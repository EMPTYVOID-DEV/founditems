import { db } from '@server/db';
import { createSessionWrapper } from '@server/utils/auth';
import { getValidator, getEmailSchema, getFullnameSchema, getPasswordSchema } from '@shared/zod';
import { type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import { userTable } from '@server/db/schema';
import { postgresUniqueViolationCode } from '@server/const';
import { authVerifyPage, profilePage } from '@shared/const';
import { setupOtp } from '@server/utils/email';
import type { PostgresError } from 'postgres';
import type { UserInsert } from '@shared/types';
import { LL } from '@shared/i18n/i18n';

export const actions: Actions = {
	signup: async ({ request }) => {
		const fd = await request.formData();
		const fullname = fd.get('fullname')!.toString();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const fullnameValidated = getValidator(getFullnameSchema())(fullname);
		const emailValidated = getValidator(getEmailSchema())(email);
		const passwordValidated = getValidator(getPasswordSchema())(password);

		if (fullnameValidated.status == 'invalid')
			return fail(402, { message: fullnameValidated.errorMsg });
		if (emailValidated.status == 'invalid') return fail(402, { message: emailValidated.errorMsg });
		if (passwordValidated.status == 'invalid')
			return fail(402, { message: passwordValidated.errorMsg });

		const hashedPassword = await hash(password);
		const newUser: UserInsert = {
			fullname,
			password: hashedPassword,
			email
		};
		try {
			await db.insert(userTable).values(newUser);
		} catch (error) {
			if ((error as PostgresError).code === postgresUniqueViolationCode)
				return fail(403, { message: LL.auth.acounntAlreadyExist() });
		}
		await setupOtp(email);
		redirect(303, `${authVerifyPage}/${email}`);
	},
	signin: async ({ cookies, request }) => {
		const fd = await request.formData();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const emailValidated = getValidator(getEmailSchema())(email);
		const passwordValidated = getValidator(getPasswordSchema())(password);

		if (emailValidated.status == 'invalid') return fail(402, { message: emailValidated.errorMsg });

		if (passwordValidated.status == 'invalid')
			return fail(402, { message: passwordValidated.errorMsg });

		const userKey = await db.query.userTable.findFirst({
			where: eq(userTable.email, email)
		});

		if (!userKey) return fail(404, { message: LL.auth.accountDoesNotExist() });

		const isValid = await verify(userKey.password, password);
		if (!isValid) return fail(403, { message: LL.auth.passwordIncorrect() });

		if (userKey.verified) {
			await createSessionWrapper(cookies, userKey.id);
			redirect(303, profilePage);
		}
		await setupOtp(email);
		redirect(303, `${authVerifyPage}/${email}`);
	}
};
