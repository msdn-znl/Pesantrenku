import type { Actions, PageServerLoad, RequestEvent } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import { KitabFormSchema } from '$lib/server/form-validation/kitab';

export const load: PageServerLoad = async () => {
	try {
		const kitabList = await db.select().from(table.kitab);
		return { kitabList };
	} catch (err) {
		console.error(err);
		error(500, 'An Error occured');
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const kitabFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const result = KitabFormSchema.safeParse(kitabFormData);
		if (!result.success) {
			return fail(422, { message: 'Data yag diimputkan salah' });
		}
		try {
			await db.insert(table.kitab).values(result.data);
			return { success: true, message: 'Success' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const stringId = formData.get('id');
		if (!stringId || typeof stringId !== 'string') {
			return fail(400, { message: 'Kelas tidak ada/ id kelas salah' });
		}
		const id = parseInt(stringId);
		try {
			await db.delete(table.kitab).where(eq(table.kitab.id, id));
			return { success: true, message: 'Berhasil dihapus' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An Error occured' });
		}
	}
};
