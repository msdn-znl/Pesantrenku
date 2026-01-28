import { customAlphabet } from 'nanoid';
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
export const generateId = customAlphabet(alphabet, 15);

export const getHariIni = () => {
	const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	const d = new Date();
	return days[d.getDay()];
};

export type dayString = 'Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
