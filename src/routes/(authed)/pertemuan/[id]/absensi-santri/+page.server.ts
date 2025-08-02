import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { AbsensiSantriFormSchema } from '$lib/server/form-validation/absensi';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		error(400, 'ID tidak valid');
	}
	try {
		const isDataExist = await db.query.absensi_santri.findFirst({
			where: eq(table.absensi_santri.pertemuanId, id),
			columns: { pertemuanId: true }
		});
		if (isDataExist) {
			return { dataPertemuanExist: true, santriKelasData: [], id: id };
		}

		const dataPertemuan = await db.query.pertemuan.findFirst({
			where: eq(table.pertemuan.id, id),
			columns: { id: true },
			with: {
				jadwal: {
					columns: {
						kelasId: true
					}
				}
			}
		});
		const idKelas = Number(dataPertemuan?.jadwal.kelasId);
		const santriKelasData = await db.query.kelas_santri.findMany({
			where: eq(table.kelas_santri.kelasId, idKelas),
			with: {
				santri: {
					columns: {
						id: true
					},
					with: {
						user: {
							columns: {
								nama: true
							}
						}
					}
				}
			}
		});
		return { santriKelasData, id };
	} catch (err) {
		console.error('Terjadi Kesalahan saat memuat halaman pertemuan', err);
		error(500, 'Error Saat memuat data halaman pertemuan');
	}
};

export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const id = Number(event.params.id);
		const formData = await event.request.formData();

		const idSantriList = formData.getAll('santriId');
		const santriListArray: object[] = [];
		idSantriList.forEach((santri) => {
			const santriId = Number(santri);
			const status = formData.get(`status_${santriId}`);
			return santriListArray.push({
				pertemuanId: id,
				santriId: santriId,
				status_kehadiran: status
			});
		});

		const validationResult = AbsensiSantriFormSchema.safeParse(santriListArray);
		if (!validationResult.success) {
			return fail(400, {
				message: 'Terdapat kesalahan dalam data yang dikirimkan',
				error: z.prettifyError(validationResult.error)
			});
		}

		try {
			await db.insert(table.absensi_santri).values(validationResult.data);
			// return { success: true, message: 'berhasil menambahkan data absensi santri' };
		} catch (err) {
			console.error('Terjadi kesalahan saat menambahkan data absensi santri', err);
			fail(500, { message: 'Error saat menambahkan data absensi santri' });
		}
		return redirect(303, '/pertemuan/' + id + `/data-absensi`);
	}
};
