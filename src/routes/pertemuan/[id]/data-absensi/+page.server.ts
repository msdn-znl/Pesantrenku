import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const idPertemuan = Number(params.id);
	if (isNaN(idPertemuan)) {
		error(400, 'ID tidak valid');
	}
	try {
		const absensiList = await db.query.absensi_santri.findMany({
			where: eq(table.absensi_santri.pertemuanId, idPertemuan),
			with: {
				santri: {
					columns: { id: true },
					with: { user: { columns: { nama: true } } }
				}
			}
		});
		return { absensiList };
	} catch (err) {
		console.error('Error saat memuat data halaman absensi', err);
		error(500, 'Terjadi kesalahan saat memuat data halaman absensi santri');
	}
};
