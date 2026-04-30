/**
 * seed.ts — Dummy data for Pesantren ERP (schema-v4)
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *   (or wherever you place this file)
 *
 * Prerequisites:
 *   npm install bcryptjs @types/bcryptjs
 *
 * ⚠️  IMPORTANT — Password hashing:
 *   Better-Auth uses scrypt by default (via oslo). This seed uses bcrypt for
 *   simplicity, so seeded users CANNOT log in through Better-Auth unless you
 *   either (a) switch BA's password hasher to bcrypt, or (b) use BA's signUp
 *   API to create the admin user, then insert the rest with BA's hashed output.
 *   All seeded accounts use password: "password123"
 *
 * ⚠️  SCHEMA BUG NOTICE (schema-v4.ts):
 *   `santriRelations` references `santri.kamarId` (line ~281) but the
 *   `santri` table in v4 does NOT have a `kamarId` column — it was moved to
 *   `pendaftaran_santri`. This will cause a TypeScript/Drizzle compile error.
 *   Fix: remove the `kamar: one(kamar, ...)` entry from `santriRelations`.
 *
 * ⚠️  SCHEMA BUG NOTICE 2 (schema-v4.ts):
 *   `absensiGuruRelations` has two `one(guru, ...)` relations without
 *   `relationName` disambiguation. Add `relationName` to both.
 *
 * Adjust the import paths below to match your project structure.
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '$lib/server/db/schema';

import { hash } from '@node-rs/argon2';
import { generateId } from '$lib/utils';
const env = process.env;
console.log(env.DATABASE_URL);

// ─── DB Connection ────────────────────────────────────────────────────────────
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
	connectionString: env.DATABASE_URL
});

const db = drizzle({ client: pool, schema: schema });

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Simple seeded PRNG — deterministic across runs */
function makeRng(seed: number) {
	let s = seed;
	return () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
}
const rng = makeRng(42);

function weightedStatus(): 'hadir' | 'alfa' | 'izin' | 'sakit' {
	const r = rng();
	if (r < 0.8) return 'hadir';
	if (r < 0.88) return 'alfa';
	if (r < 0.95) return 'izin';
	return 'sakit';
}

const DAY_INDEX: Record<string, number> = {
	Minggu: 0,
	Senin: 1,
	Selasa: 2,
	Rabu: 3,
	Kamis: 4,
	Jumat: 5,
	Sabtu: 6
};

/**
 * Returns `count` ISO date strings for every occurrence of `hari`
 * starting from (or after) `startDate`.
 */
function weeklyDates(hari: string, startDate: Date, count: number): string[] {
	const target = DAY_INDEX[hari];
	const cur = new Date(startDate);
	while (cur.getDay() !== target) cur.setDate(cur.getDate() + 1);
	const results: string[] = [];
	for (let i = 0; i < count; i++) {
		results.push(cur.toISOString().split('T')[0]);
		cur.setDate(cur.getDate() + 7);
	}
	return results;
}

function pad(n: number, len = 2) {
	return String(n).padStart(len, '0');
}

