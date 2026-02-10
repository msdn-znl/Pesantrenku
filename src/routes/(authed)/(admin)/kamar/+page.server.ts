import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';

import { KamarFormSchema, EditKamarFormSchema } from '$lib/server/form-validation/kamar';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const kamarList = await db.select().from(table.kamar);
		return { kamarList };
	} catch (err) {
		console.log(err);
		error(500, { message: 'An error occured while retrieving data from database' });
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const kamarFormData = Object.fromEntries(formData);
		const validationResult = KamarFormSchema.safeParse(kamarFormData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: kamarFormData
			});
		}
		try {
			await db.insert(table.kamar).values({ id: generateId(), ...validationResult.data });
		} catch (err) {
			console.error(err);
			error(500, { message: 'An error occured' });
		}
	},
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const kamarData = Object.fromEntries(formData);
		const validationResult = EditKamarFormSchema.safeParse(kamarData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: kamarData
			});
		}
		const { id, namaKamar } = validationResult.data;
		try {
			await db.update(table.kamar).set({ namaKamar }).where(eq(table.kamar.id, id));
		} catch (err) {
			console.error(err);
			error(500, 'An Error occured');
		}
	}
};
