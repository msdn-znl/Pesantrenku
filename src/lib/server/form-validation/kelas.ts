import * as z from 'zod/v4';

export const KelasFormSchema = z.object({
	namaKelas: z.string().max(50),
	tahunAjaran: z.coerce.number()
});
export const EditKelasFormSchema = z.object({
	id: z.coerce.number(),
	namaKelas: z.string().max(50),
	tahunAjaran: z.coerce.number()
});
export type KelasForm = z.infer<typeof KelasFormSchema>;
