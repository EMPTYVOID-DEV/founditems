import { LL, usedLocale } from '@assets/i18n/i18n';
import { uploadProofs } from '@server/utils/fileManagement';
import { postsPage } from '@shared/const';
import { getImageSchema, getValidator, itemDateSchema } from '@shared/zod';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db, itemTable } from 'db';
import {
	itemAddressSchema,
	itemMetaDataSchema,
	type ItemAddress,
	type ItemMetaData,
	type ItemType
} from 'utils';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const fd = await request.formData();
		const address: ItemAddress = JSON.parse(fd.get('address')!.toString());
		const isoStringDate = fd.get('date')!.toString();
		const date = new Date(isoStringDate);
		const itemType = fd.get('type')!.toString() as ItemType;
		const category = fd.getAll('category') as string[];
		const metadata = JSON.parse(fd.get('metaData')!.toString()) as ItemMetaData;
		const description = fd.get('description')!.toString();
		const files = fd.getAll('files') as File[];

		const dateValidated = getValidator(itemDateSchema)(date);
		if (dateValidated.status == 'invalid')
			return fail(400, { message: LL.validation.invalidItemDate() });

		const addressValidated = getValidator(itemAddressSchema)(address);
		if (addressValidated.status == 'invalid')
			return fail(400, { message: LL.validation.invalidItemAddress() });

		if (category.length < 2) return fail(400, { message: LL.validation.itemCategory() });

		const metaDataValidated = getValidator(itemMetaDataSchema)(metadata);
		if (metaDataValidated.status === 'invalid')
			return fail(400, { message: metaDataValidated.errorMsg });

		const imageValidator = getValidator(getImageSchema());
		for (const file of files) {
			const fileValidated = imageValidator(file);
			if (fileValidated.status === 'invalid') return fail(400, { message: fileValidated.errorMsg });
		}
		const upload = await uploadProofs(files);
		if (upload._tag == 'Left') {
			console.error(upload.left);
			return fail(500, { message: LL.errors.unableToUploadFile() });
		}
		let images = upload.right;

		await db.insert(itemTable).values({
			address,
			category,
			date,
			images,
			description,
			lang: usedLocale,
			metadata,
			userId,
			isFound: itemType == 'found'
		});

		redirect(302, postsPage);
	}
};
