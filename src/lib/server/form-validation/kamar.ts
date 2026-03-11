import * as z from 'zod/v4';

export const KamarFormSchema = z.object({
	namaKamar: z.string().transform((value) => {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	})
});
export const EditKamarFormSchema = z.object({
	id: z.string(),
	namaKamar: z.string().max(50)
});
export type KamarForm = z.infer<typeof KamarFormSchema>;
