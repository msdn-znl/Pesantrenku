import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	try {
		const dataAbsensiSantri = await db.query.absensi_santri.findMany({
			where: eq(table.absensi_santri.pertemuanId, id),
			with: {
				santri: {
					columns: { id: true },
					with: { user: { columns: { nama: true } } }
				}
			}
		});
		return { dataAbsensiSantri };
	} catch (err) {
		console.error(err);
		error(500, { message: 'Error while retrieving data from server' });
	}
};

export const actions: Actions = {};
