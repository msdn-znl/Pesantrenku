import * as z from 'zod/v4';

export const KelasSantriFormSchema = z.object({
	idSantri: z.array(z.string()),
	idKelas: z.string().optional()
});

export const DeleteKelasSantriFormScheme = z.object({
	idSantri: z.array(z.string())
});

export type KelasSantriForm = z.infer<typeof KelasSantriFormSchema>;
