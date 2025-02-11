import { hash } from '@node-rs/argon2';
import { db, userTable, eq } from 'db';
import { isValidOtp, setupOtp } from 'mail';
import { authPage } from '@shared/const';
import { LL } from '@assets/i18n/i18n';
import { getValidator, getEmailSchema, getPasswordSchema } from '@shared/zod';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	send: async ({ request }) => {
		const fd = await request.formData();
		const email = fd.get('email')!.toString();
		const emailValidated = getValidator(getEmailSchema())(email);
		if (emailValidated.status == 'invalid') return fail(400, { message: emailValidated.errorMsg });
		const user = await db.query.userTable.findFirst({ where: eq(userTable.email, email) });
		if (!user) return fail(403, { message: LL.auth.accountDoesNotExist() });
		await setupOtp(email);
	},
	resend: async ({ request }) => {
		const fd = await request.formData();
		const email = fd.get('email')!.toString();
		const emailValidated = getValidator(getEmailSchema())(email);
		if (emailValidated.status == 'invalid') return fail(400, { message: emailValidated.errorMsg });
		await setupOtp(email);
	},
	verify: async ({ request }) => {
		const fd = await request.formData();
		const enteredOtp = fd.get('otp')?.toString() || '';
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const emailValidated = getValidator(getEmailSchema())(email);
		const passwordValidated = getValidator(getPasswordSchema())(password);

		if (emailValidated.status == 'invalid') return fail(400, { message: emailValidated.errorMsg });

		if (passwordValidated.status == 'invalid')
			return fail(400, { message: passwordValidated.errorMsg });

		const isValid = await isValidOtp(email, enteredOtp);

		if (isValid == 'invalid') return fail(403, { message: LL.auth.incorrectCode() });

		if (isValid == 'expired') return fail(403, { message: LL.auth.expiredCode() });

		const hashedPassword = await hash(password);

		await db.update(userTable).set({ password: hashedPassword }).where(eq(userTable.email, email));
		redirect(303, authPage);
	}
};
