import { db } from '@server/db';
import { userTable } from '@server/db/schema';
import { createSessionWrapper } from '@server/utils/auth';
import { isValidOtp, setupOtp } from '@server/utils/email';
import { profilePage } from '@shared/const';
import { LL } from '@shared/i18n/i18n';
import { getValidator, getEmailSchema } from '@shared/zod';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	resend: async ({ params }) => {
		const email = params.email!;
		const emailValidated = getValidator(getEmailSchema())(email);
		if (emailValidated.status == 'invalid') return fail(400, { message: emailValidated.errorMsg });
		await setupOtp(email);
	},
	verify: async ({ cookies, request, params }) => {
		const fd = await request.formData();
		const email = params.email!;
		const enteredOtp = fd.get('otp')?.toString() || '';
		const emailValidated = getValidator(getEmailSchema())(email);

		if (emailValidated.status == 'invalid') return fail(400, { message: emailValidated.errorMsg });

		const isValid = await isValidOtp(email, enteredOtp);

		if (isValid == 'invalid') return fail(403, { message: LL.auth.incorrectCode() });

		if (isValid == 'expired') return fail(403, { message: LL.auth.expiredCode() });

		const userInfo = (
			await db
				.update(userTable)
				.set({ verified: true })
				.where(eq(userTable.email, email))
				.returning({ id: userTable.id })
		)[0];
		await createSessionWrapper(cookies, userInfo.id);
		redirect(303, profilePage);
	}
};
