import * as z from 'zod/v4';

export const UserAdminFormSchema = z.object({
	role: z.literal('admin'),
	username: z.string().nonempty(),
	password: z.string().min(6).max(255),
	nama: z.string()
});
export const UserSantriFormSchema = z.object({
	role: z.literal('santri'),
	nama: z.string(),
	tipe: z.enum(['putra', 'putri'])
});

export const UserGuruFormSchema = z.object({
	role: z.literal('guru'),
	nama: z.string()
});
export const CreateUserSchema = z.discriminatedUnion('role', [
	UserAdminFormSchema,
	UserSantriFormSchema,
	UserGuruFormSchema
]);

export const LoginUserFormSchema = z.object({
	username: z.string().nonempty(),
	password: z.string().min(3).max(255)
});

export const EditUserFormSchema = z.object({
	id: z.string(),
	username: z.string().nonempty(),
	nama: z.string(),
	password: z.string().min(6).max(255).or(z.literal('')).optional(),
	role: z.enum(['admin', 'guru', 'santri']).optional()
});

export const RegisterFormSchema = z.object({
	username: z.string().nonempty(),
	password: z.string().min(6).max(255),
	nama: z.string()
});

export const DeleteUserSchema = z.object({
	id: z.array(z.string())
});

export type CreateUserForm = z.infer<typeof CreateUserSchema>;
export type RoleUser = CreateUserForm['role'];
