import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and, sql, isNull, notExists } from 'drizzle-orm';
import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import { generateId } from '$lib/utils';
import { KelasSantriFormSchema } from '$lib/server/form-validation/kelas_santri';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	if (!id || typeof id !== 'string') {
		error(404, 'Data not found');
	}
	try {
		const kelas = await db.select().from(table.kelas).where(eq(table.kelas.id, id));
		const sq = db
			.select({ id: table.tahun_ajaran.id })
			.from(table.tahun_ajaran)
			.where(eq(table.tahun_ajaran.isActive, true));
		// const santriWithoutClass = await db
		// 	.select({
		// 		id: table.santri.id,
		// 		nama: table.user.name,
		// 		nis: table.santri.nomorIndukSantri
		// 	})
		// 	.from(table.pendaftaran_santri) // ← start di sini
		// 	.innerJoin(table.santri, eq(table.santri.id, table.pendaftaran_santri.santriId))
		// 	.innerJoin(table.user, eq(table.user.id, table.santri.userId))
		// 	.where(
		// 		and(
		// 			// filter 1: santri aktif di tahun ajaran ini
		// 			eq(table.pendaftaran_santri.tahunAjaranId, sq),
		// 			eq(table.pendaftaran_santri.status, 'aktif'),
		// 			isNull(table.pendaftaran_santri.tanggalKeluar),

		// 			// filter 2: belum terdaftar di kelas tertentu
		// 			notExists(
		// 				db
		// 					.select({ one: sql`1` })
		// 					.from(table.kelas_santri)
		// 					.where(
		// 						and(
		// 							eq(table.kelas_santri.santriId, table.santri.id),
		// 							eq(table.kelas_santri.kelasId, id) // ← filter ke kelas spesifik
		// 						)
		// 					)
		// 			)
		// 		)
		// 	);
		const santriTanpaKelas = await db.query.pendaftaran_santri.findMany({
			columns: {},
			with: {
				santri: {
					columns: { id: true, userId: true, nomorIndukSantri: true },
					with: { user: { columns: { name: true } } }
				}
			},
			where: (pendaftaran_santri) =>
				and(
					eq(pendaftaran_santri.tahunAjaranId, sq),
					eq(pendaftaran_santri.status, 'aktif'),
					isNull(pendaftaran_santri.tanggalKeluar),
					notExists(
						db
							.select({ one: sql`1` })
							.from(table.kelas_santri)
							.where(
								and(
									eq(table.kelas_santri.santriId, table.pendaftaran_santri.santriId),
									eq(table.kelas_santri.kelasId, id)
								)
							)
					)
				)
		});
		return { santriTanpaKelas, kelas };
	} catch (err) {
		console.error(`Error saat mengambil data. Error:` + err);
		error(500, 'Error saat memuat data halaman');
	}
};

export const actions: Actions = {
	tambah: async (event) => {
		const formData = await event.request.formData();
		const dataSantri = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		console.log(dataSantri);
	},
	create: async (event: RequestEvent) => {
		const id = event.params.id;
		if (!id || typeof id !== 'string') {
			error(404, 'Id tidak ditemukan');
		}
		const formData = await event.request.formData();
		const inputData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		console.log(inputData);

		const validation = KelasSantriFormSchema.safeParse(inputData);
		if (!validation.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				data: validation.data
			});
		}

		const insertData = validation.data.idSantri.map((item) => ({
			id: generateId(),
			santriId: item,
			kelasId: id
		}));
		try {
			await db.insert(table.kelas_santri).values(insertData);
			return { success: true };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
