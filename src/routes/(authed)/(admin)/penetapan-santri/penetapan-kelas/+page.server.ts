import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sql, isNull } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { KelasSantriFormSchema } from '$lib/server/form-validation/kelas_santri';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		//Mengambil data santri yang mana santri tersebut terdaftar dalam tabel pendaftaran santri
		//dengan tahun ajaran yang aktif, memiliki status aktif, dan tanggal keluar masih null
		//dan data kelas_santri dimana kelas tersebut termasuk di dalam tahun ajaran aktif
		const daftarSantri = await db.query.santri.findMany({
			columns: { id: true, userId: true, nomorIndukSantri: true },
			with: {
				user: { columns: { name: true } },
				kelas_santri: {
					where: (ks, { exists, eq, and }) =>
						exists(
							db
								.select({ one: sql`1` })
								.from(table.kelas)
								.innerJoin(table.tahun_ajaran, eq(table.kelas.tahunAjaranId, table.tahun_ajaran.id))
								.where(and(eq(table.kelas.id, ks.kelasId), eq(table.tahun_ajaran.isActive, true)))
						),
					with: {
						kelas: {
							columns: { namaKelas: true }
						}
					}
				}
			},
			where: (santriTable, { exists, and, eq }) =>
				exists(
					db
						.select({ _: sql`1` })
						.from(table.pendaftaran_santri)
						.innerJoin(
							table.tahun_ajaran,
							eq(table.pendaftaran_santri.tahunAjaranId, table.tahun_ajaran.id)
						)
						.where(
							and(
								eq(table.pendaftaran_santri.santriId, santriTable.id),
								eq(table.tahun_ajaran.isActive, true),
								eq(table.pendaftaran_santri.status, 'aktif'),
								isNull(table.pendaftaran_santri.tanggalKeluar)
							)
						)
				)
		});
		return { daftarSantri };
	} catch (err) {
		console.error(err);
	}
};

export const actions: Actions = {
	tambahKelas: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validation = KelasSantriFormSchema.safeParse(data);
		if (!validation.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				data: validation.data
			});
		}
		const id = validation.data.idKelas;
		if (!id) {
			return fail(422, {
				message: 'id kelas tidak ada'
			});
		}
		const insertData: (typeof table.kelas_santri.$inferInsert)[] = validation.data.idSantri.map(
			(item) => ({
				id: generateId(),
				santriId: item,
				kelasId: id
			})
		);
		try {
			await db.insert(table.kelas_santri).values(insertData);
			return { success: true };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
