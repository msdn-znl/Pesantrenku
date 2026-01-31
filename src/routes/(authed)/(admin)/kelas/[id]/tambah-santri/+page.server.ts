import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and, count, lt, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	if (!id || typeof id !== 'string') {
		error(404, 'Data not found');
	}
	try {
		const santriWithoutClass = await db
			.select({
				id: table.santri.id,
				nama: table.users.nama,
				jumlahKelas: count(table.kelas_santri.kelasId),
				daftarKelas: sql<string[]>`array_agg(${table.kelas.namaKelas})`
			})
			.from(table.santri)
			.leftJoin(table.users, eq(table.santri.userId, table.users.id))
			.leftJoin(table.kelas_santri, eq(table.santri.id, table.kelas_santri.santriId))
			.leftJoin(table.kelas, eq(table.kelas_santri.kelasId, table.kelas.id))
			.groupBy(table.santri.id, table.users.id)
			.having(lt(count(table.kelas_santri.kelasId), 2));
		const santriWithClass = await db.query.kelas_santri.findMany({
			where: eq(table.kelas_santri.kelasId, id),
			with: {
				santri: {
					columns: {
						id: true
					},
					with: {
						user: {
							columns: {
								id: true,
								nama: true,
								username: true
							}
						}
					}
				}
			}
		});
		return { santriWithoutClass, santriWithClass };
	} catch (err) {
		console.error(`Error saat mengambil data. Error:` + err);
		error(500, 'Error saat memuat data halaman');
	}
};

export const actions: Actions = {
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
		if (!inputData.id || typeof inputData.id !== 'string') {
			return fail(400, { message: 'Id santri tidak ditemukan' });
		}
		try {
			await db
				.insert(table.kelas_santri)
				.values({ id: generateId(), santriId: inputData.id, kelasId: id });
			return { success: true };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	},

	delete: async (event: RequestEvent) => {
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
		if (!inputData.id || typeof inputData.id !== 'string') {
			return fail(400, { message: 'Id santri tidak ditemukan' });
		}
		try {
			await db
				.delete(table.kelas_santri)
				.where(
					and(eq(table.kelas_santri.santriId, inputData.id), eq(table.kelas_santri.kelasId, id))
				);
			return { success: true, message: 'Berhasil Dihapus' };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
