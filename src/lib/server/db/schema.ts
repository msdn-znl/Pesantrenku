import {
	pgTable,
	integer,
	timestamp,
	char,
	date,
	pgEnum,
	text,
	time,
	unique,
	boolean,
	index
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

// Soft Delete
const softDeleteColumn = {
	deletedAt: timestamp('deleted_at')
};

// User, Account, Session table definition
export const user = pgTable('user', {
	id: char('id', { length: 26 }).primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	...softDeleteColumn,
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires')
});

export const session = pgTable(
	'session',
	{
		id: char('id', { length: 26 }).primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: char('user_id', { length: 26 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by')
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: char('id', { length: 26 }).primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: char('user_id', { length: 26 })
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
	'verification',
	{
		id: char('id', { length: 26 }).primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session),
	accounts: many(account),
	guru: one(guru),
	santri: one(santri)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

// Academic Year table definition

export const tahun_ajaran = pgTable('tahun_ajaran', {
	id: char('id', { length: 26 }).primaryKey(),
	tahunAjaran: text('tahun_ajaran').notNull().unique(),
	isActive: boolean('is_active').default(false),
	...softDeleteColumn,
	...timestampColumns
});

export const tahunAjaranRelations = relations(tahun_ajaran, ({ many }) => ({
	kelas: many(kelas),
	pendaftaran_santri: many(pendaftaran_santri),
	penugasan_guru: many(penugasan_guru)
}));

// Kamar table definition
export const kamar = pgTable('kamar', {
	id: char('id', { length: 26 }).primaryKey(),

	namaKamar: text('nama_kamar').notNull(),
	...timestampColumns
});

export const kamarRelations = relations(kamar, ({ many }) => ({
	pendaftaran_santri: many(pendaftaran_santri)
}));

// Profile table definition

export const santri = pgTable('santri', {
	id: char('id', { length: 26 }).primaryKey(),
	nomorIndukSantri: text('nomor_induk_santri').unique(),
	nomorTelepon: text('nomor_telepon'),
	tempatLahir: text('tempat_lahir'),
	tanggalLahir: date('tanggal_lahir'),

	userId: char('user_id', { length: 26 })
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	...softDeleteColumn,
	...timestampColumns
});

export const pendaftaran_santri = pgTable(
	'pendaftaran_santri',
	{
		id: char('id', { length: 26 }).primaryKey(),
		santriId: char('santri_id', { length: 26 })
			.notNull()
			.references(() => santri.id, { onDelete: 'cascade' }),
		tahunAjaranId: char('tahun_ajaran_id', { length: 26 })
			.notNull()
			.references(() => tahun_ajaran.id, { onDelete: 'restrict' }),
		kamarId: char('kamar_id', { length: 26 }).references(() => kamar.id, {
			onDelete: 'set null'
		}),
		status: santriStatusEnum('status').default('aktif').notNull(),
		tanggalMasuk: date('tanggal_masuk'),
		tanggalKeluar: date('tanggal_keluar'),
		...timestampColumns
	},
	(t) => [
		unique().on(t.santriId, t.tahunAjaranId),
		index('idx_pendaftaran_tahun_ajaran').on(t.tahunAjaranId)
	]
);

export const guru = pgTable('guru', {
	id: char('id', { length: 26 }).primaryKey(),
	nomorIndukGuru: text('nomor_induk_guru').unique(),
	nomorTelepon: text('nomor_telepon'),
	userId: char('user_id', { length: 26 })
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	...softDeleteColumn,
	...timestampColumns
});

export const penugasan_guru = pgTable(
	'penugasan_guru',
	{
		id: char('id', { length: 26 }).primaryKey(),
		guruId: char('guru_id', { length: 26 })
			.notNull()
			.references(() => guru.id, { onDelete: 'cascade' }),
		tahunAjaranId: char('tahun_ajaran_id', { length: 26 })
			.notNull()
			.references(() => tahun_ajaran.id, { onDelete: 'restrict' }),
		status: statusEnum('status').default('aktif').notNull(),
		jabatan: text('jabatan'),
		...timestampColumns
	},
	(t) => [unique().on(t.guruId, t.tahunAjaranId)]
);

export const guruRelations = relations(guru, ({ one, many }) => ({
	user: one(user, {
		fields: [guru.userId],
		references: [user.id]
	}),
	jadwal: many(jadwal),
	absensi_guru_utama: many(absensi_guru, { relationName: 'absensiGuru_guru' }),
	absensi_guru_pengganti: many(absensi_guru, { relationName: 'absensiGuru_guruPengganti' }),
	kelas: one(kelas, {
		fields: [guru.id],
		references: [kelas.waliKelasId]
	}),
	penugasan_guru: many(penugasan_guru)
}));

export const santriRelations = relations(santri, ({ one, many }) => ({
	user: one(user, {
		fields: [santri.userId],
		references: [user.id]
	}),
	kelas_santri: many(kelas_santri),
	absensi_santri: many(absensi_santri),
	pendaftaran_santri: many(pendaftaran_santri)
}));

export const pendaftaranSantriRelations = relations(pendaftaran_santri, ({ one }) => ({
	santri: one(santri, {
		fields: [pendaftaran_santri.santriId],
		references: [santri.id]
	}),
	tahun_ajaran: one(tahun_ajaran, {
		fields: [pendaftaran_santri.tahunAjaranId],
		references: [tahun_ajaran.id]
	}),
	kamar: one(kamar, {
		fields: [pendaftaran_santri.kamarId],
		references: [kamar.id]
	})
}));

export const penugasanGuruRelations = relations(penugasan_guru, ({ one }) => ({
	guru: one(guru, {
		fields: [penugasan_guru.guruId],
		references: [guru.id]
	}),
	tahun_ajaran: one(tahun_ajaran, {
		fields: [penugasan_guru.tahunAjaranId],
		references: [tahun_ajaran.id]
	})
}));

// Pelajaran table definition

export const kitab = pgTable('kitab', {
	id: char('id', { length: 26 }).primaryKey(),
	namaKitab: text('nama_kitab').notNull(),
	pengarang: text('pengarang'),
	kategori: text('kategori'),
	...timestampColumns
});

export const kitabRelations = relations(kitab, ({ many }) => ({
	jadwal: many(jadwal)
}));

// Kelas table definition

export const kelas = pgTable(
	'kelas',
	{
		id: char('id', { length: 26 }).primaryKey(),

		namaKelas: text('nama_kelas').notNull(),
		tahunAjaranId: char('tahun_ajaran_id', { length: 26 }).references(() => tahun_ajaran.id, {
			onDelete: 'cascade'
		}),
		waliKelasId: char('wali_kelas_id', { length: 26 }).references(() => guru.id, {
			onDelete: 'set null'
		}),
		tipeKelas: tipeKelasEnum('tipe_kelas').default('diniyah'),
		...softDeleteColumn,
		...timestampColumns
	},
	(t) => [unique().on(t.namaKelas, t.tahunAjaranId)]
);

export const kelas_santri = pgTable(
	'kelas_santri',
	{
		id: char('id', { length: 26 }).primaryKey(),
		santriId: char('santri_id', { length: 26 })
			.references(() => santri.id, { onDelete: 'cascade' })
			.notNull(),
		kelasId: char('kelas_id', { length: 26 })
			.references(() => kelas.id, { onDelete: 'cascade' })
			.notNull(),
		assignedAt: timestamp('assigned_at').defaultNow()
	},
	(t) => [
		unique().on(t.santriId, t.kelasId),
		index('idx_kelas_santri_santri').on(t.santriId),
		index('idx_kelas_santri_kelas').on(t.kelasId)
	]
);

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

// Jadwal table definition

export const jadwal = pgTable(
	'jadwal',
	{
		id: char('id', { length: 26 }).primaryKey(),

		kitabId: char('kitab_id', { length: 26 })
			.notNull()
			.references(() => kitab.id),
		kelasId: char('kelas_id', { length: 26 })
			.notNull()
			.references(() => kelas.id),
		guruId: char('guru_id', { length: 26 })
			.notNull()
			.references(() => guru.id),
		hari: dayEnum('hari').notNull(),
		jamMulai: time('jam_mulai').notNull(),
		jamSelesai: time('jam_selesai').notNull(),
		berlakuMulai: date('berlaku_mulai').notNull(),
		berlakuSampai: date('berlaku_sampai'),
		...softDeleteColumn,
		...timestampColumns
	},
	(t) => [unique().on(t.kelasId, t.hari, t.jamMulai), unique().on(t.guruId, t.hari, t.jamMulai)]
);
export const jadwalRelations = relations(jadwal, ({ one, many }) => ({
	kitab: one(kitab, { fields: [jadwal.kitabId], references: [kitab.id] }),
	kelas: one(kelas, { fields: [jadwal.kelasId], references: [kelas.id] }),
	guru: one(guru, { fields: [jadwal.guruId], references: [guru.id] }),
	pertemuan: many(pertemuan)
}));

// Pertemuan, Absensi table definition

export const pertemuan = pgTable(
	'pertemuan',
	{
		id: char('id', { length: 26 }).primaryKey(),

		jadwalId: char('jadwal_id', { length: 26 })
			.notNull()
			.references(() => jadwal.id, { onDelete: 'cascade' }),
		jurnalMengajar: text('jurnal_mengajar'),
		tanggalPertemuan: date('tanggal_pertemuan').notNull(),
		status: pertemuanStatusEnum('status').default('selesai'),
		...softDeleteColumn,
		...timestampColumns
	},
	(t) => [
		unique().on(t.jadwalId, t.tanggalPertemuan),
		index('idx_pertemuan_jadwal_tanggal').on(t.jadwalId, t.tanggalPertemuan)
	]
);

export const absensi_santri = pgTable(
	'absensi_santri',
	{
		id: char('id', { length: 26 }).primaryKey(),

		pertemuanId: char('pertemuan_id', { length: 26 })
			.notNull()
			.references(() => pertemuan.id, { onDelete: 'cascade' }),
		santriId: char('santri_id', { length: 26 })
			.notNull()
			.references(() => santri.id, { onDelete: 'cascade' }),
		status_kehadiran: kehadiranSantriEnum('status_kehadiran').notNull().default('hadir'),
		keterangan: text('keterangan'),
		recordedBy: char('recorded_by', { length: 26 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		...timestampColumns
	},
	(t) => [
		unique().on(t.pertemuanId, t.santriId),
		index('idx_absensi_santri_pertemuan').on(t.pertemuanId),
		index('idx_absensi_santri_santri').on(t.santriId)
	]
);

export const absensi_guru = pgTable(
	'absensi_guru',
	{
		id: char('id', { length: 26 }).primaryKey(),

		pertemuanId: char('pertemuan_id', { length: 26 })
			.notNull()
			.references(() => pertemuan.id, { onDelete: 'cascade' }),
		guruId: char('guru_id', { length: 26 })
			.notNull()
			.references(() => guru.id, { onDelete: 'cascade' }),
		guruPenggantiId: char('guru_pengganti_id', { length: 26 }).references(() => guru.id, {
			onDelete: 'set null'
		}),
		status_kehadiran: kehadiranGuruEnum('status_kehadiran'),
		recordedBy: char('recorded_by', { length: 26 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		...timestampColumns
	},
	(t) => [
		unique().on(t.pertemuanId, t.guruId),
		index('idx_absensi_guru_pertemuan').on(t.pertemuanId),
		index('idx_absensi_guru_guru').on(t.guruId)
	]
);

export const rekap_absensi_santri = pgTable(
	'rekap_absensi_santri',
	{
		id: char('id', { length: 26 }).primaryKey(),
		santriId: char('santri_id', { length: 26 })
			.notNull()
			.references(() => santri.id, { onDelete: 'cascade' }),
		kelasId: char('kelas_id', { length: 26 })
			.notNull()
			.references(() => kelas.id, { onDelete: 'cascade' }),
		tahunAjaranId: char('tahun_ajaran_id', { length: 26 })
			.notNull()
			.references(() => tahun_ajaran.id, { onDelete: 'cascade' }),
		bulan: integer('bulan').notNull(),
		tahun: integer('tahun').notNull(),
		totalHadir: integer('total_hadir').default(0).notNull(),
		totalAlfa: integer('total_alfa').default(0).notNull(),
		totalIzin: integer('total_izin').default(0).notNull(),
		totalSakit: integer('total_sakit').default(0).notNull(),
		presentaseKehadiran: integer('presentase_kehadiran'),
		lastComputedAt: timestamp('last_computed_at').defaultNow().notNull(),
		...timestampColumns
	},
	(t) => [
		unique().on(t.santriId, t.kelasId, t.bulan, t.tahun),
		index('idx_rekap_santri_bulan_tahun').on(t.santriId, t.bulan, t.tahun)
	]
);
export const rekap_absensi_guru = pgTable(
	'rekap_absensi_guru',
	{
		id: char('id', { length: 26 }).primaryKey(),
		guruId: char('guru_id', { length: 26 })
			.notNull()
			.references(() => guru.id, { onDelete: 'cascade' }),
		tahunAjaranId: char('tahun_ajaran_id', { length: 26 })
			.notNull()
			.references(() => tahun_ajaran.id, { onDelete: 'cascade' }),
		bulan: integer('bulan').notNull(),
		tahun: integer('tahun').notNull(),
		totalJadwal: integer('total_jadwal').default(0).notNull(),
		totalMengajar: integer('total_mengajar').default(0).notNull(),
		totalTidakHadir: integer('total_tidak_hadir').default(0).notNull(),
		lastComputedAt: timestamp('last_computed_at').defaultNow().notNull(),
		...timestampColumns
	},
	(t) => [
		unique().on(t.guruId, t.tahunAjaranId, t.bulan, t.tahun),
		index('idx_rekap_guru_bulan_tahun').on(t.guruId, t.bulan, t.tahun)
	]
);

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
	}),
	recordedBy: one(user, {
		fields: [absensi_santri.recordedBy],
		references: [user.id]
	})
}));

export const absensiGuruRelations = relations(absensi_guru, ({ one }) => ({
	pertemuan: one(pertemuan, {
		fields: [absensi_guru.pertemuanId],
		references: [pertemuan.id]
	}),
	guru: one(guru, {
		relationName: 'absensiGuru_guru',
		fields: [absensi_guru.guruId],
		references: [guru.id]
	}),
	guruPengganti: one(guru, {
		relationName: 'absensiGuru_guruPengganti',
		fields: [absensi_guru.guruPenggantiId],
		references: [guru.id]
	}),
	recordedBy: one(user, {
		fields: [absensi_guru.recordedBy],
		references: [user.id]
	})
}));

export const rekapSantriRelations = relations(rekap_absensi_santri, ({ one }) => ({
	santri: one(santri, {
		fields: [rekap_absensi_santri.santriId],
		references: [santri.id]
	})
}));

// Type Exports
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
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
