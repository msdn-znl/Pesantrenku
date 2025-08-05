import {
	pgTable,
	integer,
	varchar,
	timestamp,
	char,
	date,
	pgEnum,
	text,
	time,
	serial,
	unique
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums defined for PostgreSQL
export const userRoleEnum = pgEnum('user_role', ['admin', 'guru', 'santri']);
export const statusEnum = pgEnum('status', ['aktif', 'inaktif']);
export const dayEnum = pgEnum('day', [
	'Senin',
	'Selasa',
	'Rabu',
	'Kamis',
	'Jumat',
	'Sabtu',
	'Minggu'
]);
export const pertemuanStatusEnum = pgEnum('pertemuan_status', [
	'selesai',
	'batal',
	'tugas mandiri'
]);
export const kehadiranSantriEnum = pgEnum('kehadiran_santri', ['hadir', 'alfa', 'izin', 'sakit']);
export const kehadiranGuruEnum = pgEnum('kehadiran_guru', ['hadir', 'tidak hadir']);

// Table Definitions
export const users = pgTable('users', {
	id: varchar('id', { length: 255 }).primaryKey(),
	age: integer('age'),
	nama: varchar('nama', { length: 255 }),
	username: varchar('username', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: userRoleEnum('role')
});

export const session = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const tahun_ajaran = pgTable('tahun_ajaran', {
	id: serial('id').primaryKey(),
	tahunAjaran: varchar('tahun_ajaran', { length: 25 })
});

export const santri = pgTable('santri', {
	id: serial('id').primaryKey(),
	nomorIndukSantri: char('nomor_induk_santri', { length: 10 }),
	tahunMasuk: integer('tahun_masuk'),
	tahunKeluar: integer('tahun_keluar'),
	nomorTelepon: varchar('nomor_telepon', { length: 15 }),
	status: statusEnum('status').notNull(),
	tempatLahir: varchar('tempat_lahir', { length: 255 }),
	tanggalLahir: date('tanggal_lahir'),
	kamar: varchar('kamar', { length: 255 }),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

export const guru = pgTable('guru', {
	id: serial('id').primaryKey(),
	nomorIndukGuru: char('nomor_induk_guru', { length: 10 }),
	nomorTelepon: varchar('nomor_telepon', { length: 15 }),
	status: statusEnum('status'),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

export const kelas = pgTable('kelas', {
	id: serial('id').primaryKey(),
	namaKelas: varchar('nama_kelas', { length: 50 }),
	tahunAjaran: integer('tahun_ajaran').references(() => tahun_ajaran.id, {
		onDelete: 'set null'
	}),
	ketuaKelas: integer('ketua_kelas').references(() => santri.id, {
		onDelete: 'set null'
	})
});

export const kelas_santri = pgTable(
	'kelas_santri',
	{
		id: serial('id').primaryKey(),
		santriId: integer('santri_id')
			.references(() => santri.id, { onDelete: 'cascade' })
			.notNull(),
		kelasId: integer('kelas_id')
			.references(() => kelas.id, { onDelete: 'cascade' })
			.notNull()
	},
	(t) => [unique().on(t.santriId, t.kelasId)]
);

export const kitab = pgTable('kitab', {
	id: serial('id').primaryKey(),
	namaKitab: varchar('nama_kitab', { length: 100 }),
	pengarang: varchar('pengarang', { length: 255 }),
	kategori: varchar('kategori', { length: 20 })
});

export const jadwal = pgTable('jadwal', {
	id: serial('id').primaryKey(),
	kitabId: integer('kitab_id')
		.notNull()
		.references(() => kitab.id),
	kelasId: integer('kelas_id')
		.notNull()
		.references(() => kelas.id),
	guruId: integer('guru_id')
		.notNull()
		.references(() => guru.id),
	hari: dayEnum('hari'),
	jamMulai: time('jam_mulai'),
	jamSelesai: time('jam_selesai')
});

export const pertemuan = pgTable('pertemuan', {
	id: serial('id').primaryKey(),
	jadwalId: integer('jadwal_id')
		.notNull()
		.references(() => jadwal.id),
	jurnalMengajar: text('jurnal_mengajar'),
	tanggalPertemuan: date('tanggal_pertemuan'),
	status: pertemuanStatusEnum('status')
});

export const absensi_santri = pgTable('absensi_santri', {
	id: serial('id').primaryKey(),
	pertemuanId: integer('pertemuan_id')
		.notNull()
		.references(() => pertemuan.id, { onDelete: 'cascade' }),
	santriId: integer('santri_id')
		.notNull()
		.references(() => santri.id, { onDelete: 'cascade' }),
	status_kehadiran: kehadiranSantriEnum('status_kehadiran')
});

export const absensi_guru = pgTable('absensi_guru', {
	id: serial('id').primaryKey(),
	pertemuanId: integer('pertemuan_id')
		.notNull()
		.references(() => pertemuan.id, { onDelete: 'cascade' }),
	guruId: integer('guru_id')
		.notNull()
		.references(() => guru.id, { onDelete: 'cascade' }),
	status_kehadiran: kehadiranGuruEnum('status_kehadiran')
});

// Relations Definitions
export const userRelations = relations(users, ({ one }) => ({
	guru: one(guru),
	santri: one(santri)
}));

export const tahunAjaranRelations = relations(tahun_ajaran, ({ many }) => ({
	kelas: many(kelas)
}));

export const guruRelations = relations(guru, ({ one, many }) => ({
	user: one(users, {
		fields: [guru.userId],
		references: [users.id]
	}),
	jadwal: many(jadwal),
	absensi_guru: many(absensi_guru)
}));

export const santriRelations = relations(santri, ({ one, many }) => ({
	user: one(users, {
		fields: [santri.userId],
		references: [users.id]
	}),
	kelas_santri: many(kelas_santri),
	absensi_santri: many(absensi_santri)
}));

export const kelasRelations = relations(kelas, ({ many, one }) => ({
	kelas_santri: many(kelas_santri),
	tahun_ajaran: one(tahun_ajaran, {
		fields: [kelas.tahunAjaran],
		references: [tahun_ajaran.id]
	})
}));

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

export const kitabRelations = relations(kitab, ({ many }) => ({
	jadwal: many(jadwal)
}));

export const jadwalRelations = relations(jadwal, ({ one, many }) => ({
	kitab: one(kitab, { fields: [jadwal.kitabId], references: [kitab.id] }),
	kelas: one(kelas, { fields: [jadwal.kelasId], references: [kelas.id] }),
	guru: one(guru, { fields: [jadwal.guruId], references: [guru.id] }),
	pertemuan: many(pertemuan)
}));

export const pertemuanRelations = relations(pertemuan, ({ one, many }) => ({
	jadwal: one(jadwal, {
		fields: [pertemuan.jadwalId],
		references: [jadwal.id]
	}),
	absensi_santri: many(absensi_santri),
	absensi_guru: many(absensi_guru)
}));

export const absensiSantriRelations = relations(absensi_santri, ({ one }) => ({
	pertemuan: one(pertemuan, {
		fields: [absensi_santri.pertemuanId],
		references: [pertemuan.id]
	}),
	santri: one(santri, {
		fields: [absensi_santri.santriId],
		references: [santri.id]
	})
}));

export const absensiGuruRelations = relations(absensi_guru, ({ one }) => ({
	pertemuan: one(pertemuan, {
		fields: [absensi_guru.pertemuanId],
		references: [pertemuan.id]
	}),
	guru: one(guru, {
		fields: [absensi_guru.guruId],
		references: [guru.id]
	})
}));

// Type Exports
export type Session = typeof session.$inferSelect;
export type User = typeof users.$inferSelect;
export type Santri = typeof santri.$inferSelect;
export type Guru = typeof guru.$inferSelect;
export type Kelas = typeof kelas.$inferSelect;
export type KelasSantri = typeof kelas_santri.$inferSelect;
export type Kitab = typeof kitab.$inferSelect;
export type Jadwal = typeof jadwal.$inferSelect;
export type Pertemuan = typeof pertemuan.$inferSelect;
export type AbsensiGuru = typeof absensi_guru.$inferSelect;
export type AbsensiSantri = typeof absensi_santri.$inferSelect;
