import * as z from 'zod/v4';

export const PertemuanFormSchema = z.object({
	jadwalId: z.coerce.number(),
	jurnalMengajar: z.string().optional(),
	tanggalPertemuan: z.string(),
	status: z.enum(['selesai', 'batal', 'tugas mandiri'])
});

export const SinglePertemuanFormSchema = z.object({
	jurnalMengajar: z.string().optional(),
	status: z.enum(['selesai', 'batal', 'tugas mandiri'])
});

export const EditPertemuanFormSchema = z.object({
	id: z.coerce.number(),
	jadwalId: z.coerce.number(),
	jurnalMengajar: z.string().optional(),
	tanggalPertemuan: z.string(),
	status: z.enum(['selesai', 'batal', 'tugas mandiri'])
});
