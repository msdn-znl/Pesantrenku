import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { PertemuanFormSchema } from '$lib/server/form-validation/pertemuan';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	try {
		const pertemuanData = await db.query.pertemuan.findFirst({
			where: eq(table.pertemuan.id, id),
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
		return { pertemuanData, jadwalList };
	} catch (err) {
		console.error('Terjadi Kesalahan saat memuat halaman pertemuan', err);
		error(500, 'Error Saat memuat data halaman pertemuan');
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const id = Number(event.params.id);
		const formData = await event.request.formData();
		const pertemuanData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = PertemuanFormSchema.safeParse(pertemuanData);
		console.log(validationResult);
		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: validationResult.data
			});
		}
		try {
			await db.update(table.pertemuan).set(validationResult.data).where(eq(table.pertemuan.id, id));
			return { success: true, message: 'berhasil mengubah data pertemuan' };
		} catch (err) {
			console.error('Terjadi kesalahan saat mengubah data pertemuan', err);
			fail(500, { message: 'Error saat mengubah data pertemuan' });
		}
	}
};
