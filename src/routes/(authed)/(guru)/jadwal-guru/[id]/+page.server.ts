import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as z from 'zod';
import { EditPertemuanFormSchema } from '$lib/server/form-validation/pertemuan';

export const load: PageServerLoad = async (event: RequestEvent) => {
	const id = event.params.id;
	try {
		const jurnalList = await db.query.pertemuan.findMany({
			where: eq(table.pertemuan.jadwalId, id)
		});
		return { jurnalList };
	} catch (err) {
		console.error(err);
		error(500, { message: 'Error while retrieving data from database' });
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const pertemuanEditFormData = Object.fromEntries(formData);
		const pertemuanEditData = EditPertemuanFormSchema.safeParse(pertemuanEditFormData);
		if (!pertemuanEditData.success) {
			return fail(422, { message: 'Data yang anda masukkan salah' });
		}
		const { id, jurnalMengajar, status } = pertemuanEditData.data;
		try {
			await db
				.update(table.pertemuan)
				.set({ jurnalMengajar: jurnalMengajar, status: status })
				.where(eq(table.pertemuan.id, id));
		} catch (err) {
			console.error(err);
			return error(500, { message: 'Server error' });
		}
	}
};
