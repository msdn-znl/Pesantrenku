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
	unique,
	boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums defined for PostgreSQL
export const userRoleEnum = pgEnum('user_role', ['admin', 'guru', 'santri']);
export const statusEnum = pgEnum('status', ['aktif', 'inaktif']);
export const santriStatusEnum = pgEnum('santri_status', ['aktif', 'lulus', 'keluar']);
export const tipeKelasEnum = pgEnum('tipe_kelas', ['diniyah', 'quran']);
export const dayEnum = pgEnum('day', [
	'Minggu',
	'Senin',
	'Selasa',
	'Rabu',
	'Kamis',
	'Jumat',
	'Sabtu'
]);
export const pertemuanStatusEnum = pgEnum('pertemuan_status', [
	'selesai',
	'batal',
	'tugas mandiri'
]);
export const kehadiranSantriEnum = pgEnum('kehadiran_santri', ['hadir', 'alfa', 'izin', 'sakit']);
export const kehadiranGuruEnum = pgEnum('kehadiran_guru', ['hadir', 'tidak hadir']);

// Timestamp
const timestampColumns = {
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
};

// Table Definitions
export const users = pgTable('users', {
	id: text('id').primaryKey(),
	nama: text('nama'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRoleEnum('role'),
	isActive: boolean('is_active').default(true).notNull(),
	...timestampColumns
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const tahun_ajaran = pgTable('tahun_ajaran', {
	id: text('id').primaryKey(),
	tahunAjaran: text('tahun_ajaran').notNull(),
	isActive: boolean('is_active').default(false),
	...timestampColumns
});

export const santri = pgTable('santri', {
	id: text('id').primaryKey(),
	nomorIndukSantri: text('nomor_induk_santri').unique(),
	tahunMasuk: integer('tahun_masuk'),
	tahunKeluar: integer('tahun_keluar'),
	nomorTelepon: text('nomor_telepon'),
	status: santriStatusEnum('santri_status').default('aktif'),
	tempatLahir: text('tempat_lahir'),
	tanggalLahir: date('tanggal_lahir'),
	kamarId: text('kamar_id').references(() => kamar.id, { onDelete: 'set null' }),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	...timestampColumns
});

export const guru = pgTable('guru', {
	id: text('id').primaryKey(),
	nomorIndukGuru: text('nomor_induk_guru').unique(),
	nomorTelepon: text('nomor_telepon'),
	status: statusEnum('status').default('aktif'),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	...timestampColumns
});

export const kelas = pgTable('kelas', {
	id: text('id').primaryKey(),

	namaKelas: text('nama_kelas').notNull(),
	tahunAjaranId: text('tahun_ajaran_id').references(() => tahun_ajaran.id, {
		onDelete: 'cascade'
	}),
	waliKelasId: text('wali_kelas_id').references(() => guru.id, {
		onDelete: 'set null'
	}),
	tipeKelas: tipeKelasEnum('tipe_kelas').default('diniyah'),
	...timestampColumns
});

export const kelas_santri = pgTable(
	'kelas_santri',
	{
		id: text('id').primaryKey(),
		santriId: text('santri_id')
			.references(() => santri.id, { onDelete: 'cascade' })
			.notNull(),
		kelasId: text('kelas_id')
			.references(() => kelas.id, { onDelete: 'cascade' })
			.notNull(),
		assignedAt: timestamp('assigned_at').defaultNow()
	},
	(t) => [unique().on(t.santriId, t.kelasId)]
);

export const kitab = pgTable('kitab', {
	id: text('id').primaryKey(),
	namaKitab: text('nama_kitab').notNull(),
	pengarang: text('pengarang'),
	kategori: text('kategori'),
	...timestampColumns
});

export const jadwal = pgTable('jadwal', {
	id: text('id').primaryKey(),

	kitabId: text('kitab_id')
		.notNull()
		.references(() => kitab.id),
	kelasId: text('kelas_id')
		.notNull()
		.references(() => kelas.id),
	guruId: text('guru_id')
		.notNull()
		.references(() => guru.id),
	hari: dayEnum('hari').notNull(),
	jamMulai: time('jam_mulai').notNull(),
	jamSelesai: time('jam_selesai').notNull(),
	isActive: boolean('is_active').default(true),
	...timestampColumns
});

export const pertemuan = pgTable(
	'pertemuan',
	{
		id: text('id').primaryKey(),

		jadwalId: text('jadwal_id')
			.notNull()
			.references(() => jadwal.id, { onDelete: 'cascade' }),
		jurnalMengajar: text('jurnal_mengajar'),
		tanggalPertemuan: date('tanggal_pertemuan'),
		status: pertemuanStatusEnum('status').default('selesai'),
		...timestampColumns
	},
	(t) => [unique().on(t.jadwalId, t.tanggalPertemuan)]
);

export const absensi_santri = pgTable(
	'absensi_santri',
	{
		id: text('id').primaryKey(),

		pertemuanId: text('pertemuan_id')
			.notNull()
			.references(() => pertemuan.id, { onDelete: 'cascade' }),
		santriId: text('santri_id')
			.notNull()
			.references(() => santri.id, { onDelete: 'cascade' }),
		status_kehadiran: kehadiranSantriEnum('status_kehadiran').notNull().default('hadir'),
		keterangan: text('keterangan'),
		...timestampColumns
	},
	(t) => [unique().on(t.pertemuanId, t.santriId)]
);

export const absensi_guru = pgTable(
	'absensi_guru',
	{
		id: text('id').primaryKey(),

		pertemuanId: text('pertemuan_id')
			.notNull()
			.references(() => pertemuan.id, { onDelete: 'cascade' }),
		guruId: text('guru_id')
			.notNull()
			.references(() => guru.id, { onDelete: 'cascade' }),
		status_kehadiran: kehadiranGuruEnum('status_kehadiran'),
		...timestampColumns
	},
	(t) => [unique().on(t.pertemuanId, t.guruId)]
);

export const kamar = pgTable('kamar', {
	id: text('id').primaryKey(),

	namaKamar: text('nama_kamar').notNull(),
	...timestampColumns
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
	absensi_santri: many(absensi_santri),
	kamar: one(kamar, {
		fields: [santri.kamarId],
		references: [kamar.id]
	})
}));

export const kelasRelations = relations(kelas, ({ many, one }) => ({
	kelas_santri: many(kelas_santri),
	tahun_ajaran: one(tahun_ajaran, {
		fields: [kelas.tahunAjaranId],
		references: [tahun_ajaran.id]
	}),
	guru: one(guru, {
		fields: [kelas.waliKelasId],
		references: [guru.id]
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

export const kamarRelations = relations(kamar, ({ many }) => ({
	santri: many(santri)
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
export type TahunAjaran = typeof tahun_ajaran.$inferSelect;
export type Kamar = typeof kamar.$inferSelect;
