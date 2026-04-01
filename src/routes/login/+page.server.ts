import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { LoginUserFormSchema } from '$lib/server/form-validation/user';
import * as z from 'zod/v4';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user && event.locals.user.role === 'admin') {
		return redirect(302, '/dashboard');
	}
	if (event.locals.user && event.locals.user.role === 'guru') {
		return redirect(302, '/dashboard-guru');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const loginData = Object.fromEntries(formData);
		const validationResult = LoginUserFormSchema.safeParse(loginData);

		if (!validationResult.success) {
			console.log(validationResult.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error)
			});
		}
		const username = validationResult.data.username;
		const password = validationResult.data.password;
		let role;
		try {
			const response = await auth.api.signInEmail({
				body: {
					email: username,
					password: password
				}
			});
			role = response.user.role;
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Signin failed' });
			}
			console.error(error);
			return fail(500, { message: 'Unexpected error' });
		}
		if (role === 'admin') {
			return redirect(302, '/dashboard');
		} else if (role === 'guru') {
			return redirect(302, '/dashboard-guru');
		}
	}
};
