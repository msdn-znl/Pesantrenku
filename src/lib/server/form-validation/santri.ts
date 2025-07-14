import * as z from 'zod/v4';

export const SantriFormSchema = z.object({
	nomorIndukSantri: z.string().optional(),
	tahunMasuk: z.coerce.number().optional(),
	tahunKeluar: z.coerce.number().optional(),
	nomorTelepon: z.string().optional(),
	status: z.enum(['aktif', 'inaktif']).optional(),
	tempatLahir: z.string().optional(),
	tanggalLahir: z.coerce.date().optional(),
	kamar: z.string().optional()
});

export type SantriForm = z.infer<typeof SantriFormSchema>;
