import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { GuruFormSchema } from '$lib/server/form-validation/guru';
import { fail } from '@sveltejs/kit';
import * as z from 'zod/v4';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const result = await db.select().from(table.guru).where(eq(table.guru.userId, id));
	const guruData = result.at(0);
	return { guruData };
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
		try {
			const operation = await db
				.update(table.guru)
				.set(result.data)
				.where(eq(table.guru.userId, event.params.id));
			console.log(operation);
			console.log(typeof operation);
		} catch {
			return fail(500, { message: 'An error has occured.' });
		}
	}
};
