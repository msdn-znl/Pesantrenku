import { hash } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
// import * as auth from '$lib/server/auth';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import {
	CreateUserSchema,
	DeleteUserSchema,
	EditUserFormSchema
} from '$lib/server/form-validation/user';
import * as z from 'zod/v4';
import { generateId, getTahunSekarang, generateNIS } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const userList = await db
			.select({
				id: table.users.id,
				nama: table.users.nama,
				username: table.users.username,
				role: table.users.role
			})
			.from(table.users);
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
			const tahun = getTahunSekarang();
			let urutan = await db.$count(table.santri, eq(table.santri.tahunMasuk, tahun));
			console.log(urutan);
			const userToInsert: (typeof table.users.$inferInsert)[] = [];
			const santriToInsert: (typeof table.santri.$inferInsert)[] = [];
			const listSantri = validation.data.nama
				.split(/\r?\n/)
				.map((nama) => nama.trim())
				.filter(Boolean);
			for (const santri of listSantri) {
				urutan += 1;
				const userId = generateId();
				const santriId = generateId();
				const NIS = generateNIS(validation.data.tipe, tahun, urutan.toString());

				const password = await hash(NIS, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				userToInsert.push({
					id: userId,
					username: NIS,
					passwordHash: password,
					nama: santri,
					role: validation.data.role
				});
				santriToInsert.push({
					id: santriId,
					userId: userId,
					nomorIndukSantri: NIS,
					tahunMasuk: tahun
				});
			}
			console.log(userToInsert);
			console.log(santriToInsert);
			// Insert Data Santri ke Database

			await db.transaction(async (tx) => {
				if (userToInsert.length > 0) {
					await tx.insert(table.users).values(userToInsert);
				}
				if (santriToInsert.length > 0) {
					await tx.insert(table.santri).values(santriToInsert);
				}
			});
		} else if (validation.data.role === 'guru') {
			let urutan = await db.$count(table.guru);
			const listGuru = validation.data.nama
				.split(/\r?\n/)
				.map((nama) => nama.trim())
				.filter(Boolean);
			const userToInsert: (typeof table.users.$inferInsert)[] = [];
			const guruToInsert: (typeof table.guru.$inferInsert)[] = [];
			for (const guru of listGuru) {
				urutan += 1;
				const userId = generateId();
				const guruId = generateId();
				const NIG = urutan.toString().padStart(3, '0');
				const password = await hash(NIG, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1
				});
				userToInsert.push({
					id: userId,
					username: NIG,
					passwordHash: password,
					nama: guru,
					role: validation.data.role
				});
				guruToInsert.push({
					id: guruId,
					userId: userId,
					nomorIndukGuru: NIG
				});
			}
			console.log(userToInsert && guruToInsert);
			// Insert data Guru ke Database
			await db.transaction(async (tx) => {
				if (userToInsert.length > 0) {
					await tx.insert(table.users).values(userToInsert);
				}
				if (guruToInsert.length > 0) {
					await tx.insert(table.guru).values(guruToInsert);
				}
			});
		} else {
			const userId = generateId();
			const hashedPassword = await hash(validation.data.password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			const data: typeof table.users.$inferInsert = {
				id: userId,
				role: validation.data.role,
				username: validation.data.username,
				passwordHash: hashedPassword,
				nama: validation.data.nama
			};
			console.log(data);
			await db.insert(table.users).values(data);
		}
	},
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const newUsername = formData.get('username');
		if (!newUsername || typeof newUsername !== 'string') {
			return fail(400, { message: 'no username provided' });
		}
		const result = await db.select().from(table.users).where(eq(table.users.username, newUsername));

		const existingUser = result.at(0);
		if (existingUser) {
			return fail(422, { message: 'username sudah ada di database, gunakan username lain' });
		}
		const userFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = CreateUserSchema.safeParse(userFormData);
		if (!validationResult.success) {
			console.log(validationResult.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: userFormData
			});
		}

		const { username, password, nama, role } = validationResult.data;
		// Generate Id dan hash password
		const userId = generateId();
		const id = generateId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.transaction(async (tx) => {
				await tx.insert(table.users).values({ id: userId, username, passwordHash, role, nama });
				if (role === 'guru') {
					await tx.insert(table.guru).values({ id: id, userId: userId });
				} else if (role === 'santri') {
					await tx.insert(table.santri).values({ id: id, userId: userId });
				}
			});
			return { success: true, message: 'Berhasil Menambahkan Data' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occurred' });
		}
	},

	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id');
		if (!id) {
			return fail(400, { message: 'userId  tidak ada' });
		}
		if (typeof id !== 'string') {
			return fail(400, { message: 'userId tidak valid' });
		}
		try {
			await db.delete(table.users).where(eq(table.users.id, id));
			return { success: true, message: 'Berhasil Dihapus' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured ' });
		}
	},
	hapus: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const listId = formData.getAll('id');
		const validation = DeleteUserSchema.safeParse(listId);
		if (!validation.success) {
			return fail(400, { message: 'userId  tidak ada' });
		}
		try {
			await db.delete(table.users).where(inArray(table.users.id, validation.data.id));
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

		const { username, password, nama, role, id } = result.data;
		const updatedData: {
			username: string;
			nama: string;
			role?: 'admin' | 'guru' | 'santri' | undefined;
			passwordHash?: string;
		} = { username, nama, role };
		if (password) {
			const passwordHash = await hash(password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			updatedData.passwordHash = passwordHash;
		}
		console.log(updatedData);

		try {
			await db.update(table.users).set(updatedData).where(eq(table.users.id, id));
			return { success: true, message: 'Berhasil di-edit' };
		} catch (err) {
			console.error(err);
			error(500, 'An error occured');
		}
	}
};
