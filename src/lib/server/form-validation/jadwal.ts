import * as z from 'zod/v4';

export const JadwalFormSchema = z.object({
	kitabId: z.coerce.number(),
	kelasId: z.coerce.number(),
	guruId: z.coerce.number(),
	hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
	jamMulai: z.iso.time().optional(),
	jamSelesai: z.iso.time().optional()
});
export type JadwalForm = z.infer<typeof JadwalFormSchema>;
