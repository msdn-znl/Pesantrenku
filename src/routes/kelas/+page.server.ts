import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { KelasFormSchema } from '$lib/server/form-validation/kelas';
import * as z from 'zod/v4';

export const load: PageServerLoad = async () => {
	try {
		const kelasList = await db.select().from(table.kelas);
		return { kelasList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	add: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const kelasFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);

		const validationResult = KelasFormSchema.safeParse(kelasFormData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: kelasFormData
			});
		}

		try {
			await db.insert(table.kelas).values(validationResult.data);
		} catch (err) {
			console.error(err);
			error(500, { message: 'An error occured' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id');
		if (!id || typeof id !== 'string') {
			return fail(400, { message: 'Kelas tidak ada/ id kelas salah' });
		}
		const deleteId = parseInt(id);
		try {
			await db.delete(table.kelas).where(eq(table.kelas.id, deleteId));
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured' });
		}
	}
};
