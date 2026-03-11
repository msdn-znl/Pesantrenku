import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	try {
		const jadwalList = await db.query.jadwal.findMany({
			where: and(eq(table.jadwal.guruId, user.roleId), eq(table.jadwal.isActive, true)),
			with: { kelas: true, kitab: true }
		});
		return { jadwalList };
	} catch (err) {
		console.error(err);
		return error(500, { message: 'Error while retrieving data from server' });
	}
};
