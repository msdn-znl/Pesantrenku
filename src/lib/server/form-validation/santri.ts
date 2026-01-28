import * as z from 'zod/v4';

export const SantriFormSchema = z.object({
	nomorIndukSantri: z.string().optional(),
	tahunMasuk: z.coerce.number().optional(),
	tahunKeluar: z.coerce.number().optional(),
	nomorTelepon: z.string().optional(),
	status: z.enum(['aktif', 'lulus', 'keluar']).optional(),
	tempatLahir: z.string().optional(),
	tanggalLahir: z.string().optional(),
	kamar: z.string().optional()
});

export type SantriForm = z.infer<typeof SantriFormSchema>;
