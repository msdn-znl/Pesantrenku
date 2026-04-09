import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { db } from '$lib/server/db';
import { eq, and, inArray } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { DeleteKelasSantriFormScheme } from '$lib/server/form-validation/kelas_santri';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	try {
		const listSantri = await db.query.kelas_santri.findMany({
			where: eq(table.kelas_santri.kelasId, id),
			with: { santri: { with: { user: { columns: { name: true } } }, columns: { userId: true } } }
		});
		const infoKelas = await db.query.kelas.findFirst({
			where: eq(table.kelas.id, id),
			with: {
				guru: { with: { user: { columns: { name: true } } }, columns: { userId: true } },
				tahun_ajaran: true
			}
		});
		return { listSantri, infoKelas };
	} catch (err) {
		console.error(err);
		error(500, 'Error ketika mengambil data dari database');
	}
};
export const actions: Actions = {
	delete: async (event: RequestEvent) => {
		const id = event.params.id;
		if (!id || typeof id !== 'string') {
			error(404, 'Id tidak ditemukan');
		}
		const formData = await event.request.formData();
		console.log(formData);
		const inputData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validation = DeleteKelasSantriFormScheme.safeParse(inputData);
		if (!validation.success) {
			return fail(422, { message: 'data yang dimasukkan salah' });
		}

		try {
			await db
				.delete(table.kelas_santri)
				.where(
					and(
						eq(table.kelas_santri.kelasId, id),
						inArray(table.kelas_santri.santriId, validation.data.idSantri)
					)
				);
			return { success: true, message: 'Berhasil Dihapus' };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
