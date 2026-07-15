import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { EditAbsensiSantriFormSchema } from '$lib/server/form-validation/absensi';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	try {
		const dataAbsensiSantri = await db.query.absensi_santri.findMany({
			where: eq(table.absensi_santri.pertemuanId, id),
			with: {
				santri: {
					columns: { id: true },
					with: { user: { columns: { name: true } } }
				}
			}
		});
		return { dataAbsensiSantri };
	} catch (err) {
		console.error(err);
		error(500, { message: 'Error while retrieving data from server' });
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const pertemuanId = event.params.id;
		const formData = await event.request.formData();
		const idAbsensiList = formData.getAll('id');
		// const santriIdList = formData.getAll('santriId');
		// const pertemuanIdList = formData.getAll('pertemuanId');
		console.log(idAbsensiList);

		const itemToUpdated = idAbsensiList.map((item) => {
			const id = item;
			const status = formData.get(`status_${id}`);
			return { id: id, status_kehadiran: status };
		});

		const validationResult = EditAbsensiSantriFormSchema.safeParse(itemToUpdated);
		if (!validationResult.success) {
			return fail(400, {
				message: 'Terdapat kesalahan dalam data yang dikirimkan',
				error: z.prettifyError(validationResult.error)
			});
		}
		console.log(validationResult.data);
		try {
			await db.transaction(async (tx) => {
				for (const item of validationResult.data) {
					await tx
						.update(table.absensi_santri)
						.set({ status_kehadiran: item.status_kehadiran })
						.where(eq(table.absensi_santri.id, item.id));
				}
			});
		} catch (err) {
			console.error('Error saat mengubah data absensi:', err);
			return fail(500, { message: 'Error saat mengubah data absensi santri' });
		}
		return redirect(303, `/pertemuan-guru/${pertemuanId}`);
	}
};
