import * as z from 'zod/v4';

export const GuruFormSchema = z.object({
	nama: z.string(),
	nomorIndukGuru: z.string().optional(),
	nomorTelepon: z.string().optional(),
	status: z.enum(['aktif', 'inaktif']).optional()
});

export type GuruForm = z.infer<typeof GuruFormSchema>;
