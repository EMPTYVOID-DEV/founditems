import { sendVerificationEmail } from '@server/utils/email';
import { db } from '@server/db';
import { userTable } from '@server/db/schema';
import { createSessionWrapper } from '@server/utils/auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	send: async ({ params, cookies }) => {
		const email = params.email!;
		const otp = customAlphabet('0123456789')(6);
		await sendVerificationEmail(email, otp);
		cookies.set('otp', otp, {
			path: '/auth/verify',
			httpOnly: true,
			maxAge: 60 * 10,
			secure: env.NODE_ENV == 'prod'
		});
	},
	verify: async ({ cookies, request, params }) => {
		const email = params.email!;
		const fd = await request.formData();
		const enteredOtp = fd.get('otp');
		const validOtp = cookies.get('otp');
		if (!validOtp) return fail(400, { message: 'The code has expired, try resend.' });
		// you can clear the cookie here
		if (enteredOtp != validOtp) return fail(403, { message: 'The entered code is not valid' });
		const userInfo = (
			await db
				.update(userTable)
				.set({ verified: true })
				.where(eq(userTable.email, email))
				.returning({ id: userTable.id })
		)[0];
		await createSessionWrapper(cookies, userInfo.id);
		redirect(303, '/dashboard');
	}
};
