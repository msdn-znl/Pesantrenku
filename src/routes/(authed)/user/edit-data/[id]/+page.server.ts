import { hash } from '@node-rs/argon2';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { EditUserFormSchema } from '$lib/server/form-validation/user';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = params.id;
		const userArray = await db
			.select({ nama: table.users.nama, username: table.users.username, role: table.users.role })
			.from(table.users)
			.where(eq(table.users.id, id));
		const user = userArray[0];
		if (!user) {
			error(404, { message: 'User tidak ditemukan' });
		}
		return { user: user };
	} catch (err) {
		console.error(err);
		throw error(500, { message: 'An error occcured' });
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = event.params.id;
		if (!id || typeof id !== 'string') {
			return fail(400, { message: 'ID tidak ditemukan' });
		}
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

		const { username, password, nama, role } = result.data;
		const updatedData: {
			username: string;
			nama: string;
			role: 'admin' | 'guru' | 'santri' | undefined;
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

		try {
			await db.update(table.users).set(updatedData).where(eq(table.users.id, id));
			return { success: true, message: 'Berhasil di-edit' };
		} catch (err) {
			console.error(err);
			error(500, 'An error occured');
		}
	}
};
