import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async () => {
	try {
		const [kelasList, guruList, kitabList] = await Promise.all([
			db
				.select({
					id: table.kelas.id,
					namaKelas: table.kelas.namaKelas,
					tahunAjaranId: table.kelas.tahunAjaranId,
					waliKelasId: table.kelas.waliKelasId,
					tipeKelas: table.kelas.tipeKelas
				})
				.from(table.kelas),
			db
				.select({ id: table.guru.id, nama: table.user.name })
				.from(table.guru)
				.innerJoin(table.user, eq(table.guru.userId, table.user.id)),
			db.select().from(table.kitab)
		]);
		return { kelasList, guruList, kitabList };
	} catch (err) {
		console.error(err);
	}
};
