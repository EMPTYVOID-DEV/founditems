import { deleteItemProofs } from '@server/utils/fileManagement';
import { postsPage } from '@shared/const';
import { error, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { matchedTable, db, eq, itemTable, or, and } from 'db';

async function validateAccess(postId: string, userId: string) {
	let item = await db.query.itemTable.findFirst({
		where: and(eq(itemTable.id, postId), eq(itemTable.userId, userId))
	});
	if (!item) error(403);
	return item;
}

export const load: ServerLoad = async ({ params, locals }) => {
	const userId = locals.user!.id;
	const postId = params.postId!;
	const item = await validateAccess(postId, userId);
	return { item };
};

export const actions: Actions = {
	release: async ({ params, locals }) => {
		const userId = locals.user!.id;
		const postId = params.postId!;
		await validateAccess(postId, userId);
		await db.transaction(async (tx) => {
			const connection = await tx.query.matchedTable.findFirst({
				where: or(eq(matchedTable.foundItemId, postId), eq(matchedTable.lostItemId, postId))
			});
			if (connection) {
				const otherItemId =
					connection.foundItemId == postId ? connection.lostItemId : connection.foundItemId;
				await tx.update(itemTable).set({ state: 'idle' }).where(eq(itemTable.id, otherItemId));
			}
			await deleteItemProofs(postId);
			await tx.delete(itemTable).where(eq(itemTable.id, postId));
		});
		redirect(303, postsPage);
	}
};
