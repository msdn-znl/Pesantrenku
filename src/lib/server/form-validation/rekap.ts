import * as z from 'zod/v4';
export const RekapFormSchema = z.object({
	tahunAjaranId: z.string().optional(),
	kelasId: z.string().optional(),
	bulan: z.coerce.number().optional(),
	tahun: z.coerce.number().optional()
});
