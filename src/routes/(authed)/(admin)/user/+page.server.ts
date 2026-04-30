import { hash } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, inArray, isNull } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import {
	CreateUserSchema,
	DeleteUserSchema,
	EditUserFormSchema
} from '$lib/server/form-validation/user';
import * as z from 'zod/v4';
import { generateId, generateNIS } from '$lib/utils';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	try {
		const userList = await db
			.select({
				id: table.user.id,
				nama: table.user.name,
				username: table.user.email,
				role: table.user.role
			})
			.from(table.user)
			.where(isNull(table.user.deletedAt));
		return { userList };
	} catch (err) {
		console.error(err);
		error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	tambah: async (event) => {
		const formData = await event.request.formData();
		const userData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validation = CreateUserSchema.safeParse(userData);
		if (!validation.success) {
			console.log(validation.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validation.error),
				data: userData
			});
		}

		if (validation.data.role === 'santri') {
			const tahun = validation.data.tahun;
			const tahunAjaranSubQuery = db
				.select({ id: table.tahun_ajaran.id })
				.from(table.tahun_ajaran)
				.where(eq(table.tahun_ajaran.isActive, true));
			let urutan = await db.$count(
				table.pendaftaran_santri,
				eq(table.pendaftaran_santri.tahunAjaranId, tahunAjaranSubQuery)
			);
			console.log(urutan);
			const userData: (typeof table.user.$inferInsert)[] = [];
			const santriData: (typeof table.santri.$inferInsert)[] = [];
			const accountData: (typeof table.account.$inferInsert)[] = [];
			const listSantri = validation.data.nama
				.split(/\r?\n/)
				.map((nama) => nama.trim())
				.filter(Boolean);
			for (const santri of listSantri) {
				urutan += 1;
				const userId = generateId();
				const santriId = generateId();
				const accountId = generateId();
				const NIS = generateNIS(validation.data.tipe, tahun, urutan.toString());

				const password = await hash(NIS, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				userData.push({
					id: userId,
					email: NIS + env.TEMP_HOSTNAME_POSTFIX,
					name: santri,
					role: validation.data.role
				});
				santriData.push({
					id: santriId,
					userId: userId,
					nomorIndukSantri: NIS
				});
				accountData.push({
					id: accountId,
					accountId: userId,
					userId: userId,
					providerId: 'credential',
					password: password
				});
			}
			console.log('UserData:', userData);
			console.log('AccountData:', accountData);
			console.log('SantriData:', santriData);
			// Insert Data Santri ke Database

			await db.transaction(async (tx) => {
				if (userData.length > 0) {
					await tx.insert(table.user).values(userData);
				}
				if (santriData.length > 0) {
					await tx.insert(table.santri).values(santriData);
				}
				if (accountData.length > 0) {
					await tx.insert(table.account).values(accountData);
				}
			});
		} else if (validation.data.role === 'guru') {
			let urutan = await db.$count(table.guru);
			const listGuru = validation.data.nama
				.split(/\r?\n/)
				.map((nama) => nama.trim())
				.filter(Boolean);
			const userData: (typeof table.user.$inferInsert)[] = [];
			const guruData: (typeof table.guru.$inferInsert)[] = [];
			const accountData: (typeof table.account.$inferInsert)[] = [];
			for (const guru of listGuru) {
				urutan += 1;
				const userId = generateId();
				const guruId = generateId();
				const accountId = generateId();
				const NIG = urutan.toString().padStart(3, '0');
				const password = await hash(NIG, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				userData.push({
					id: userId,
					email: NIG + env.TEMP_HOSTNAME_POSTFIX,
					name: guru,
					role: validation.data.role
				});
				guruData.push({
					id: guruId,
					userId: userId,
					nomorIndukGuru: NIG
				});
				accountData.push({
					id: accountId,
					accountId: userId,
					userId: userId,
					providerId: 'credential',
					password: password
				});
			}
			console.log('UserData:', userData);
			console.log('AccountData:', accountData);
			console.log('GuruData:', guruData);
			// Insert data Guru ke Database
			await db.transaction(async (tx) => {
				if (userData.length > 0) {
					await tx.insert(table.user).values(userData);
				}
				if (guruData.length > 0) {
					await tx.insert(table.guru).values(guruData);
				}
				if (accountData.length > 0) {
					await tx.insert(table.account).values(accountData);
				}
			});
		} else {
			const userId = generateId();
			const accountId = generateId();
			const password = await hash(validation.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			const userData: typeof table.user.$inferInsert = {
				id: userId,
				role: validation.data.role,
				email: validation.data.username,
				name: validation.data.nama
			};
			const accountData: typeof table.account.$inferInsert = {
				id: accountId,
				accountId: userId,
				userId: userId,
				providerId: 'credential',
				password: password
			};
			console.log('UserData:', userData);
			console.log('AccountData:', accountData);
			await db.transaction(async (tx) => {
				if (userData) {
					await tx.insert(table.user).values(userData);
				}
				if (accountData) {
					await tx.insert(table.account).values(accountData);
				}
			});
		}
	},

	hapus: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const listId = formData.getAll('id');

		const timestamp = new Date();
		const validation = DeleteUserSchema.safeParse(listId);
		if (!validation.success) {
			console.log(validation.error);
			return fail(400, { message: 'userId  tidak ada' });
		}
		try {
			await db.transaction(async (tx) => {
				await tx
					.update(table.user)
					.set({ deletedAt: timestamp })
					.where(inArray(table.user.id, validation.data));
				await tx
					.update(table.santri)
					.set({ deletedAt: timestamp })
					.where(inArray(table.santri.userId, validation.data));
			});
			return { success: true, message: 'Berhasil Menghapus Data' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured ' });
		}
	},
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const userData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const result = EditUserFormSchema.safeParse(userData);
		if (!result.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(result.error),
				data: userData
			});
		}
	}
};
