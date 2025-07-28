//TODO
// ambil data santri dari database
// load data ke page.svelte
import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const santriList = await db
			.select({
				id: table.santri.id,
				userId: table.santri.userId,
				nama: table.users.nama,
				tahun_masuk: table.santri.tahunMasuk,
				status: table.santri.status,
				kamar: table.santri.kamar
			})
			.from(table.santri)
			.innerJoin(table.users, eq(table.santri.userId, table.users.id));
		return { santriList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'An Error occured' });
	}
};

export const actions: Actions = {
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const userId = formData.get('id');
		if (!userId) {
			return fail(400, { message: 'userId  tidak ada' });
		}
		if (typeof userId !== 'string') {
			return fail(400, { message: 'userId tidak valid' });
		}
		try {
			await db.delete(table.santri).where(eq(table.santri.userId, userId));
			return { success: true, message: 'Success' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occured.' });
		}
	}
};
