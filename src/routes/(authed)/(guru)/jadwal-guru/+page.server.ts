import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	try {
		const subqueryGuruId = db
			.select({ id: table.guru.id })
			.from(table.guru)
			.where(eq(table.guru.userId, user.id));
		const jadwalList = await db.query.jadwal.findMany({
			where: and(eq(table.jadwal.guruId, subqueryGuruId), isNull(table.jadwal.berlakuSampai)),
			with: { kelas: true, kitab: true }
		});

		console.log(jadwalList);
		return { jadwalList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'Error while retrieving data from server' });
	}
};
