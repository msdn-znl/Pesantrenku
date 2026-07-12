import type { PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, count, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	// Menghitung total data dari masing-masing entitas tabel menggunakan count()
	const [totalSantriResult] = await db.select({ value: count() }).from(table.santri);
	const [totalGuruResult] = await db.select({ value: count() }).from(table.guru);
	const [totalKelasResult] = await db.select({ value: count() }).from(table.kelas);
	const [totalKamarResult] = await db.select({ value: count() }).from(table.kamar);

	// Mengambil 5 pendaftaran santri terbaru beserta nama dari tabel user
	// Menggunakan relasi pendaftaran_santri -> santri -> user
	const pendaftaranTerbaru = await db
		.select({
			nis: table.santri.nomorIndukSantri,
			nama: table.user.name,
			kamarId: table.pendaftaran_santri.kamarId,
			tahunAjaranId: table.pendaftaran_santri.tahunAjaranId,
			status: table.pendaftaran_santri.status,
			tanggalMasuk: table.pendaftaran_santri.tanggalMasuk
		})
		.from(table.pendaftaran_santri)
		.leftJoin(table.santri, eq(table.pendaftaran_santri.santriId, table.santri.id))
		.leftJoin(table.user, eq(table.santri.userId, table.user.id))
		.orderBy(desc(table.pendaftaran_santri.createdAt))
		.limit(5);

	return {
		totalSantri: totalSantriResult.value,
		totalGuru: totalGuruResult.value,
		totalKelas: totalKelasResult.value,
		totalKamar: totalKamarResult.value,
		pendaftaranTerbaru,
		user
	};
};
