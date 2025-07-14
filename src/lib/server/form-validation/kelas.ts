import * as z from 'zod/v4';

export const KelasFormSchema = z.object({
	namaKelas: z.string().max(50),
	tahunAjaran: z.string().max(20)
});

export type KelasForm = z.infer<typeof KelasFormSchema>;
