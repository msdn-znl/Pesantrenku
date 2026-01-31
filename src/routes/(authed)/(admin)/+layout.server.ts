import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}
	if (locals.user.role !== 'admin') {
		redirect(302, '/login');
	}
	return {};
};
