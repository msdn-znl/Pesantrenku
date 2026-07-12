import * as z from 'zod/v4';

export const PenetapanGuruFormSchema = z.object({
	guruIds: z.array(z.string()),
	tahunAjaranId: z.string(),
	jabatan: z.string().optional(),
	actionType: z.enum(['aktif', 'inaktif'])
});
