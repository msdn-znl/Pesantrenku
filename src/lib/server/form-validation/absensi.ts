import * as z from 'zod/v4';

export const AbsensiSantriSchema = z.object({
	pertemuanId: z.string(),
	santriId: z.string(),
	status_kehadiran: z.enum(['hadir', 'alfa', 'izin', 'sakit'])
});

export const AbsensiSantriFormSchema = z.array(AbsensiSantriSchema);

export const EditAbsensiSantriSchema = z.object({
	id: z.string(),
	status_kehadiran: z.enum(['hadir', 'alfa', 'izin', 'sakit'])
});

export const EditAbsensiSantriFormSchema = z.array(EditAbsensiSantriSchema);
