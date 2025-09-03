import type { LayoutServerLoad } from './$types';
import { injectSpeedInsights } from '@vercel/speed-insights';

export const load: LayoutServerLoad = async ({ locals }) => {
	return { user: locals.user };
};
injectSpeedInsights();
