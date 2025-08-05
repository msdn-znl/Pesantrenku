import * as z from 'zod/v4';

export const UserFormSchema = z.object({
	username: z.email().nonempty(),
	password: z.string().min(6).max(255),
	nama: z.string(),
	role: z.enum(['admin', 'santri', 'guru'])
});

export const LoginUserFormSchema = z.object({
	username: z.email().nonempty(),
	password: z.string().min(6).max(255)
});

export const EditUserFormSchema = z.object({
	id: z.string(),
	username: z.email().nonempty(),
	nama: z.string(),
	password: z.string().min(6).max(255).or(z.literal('')).optional(),
	role: z.enum(['admin', 'guru', 'santri']).optional()
});
