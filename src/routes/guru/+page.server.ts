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
		const guruList = await db
			.select({
				id: table.guru.userId,
				nama: table.user.nama,
				nomorIndukGuru: table.guru.nomorIndukGuru,
				status: table.guru.status,
				nomorTelepon: table.guru.nomorTelepon
			})
			.from(table.guru)
			.innerJoin(table.user, eq(table.guru.userId, table.user.id));
		return { guruList };
	} catch (err) {
		console.error(err);
		error(500, { message: 'An error occured' });
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
			await db.delete(table.guru).where(eq(table.guru.userId, userId));
			return { success: true, message: 'Berhasil dihapus' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occured.' });
		}
	}
};
