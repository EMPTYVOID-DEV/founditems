import { postsPage } from '@shared/const';
import type { ItemType } from '@shared/types';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { db, eq, foundItemTable, lostItemTable, type FoundItem, type LostItem } from 'db';
import { left, right } from 'fp-ts/lib/Either';

export const load: ServerLoad = async ({ params }) => {
	const id = params.id!;
	const type = params.type as ItemType;
	if (type == 'found') {
		let item = await db.query.foundItemTable.findFirst({
			where: eq(foundItemTable.id, parseInt(id))
		});
		if (!item) redirect(302, postsPage);
		return { item: right(item) };
	} else {
		let item = await db.query.lostItemTable.findFirst({
			where: eq(lostItemTable.id, parseInt(id))
		});
		if (!item) redirect(302, postsPage);
		return { item: left(item) };
	}
};
