import * as z from 'zod/v4';

export const JadwalFormSchema = z.object({
	kitabId: z.string(),
	kelasId: z.string(),
	guruId: z.string(),
	hari: z.array(z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'])),
	jamMulai: z.string().min(1, 'jam mulai wajib diisi'),
	jamSelesai: z.string().min(1, 'jam selesai wajib diisi')
});
export type JadwalForm = z.infer<typeof JadwalFormSchema>;
