import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { JadwalFormSchema } from '$lib/server/form-validation/jadwal';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as z from 'zod/v4';
import { generateId, groupJadwal, getTanggalSekarang } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const streamedPromises = {
			kelasList: db.select().from(table.kelas),
			guruList: db
				.select({ id: table.guru.id, nama: table.user.name })
				.from(table.guru)
				.innerJoin(table.user, eq(table.guru.userId, table.user.id)), //harusnya tabel join antara guru dan user
			kitabList: db.select().from(table.kitab)
		};
		const jadwalListPromise = db.query.jadwal.findMany({
			with: {
				guru: { with: { user: { columns: { name: true } } }, columns: {} },
				kelas: { columns: { namaKelas: true } },
				kitab: { columns: { namaKitab: true } }
			}
		});
		const dataJadwal = await jadwalListPromise;
		const groupedJadwalData = groupJadwal(dataJadwal);

		return { streamed: streamedPromises, jadwalList: dataJadwal, grouped: groupedJadwalData };
	} catch (err) {
		console.error(err);
		error(500, 'An error occured');
	}
};
export const actions: Actions = {
	create: async (event: RequestEvent) => {
		const formData = await event.request.formData();

		const jadwalFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);

		const validationResult = JadwalFormSchema.safeParse(jadwalFormData);

		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error)
			});
		}

		const { hari, ...dataLain } = validationResult.data;
		const dataToInsert: (typeof table.jadwal.$inferInsert)[] = hari.map((namaHari) => ({
			...dataLain,
			hari: namaHari,
			id: generateId(),
			berlakuMulai: getTanggalSekarang()
		}));
		try {
			await db.insert(table.jadwal).values(dataToInsert);
			return { success: true, message: 'Data berhasil ditambahkan' };
		} catch (err) {
			console.error(err);
			error(500, 'An error occured');
		}
	},
	delete: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const entryId = formData.get('id');
		if (!entryId) {
			return fail(400, { message: 'ID  tidak ada' });
		}
		if (typeof entryId !== 'string') {
			return fail(400, { message: 'ID tidak valid' });
		}

		try {
			await db.delete(table.jadwal).where(eq(table.jadwal.id, entryId));
			return { success: true, message: 'Berhasil Dihapus' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured ' });
		}
	}
};
