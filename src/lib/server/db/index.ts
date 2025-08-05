import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
// import { env } from '$env/dynamic/private';
import { config } from 'dotenv';

config({ path: '/home/msdn/Pesantrenku/.env' });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

export const db = drizzle({ client: pool, schema: schema });
