import { matchesPage } from '@shared/const';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { db, eq, itemTable, matchedTable, or, userTable, type Item, type User } from 'db';
import type { MatchStates } from 'utils';

type MatchContext = {
	state: MatchStates;
	isFound: boolean;
	lostItem: Item;
	foundItem: Item;
};

async function validateAccess(matchId: string, userId: string): Promise<MatchContext> {
	const joinResult = await db
		.select()
		.from(matchedTable)
		.where(eq(matchedTable.id, matchId))
		.innerJoin(
			itemTable,
			or(eq(matchedTable.foundItemId, itemTable.id), eq(matchedTable.lostItemId, itemTable.id))
		);

	const match = joinResult.find((i) => i.item.userId === userId);

	if (!match) redirect(303, matchesPage);

	const found = joinResult.find((i) => i.item.isFound)!.item;
	const lost = joinResult.find((i) => !i.item.isFound)!.item;

	return {
		state: match.matched_item.state,
		isFound: match.item.isFound,
		foundItem: found,
		lostItem: lost
	};
}
async function handleLost(ctx: MatchContext) {
	const newCtx = { state: ctx.state, isFound: ctx.isFound };
	if (ctx.state == 'validated') {
		const finder = (await db.query.userTable.findFirst({
			where: eq(userTable.id, ctx.foundItem.userId),
			columns: { password: false, verified: false, id: false }
		}))!;
		return { ctx: { ...newCtx, finder } };
	}
	return { ctx: newCtx };
}

async function handleFound(ctx: MatchContext) {
	const newCtx = { state: ctx.state, isFound: ctx.isFound };
	if (ctx.state == 'idle') return { ctx: { ...newCtx, lostItem: ctx.lostItem } };
	return { ctx: newCtx };
}

export const load: ServerLoad = async ({ locals, params }) => {
	const matchId = params.matchId!;
	const userId = locals.user!.id;
	const matchContext = await validateAccess(matchId, userId);
	if (matchContext.isFound) return await handleFound(matchContext);
	return await handleLost(matchContext);
};
