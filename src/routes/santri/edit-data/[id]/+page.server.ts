import type { Actions, PageServerLoad, RequestEvent } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { SantriFormSchema } from '$lib/server/form-validation/santri';
import { fail, error } from '@sveltejs/kit';
import * as z from 'zod/v4';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = params.id;
		const santriArray = await db.select().from(table.santri).where(eq(table.santri.userId, id));
		if (!santriArray) {
			error(404, { message: 'Tidak ditemukan' });
		}
		const santriData = santriArray[0];
		return { santriData: santriData };
	} catch (err) {
		console.error(err);
		error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		//Data dari setiap kolom di Form
		const santriData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		//Validasi Data
		const result = SantriFormSchema.safeParse(santriData);
		if (!result.success) {
			console.log(result.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(result.error),
				data: santriData
			});
		}
		try {
			await db
				.update(table.santri)
				.set(result.data)
				.where(eq(table.santri.userId, event.params.id));
			return { success: true, message: 'Success' };
		} catch {
			return fail(500, { message: 'An error has occured.' });
		}
	}
};
