import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const daftarTahunAjaran = await db.select().from(table.tahun_ajaran);
	return { user: locals.user, daftarTahunAjaran: daftarTahunAjaran };
};
