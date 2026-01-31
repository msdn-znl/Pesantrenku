import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const periodeList = await db.select().from(table.tahun_ajaran);
		return { periodeList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const tahunAjaran = formData.get('tahunAjaran');
		if (
			!tahunAjaran ||
			typeof tahunAjaran !== 'string' ||
			tahunAjaran === null ||
			tahunAjaran === undefined
		)
			return fail(422, { message: 'Data yang anda masukkan salah' });
		try {
			await db.insert(table.tahun_ajaran).values({ id: generateId(), tahunAjaran: tahunAjaran });
			return { success: true, message: 'Berhasil ditambahkan' };
		} catch (err) {
			console.error('Error while add record to Periode:', err);
			error(500, { message: 'An error occured' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id');
		if (!id || typeof id !== 'string') {
			return fail(422, { message: 'ID tidak valid' });
		}
		try {
			await db.delete(table.tahun_ajaran).where(eq(table.tahun_ajaran.id, id));
			return { success: true, message: 'Berhasil dihapus' };
		} catch (err) {
			console.error('Error while deleting Periode:', err);
			return fail(500, { message: 'An error occured' });
		}
	}
};
