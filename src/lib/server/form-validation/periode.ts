import * as z from 'zod/v4';

export const PeriodeSchema = z
	.object({
		tahunMulai: z.string().transform((value) => {
			return parseInt(value);
		}),
		tahunSelesai: z.string().transform((value) => {
			return parseInt(value);
		}),
		tipeSemester: z.enum(['ganjil', 'genap'])
	})
	.refine((data) => data.tahunSelesai > data.tahunMulai);
