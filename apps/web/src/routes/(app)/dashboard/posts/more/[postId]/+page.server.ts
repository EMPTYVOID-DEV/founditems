import { deleteItemProofs } from '@server/utils/fileManagement';
import { postsPage } from '@shared/const';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { matchedItemsTable, db, eq, itemTable, or } from 'db';

/**
 * In hook.server we preventing accessing a post that you don't own or one that does not exist
 */
export const load: ServerLoad = async ({ params }) => {
	const id = params.postId!;
	let item = (await db.query.itemTable.findFirst({
		where: eq(itemTable.id, parseInt(id))
	}))!;
	return { item };
};

export const actions: Actions = {
	release: async ({ params }) => {
		const id = params.postId!;
		const parsedId = parseInt(id);
		await db.transaction(async (tx) => {
			const connection = await tx.query.matchedItemsTable.findFirst({
				where: or(
					eq(matchedItemsTable.foundItemId, parsedId),
					eq(matchedItemsTable.lostItemId, parsedId)
				)
			});
			if (connection) {
				const otherItemId = connection.foundItemId == parsedId ? parsedId : connection.lostItemId;
				await tx.update(itemTable).set({ state: 'idle' }).where(eq(itemTable.id, otherItemId));
			}
			await deleteItemProofs(parsedId);
			await tx.delete(itemTable).where(eq(itemTable.id, parsedId));
		});
		redirect(303, postsPage);
	}
};
