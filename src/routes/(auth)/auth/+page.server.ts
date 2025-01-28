import { db } from '@server/db';
import { createSessionWrapper } from '@server/utils/auth';
import type { UserInsert } from '@shared/types';
import { getValidator, emailSchema, passwordSchema, fullnameSchema } from '@shared/zod';
import { type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import { userTable } from '@server/db/schema';
import { postgresUniqueViolationCode } from '@server/const';
import type { PostgresError } from 'postgres';

export const actions: Actions = {
	signup: async ({ request }) => {
		const fd = await request.formData();
		const fullname = fd.get('fullname')!.toString();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const fullnameValidated = getValidator(fullnameSchema)(fullname);
		const emailValidated = getValidator(emailSchema)(email);
		const passwordValidated = getValidator(passwordSchema)(password);

		if (fullnameValidated.state == 'invalid')
			return fail(403, { message: fullnameValidated.errorMsg });
		if (emailValidated.state == 'invalid') return fail(403, { message: emailValidated.errorMsg });
		if (passwordValidated.state == 'invalid')
			return fail(403, { message: passwordValidated.errorMsg });

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
				return fail(409, { message: 'It seems that this account already exist.' });
		}
		redirect(303, `/auth/verify/${email}`);
	},
	signin: async ({ cookies, request }) => {
		const fd = await request.formData();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const emailValidated = getValidator(emailSchema)(email);
		const passwordValidated = getValidator(passwordSchema)(password);

		if (emailValidated.state == 'invalid') return fail(403, { message: emailValidated.errorMsg });
		if (passwordValidated.state == 'invalid')
			return fail(403, { message: passwordValidated.errorMsg });

		const userKey = await db.query.userTable.findFirst({
			where: eq(userTable.email, email)
		});

		if (!userKey) return fail(404, { message: 'It seems the user does not exist.' });

		const isValid = await verify(userKey.password, password);
		if (!isValid) return fail(403, { message: 'The password is not correct.' });

		if (userKey.verified) {
			await createSessionWrapper(cookies, userKey.id);
			redirect(303, '/dashboard/profile');
		}
		redirect(303, `/auth/verify/${email}`);
	}
};
