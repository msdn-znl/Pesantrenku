import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user.id;

	try {
		const subqueryGuruId = db
			.select({ id: table.guru.id })
			.from(table.guru)
			.where(eq(table.guru.userId, userId));
		const subqueryJadwalGuru = db
			.select({ id: table.jadwal.id })
			.from(table.jadwal)
			.where(eq(table.jadwal.guruId, subqueryGuruId));
		const pertemuanGuruList = await db.query.pertemuan.findMany({
			where: inArray(table.pertemuan.jadwalId, subqueryJadwalGuru),
			with: {
				jadwal: {
					columns: { id: true, jamMulai: true, jamSelesai: true, hari: true },
					with: {
						kelas: { columns: { namaKelas: true } },
						kitab: { columns: { namaKitab: true } }
					}
				}
			}
		});
		return { pertemuanGuruList };
	} catch (err) {
		console.error(err);
		error(500, { message: 'Error while retrieving data from server' });
	}
};

export const actions: Actions = {};
