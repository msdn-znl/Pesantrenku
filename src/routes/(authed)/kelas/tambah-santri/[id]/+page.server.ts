import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, notExists, and } from 'drizzle-orm';
import type { PageServerLoad, Actions, RequestEvent } from '../$types';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const paramsId = params.id;
	if (!paramsId || typeof paramsId !== 'string') {
		error(404, 'Data not found');
	}
	const id = parseInt(paramsId);
	try {
		const santriWithoutClass = await db.query.santri.findMany({
			where: notExists(
				db.select().from(table.kelas_santri).where(eq(table.kelas_santri.santriId, table.santri.id))
			),
			columns: {
				id: true
			},
			with: {
				user: {
					columns: {
						nama: true,
						id: true,
						username: true
					}
				}
			}
		});
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
		const paramsId = event.params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			error(404, 'Id tidak ditemukan');
		}
		const id = parseInt(paramsId);
		const formData = await event.request.formData();
		const inputData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		console.log(inputData);
		console.log(paramsId);
		try {
			await db.insert(table.kelas_santri).values({ santriId: inputData.id, kelasId: id });
			return { success: true };
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	},
	delete: async (event: RequestEvent) => {
		const paramsId = event.params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			error(404, 'Id tidak ditemukan');
		}
		const id = parseInt(paramsId);
		const formData = await event.request.formData();
		const inputData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		console.log(inputData);
		console.log(paramsId);
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
