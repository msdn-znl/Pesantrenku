import { hash } from '@node-rs/argon2';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { RegisterFormSchema } from '$lib/server/form-validation/user';
import * as z from 'zod/v4';
import { generateId } from '$lib/utils';

const setupRequired = async () => {
	const admin = await db.query.user.findFirst({
		where: eq(table.user.role, 'admin')
	});
	return !admin;
};
export const load: PageServerLoad = async () => {
	const required = await setupRequired();
	if (!required) {
		redirect(302, '/login');
	}
};

export const actions: Actions = {
	register: async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const userFormData = Object.fromEntries(
			Array.from(formData.keys()).map((key) => [
				key,
				formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
			])
		);
		const validationResult = RegisterFormSchema.safeParse(userFormData);
		if (!validationResult.success) {
			console.log(validationResult.error);
			return fail(422, {
				message: 'Data yang anda masukkan salah',
				error: z.prettifyError(validationResult.error),
				data: userFormData
			});
		}

		const { username, password, nama } = validationResult.data;
		const role = 'admin';
		const userId = generateId;
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const userData = {
			id: userId,
			name: nama,
			role: role,
			email: username
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const accountData = {
			id: generateId,
			accountId: userId,
			providerId: 'credential',
			userId: userId,
			password: passwordHash
		};
		try {
			// await db.transaction(async (tx) => {
			// 	await tx.insert(table.user).values(userData);
			// 	await tx.insert(table.account).values(accountData);
			// });
			await auth.api.signUpEmail({
				body: {
					name: nama,
					email: username,
					password: password
				}
			});
			await db.update(table.user).set({ role: role }).where(eq(table.user.email, username));
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occurred' });
		}
		try {
			await auth.api.signInEmail({
				body: {
					email: username,
					password: password
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Signin failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}
		return redirect(302, '/dashboard');
	}
};
