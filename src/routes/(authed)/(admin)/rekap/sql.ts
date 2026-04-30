import * as table from '$lib/server/db/schema';
import { eq, like, and, count, sql, inArray, isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const env = process.env;
import { generateId } from '$lib/utils';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
	connectionString: env.DATABASE_URL
});

const db = drizzle({ client: pool, schema: table });

// const bulan = '09';
// const tahun = '2024';
// const kelasId = '01KQ71J7EE80PWQ7TNB4A0KERP';

// const idSantriDiKelas = await db
// 	.select({ santriId: table.kelas_santri.santriId })
// 	.from(table.kelas_santri)
// 	.where(eq(table.kelas_santri.kelasId, kelasId));
// const idSantri = idSantriDiKelas.map((i) => i.santriId);
const raw = await db
	.select({
		santriId: table.absensi_santri.santriId,
		kelasId: table.jadwal.kelasId,
		tahunAjaranId: table.kelas.tahunAjaranId,
		bulan: sql`EXTRACT(MONTH FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number),
		tahun: sql`EXTRACT(YEAR FROM ${table.pertemuan.tanggalPertemuan})`.mapWith(Number),
		total: count(),
		hadir: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'hadir')`.mapWith(
			Number
		),
		alfa: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'alfa')`.mapWith(
			Number
		),
		izin: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'izin')`.mapWith(
			Number
		),
		sakit: sql`COUNT(*) FILTER (WHERE ${table.absensi_santri.status_kehadiran} = 'sakit')`.mapWith(
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
			isNull(table.kelas.deletedAt)
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
console.log(raw);
