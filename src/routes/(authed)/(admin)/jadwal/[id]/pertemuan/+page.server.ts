import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { SinglePertemuanFormSchema } from '$lib/server/form-validation/pertemuan';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const jadwalId = params.id;
	try {
		const pertemuanList = await db.query.pertemuan.findMany({
			where: eq(table.pertemuan.jadwalId, jadwalId),
			with: {
				jadwal: {
					columns: {
						hari: true
					},
					with: {
						kelas: {
							columns: {
								namaKelas: true
							}
						},
						kitab: {
							columns: {
								namaKitab: true
							}
						}
					}
				}
			}
		});
		return { pertemuanList };
	} catch (err) {
		console.error('Terjadi Kesalahan saat memuat halaman pertemuan', err);
		error(500, 'Error Saat memuat data halaman pertemuan');
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const pertemuanData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = SinglePertemuanFormSchema.safeParse(pertemuanData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: validationResult.data
			});
		}
		const dataPertemuan = {
			jadwalId: event.params.id,
			id: generateId(),
			tanggalPertemuan: new Date().toISOString().split('T')[0],
			...validationResult.data
		};
		console.log(dataPertemuan);

		try {
			await db.insert(table.pertemuan).values(dataPertemuan);
			return { success: true, message: 'berhasil menambahkan data pertemuan' };
		} catch (err) {
			console.error('Terjadi kesalahan saat menambahkan data pertemuan', err);
			return fail(500, { message: 'Error saat menambahkan data pertemuan' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const entryId = formData.get('id');
		if (typeof entryId !== 'string') {
			return fail(400, { message: 'ID pertemuan tidak valid' });
		}
		try {
			await db.delete(table.pertemuan).where(eq(table.pertemuan.id, entryId));
			return { success: true, message: 'data pertemuan berhasil dihapus' };
		} catch (err) {
			console.error('Error saat menghapus data pertemuan.', err);
			return fail(500, { message: 'Terjadi kesalahan saat menghapus data pertemuan' });
		}
	}
};
