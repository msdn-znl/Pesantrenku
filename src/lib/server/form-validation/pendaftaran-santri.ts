import * as z from 'zod';

export const pendaftaranSantriFormSchema = z.object({
	santriId: z
		.union([z.string(), z.array(z.string())])
		.transform((val) => (Array.isArray(val) ? val : [val])),
	tahunAjaranId: z.string()
});
