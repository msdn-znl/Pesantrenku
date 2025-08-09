import * as z from 'zod/v4';

export const KitabFormSchema = z.object({
	namaKitab: z.string().max(100),
	pengarang: z.string().max(255).optional(),
	kategori: z.string().max(20).optional()
});

export const EditKitabFormSchema = z.object({
	id: z.coerce.number(),
	namaKitab: z.string().max(100),
	pengarang: z.string().max(255).optional(),
	kategori: z.string().max(20).optional()
});

export type KitabForm = z.infer<typeof KitabFormSchema>;
