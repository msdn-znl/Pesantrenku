import * as z from 'zod/v4';

export const KelasFormSchema = z.object({
	namaKelas: z.string().max(50),
	tahunAjaran: z.coerce.number()
});

export type KelasForm = z.infer<typeof KelasFormSchema>;