// Chunk an array for batch inserts
function chunks<T>(arr: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
	return result;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const GURU_NAMES = [
	'Ahmad Fauzi',
	'Budi Santoso',
	'Cahyo Wibowo',
	'Dedi Kurniawan',
	'Eko Prasetyo',
	'Fajar Hidayat',
	'Gunawan Saputra',
	'Hadi Nugroho',
	'Irfan Maulana',
	'Joko Susanto',
	'Khairul Anwar',
	'Lutfi Rahman',
	'Muhammad Iqbal',
	'Nurcholis Majid',
	'Omar Faruq',
	'Parman Wijaya',
	'Qomarudin Aziz',
	'Rizal Hamid',
	'Syaiful Bahri',
	'Taufiq Ismail'
];

const SANTRI_NAMES = [
	'Abdullah Wahab',
	'Bilal Hakim',
	'Choirul Anam',
	'Daffa Rabbani',
	'Fahri Fauzan',
	'Ghifari Aziz',
	'Harun Rasyid',
	'Ilham Mustofa',
	'Jamaludin Malik',
	'Kafabih Ramdhan',
	'Luqman Hakim',
	'Miftahul Huda',
	'Nadhif Zaki',
	'Oman Fathoni',
	'Panji Wirawan',
	'Qusyairi Najib',
	'Raihan Anwar',
	'Sholeh Abadi',
	'Tsaqif Rabbani',
	'Ubaid Mubarok',
	'Valdi Kurniawan',
	'Wahyu Hidayat',
	'Yanuar Putra',
	'Yusuf Anshori',
	'Zaki Mubarak',
	'Abdul Aziz',
	'Bagas Prasetyo',
	'Dzikri Fuadi',
	'Faris Halim',
	'Gibran Sholeh',
	'Hamdan Kurnia',
	'Ihsan Nurani',
	'Jauhar Ridwan',
	'Khoirul Umam',
	'Latif Hasan',
	'Muzakki Farid',
	'Najib Kholil',
	'Okta Ramadhan',
	'Pandu Wiratama',
	'Qodir Rahman',
	'Rasyid Habibi',
	'Sulthan Yazid',
	'Tamam Fudholi',
	'Ulum Shidqi',
	'Varrel Akhyar',
	'Wafiq Sulaiman',
	'Yafi Muammar',
	'Ziyan Fadhil',
	'Afif Rohman',
	'Basyir Ghazali'
];

const BIRTH_CITIES = ['Surabaya', 'Malang', 'Yogyakarta', 'Solo', 'Semarang', 'Jombang', 'Kediri'];

const JURNAL_TOPICS = [
	'Pengenalan Bab Kalam dan Pembagiannya',
	'Mubtada dan Khobar: Definisi dan Syarat',
	'Isim Nakiroh dan Marifah beserta Tanda-tandanya',
	"Fi'il Madhi dan Fi'il Mudhori'",
	'Wazn Tsulatsi Mujarrod Bab Pertama dan Kedua',
	'Pembahasan Sifat Musyabbahah bil Ismi',
	'Pengertian Tashbih dan Istiaro dalam Balagho',
	'Wajibat dan Rukun-rukun Sholat',
	'Syarat Sah dan Syarat Wajib Sholat',
	'Bab Thoharoh: Najis dan Cara Mensucikannya',
	'Adab dan Akhlak kepada Guru',
	'Pentingnya Niat dalam Mencari Ilmu',
	"Hadits Arbain: Hadits Niat (Innama al-A'mal)",
	'Hadits Jibril: Rukun Islam, Iman, dan Ihsan',
	'Mukaddimah Ilmu Tafsir dan Metodologinya',
	'Hukum Bacaan Mad dan Jenisnya',
	'Bab Faroidh: Ketentuan Waris dalam Islam',
	"Aqidah Ahlussunnah wal Jama'ah"
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
	console.log('🌱 Starting seed...\n');

	const PASSWORD_HASH = await hash('password123', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	// ══════════════════════════════════════════════════════════════════
	// 1. TAHUN AJARAN
	// ══════════════════════════════════════════════════════════════════
	const tahunAjaranId = generateId();
	await db.insert(schema.tahun_ajaran).values([
		{
			id: tahunAjaranId,
			tahunMulai: 2024,
			tahunSelesai: 2025,
			tipeSemester: 'ganjil',
			isActive: true
		}
	]);
	console.log('✅  tahun_ajaran        — 1 record');

	// ══════════════════════════════════════════════════════════════════
	// 2. KAMAR
	// ══════════════════════════════════════════════════════════════════
	await db.insert(schema.kamar).values([
		{ id: generateId(), namaKamar: 'Kamar Al-Fatih' },
		{ id: generateId(), namaKamar: 'Kamar Al-Ikhlas' },
		{ id: generateId(), namaKamar: 'Kamar Al-Baqarah' },
		{ id: generateId(), namaKamar: 'Kamar An-Nisa' },
		{ id: generateId(), namaKamar: 'Kamar Al-Imran' }
	]);
	console.log('✅  kamar               — 5 records');

	// ══════════════════════════════════════════════════════════════════
	// 3. USERS (1 admin + 20 guru + 50 santri = 71)
	// ══════════════════════════════════════════════════════════════════

	const guruUsers = GURU_NAMES.map((name, i) => ({
		id: generateId(),
		name,
		email: `guru${pad(i + 1)}@pesantren.id`,
		emailVerified: true,
		role: 'guru',
		createdAt: new Date(),
		updatedAt: new Date()
	}));

	const santriUsers = SANTRI_NAMES.map((name, i) => ({
		id: generateId(),
		name,
		email: `santri${pad(i + 1)}@pesantren.id`,
		emailVerified: true,
		role: 'santri',
		createdAt: new Date(),
		updatedAt: new Date()
	}));

	await db.insert(schema.user).values([...guruUsers, ...santriUsers]);
	console.log('✅  user                — 71 records (1 admin, 20 guru, 50 santri)');

	// ══════════════════════════════════════════════════════════════════
	// 4. ACCOUNTS (one credential account per user)
	// ══════════════════════════════════════════════════════════════════
	const allUsers = [...guruUsers, ...santriUsers];
	const accountData = allUsers.map((u, i) => ({
		id: generateId(),
		accountId: u.id,
		providerId: 'credential',
		userId: u.id,
		password: PASSWORD_HASH,
		createdAt: new Date(),
		updatedAt: new Date()
	}));

	await db.insert(schema.account).values(accountData);
	console.log('✅  account             — 71 records');

	// ══════════════════════════════════════════════════════════════════
	// 5. GURU PROFILES
	// ══════════════════════════════════════════════════════════════════
	const guruProfiles = guruUsers.map((u, i) => ({
		id: generateId(),
		nomorIndukGuru: `NIG${pad(i + 1, 4)}`,
		nomorTelepon: `0812${pad(10000000 + i * 111, 8)}`,
		userId: u.id
	}));

	await db.insert(schema.guru).values(guruProfiles);
	console.log('✅  guru                — 20 records');

	// ══════════════════════════════════════════════════════════════════
	// 6. SANTRI PROFILES
	// ══════════════════════════════════════════════════════════════════
	const santriProfiles = santriUsers.map((u, i) => ({
		id: generateId(),
		nomorIndukSantri: `NIS${pad(i + 1, 4)}`,
		nomorTelepon: `0813${pad(10000000 + i * 137, 8)}`,
		tempatLahir: BIRTH_CITIES[i % BIRTH_CITIES.length],
		tanggalLahir: `${2000 + (i % 6)}-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
		userId: u.id
	}));

	await db.insert(schema.santri).values(santriProfiles);
	console.log('✅  santri              — 50 records');

	// ══════════════════════════════════════════════════════════════════
	// 7. PENDAFTARAN SANTRI (all 50 santri enrolled in ta01)
	// ══════════════════════════════════════════════════════════════════
	const pendaftaranData = santriProfiles.map((s, i) => ({
		id: generateId(),
		santriId: s.id,
		tahunAjaranId: tahunAjaranId,

		status: 'aktif' as const,
		tanggalMasuk: '2024-07-15'
	}));

	await db.insert(schema.pendaftaran_santri).values(pendaftaranData);
	console.log('✅  pendaftaran_santri  — 50 records');

	// ══════════════════════════════════════════════════════════════════
	// 8. PENUGASAN GURU (all 20 guru assigned to ta01)
	// ══════════════════════════════════════════════════════════════════
	const jabatanMap: Record<number, string> = {
		0: 'Kepala Madrasah',
		1: 'Wakil Kepala Madrasah',
		2: 'Wali Kelas Diniyah Ula 1',
		3: 'Wali Kelas Diniyah Ula 2',
		4: 'Wali Kelas Quran Dasar'
	};
	const penugasanData = guruProfiles.map((g, i) => ({
		id: generateId(),
		guruId: g.id,
		tahunAjaranId: tahunAjaranId,
		status: 'aktif' as const,
		jabatan: jabatanMap[i] ?? 'Guru Pengajar'
	}));

	await db.insert(schema.penugasan_guru).values(penugasanData);
	console.log('✅  penugasan_guru      — 20 records');

	// ══════════════════════════════════════════════════════════════════
	// 9. KELAS (2 diniyah + 3 quran)
	// ══════════════════════════════════════════════════════════════════
	const kelasDiniyah1 = generateId();
	const kelasDiniyah2 = generateId();
	await db.insert(schema.kelas).values([
		{
			id: kelasDiniyah1,
			namaKelas: 'Dirosah',
			tahunAjaranId: tahunAjaranId,

			tipeKelas: 'diniyah'
		},
		{
			id: kelasDiniyah2,
			namaKelas: 'Buhuts',
			tahunAjaranId: tahunAjaranId,

			tipeKelas: 'diniyah'
		},
		{
			id: generateId(),
			namaKelas: 'Quran Dasar',
			tahunAjaranId: tahunAjaranId,

			tipeKelas: 'quran'
		},
		{
			id: generateId(),
			namaKelas: 'Quran Menengah',
			tahunAjaranId: tahunAjaranId,

			tipeKelas: 'quran'
		},
		{
			id: generateId(),
			namaKelas: 'Quran Lanjutan',
			tahunAjaranId: tahunAjaranId,

			tipeKelas: 'quran'
		}
	]);
	console.log('✅  kelas               — 5 records (2 diniyah, 3 quran)');

	// ══════════════════════════════════════════════════════════════════
	// 10. KELAS SANTRI
	//     snt01–snt25 → kls01 (Diniyah Ula 1)
	//     snt26–snt50 → kls02 (Diniyah Ula 2)
	// ══════════════════════════════════════════════════════════════════
	const kelasSantriData = santriProfiles.map((s, i) => ({
		id: generateId(),
		santriId: s.id,
		kelasId: i < 25 ? kelasDiniyah1 : kelasDiniyah2
	}));

	await db.insert(schema.kelas_santri).values(kelasSantriData);
	console.log('✅  kelas_santri        — 50 records (25 per kelas diniyah)');

	// ══════════════════════════════════════════════════════════════════
	// 11. KITAB (18 records)
	// ══════════════════════════════════════════════════════════════════
	const idKitab = {
		a: generateId(),
		b: generateId(),
		c: generateId(),
		d: generateId(),
		e: generateId(),
		f: generateId(),
		g: generateId(),
		h: generateId(),
		i: generateId(),
		j: generateId(),
		k: generateId(),
		l: generateId(),
		m: generateId(),
		n: generateId(),
		o: generateId(),
		p: generateId(),
		q: generateId(),
		r: generateId()
	};
	await db.insert(schema.kitab).values([
		{ id: idKitab.a, namaKitab: 'Jurumiyah', pengarang: 'Ibnu Ajurrum', kategori: 'Nahwu' },
		{ id: idKitab.b, namaKitab: 'Imrithi', pengarang: 'Syarafuddin al-Imrithi', kategori: 'Nahwu' },
		{ id: idKitab.c, namaKitab: 'Alfiyah Ibnu Malik', pengarang: 'Ibnu Malik', kategori: 'Nahwu' },
		{ id: idKitab.d, namaKitab: 'Matan Bina wa Asas', pengarang: 'Ibnu Aqil', kategori: 'Shorof' },
		{
			id: idKitab.e,
			namaKitab: 'Amtsilah Tashrifiyah',
			pengarang: "KH. Ma'shum Ali",
			kategori: 'Shorof'
		},
		{
			id: idKitab.f,
			namaKitab: 'Aqidatul Awam',
			pengarang: 'Sayyid Ahmad Marzuqi',
			kategori: 'Tauhid'
		},
		{
			id: idKitab.g,
			namaKitab: 'Sanusiyah (Ummul Barahin)',
			pengarang: 'Muhammad al-Sanusi',
			kategori: 'Tauhid'
		},
		{
			id: idKitab.h,
			namaKitab: 'Tijan al-Darari',
			pengarang: 'Nawawi al-Bantani',
			kategori: 'Tauhid'
		},
		{
			id: idKitab.i,
			namaKitab: 'Safinah al-Najah',
			pengarang: 'Salim bin Sumair al-Hadrami',
			kategori: 'Fiqh'
		},
		{
			id: idKitab.j,
			namaKitab: "Matan Abu Syuja' (Taqrib)",
			pengarang: "Abu Syuja' al-Ashfahani",
			kategori: 'Fiqh'
		},
		{
			id: idKitab.k,
			namaKitab: 'Fathul Qorib',
			pengarang: 'Ibnu Qosim al-Ghazi',
			kategori: 'Fiqh'
		},
		{
			id: idKitab.l,
			namaKitab: 'Bidayatul Hidayah',
			pengarang: 'Imam al-Ghazali',
			kategori: 'Akhlak'
		},
		{
			id: idKitab.m,
			namaKitab: "Ta'limul Muta'allim",
			pengarang: 'Az-Zarnuji',
			kategori: 'Akhlak'
		},
		{
			id: idKitab.n,
			namaKitab: "Washaya al-Aba'",
			pengarang: 'Muhammad Syakir',
			kategori: 'Akhlak'
		},
		{
			id: idKitab.o,
			namaKitab: 'Bulugh al-Maram',
			pengarang: 'Ibnu Hajar al-Asqalani',
			kategori: 'Hadits'
		},
		{
			id: idKitab.p,
			namaKitab: 'Riyadhus Shalihin',
			pengarang: 'Imam al-Nawawi',
			kategori: 'Hadits'
		},
		{
			id: idKitab.q,
			namaKitab: 'Tafsir Jalalain',
			pengarang: 'Jalaluddin al-Mahalli & al-Suyuthi',
			kategori: 'Tafsir'
		},
		{
			id: idKitab.r,
			namaKitab: 'Al-Itqan fi Ulumil Quran',
			pengarang: 'Jalaluddin al-Suyuthi',
			kategori: 'Ulumul Quran'
		}
	]);
	console.log('✅  kitab               — 18 records');

	// ══════════════════════════════════════════════════════════════════
	// 12. JADWAL
	//
	//  Unique constraints in schema-v4:
	//    • unique(kelasId, hari, jamMulai)   — no double-booking a class slot
	//    • unique(guruId,  hari, jamMulai)   — no double-booking a guru slot
	//
	//  Strategy:
	//    kls01 → gru03..gru11  (07:xx slots)
	//    kls02 → gru12..gru20  (09:xx slots)
	//  Since the time slots differ between kls01 and kls02, no guru conflicts.
	// ══════════════════════════════════════════════════════════════════
	type JadwalRow = {
		id: string;
		kelasId: string;
		kitabId: string;
		guruId: string;
		hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
		jamMulai: string;
		jamSelesai: string;
		berlakuMulai: string;
	};

	const guruId = guruProfiles.map((guru) => {
		return guru.id;
	});
	const jadwalKls01: JadwalRow[] = [
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.a,
			guruId: guruId[2],
			hari: 'Senin',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.b,
			guruId: guruId[3],
			hari: 'Senin',
			jamMulai: '08:00',
			jamSelesai: '09:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.c,
			guruId: guruId[4],
			hari: 'Selasa',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.d,
			guruId: guruId[5],
			hari: 'Selasa',
			jamMulai: '08:00',
			jamSelesai: '09:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.e,
			guruId: guruId[6],
			hari: 'Rabu',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.f,
			guruId: guruId[7],
			hari: 'Kamis',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.g,
			guruId: guruId[8],
			hari: 'Kamis',
			jamMulai: '08:00',
			jamSelesai: '09:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.h,
			guruId: guruId[9],
			hari: 'Jumat',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah1,
			kitabId: idKitab.i,
			guruId: guruId[10],
			hari: 'Sabtu',
			jamMulai: '07:00',
			jamSelesai: '08:00',
			berlakuMulai: '2024-07-15'
		}
	];

	const jadwalKls02: JadwalRow[] = [
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.j,
			guruId: guruId[11],
			hari: 'Senin',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.k,
			guruId: guruId[12],
			hari: 'Senin',
			jamMulai: '10:00',
			jamSelesai: '11:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.l,
			guruId: guruId[13],
			hari: 'Selasa',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.m,
			guruId: guruId[14],
			hari: 'Selasa',
			jamMulai: '10:00',
			jamSelesai: '11:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.n,
			guruId: guruId[15],
			hari: 'Rabu',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.o,
			guruId: guruId[16],
			hari: 'Kamis',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.p,
			guruId: guruId[17],
			hari: 'Kamis',
			jamMulai: '10:00',
			jamSelesai: '11:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.q,
			guruId: guruId[18],
			hari: 'Jumat',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		},
		{
			id: generateId(),
			kelasId: kelasDiniyah2,
			kitabId: idKitab.r,
			guruId: guruId[19],
			hari: 'Sabtu',
			jamMulai: '09:00',
			jamSelesai: '10:00',
			berlakuMulai: '2024-07-15'
		}
	];

	await db.insert(schema.jadwal).values([...jadwalKls01, ...jadwalKls02]);
	console.log('✅  jadwal              — 18 records (9 per kelas diniyah)');

	// ══════════════════════════════════════════════════════════════════
	// 13. PERTEMUAN
	//
	//  Target: 30 per diniyah kelas = 60 total
	//  Distribution across 9 jadwal:
	//    jadwal index 0–2 → 4 pertemuan each = 12
	//    jadwal index 3–8 → 3 pertemuan each = 18
	//    total = 30 ✓
	//
	//  Dates are real weekly occurrences of each jadwal's hari,
	//  starting from 2024-09-02 (first school week).
	// ══════════════════════════════════════════════════════════════════
	const START_DATE = new Date('2024-09-02');

	const pertemuanData: {
		id: string;
		jadwalId: string;
		tanggalPertemuan: string;
		jurnalMengajar: string;
		status: 'selesai';
	}[] = [];

	let ptmIdx = 1;

	function buildPertemuan(jadwalList: JadwalRow[]) {
		jadwalList.forEach((jdw, pos) => {
			const count = pos < 3 ? 4 : 3;
			const dates = weeklyDates(jdw.hari, START_DATE, count);
			dates.forEach((date) => {
				pertemuanData.push({
					id: generateId(),
					jadwalId: jdw.id,
					tanggalPertemuan: date,
					jurnalMengajar: JURNAL_TOPICS[(ptmIdx - 1) % JURNAL_TOPICS.length],
					status: 'selesai'
				});
				ptmIdx++;
			});
		});
	}

	buildPertemuan(jadwalKls01); // ptm001–ptm030
	buildPertemuan(jadwalKls02); // ptm031–ptm060

	await db.insert(schema.pertemuan).values(pertemuanData);
	console.log(`✅  pertemuan           — ${pertemuanData.length} records (30 per kelas diniyah)`);

	// ══════════════════════════════════════════════════════════════════
	// 14. ABSENSI SANTRI  (1500 records)
	//
	//  kls01: ptm001–ptm030, santri snt01–snt25 → 750 records
	//  kls02: ptm031–ptm060, santri snt26–snt50 → 750 records
	//  Total = 1500 ✓
	//
	//  Status distribution (seeded deterministic):
	//    hadir  ~80%  |  alfa ~8%  |  izin ~7%  |  sakit ~5%
	// ══════════════════════════════════════════════════════════════════
	const kls01Pertemuan = pertemuanData.slice(0, 30);
	const kls02Pertemuan = pertemuanData.slice(30);

	const kls01Santri = santriProfiles.slice(0, 25).map((s) => s.id);
	const kls02Santri = santriProfiles.slice(25).map((s) => s.id);

	const absensiSantriRows: {
		id: string;
		pertemuanId: string;
		santriId: string;
		status_kehadiran: 'hadir' | 'alfa' | 'izin' | 'sakit';
	}[] = [];

	let absIdx = 1;

	function buildAbsensiSantri(pertemuanList: typeof kls01Pertemuan, santriIds: string[]) {
		for (const ptm of pertemuanList) {
			for (const santriId of santriIds) {
				absensiSantriRows.push({
					id: generateId(),
					pertemuanId: ptm.id,
					santriId,
					status_kehadiran: weightedStatus()
				});
				absIdx++;
			}
		}
	}

	buildAbsensiSantri(kls01Pertemuan, kls01Santri);
	buildAbsensiSantri(kls02Pertemuan, kls02Santri);

	// Batch insert in chunks of 500 to avoid hitting query size limits
	for (const batch of chunks(absensiSantriRows, 500)) {
		await db.insert(schema.absensi_santri).values(batch);
	}
	console.log(`✅  absensi_santri      — ${absensiSantriRows.length} records`);

	// ══════════════════════════════════════════════════════════════════
	// 15. ABSENSI GURU (60 records — one per pertemuan)
	//
	//  Maps each pertemuan → its jadwal → the assigned guru.
	//  ~10% chance of 'tidak hadir' to simulate some absences.
	// ══════════════════════════════════════════════════════════════════
	const jadwalGuruMap: Record<string, string> = {};
	for (const j of [...jadwalKls01, ...jadwalKls02]) {
		jadwalGuruMap[j.id] = j.guruId;
	}

	const absensiGuruRows = pertemuanData.map((ptm, i) => ({
		id: generateId(),
		pertemuanId: ptm.id,
		guruId: jadwalGuruMap[ptm.jadwalId],
		status_kehadiran: (rng() > 0.1 ? 'hadir' : 'tidak hadir') as 'hadir' | 'tidak hadir'
	}));

	await db.insert(schema.absensi_guru).values(absensiGuruRows);
	console.log(`✅  absensi_guru        — ${absensiGuruRows.length} records`);

	// ══════════════════════════════════════════════════════════════════
	// SUMMARY
	// ══════════════════════════════════════════════════════════════════
	console.log(`
╔═══════════════════════════════════════════╗
║            SEED COMPLETE ✨               ║
╠═══════════════════════════════════════════╣
║  tahun_ajaran        1                    ║
║  kamar               5                    ║
║  user               70  (20+50)           ║
║  account            71                    ║
║  guru               20                    ║
║  santri             50                    ║
║  pendaftaran_santri 50                    ║
║  penugasan_guru     20                    ║
║  kelas               5  (2 din + 3 qur)  ║
║  kelas_santri       50  (25 per diniyah)  ║
║  kitab              18                    ║
║  jadwal             18  (9 per diniyah)   ║
║  pertemuan          60  (30 per diniyah)  ║
║  absensi_santri   1500  (750 per kelas)   ║
║  absensi_guru       60  (1 per pertemuan) ║
╚═══════════════════════════════════════════╝
`);

	await pool.end();
}

// ─── Run ─────────────────────────────────────────────────────────────────────
seed().catch(async (err) => {
	console.error('❌ Seed failed:', err);
	await pool.end();
	process.exit(1);
});
