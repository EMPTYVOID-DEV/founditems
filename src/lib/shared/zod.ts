import type { ZodSchema } from 'zod';
import type { Validator } from './types';
import z from 'zod';
import { LL } from '@shared/i18n/i18n';
import { maxAvatarSize } from './const';

export const getFullnameSchema = () => z.string().min(6, { message: LL.validation.fullname(8) });

export const getEmailSchema = () => z.string().email(LL.validation.email());

export const getPasswordSchema = () =>
	z
		.string()
		.min(8, { message: LL.validation.passwordLength(8) })
		.regex(/[a-z]/, { message: LL.validation.passwordLowercase() })
		.regex(/[A-Z]/, { message: LL.validation.passwordUppercase() })
		.regex(/\d/, { message: LL.validation.passwordNumber() })
		.regex(/[!@#$%^&*(),.?"':{}|<>]/, {
			message: LL.validation.passwordSpecialChar()
		});

export const getAddressSchema = () => z.string().min(12, { message: LL.validation.address(12) });

export const getAvatarSchema = () =>
	z
		.instanceof(File, { message: LL.validation.invalidImageUpload() })
		.refine((file) => file.type.startsWith('image'), {
			message: LL.validation.invalidImageUpload()
		})
		.refine((file) => file.size <= maxAvatarSize * Math.pow(1024, 2), {
			message: LL.validation.imageSize(maxAvatarSize)
		});

export function getValidator(schema: ZodSchema): Validator {
	return (data: unknown) => {
		const parseResult = schema.safeParse(data);
		if (parseResult.success == true) return { status: 'valid', errorMsg: '' };
		else return { status: 'invalid', errorMsg: parseResult.error.errors[0].message };
	};
}
