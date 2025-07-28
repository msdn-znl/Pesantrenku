import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { JadwalFormSchema } from '$lib/server/form-validation/jadwal';
import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const streamedPromises = {
			kelasList: db.select().from(table.kelas),
			guruList: db
				.select({ id: table.guru.id, nama: table.users.nama })
				.from(table.guru)
				.innerJoin(table.users, eq(table.guru.userId, table.users.id)), //harusnya tabel join antara guru dan user
			kitabList: db.select().from(table.kitab)
		};
		const jadwalListPromise = db
			.select({
				id: table.jadwal.id,
				nama: table.users.nama,
				kelas: table.kelas.namaKelas,
				kitab: table.kitab.namaKitab,
				hari: table.jadwal.hari,
				jamMulai: table.jadwal.jamMulai,
				jamSelesai: table.jadwal.jamSelesai
			})
			.from(table.jadwal)
			.innerJoin(table.guru, eq(table.jadwal.guruId, table.guru.id))
			.innerJoin(table.users, eq(table.guru.userId, table.users.id))
			.innerJoin(table.kelas, eq(table.jadwal.kelasId, table.kelas.id))
			.innerJoin(table.kitab, eq(table.jadwal.kitabId, table.kitab.id));
		return { streamed: streamedPromises, jadwalList: await jadwalListPromise };
	} catch (err) {
		console.error(err);
		error(500, 'An error occured');
	}
};
export const actions: Actions = {
	add: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const jadwalFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = JadwalFormSchema.safeParse(jadwalFormData);

		if (!validationResult.success) {
			return fail(422, { message: 'Data yang anda masukkan salah' });
		}
		console.log(validationResult.data);
		// const { kitabId, kelasId, guruId, hari, jamMulai, jamSelesai } = validationResult.data;
		try {
			await db.insert(table.jadwal).values(validationResult.data);
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
			return fail(400, { message: 'userId  tidak ada' });
		}
		if (typeof entryId !== 'string') {
			return fail(400, { message: 'userId tidak valid' });
		}
		const id = parseInt(entryId);
		try {
			await db.delete(table.jadwal).where(eq(table.jadwal.id, id));
			return { success: true, message: 'Berhasil Dihapus' };
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'An error occured ' });
		}
	}
};
