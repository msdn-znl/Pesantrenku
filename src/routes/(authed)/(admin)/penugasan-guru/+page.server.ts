import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { PenetapanGuruFormSchema } from '$lib/server/form-validation/penetapan-guru';
import { fail } from '@sveltejs/kit';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	try {
		const tahunAjaran = await db.query.tahun_ajaran.findFirst({
			where: eq(table.tahun_ajaran.isActive, true)
		});
		const subqueryTahunAjaranId = db
			.select({ id: table.tahun_ajaran.id })
			.from(table.tahun_ajaran)
			.where(eq(table.tahun_ajaran.isActive, true))
			.limit(1);
		const guruList = await db
			.select({
				userId: table.user.id,
				guruId: table.guru.id,
				penugasanId: table.penugasan_guru.id,
				name: table.user.name,
				status: table.penugasan_guru.status
			})
			.from(table.guru)
			.innerJoin(table.user, eq(table.guru.userId, table.user.id))
			.leftJoin(
				table.penugasan_guru,
				and(
					eq(table.guru.id, table.penugasan_guru.guruId),
					eq(table.penugasan_guru.tahunAjaranId, subqueryTahunAjaranId)
				)
			);
		return { guruList, tahunAjaran };
	} catch (err) {
		console.error(err);
	}
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(formData);
		const inputData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);

		const validation = PenetapanGuruFormSchema.safeParse(inputData);
		if (!validation.success) {
			return fail(422, { message: 'Data yang anda masukkan salah', data: validation.data });
		}
		const insertData = validation.data.guruIds.map((item) => ({
			id: generateId(),
			guruId: item,
			tahunAjaranId: validation.data.tahunAjaranId,
			status: validation.data.actionType
		}));
		console.log(insertData);
		try {
			await db.insert(table.penugasan_guru).values(insertData);
		} catch (err) {
			console.error(err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	},
	delete: async (event) => {
		const formData = await event.request.formData();
		const guruId = formData.get('guruId')?.toString();
		if (!guruId) {
			return fail(422, {
				message: 'tidak ada Id yang dikirimkan',
				data: guruId
			});
		}
		const tahunAjaranId = formData.get('tahunAjaranId')?.toString();
		if (!tahunAjaranId) {
			return fail(422, {
				message: 'tidak ada Id yang dikirimkan',
				data: guruId
			});
		}
		try {
			await db
				.delete(table.penugasan_guru)
				.where(
					and(
						eq(table.penugasan_guru.guruId, guruId),
						eq(table.penugasan_guru.tahunAjaranId, tahunAjaranId)
					)
				);
		} catch (err) {
			console.error(err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
