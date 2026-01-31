import { hash } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
// import * as auth from '$lib/server/auth';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { UserFormSchema, EditUserFormSchema } from '$lib/server/form-validation/user';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

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
		const validationResult = UserFormSchema.safeParse(userFormData);
		if (!validationResult.success) {
			console.log(validationResult.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: userFormData
			});
		}

		const { username, password, nama, role } = validationResult.data;

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
