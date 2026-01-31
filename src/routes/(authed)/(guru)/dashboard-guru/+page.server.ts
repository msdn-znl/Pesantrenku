import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

import { getHariIni, type dayString } from '$lib/utils';
export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const guruProfile = await db.query.guru.findFirst({
		where: eq(table.guru.userId, user.id),
		columns: { id: true },
		with: { user: { columns: { nama: true } } }
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

	return { user, isGuru: !!guruProfile, jadwalHariIni };
};

export const actions: Actions = {
	begin: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const jadwalId = Object.fromEntries(formData);
	}
};
