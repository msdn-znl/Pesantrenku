import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { error, redirect, fail } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, inArray } from 'drizzle-orm';
import { AbsensiSantriFormSchema } from '$lib/server/form-validation/absensi';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const isDataExist = await db.query.absensi_santri.findFirst({
		where: eq(table.absensi_santri.pertemuanId, id)
	});
	if (isDataExist) {
		redirect(303, `/pertemuan-guru/${id}`);
	}
	try {
		const subqueryKelasId = db
			.select({ kelasId: table.jadwal.kelasId })
			.from(table.pertemuan)
			.innerJoin(table.jadwal, eq(table.pertemuan.jadwalId, table.jadwal.id))
			.where(eq(table.pertemuan.id, id));
		const dataSantriKelas = await db.query.kelas_santri.findMany({
			where: inArray(table.kelas_santri.kelasId, subqueryKelasId),
			with: {
				santri: {
					columns: { id: true },
					with: {
						user: { columns: { name: true } }
					}
				}
			}
		});
		return { dataSantriKelas };
	} catch (err) {
		console.error(err);
		error(500, { message: 'Error while retrieving data from server' });
	}
};

export const actions: Actions = {
	add: async (event: RequestEvent) => {
		const id = event.params.id;
		const formData = await event.request.formData();

		const santriIdList = formData.getAll('santriId');
		const santriArray: object[] = [];
		santriIdList.forEach((itemId) => {
			const santriId = itemId;
			const status = formData.get(`status_${santriId}`);
			return santriArray.push({
				pertemuanId: id,
				santriId: santriId,
				status_kehadiran: status
			});
		});
		const validation = AbsensiSantriFormSchema.safeParse(santriArray);
		if (!validation.success) {
			return fail(400, {
				message: 'Terdapat kesalahan dalam data yang dikirimkan',
				error: z.prettifyError(validation.error)
			});
		}
		const absensiData = validation.data.map((item) => ({ id: generateId(), ...item }));
		try {
			await db.insert(table.absensi_santri).values(absensiData);
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Error saat menambahkan data ke database' });
		}
		return redirect(303, `/pertemuan-guru/${id}`);
	}
};
