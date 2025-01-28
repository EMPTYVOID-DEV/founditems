import type { ZodSchema } from 'zod';
import z from 'zod';

export type ActionStatus = { state: 'valid' | 'invalid'; errorMsg: string };

export type Validator = (text: string) => ActionStatus;

export const fullnameSchema = z
	.string()
	.min(6, { message: 'Full name must be at least 6 characters long' });

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
	.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
	.regex(/\d/, { message: 'Password must contain at least one number' })
	.regex(/[!@#$%^&*(),.?"':{}|<>]/, {
		message: 'Password must contain at least one special character'
	});

export function getValidator(schema: ZodSchema): Validator {
	return (text: string) => {
		const parseResult = schema.safeParse(text);
		if (parseResult.success == true) return { state: 'valid', errorMsg: '' };
		else return { state: 'invalid', errorMsg: parseResult.error.errors[0].message };
	};
}
