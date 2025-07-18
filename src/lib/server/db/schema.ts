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
import { relations } from 'drizzle-orm';

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

export const userRelations = relations(user, ({ one }) => ({
	guru: one(guru),
	santri: one(santri)
}));

export const guruRelations = relations(guru, ({ one, many }) => ({
	user: one(user, {
		fields: [guru.userId],
		references: [user.id]
	}),
	jadwal: many(jadwal),
	kelas: many(kelas_guru)
}));

export const santriRelations = relations(santri, ({ one, many }) => ({
	user: one(user, {
		fields: [santri.userId],
		references: [user.id]
	}),
	kelas_santri: many(kelas_santri)
}));

export const kelas = mysqlTable('kelas', {
	id: int('id').autoincrement().primaryKey(),
	namaKelas: varchar('nama_kelas', { length: 50 }),
	tahunAjaran: varchar('tahun_ajaran', { length: 20 }),
	ketuaKelas: int('ketua_kelas').references(() => santri.id, { onDelete: 'set null' })
});

export const kelasRelations = relations(kelas, ({ many }) => ({
	kelas_santri: many(kelas_santri),
	kelas_guru: many(kelas_guru)
}));

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

export const kelasSantriRelations = relations(kelas_santri, ({ one }) => ({
	kelas: one(kelas, {
		fields: [kelas_santri.kelasId],
		references: [kelas.id]
	}),
	santri: one(santri, {
		fields: [kelas_santri.santriId],
		references: [santri.id]
	})
}));

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

export const kelasGuruRelations = relations(kelas_guru, ({ one }) => ({
	kelas: one(kelas, {
		fields: [kelas_guru.kelasId],
		references: [kelas.id]
	}),
	guru: one(guru, {
		fields: [kelas_guru.guruId],
		references: [guru.id]
	})
}));

export const kitab = mysqlTable('kitab', {
	id: int('id').autoincrement().primaryKey(),
	namaKitab: varchar('nama_kitab', { length: 100 }),
	pengarang: varchar('pengarang', { length: 255 }),
	kategori: varchar('kategori', { length: 20 })
});

export const kitabRelations = relations(kitab, ({ many }) => ({
	jadwal: many(jadwal)
}));

export const jadwal = mysqlTable('jadwal', {
	id: int('id').autoincrement().primaryKey(),
	kitabId: int('kitab_id')
		.notNull()
		.references(() => kitab.id),
	kelasId: int('kelas_id')
		.notNull()
		.references(() => kelas.id),
	guruId: int('guru_id')
		.notNull()
		.references(() => guru.id),
	hari: mysqlEnum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
	jamMulai: time('jam_mulai'),
	jamSelesai: time('jam_selesai')
});

export const jadwalRelations = relations(jadwal, ({ one }) => ({
	kitab: one(kitab, { fields: [jadwal.kitabId], references: [kitab.id] }),
	kelas: one(kelas, { fields: [jadwal.kelasId], references: [kelas.id] }),
	guru: one(guru, { fields: [jadwal.guruId], references: [guru.id] })
}));

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Santri = typeof santri.$inferSelect;

export type Guru = typeof guru.$inferSelect;

export type Admin = typeof admin.$inferSelect;

export type Kelas = typeof kelas.$inferSelect;

export type KelasSantri = typeof kelas_santri.$inferSelect;

export type KelasGuru = typeof kelas_guru.$inferSelect;

export type Kitab = typeof kitab.$inferSelect;

export type Jadwal = typeof jadwal.$inferSelect;
