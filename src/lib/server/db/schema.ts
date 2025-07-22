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

export const users = mysqlTable('users', {
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
		.references(() => users.id),
	expiresAt: datetime('expires_at').notNull()
});

export const tahun_ajaran = mysqlTable('tahun_ajaran', {
	id: int('id').autoincrement().primaryKey(),
	tahunAjaran: varchar('tahun_ajaran', { length: 25 })
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
		.references(() => users.id, { onDelete: 'cascade' })
});

export const guru = mysqlTable('guru', {
	id: int('id').autoincrement().primaryKey(),
	nomorIndukGuru: char('nomor_induk_guru', { length: 10 }),
	nomorTelepon: varchar('nomor_telepon', { length: 15 }),
	status: mysqlEnum(['aktif', 'inaktif']),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

// tabel admin ini bisa dihapus
// export const admin = mysqlTable('admin', {
// 	id: int('id').autoincrement().primaryKey(),
// 	userId: varchar('user_id', { length: 255 })
// 		.notNull()
// 		.references(() => users.id, { onDelete: 'cascade' })
// });

export const userRelations = relations(users, ({ one }) => ({
	guru: one(guru),
	santri: one(santri)
}));

export const guruRelations = relations(guru, ({ one, many }) => ({
	user: one(users, {
		fields: [guru.userId],
		references: [users.id]
	}),
	jadwal: many(jadwal),
	absensi_guru: many(absensi_guru)
	// kelas_guru: many(kelas_guru)
}));

export const santriRelations = relations(santri, ({ one, many }) => ({
	user: one(users, {
		fields: [santri.userId],
		references: [users.id]
	}),
	kelas_santri: many(kelas_santri),
	absensi_santri: many(absensi_santri)
}));

export const kelas = mysqlTable('kelas', {
	id: int('id').autoincrement().primaryKey(),
	namaKelas: varchar('nama_kelas', { length: 50 }),
	tahunAjaran: int('tahun_ajaran').references(() => tahun_ajaran.id, { onDelete: 'set null' }),
	ketuaKelas: int('ketua_kelas').references(() => santri.id, { onDelete: 'set null' })
});

export const kelasRelations = relations(kelas, ({ many }) => ({
	kelas_santri: many(kelas_santri)
	// kelas_guru: many(kelas_guru)
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

// export const kelas_guru = mysqlTable(
// 	'kelas_guru',
// 	{
// 		kelasId: int('kelas_id')
// 			.references(() => kelas.id, { onDelete: 'cascade' })
// 			.notNull(),
// 		guruId: int('guru_id')
// 			.references(() => guru.id, { onDelete: 'cascade' })
// 			.notNull()
// 	},
// 	(table) => [primaryKey({ columns: [table.kelasId, table.guruId] })]
// );

// export const kelasGuruRelations = relations(kelas_guru, ({ one }) => ({
// 	kelas: one(kelas, {
// 		fields: [kelas_guru.kelasId],
// 		references: [kelas.id]
// 	}),
// 	guru: one(guru, {
// 		fields: [kelas_guru.guruId],
// 		references: [guru.id]
// 	})
// }));

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

export const jadwalRelations = relations(jadwal, ({ one, many }) => ({
	kitab: one(kitab, { fields: [jadwal.kitabId], references: [kitab.id] }),
	kelas: one(kelas, { fields: [jadwal.kelasId], references: [kelas.id] }),
	guru: one(guru, { fields: [jadwal.guruId], references: [guru.id] }),
	pertemuan: many(pertemuan)
}));

export const pertemuan = mysqlTable('pertemuan', {
	id: int('id').autoincrement().primaryKey(),
	jadwalId: int('jadwal_id')
		.notNull()
		.references(() => jadwal.id),
	jurnalMengajar: text('jurnal_mengajar'),
	tanggalPertemuan: date('tanggal_pertemuan'),
	status: mysqlEnum(['selesai', 'batal', 'tugas mandiri'])
});

export const absensi_santri = mysqlTable('absensi_santri', {
	id: int('id').autoincrement().primaryKey(),
	pertemuanId: int('pertemuan_id')
		.notNull()
		.references(() => pertemuan.id, { onDelete: 'cascade' }),
	santriId: int('santri_id')
		.notNull()
		.references(() => santri.id, { onDelete: 'cascade' }),
	status_kehadiran: mysqlEnum(['hadir', 'alfa', 'izin', 'sakit'])
});

export const absensi_guru = mysqlTable('absensi_guru', {
	id: int('id').autoincrement().primaryKey(),
	pertemuanId: int('pertemuan_id')
		.notNull()
		.references(() => pertemuan.id, { onDelete: 'cascade' }),
	guruId: int('guru_id')
		.notNull()
		.references(() => guru.id, { onDelete: 'cascade' }),
	status_kehadiran: mysqlEnum(['hadir', 'tidak hadir'])
});

export const pertemuanRelations = relations(pertemuan, ({ one, many }) => ({
	jadwal: one(jadwal, { fields: [pertemuan.jadwalId], references: [jadwal.id] }),
	absensi_santri: many(absensi_santri),
	absensi_guru: many(absensi_guru)
}));

export const absensiSantriRelations = relations(absensi_santri, ({ one }) => ({
	pertemuan: one(pertemuan, { fields: [absensi_santri.pertemuanId], references: [pertemuan.id] }),
	santri: one(santri, { fields: [absensi_santri.santriId], references: [santri.id] })
}));

export const absensiGuruRelations = relations(absensi_guru, ({ one }) => ({
	pertemuan: one(pertemuan, { fields: [absensi_guru.pertemuanId], references: [pertemuan.id] }),
	guru: one(guru, { fields: [absensi_guru.guruId], references: [guru.id] })
}));

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;

export type Santri = typeof santri.$inferSelect;

export type Guru = typeof guru.$inferSelect;

// export type Admin = typeof admin.$inferSelect; // bisa dihilangkan

export type Kelas = typeof kelas.$inferSelect;

export type KelasSantri = typeof kelas_santri.$inferSelect;

// export type KelasGuru = typeof kelas_guru.$inferSelect;

export type Kitab = typeof kitab.$inferSelect;

export type Jadwal = typeof jadwal.$inferSelect;

export type Pertemuan = typeof pertemuan.$inferSelect;

export type AbsensiGuru = typeof absensi_guru.$inferSelect;

export type AbsensiSantri = typeof absensi_santri.$inferSelect;
