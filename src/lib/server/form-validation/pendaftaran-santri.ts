import * as z from 'zod';

export const pendaftaranSantriFormSchema = z.object({
	santriId: z.array(z.string()),
	tahunAjaranId: z.string()
});
