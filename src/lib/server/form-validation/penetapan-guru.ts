import * as z from 'zod/v4';

export const PenetapanGuruFormSchema = z.object({
	guruId: z.string(),
	tahunAjaranId: z.string(),
	jabatan: z.string().optional()
});
