import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and, count, lt, sql, notInArray } from 'drizzle-orm';
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
		// const santriWithoutClass = await db
		// 	.select({
		// 		id: table.santri.id,
		// 		nama: table.users.nama,
		// 		jumlahKelas: count(table.kelas_santri.kelasId),
		// 		daftarKelas: sql<string[]>`array_agg(${table.kelas.namaKelas})`
		// 	})
		// 	.from(table.santri)
		// 	.leftJoin(table.users, eq(table.santri.userId, table.users.id))
		// 	.leftJoin(table.kelas_santri, eq(table.santri.id, table.kelas_santri.santriId))
		// 	.leftJoin(table.kelas, eq(table.kelas_santri.kelasId, table.kelas.id))
		// 	.groupBy(table.santri.id, table.users.id)
		// 	.having(lt(count(table.kelas_santri.kelasId), 2));
		// const santriWithClass = await db.query.kelas_santri.findMany({
		// 	where: eq(table.kelas_santri.kelasId, id),
		// 	with: {
		// 		santri: {
		// 			columns: {
		// 				id: true
		// 			},
		// 			with: {
		// 				user: {
		// 					columns: {
		// 						id: true,
		// 						nama: true,
		// 						username: true
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// });
		//Logikanya adalah mencari dulu data yang ada di dalam tabel kelas_santri yang di join dengan tabel kelas(Subquery)
		// baru kemudian data Santri dicari dengan negasi: Dimana id tidak ada di array kembalian subquery tadi
		const kelas = await db.query.kelas.findFirst({
			where: eq(table.kelas.id, id),
			columns: { namaKelas: true, tipeKelas: true }
		});
		if (!kelas) {
			error(404, { message: 'Kelas tidak ditemukan' });
		}

		const subqueryKelasSantri = db
			.select({ id: table.kelas_santri.santriId })
			.from(table.kelas_santri)
			.innerJoin(table.kelas, eq(table.kelas_santri.kelasId, table.kelas.id))
			.where(eq(table.kelas.tipeKelas, kelas?.tipeKelas));

		const santriTanpaKelas = await db.query.santri.findMany({
			where: and(
				eq(table.santri.status, 'aktif'),
				notInArray(table.santri.id, subqueryKelasSantri)
			),
			with: { user: { columns: { nama: true } } },
			columns: { id: true }
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
