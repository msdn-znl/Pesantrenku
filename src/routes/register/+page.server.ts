import { hash, verify } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { RegisterFormSchema } from '$lib/server/form-validation/user';
import * as z from 'zod/v4';

import { generateId } from '$lib/utils';

export const load: PageServerLoad = async () => {
	const result = await db.select({ count: count() }).from(table.users);
	const userCount = result[0].count;

	if (userCount > 0) {
		redirect(307, '/login');
	}
	return {};
};

export const actions: Actions = {
	register: async (event: RequestEvent) => {
		const countResult = await db.select({ count: count() }).from(table.users);
		if (countResult[0].count > 0) {
			return fail(403, { message: 'Setup Pertama Kali sudah dilakukan, tidak bisa register lagi' });
		}
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
		const userId = generateId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.users).values({ id: userId, username, passwordHash, role: role, nama });
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'An error has occurred' });
		}

		const results = await db.select().from(table.users).where(eq(table.users.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		if (existingUser.role === 'admin') {
			return redirect(302, '/dashboard');
		}
		if (existingUser.role === 'guru') {
			return redirect(302, '/dashboard-guru');
		}
	}
};
