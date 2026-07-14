import * as z from 'zod/v4';

export const KelasSantriFormSchema = z.object({
	idSantri: z
		.union([z.string(), z.array(z.string())])
		.transform((val) => (Array.isArray(val) ? val : [val])),
	idKelas: z.string().optional()
});

export const DeleteKelasSantriFormScheme = z.object({
	kelasSantriId: z
		.union([z.string(), z.array(z.string())])
		.transform((val) => (Array.isArray(val) ? val : [val]))
});

export type KelasSantriForm = z.infer<typeof KelasSantriFormSchema>;
