import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user && event.locals.user.role === 'admin') {
		return redirect(302, '/dashboard');
	}
	if (event.locals.user && event.locals.user.role === 'guru') {
		return redirect(302, '/dashboard-guru');
	}
	return {};
};
