import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import {
	PertemuanFormSchema,
	EditPertemuanFormSchema
} from '$lib/server/form-validation/pertemuan';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const pertemuanList = await db.query.pertemuan.findMany({
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
		const jadwalList = await db.query.jadwal.findMany({
			columns: {
				id: true,
				jamMulai: true,
				jamSelesai: true,
				hari: true
			},
			with: {
				kelas: {
					columns: {
						namaKelas: true
					}
				},
				guru: {
					with: {
						user: {
							columns: {
								nama: true
							}
						}
					}
				},
				kitab: {
					columns: {
						namaKitab: true
					}
				}
			}
		});
		return { pertemuanList, jadwalList };
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
		const validationResult = PertemuanFormSchema.safeParse(pertemuanData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: validationResult.data
			});
		}

		try {
			await db.insert(table.pertemuan).values({ id: generateId(), ...validationResult.data });
			return { success: true, message: 'berhasil menambahkan data pertemuan' };
		} catch (err) {
			console.error('Terjadi kesalahan saat menambahkan data pertemuan', err);
			return fail(500, { message: 'Error saat menambahkan data pertemuan' });
		}
	},
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const pertemuanData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = EditPertemuanFormSchema.safeParse(pertemuanData);
		console.log(validationResult);
		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: validationResult.data
			});
		}
		const { id, ...rest } = validationResult.data;
		try {
			await db.update(table.pertemuan).set(rest).where(eq(table.pertemuan.id, id));
			return { success: true, message: 'berhasil mengubah data pertemuan' };
		} catch (err) {
			console.error('Terjadi kesalahan saat mengubah data pertemuan', err);
			return fail(500, { message: 'Error saat mengubah data pertemuan' });
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const id = formData.get('id');
		if (!id || typeof id !== 'string') {
			return fail(422, { message: 'ID tidak valid' });
		}
		try {
			await db.delete(table.pertemuan).where(eq(table.pertemuan.id, id));
			return { success: true, message: 'data pertemuan berhasil dihapus' };
		} catch (err) {
			console.error('Error saat menghapus data pertemuan.', err);
			return fail(500, { message: 'Terjadi kesalahan saat menghapus data pertemuan' });
		}
	}
};
