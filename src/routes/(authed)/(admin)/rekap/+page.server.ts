import type { PageServerLoad, Actions } from './$types';
import * as table from '$lib/server/db/schema';
import { eq, ilike, and, count, sql, isNull, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import { generateId } from '$lib/utils';
import { RekapFormSchema } from '$lib/server/form-validation/rekap';
import z from 'zod';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { tahunAjaranList, kelasList, tahunRekap, bulanTersedia, filterRecompute } = await parent();
	const tahunAjaranId = url.searchParams.get('tahunAjaranId') || '';
	const kelasId = url.searchParams.get('kelasId') || '';
	const bulan = Number(url.searchParams.get('bulan')) || new Date().getMonth();
	const tahun = Number(url.searchParams.get('tahun')) || new Date().getFullYear();
	const pencarianNama = url.searchParams.get('nama') || '';
	const filters = [
		eq(table.rekap_absensi_santri.tahunAjaranId, tahunAjaranId),
		eq(table.rekap_absensi_santri.kelasId, kelasId),
		eq(table.rekap_absensi_santri.bulan, bulan),
		eq(table.rekap_absensi_santri.tahun, tahun)
	];
	if (pencarianNama) {
		filters.push(ilike(table.user.name, `%${pencarianNama}%`));
	}
	// const r = await db.query.rekap_absensi_santri.findMany({
	// 	where: and(...filters),
	// 	with: {
	// 		santri: {
	// 			with: {
	// 				user: { columns: { name: true } }
	// 			},
	// 			columns: { nomorIndukSantri: true, userId: true }
	// 		}
	// 	},
	// 	orderBy: (rekap, { desc }) => [desc(rekap.presentaseKehadiran)]
	// });
	const rekap = await db
		.select({
			rekap: table.rekap_absensi_santri,
			santri: {
				userId: table.santri.userId,
				nomorIndukSantri: table.santri.nomorIndukSantri
			},
			user: { name: table.user.name }
		})
		.from(table.rekap_absensi_santri)
		.innerJoin(table.santri, eq(table.rekap_absensi_santri.santriId, table.santri.id))
		.innerJoin(table.user, eq(table.santri.userId, table.user.id))
		.where(and(...filters))
		.orderBy(desc(table.rekap_absensi_santri.presentaseKehadiran));
	return {
		tahunAjaranList,
		kelasList,
		rekap,
		tahunRekap,
		bulanTersedia,
		filters: { kelasId, tahunAjaranId, bulan, tahun, nama: pencarianNama },
		filterRecompute
	};
};

export const actions: Actions = {
	compute: async (event) => {
		const formData = await event.request.formData();
		const filters = [];
		const filterData = Object.fromEntries(formData);
		const validation = RekapFormSchema.safeParse(filterData);
		if (!validation.success) {
			console.log(z.prettifyError(validation.error));
			return fail(422, { message: 'Data Filter yang dimasukkan salah' });
		}
		const { tahunAjaranId, kelasId, bulan, tahun } = validation.data;
		if (tahunAjaranId) filters.push(eq(table.kelas.tahunAjaranId, tahunAjaranId));
		if (kelasId) filters.push(eq(table.jadwal.kelasId, kelasId));
		if (bulan) filters.push(sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})= ${bulan}`);
		if (tahun) filters.push(sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})=${tahun}`);

		const raw = await db
			.select({
				santriId: table.absensi_santri.santriId,
				kelasId: table.jadwal.kelasId,
				tahunAjaranId: table.kelas.tahunAjaranId,
				bulan: sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number),
				tahun: sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number),
				total: count(),
				hadir:
					sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'hadir')`.mapWith(
						Number
					),
				alfa: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'alfa')`.mapWith(
					Number
				),
				izin: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'izin')`.mapWith(
					Number
				),
				sakit:
					sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'sakit')`.mapWith(
						Number
					)
			})
			.from(table.absensi_santri)
			.innerJoin(table.pertemuan, eq(table.absensi_santri.pertemuanId, table.pertemuan.id))
			.innerJoin(table.jadwal, eq(table.pertemuan.jadwalId, table.jadwal.id))
			.innerJoin(table.kelas, eq(table.jadwal.kelasId, table.kelas.id))
			.where(
				and(
					isNull(table.pertemuan.deletedAt),
					isNull(table.jadwal.deletedAt),
					isNull(table.kelas.deletedAt),
					...filters
				)
			)
			.groupBy(
				table.absensi_santri.santriId,
				table.jadwal.kelasId,
				table.kelas.tahunAjaranId,
				sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})`,
				sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})`
			);

		const dataToUpsert: (typeof table.rekap_absensi_santri.$inferInsert)[] = raw.map((i) => {
			return {
				id: generateId(),
				tahunAjaranId: i.tahunAjaranId,
				kelasId: i.kelasId,
				santriId: i.santriId,
				bulan: i.bulan,
				tahun: i.tahun,
				totalHadir: i.hadir,
				totalAlfa: i.alfa,
				totalIzin: i.izin,
				totalSakit: i.sakit,
				presentaseKehadiran: i.total > 0 ? Math.round((i.hadir / i.total) * 100) : 0,
				lastComputedAt: new Date()
			};
		});
		await db
			.insert(table.rekap_absensi_santri)
			.values(dataToUpsert)
			.onConflictDoUpdate({
				target: [
					table.rekap_absensi_santri.santriId,
					table.rekap_absensi_santri.kelasId,
					table.rekap_absensi_santri.bulan,
					table.rekap_absensi_santri.tahun
				],
				set: {
					totalHadir: sql`EXCLUDED.total_hadir`,
					totalAlfa: sql`EXCLUDED.total_alfa`,
					totalIzin: sql`EXCLUDED.total_izin`,
					totalSakit: sql`EXCLUDED.total_sakit`,
					presentaseKehadiran: sql`EXCLUDED.presentase_kehadiran`,
					lastComputedAt: sql`NOW()`,
					updatedAt: sql`NOW()`
				}
			});
	}
};
