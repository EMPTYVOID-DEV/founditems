import { db } from '@server/db';
import { userTable } from '@server/db/schema';
import { deleteSessionTokenCookie, invalidateSession } from '@server/utils/auth';
import { FileUploadFactory } from '@server/utils/fileUpload';
import { LL } from '@shared/i18n/i18n';
import {
	getValidator,
	getFullnameSchema,
	getAddressSchema,
	getAvatarSchema,
	getPhoneNumberSchema
} from '@shared/zod';

import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	fullname: async ({ request, locals }) => {
		const id = locals.user!.id;
		const fd = await request.formData();
		const fullname = fd.get('fullname')!.toString();
		const fullnameValidated = getValidator(getFullnameSchema())(fullname);

		if (fullnameValidated.status == 'invalid')
			return fail(400, { message: fullnameValidated.errorMsg });

		await db.update(userTable).set({ fullname }).where(eq(userTable.id, id));
	},
	address: async ({ request, locals }) => {
		const id = locals.user!.id;
		const fd = await request.formData();
		const address = fd.get('address')!.toString();
		const addressValidated = getValidator(getAddressSchema())(address);

		if (addressValidated.status == 'invalid')
			return fail(400, { message: addressValidated.errorMsg });

		await db.update(userTable).set({ address }).where(eq(userTable.id, id));
	},
	phone: async ({ request, locals }) => {
		const id = locals.user!.id;
		const fd = await request.formData();
		const phoneNumber = fd.get('phoneNumber')!.toString();
		const phoneNumberValidated = getValidator(getPhoneNumberSchema())(phoneNumber);

		if (phoneNumberValidated.status == 'invalid')
			return fail(400, { message: phoneNumberValidated.errorMsg });

		await db.update(userTable).set({ phoneNumber }).where(eq(userTable.id, id));
	},
	avatar: async ({ request, locals }) => {
		const { id } = locals.user!;
		const fd = await request.formData();
		const avatar = fd.get('avatar')?.valueOf() as Blob;
		const avatarValidated = getValidator(getAvatarSchema())(avatar);

		if (avatarValidated.status == 'invalid')
			return fail(400, { message: avatarValidated.errorMsg });

		const fileUpload = FileUploadFactory.create();
		const upload = await fileUpload.uploadFile(avatar);
		if (upload._tag == 'Left') {
			console.error(upload.left);
			return fail(500, { message: LL.errors.unableToUploadFile() });
		}
		await db.update(userTable).set({ avatar: upload.right }).where(eq(userTable.id, id));
	},
	logout: async ({ locals, cookies }) => {
		const { session } = locals;
		await invalidateSession(session!.id);
		deleteSessionTokenCookie(cookies);
	}
};
