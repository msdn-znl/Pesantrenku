import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq, and, getTableColumns } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

import { SinglePertemuanFormSchema } from '$lib/server/form-validation/pertemuan';
import * as z from 'zod/v4';
import { getHariIni, getTanggalSekarang, type dayString, generateId } from '$lib/utils';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const guruProfile = await db.query.guru.findFirst({
		where: eq(table.guru.userId, user.id),
		columns: { id: true },
		with: { user: { columns: { name: true } } }
	});
	let jadwalHariIni = undefined;
	if (guruProfile) {
		const hariIni = getHariIni();
		jadwalHariIni = await db.query.jadwal.findMany({
			where: and(
				eq(table.jadwal.guruId, guruProfile.id),
				eq(table.jadwal.hari, hariIni as dayString)
			),
			with: { kelas: true, kitab: true }
		});
	}
	const tanggalSekarang = getTanggalSekarang();
	const hariIni = getHariIni();
	const jadwalSekarang = await db
		.select()
		.from(table.jadwal)
		.leftJoin(table.kitab, eq(table.kitab.id, table.jadwal.kitabId))
		.leftJoin(table.kelas, eq(table.kelas.id, table.jadwal.kelasId))
		.leftJoin(
			table.pertemuan,
			and(
				eq(table.pertemuan.jadwalId, table.jadwal.id),
				eq(table.pertemuan.tanggalPertemuan, tanggalSekarang)
			)
		)
		.where(and(eq(table.jadwal.guruId, guruProfile.id), eq(table.jadwal.hari, hariIni)));
	console.log(jadwalSekarang);
	return { user, isGuru: !!guruProfile, jadwalHariIni, jadwalSekarang };
};

export const actions: Actions = {
	begin: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const jadwalId = formData.get('jadwalId');
		if (typeof jadwalId !== 'string') {
			return fail(400, { message: 'ID Jadwal tidak valid' });
		}
		const tanggalHariIni = getTanggalSekarang();
		const pertemuan = await db.query.pertemuan.findFirst({
			where: and(
				eq(table.pertemuan.jadwalId, jadwalId),
				eq(table.pertemuan.tanggalPertemuan, tanggalHariIni)
			)
		});
		if (!pertemuan) {
			const pertemuanData = Object.fromEntries(formData);
			const validationResult = SinglePertemuanFormSchema.safeParse(pertemuanData);
			if (!validationResult.success) {
				return fail(422, {
					message: 'Data yang anda masukkan salah',
					error: z.prettifyError(validationResult.error),
					data: validationResult.data
				});
			}
			const data = {
				jadwalId: jadwalId,
				id: generateId(),
				tanggalPertemuan: tanggalHariIni,
				...validationResult.data
			};
			console.log(data);
			try {
				await db.insert(table.pertemuan).values(data);
			} catch (err) {
				console.error(err);
				return error(500, { message: 'terjadi kesalahan saat menambahkan data' });
			}
			redirect(303, `/pertemuan-guru/${data.id}/tambah-absensi`);
		}
		redirect(303, `/pertemuan-guru/${pertemuan.id}`);
	}
};
