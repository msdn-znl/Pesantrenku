import { ulid } from 'ulid';
export const generateId = () => {
	const id = ulid();
	return id;
};

import type { Jadwal } from './server/db/schema';

export const getHariIni = () => {
	const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	const d = new Date();
	return days[d.getDay()];
};
export const getTanggalSekarang = () => {
	const d = new Date().toDateString();
	return d;
};

export const getTahunSekarang = () => {
	const d = new Date();
	return d.getFullYear();
};

export type dayString = 'Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export const groupJadwal = (listJadwal: Array<Jadwal>) => {
	const container = new Map();
	listJadwal.forEach((item) => {
		const uniqueKey = JSON.stringify({
			kitab: item.kitabId,
			kelas: item.kelasId,
			guru: item.guruId,
			jamMulai: item.jamMulai,
			jamSelesai: item.jamSelesai
		});
		if (container.has(uniqueKey)) {
			const existingItem = container.get(uniqueKey);
			if (!existingItem.hari.includes(item.hari)) {
				existingItem.hari.push(item.hari);
			}
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, hari, ...rest } = item;
			const newItem = {
				...rest,
				hari: [hari]
			};
			container.set(uniqueKey, newItem);
		}
	});
	return Array.from(container.values());
};

export const generateNIS = (tipe: string, tahun: number, urutan: string) => {
	const prefix = tipe == 'putra' ? '10' : '20';
	const postfix = urutan.padStart(3, '0');
	const finalNIS = prefix + tahun.toString() + postfix;
	return finalNIS;
};
