import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, and, or, sql, isNull, notExists, desc } from 'drizzle-orm';
import { pendaftaranSantriFormSchema } from '$lib/server/form-validation/pendaftaran-santri';
import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	const pendaftaranTerakhir = db
		.selectDistinctOn([table.pendaftaran_santri.santriId], {
			santriId: table.pendaftaran_santri.santriId,
			status: table.pendaftaran_santri.status,
			tanggalKeluar: table.pendaftaran_santri.tanggalKeluar,
			id: table.pendaftaran_santri.id
		})
		.from(table.pendaftaran_santri)
		.orderBy(
			table.pendaftaran_santri.santriId,
			desc(table.pendaftaran_santri.id) // terbaru berdasarkan waktu dibuat
		)
		.as('pendaftaran_terakhir');
	const tahunAktifId = db
		.select({ id: table.tahun_ajaran.id })
		.from(table.tahun_ajaran)
		.where(eq(table.tahun_ajaran.isActive, true));
	const santriBelumTerdaftar = await db
		.select({
			id: table.santri.id,
			nama: table.user.name,
			nis: table.santri.nomorIndukSantri
		})
		.from(table.santri)
		.innerJoin(table.user, eq(table.user.id, table.santri.userId))
		.leftJoin(pendaftaranTerakhir, eq(pendaftaranTerakhir.santriId, table.santri.id))
		.where(
			and(
				// tidak ada record di tahun aktif
				notExists(
					db
						.select({ one: sql`1` })
						.from(table.pendaftaran_santri)
						.where(
							and(
								eq(table.pendaftaran_santri.santriId, table.santri.id),
								eq(table.pendaftaran_santri.tahunAjaranId, tahunAktifId)
							)
						)
				),
				// record terakhirnya aktif, atau belum punya record sama sekali
				or(
					isNull(pendaftaranTerakhir.id),
					and(eq(pendaftaranTerakhir.status, 'aktif'), isNull(pendaftaranTerakhir.tanggalKeluar))
				)
			)
		);
	const [tahunAjaranId] = await db
		.select({ id: table.tahun_ajaran.id })
		.from(table.tahun_ajaran)
		.where(eq(table.tahun_ajaran.isActive, true));
	return { santriBelumTerdaftar, tahunAjaranId };
};

export const actions: Actions = {
	daftar: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const data = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		console.log(data);
		const validation = pendaftaranSantriFormSchema.safeParse(data);
		if (!validation.success) {
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				data: validation.data
			});
		}
		console.log(validation.data);
		const tanggal = new Date().toISOString();
		const dataToInsert: (typeof table.pendaftaran_santri.$inferInsert)[] = [];
		validation.data.santriId.map((value) => {
			dataToInsert.push({
				id: generateId(),
				tahunAjaranId: validation.data.tahunAjaranId,
				santriId: value,
				status: 'aktif',
				tanggalMasuk: tanggal
			});
		});

		console.log(dataToInsert);
		try {
			await db.insert(table.pendaftaran_santri).values(dataToInsert);
		} catch (err) {
			console.error(`Terjadi Error:`, err);
			return fail(500, { message: ' terjadi kesalahan di Server saat input data' });
		}
	}
};
