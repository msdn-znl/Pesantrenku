import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, error } from '@sveltejs/kit';
import { JadwalFormSchema } from '$lib/server/form-validation/jadwal';
import * as z from 'zod/v4';

export const load: PageServerLoad = async ({ params }) => {
	const paramsId = params.id;
	if (!paramsId || typeof paramsId !== 'string') {
		error(404, 'Data not found');
	}
	const id = parseInt(paramsId);
	try {
		const streamedPromises = {
			kelasList: db.select().from(table.kelas),
			guruList: db
				.select({ id: table.guru.id, nama: table.users.nama })
				.from(table.guru)
				.innerJoin(table.users, eq(table.guru.userId, table.users.id)), //harusnya tabel join antara guru dan user
			kitabList: db.select().from(table.kitab)
		};
		const jadwal = db.query.jadwal.findFirst({
			where: eq(table.jadwal.id, id),
			with: {
				guru: {
					with: {
						user: true
					}
				},
				kelas: true,
				kitab: true
			}
		});
		return { streamed: streamedPromises, jadwal: await jadwal };
	} catch (err) {
		console.error(err);
		error(500, 'An error occured');
	}
};

export const actions: Actions = {
	edit: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const paramsId = event.params.id;
		if (!paramsId || typeof paramsId !== 'string') {
			return fail(400, { message: 'ID tidak ditemukan' });
		}
		const id = parseInt(paramsId);
		const jadwalData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = JadwalFormSchema.safeParse(jadwalData);
		if (!validationResult.success) {
			return fail(422, {
				message: 'Data yang anda masukan salah ',
				error: z.prettifyError(validationResult.error),
				data: jadwalData
			});
		}
		// const { guruId, kelasId, kitabId, hari, jamMulai, jamSelesai } = validationResult.data;
		try {
			await db.update(table.jadwal).set(validationResult.data).where(eq(table.jadwal.id, id));
		} catch (err) {
			console.error(err);
			error(500, 'An error occured');
		}
	}
};
