import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { AbsensiSantriFormSchema } from '$lib/server/form-validation/absensi';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	if (!id || typeof id !== 'string') {
		error(404, 'Data not found');
	}
	try {
		const isDataExist = await db.query.absensi_santri.findFirst({
			where: eq(table.absensi_santri.pertemuanId, id),
			columns: { pertemuanId: true }
		});
		if (isDataExist) {
			return { dataKehadiranExist: true, santriKelasData: [], id: id };
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
		const idKelas = dataPertemuan?.jadwal.kelasId;
		if (!idKelas || typeof idKelas !== 'string') {
			error(404, 'Data kelas tidak ditemukan');
		}
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
		const id = event.params.id;
		const formData = await event.request.formData();

		const idSantriList = formData.getAll('santriId');
		const santriListArray: object[] = [];
		idSantriList.forEach((santri) => {
			const santriId = santri;
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
		const absensiData = validationResult.data.map((item) => ({ id: generateId(), ...item }));
		try {
			await db.insert(table.absensi_santri).values(absensiData);
			// return { success: true, message: 'berhasil menambahkan data absensi santri' };
		} catch (err) {
			console.error('Terjadi kesalahan saat menambahkan data absensi santri', err);
			return fail(500, { message: 'Error saat menambahkan data absensi santri' });
		}
		return redirect(303, '/pertemuan/' + id + `/data-absensi`);
	}
};
