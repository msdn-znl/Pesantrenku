import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { KitabFormSchema } from '$lib/server/form-validation/kitab';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const paramsId = params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			return error(400, 'id tidak ditemukan');
		}
		const id = parseInt(paramsId);
		const kitabArray = await db.select().from(table.kitab).where(eq(table.kitab.id, id));
		const kitab = kitabArray[0];
		if (!kitab) {
			error(404, { message: 'Data tidak ditemukan' });
		}
		return { kitab: kitab };
	} catch (err) {
		console.error(err);
		error(500, 'an Error occured');
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const paramsId = event.params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			return error(400, 'id tidak ditemukan');
		}
		const id = parseInt(paramsId);
		const kitabData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const result = KitabFormSchema.safeParse(kitabData);
		if (!result.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(result.error),
				data: kitabData
			});
		}
		const { namaKitab, kategori, pengarang } = result.data;
		try {
			await db
				.update(table.kitab)
				.set({ namaKitab, pengarang, kategori })
				.where(eq(table.kitab.id, id));
			return {success:true, message:'Success'}
		} catch (err) {
			console.error(err);
			error(500, 'An Error occured');
		}
	}
};
