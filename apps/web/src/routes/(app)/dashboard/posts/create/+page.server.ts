import { LL, usedLocale } from '@assets/i18n/i18n';
import { uploadProofs } from '@server/utils/fileUpload';
import { postsPage } from '@shared/const';
import { getImageSchema, getValidator } from '@shared/zod';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db, foundItemTable, lostItemTable } from 'db';
import { itemAddressSchema, itemMetaDataSchema, type ItemAddress, type ItemMetaData } from 'utils';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const id = locals.user!.id;
		const fd = await request.formData();
		const address: ItemAddress = JSON.parse(fd.get('address')!.toString());
		const date = fd.get('date')!.toString();
		const castedDate = new Date(date);
		const type = fd.get('type')!.toString();
		const category = fd.getAll('category') as string[];
		const metadata = JSON.parse(fd.get('metaData')!.toString()) as ItemMetaData;
		let description = '';
		let images: string[] = [];

		if (castedDate.toString() == 'Invalid Date')
			return fail(400, { message: LL.validation.itemDate() });

		const addressValidated = getValidator(itemAddressSchema)(address);
		if (addressValidated.status == 'invalid')
			return fail(400, { message: LL.validation.invalidItemAddress() });

		if (category.length < 2) return fail(400, { message: LL.validation.itemCategory() });

		const metaDataValidated = getValidator(itemMetaDataSchema)(metadata);
		if (metaDataValidated.status === 'invalid')
			return fail(400, { message: metaDataValidated.errorMsg });

		if (type === 'lost') {
			description = fd.get('description')!.toString();
			const files = fd.getAll('files') as File[];
			const imageValidator = getValidator(getImageSchema());
			for (const file of files) {
				const fileValidated = imageValidator(file);
				if (fileValidated.status === 'invalid')
					return fail(400, { message: fileValidated.errorMsg });
			}
			const upload = await uploadProofs(files);
			if (upload._tag == 'Left') {
				console.error(upload.left);
				return fail(500, { message: LL.errors.unableToUploadFile() });
			}
			images = upload.right;
		}

		const itemData = {
			address,
			category,
			lang: usedLocale,
			metadata,
			userId: id
		};

		if (type === 'lost')
			await db.insert(lostItemTable).values({
				description,
				images,
				lostDate: castedDate,
				...itemData
			});
		else await db.insert(foundItemTable).values({ ...itemData, foundDate: castedDate });

		redirect(302, postsPage);
	}
};
