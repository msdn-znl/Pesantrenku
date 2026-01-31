import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	if (!id || typeof id !== 'string') {
		error(404, 'Data not found');
	}
	try {
		const absensiList = await db.query.absensi_santri.findMany({
			where: eq(table.absensi_santri.pertemuanId, id),
			with: {
				santri: {
					columns: { id: true },
					with: { user: { columns: { nama: true } } }
				}
			}
		});
		return { absensiList, id };
	} catch (err) {
		console.error('Error saat memuat data halaman absensi', err);
		error(500, 'Terjadi kesalahan saat memuat data halaman absensi santri');
	}
};
