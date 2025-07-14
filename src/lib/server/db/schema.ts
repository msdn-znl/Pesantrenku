import {
	mysqlTable,
	int,
	varchar,
	datetime,
	char,
	date,
	mysqlEnum,
	text,
	time,
	primaryKey
} from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	age: int('age'),
	nama: varchar('nama', { length: 255 }),
	username: varchar('username', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: mysqlEnum(['admin', 'guru', 'santri'])
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

export const santri = mysqlTable('santri', {
	id: int('id').autoincrement().primaryKey(),
	nomorIndukSantri: char('nomor_induk_santri', { length: 10 }),
	tahunMasuk: int('tahun_masuk'),
	tahunKeluar: int('tahun_keluar'),
	nomorTelepon: varchar('nomor_telepon', { length: 15 }),
	status: mysqlEnum(['aktif', 'inaktif']).notNull(),
	tempatLahir: varchar('tempat_lahir', { length: 255 }),
	tanggalLahir: date('tanggal_lahir'),
	kamar: varchar('kamar', { length: 255 }),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const guru = mysqlTable('guru', {
	id: int('id').autoincrement().primaryKey(),
	nomorIndukGuru: char('nomor_induk_guru', { length: 10 }),
	nomorTelepon: varchar('nomor_telepon', { length: 15 }),
	status: mysqlEnum(['aktif', 'inaktif']),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const admin = mysqlTable('admin', {
	id: int('id').autoincrement().primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const kelas = mysqlTable('kelas', {
	id: int('id').autoincrement().primaryKey(),
	namaKelas: varchar('nama_kelas', { length: 50 }),
	tahunAjaran: varchar('tahun_ajaran', { length: 20 }),
	ketuaKelas: int('ketua_kelas').references(() => santri.id, { onDelete: 'set null' })
});

export const kelas_santri = mysqlTable(
	'kelas_santri',
	{
		santriId: int('santri_id')
			.references(() => santri.id, { onDelete: 'cascade' })
			.notNull(),
		kelasId: int('kelas_id')
			.references(() => kelas.id, { onDelete: 'cascade' })
			.notNull()
	},
	(table) => [primaryKey({ columns: [table.kelasId, table.santriId] })]
);

export const kelas_guru = mysqlTable(
	'kelas_guru',
	{
		kelasId: int('kelas_id')
			.references(() => kelas.id, { onDelete: 'cascade' })
			.notNull(),
		guruId: int('guru_id')
			.references(() => guru.id, { onDelete: 'cascade' })
			.notNull()
	},
	(table) => [primaryKey({ columns: [table.kelasId, table.guruId] })]
);

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Santri = typeof santri.$inferSelect;

export type Guru = typeof guru.$inferSelect;

export type Admin = typeof admin.$inferSelect;

export type Kelas = typeof kelas.$inferSelect;

export type KelasSantri = typeof kelas_santri.$inferSelect;

export type KelasGuru = typeof kelas_guru.$inferSelect;
