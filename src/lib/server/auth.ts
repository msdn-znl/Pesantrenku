import { betterAuth } from 'better-auth/minimal';
import { admin } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { hash, verify, type Options } from '@node-rs/argon2';
import { ulid } from 'ulid';

const opts: Options = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export async function hashPassword(password: string) {
	const result = await hash(password, opts);
	return result;
}
export async function verifyPassword(data: { password: string; hash: string }) {
	const { password, hash } = data;
	const result = await verify(hash, password, opts);
	return result;
}

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	advanced: {
		database: {
			generateId: () => ulid()
		}
	},
	emailAndPassword: {
		enabled: true,
		password: {
			hash: hashPassword,
			verify: verifyPassword
		}
	},
	plugins: [sveltekitCookies(getRequestEvent), admin()] // make sure this is the last plugin in the array
});
