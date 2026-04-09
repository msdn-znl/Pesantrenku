import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, ne, sql } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { generateId } from '$lib/utils';
import { PeriodeSchema } from '$lib/server/form-validation/periode';
import * as z from 'zod/v4';

export const load: PageServerLoad = async () => {
	try {
		const periodeList = await db
			.select()
			.from(table.tahun_ajaran)
			.orderBy(sql`${table.tahun_ajaran.id} asc`);
		return { periodeList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'An error occured' });
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const tahunAjaranFormData = Object.fromEntries(formData);
		console.log(tahunAjaranFormData);
		const validation = await PeriodeSchema.safeParse(tahunAjaranFormData);
		console.log(validation.error);
		if (!validation.success) {
			return fail(422, {
				message: 'data yang anda masukkan salah',
				error: z.prettifyError(validation.error),
				data: tahunAjaranFormData
			});
		}
		try {
			await db.insert(table.tahun_ajaran).values({ id: generateId(), ...validation.data });
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
	},
	activate: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('tahunAjaranId');
		if (!id || typeof id !== 'string') {
			return fail(422, { message: 'ID tidak valid' });
		}
		const query1 = db
			.update(table.tahun_ajaran)
			.set({ isActive: false })
			.where(ne(table.tahun_ajaran.id, id))
			.toSQL();
		console.log(query1);
		try {
			await db.transaction(async (tx) => {
				await tx
					.update(table.tahun_ajaran)
					.set({ isActive: true })
					.where(eq(table.tahun_ajaran.id, id));
				await tx
					.update(table.tahun_ajaran)
					.set({ isActive: false })
					.where(ne(table.tahun_ajaran.id, id));
			});
		} catch (err) {
			console.error('Error while deleting Periode:', err);
			return fail(500, { message: 'An error occured' });
		}
	}
};
