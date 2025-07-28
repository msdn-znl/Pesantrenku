import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { KelasFormSchema } from '$lib/server/form-validation/kelas';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const paramsId = params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			return error(400, 'id tidak ditemukan');
		}
		const id = parseInt(paramsId);
		const kelasArray = await db.select().from(table.kelas).where(eq(table.kelas.id, id));
		const kelas = kelasArray[0];
		if (!kelas) {
			error(404, { message: 'Data tidak ditemukan' });
		}
		return { kelas: kelas };
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
		const kelasData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const result = KelasFormSchema.safeParse(kelasData);
		if (!result.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(result.error),
				data: kelasData
			});
		}
		const { namaKelas, tahunAjaran } = result.data;
		try {
			await db.update(table.kelas).set({ namaKelas, tahunAjaran }).where(eq(table.kelas.id, id));
			return { success: true, message: 'Success' };
		} catch (err) {
			console.error(err);
			error(500, 'An Error occured');
		}
	}
};
