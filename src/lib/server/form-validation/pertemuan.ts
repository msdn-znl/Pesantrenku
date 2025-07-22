import * as z from 'zod/v4';

export const PertemuanFormSchema = z.object({
	jadwalId: z.coerce.number(),
	jurnalMengajar: z.string().optional(),
	tanggalPertemuan: z.coerce.date(),
	status: z.enum(['selesai', 'batal', 'tugas mandiri'])
});
