import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export const load: LayoutServerLoad = async () => {
	const [tahunAjaranList, kelasList, tahunRekap, bulanRekap, rows] = await Promise.all([
		db
			.selectDistinct({ tahunAjaran: table.tahun_ajaran })
			.from(table.rekap_absensi_santri)
			.innerJoin(
				table.tahun_ajaran,
				eq(table.rekap_absensi_santri.tahunAjaranId, table.tahun_ajaran.id)
			),
		db
			.selectDistinct({
				kelasId: table.rekap_absensi_santri.kelasId,
				namaKelas: table.kelas.namaKelas
			})
			.from(table.rekap_absensi_santri)
			.innerJoin(table.kelas, eq(table.rekap_absensi_santri.kelasId, table.kelas.id)),
		db
			.selectDistinct({ tahun: table.rekap_absensi_santri.tahun })
			.from(table.rekap_absensi_santri)
			.orderBy(desc(table.rekap_absensi_santri.tahun)),
		db
			.selectDistinct({ bulan: table.rekap_absensi_santri.bulan })
			.from(table.rekap_absensi_santri)
			.orderBy(desc(table.rekap_absensi_santri.bulan)),
		db
			.select({
				tahunAjaran: table.tahun_ajaran,
				kelas: {
					id: table.kelas.id,
					namaKelas: table.kelas.namaKelas
				},
				bulan: sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number),
				tahun: sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number)
			})
			.from(table.pertemuan)
			.innerJoin(table.jadwal, eq(table.pertemuan.jadwalId, table.jadwal.id))
			.innerJoin(table.kelas, eq(table.jadwal.kelasId, table.kelas.id))
			.innerJoin(table.tahun_ajaran, eq(table.kelas.tahunAjaranId, table.tahun_ajaran.id))
			.groupBy(
				table.jadwal.kelasId,
				table.kelas.id,
				table.tahun_ajaran.id,
				sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})`,
				sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})`
			)
	]);
	const namaBulan = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];
	const bulanTersedia = bulanRekap.map((baris) => {
		return {
			idx: baris.bulan,
			month: namaBulan[baris.bulan]
		};
	});
	type RekapKey = `${string}:${string}`;

	const grouped = new Map<
		RekapKey,
		{
			tahunAjaran: typeof table.tahun_ajaran.$inferSelect;
			kelas: { id: string; namaKelas: string };
			bulan: Set<number>;
			tahun: Set<number>;
		}
	>();
	for (const row of rows) {
		if (!row.kelas.id || !row.tahunAjaran.id) continue;

		const key: RekapKey = `${row.kelas.id}:${row.tahunAjaran.id}`;

		if (!grouped.has(key)) {
			grouped.set(key, {
				tahunAjaran: row.tahunAjaran,
				kelas: { id: row.kelas.id, namaKelas: row.kelas.namaKelas },
				bulan: new Set(),
				tahun: new Set()
			});
		}

		grouped.get(key)!.bulan.add(row.bulan);
		grouped.get(key)!.tahun.add(row.tahun);
	}

	const filterRecompute = Array.from(grouped.values()).map((v) => ({
		tahunAjaran: v.tahunAjaran,
		kelas: v.kelas,
		bulan: [...v.bulan]
			.sort((a, b) => a - b)
			.map((baris) => {
				return {
					idx: baris,
					month: namaBulan[baris]
				};
			}),
		tahun: [...v.tahun].sort((a, b) => a - b)
	}));

	return { tahunAjaranList, kelasList, tahunRekap, bulanTersedia, filterRecompute };
};
