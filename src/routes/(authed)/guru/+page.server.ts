//TODO
// ambil data santri dari database
// load data ke page.svelte
import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { GuruFormSchema } from '$lib/server/form-validation/guru';
import * as z from 'zod/v4';

export const load: PageServerLoad = async () => {
	try {
		const guruList = await db
			.select({
				id: table.guru.userId,
				nama: table.users.nama,
				nomorIndukGuru: table.guru.nomorIndukGuru,
				status: table.guru.status,
				nomorTelepon: table.guru.nomorTelepon
			})
			.from(table.guru)
			.innerJoin(table.users, eq(table.guru.userId, table.users.id));
		return { guruList };
	} catch (err) {
		console.error(err);
		error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	edit: async (event) => {
		const formData = await event.request.formData();
		//Data dari setiap kolom di Form
		const guruData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		//Validasi Data
		const result = GuruFormSchema.safeParse(guruData);
		if (!result.success) {
			console.log(result.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(result.error),
				data: guruData
			});
		}
		const { id, ...rest } = result.data;
		try {
			const operation = await db.update(table.guru).set(rest).where(eq(table.guru.userId, id));
			return { success: true, message: 'Berhasil di-edit' };
		} catch {
			return fail(500, { message: 'An error has occured.' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const userId = formData.get('id');
		if (!userId) {
			return fail(400, { message: 'userId  tidak ada' });
		}
		if (typeof userId !== 'string') {
			return fail(400, { message: 'userId tidak valid' });
		}
		try {
			await db.delete(table.guru).where(eq(table.guru.userId, userId));
			return { success: true, message: 'Berhasil dihapus' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occured.' });
		}
	}
};
