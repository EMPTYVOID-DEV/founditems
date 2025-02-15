import { LL, usedLocale } from '@assets/i18n/i18n';
import { FileUploadFactory } from '@server/utils/fileUpload';
import { postsPage } from '@shared/const';
import { getAddressSchema, getImageSchema, getItemDateSchema, getValidator } from '@shared/zod';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db, foundItemTable, lostItemTable } from 'db';
import { itemMetaDataSchema, type ItemMetaData } from 'utils';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const id = locals.user!.id;
		const fd = await request.formData();
		const address = fd.get('address')!.toString();
		const date = fd.get('date')!.toString();
		const section = parseInt(fd.get('section')!.toString());
		const type = fd.get('type')!.toString();
		const category = fd.getAll('category') as string[];
		const metaData = JSON.parse(fd.get('metaData')!.toString()) as ItemMetaData;

		const addressValidated = getValidator(getAddressSchema())(address);
		if (addressValidated.status === 'invalid') {
			return fail(400, { message: addressValidated.errorMsg });
		}

		const dateValidated = getValidator(getItemDateSchema())(date);
		if (dateValidated.status === 'invalid') {
			return fail(400, { message: dateValidated.errorMsg });
		}

		if (category.length < 2) {
			return fail(400, { message: LL.validation.itemCategory() });
		}

		const metaDataValidated = getValidator(itemMetaDataSchema)(metaData);
		if (metaDataValidated.status === 'invalid') {
			return fail(400, { message: metaDataValidated.errorMsg });
		}

		let description = '';
		let images: string[] = [];

		if (type === 'lost') {
			description = fd.get('description')!.toString();
			const files = fd.getAll('files') as Blob[];
			const imageValidator = getValidator(getImageSchema());

			for (const file of files) {
				const fileValidated = imageValidator(file);
				if (fileValidated.status === 'invalid') {
					return fail(400, { message: fileValidated.errorMsg });
				}

				const fileUpload = FileUploadFactory.create();
				const upload = await fileUpload.uploadFile(file);
				if (upload._tag === 'Left') {
					console.error(upload.left);
					return fail(500, { message: LL.errors.unableToUploadFile() });
				}
				images.push(upload.right);
			}
		}

		const itemData = {
			address,
			category,
			lang: usedLocale,
			metadata: metaData,
			userId: id
		};

		const itemDate = { date, section };

		if (type === 'lost') {
			await db
				.insert(lostItemTable)
				.values({ ...itemData, description, images, lostDate: itemDate });
		} else if (type === 'found') {
			await db.insert(foundItemTable).values({ ...itemData, foundDate: itemDate });
		}

		redirect(302, postsPage);
	}
};
