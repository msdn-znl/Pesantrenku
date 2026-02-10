import * as z from 'zod/v4';

export const KamarFormSchema = z.object({
	namaKamar: z.string()
});
export const EditKamarFormSchema = z.object({
	id: z.string(),
	namaKamar: z.string().max(50)
});
export type KamarForm = z.infer<typeof KamarFormSchema>;
