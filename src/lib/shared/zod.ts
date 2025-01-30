import type { ZodSchema } from 'zod';
import type { Validator } from './types';
import z from 'zod';
import { LL } from '@shared/i18n/i18n';

export const getFullnameSchema = () => z.string().min(6, { message: LL.validation.fullname() });

export const getEmailSchema = () => z.string().email(LL.validation.email());

export const getPasswordSchema = () =>
	z
		.string()
		.min(8, { message: LL.validation.passwordLength() })
		.regex(/[a-z]/, { message: LL.validation.passwordLowercase() })
		.regex(/[A-Z]/, { message: LL.validation.passwordUppercase() })
		.regex(/\d/, { message: LL.validation.passwordNumber() })
		.regex(/[!@#$%^&*(),.?"':{}|<>]/, {
			message: LL.validation.passwordSpecialChar()
		});

export function getValidator(schema: ZodSchema): Validator {
	return (text: string) => {
		const parseResult = schema.safeParse(text);
		if (parseResult.success == true) return { status: 'valid', errorMsg: '' };
		else return { status: 'invalid', errorMsg: parseResult.error.errors[0].message };
	};
}
