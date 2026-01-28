import * as z from 'zod/v4';

export const KelasFormSchema = z.object({
	namaKelas: z.string().max(50),
	tahunAjaranId: z.string()
});
export const EditKelasFormSchema = z.object({
	id: z.string(),
	namaKelas: z.string().max(50),
	tahunAjaranId: z.string()
});
export type KelasForm = z.infer<typeof KelasFormSchema>;
