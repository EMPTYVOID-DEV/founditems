import { matchesPage } from '@shared/const';
import { error, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import {
	db,
	eq,
	inArray,
	itemTable,
	matchedTable,
	or,
	unmatchedTable,
	userTable,
	type Item,
	type User
} from 'db';
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

	if (!match) error(403);

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

export const actions: Actions = {
	validate: async ({ locals, params }) => {
		const matchId = params.matchId!;
		const userId = locals.user!.id;
		const matchContext = await validateAccess(matchId, userId);
		if (!matchContext.isFound) error(403);
		await db.update(matchedTable).set({ state: 'validated' }).where(eq(matchedTable.id, matchId));
	},
	reject: async ({ locals, params }) => {
		const matchId = params.matchId!;
		const userId = locals.user!.id;
		const matchContext = await validateAccess(matchId, userId);
		if (!matchContext.isFound) error(403);
		await db.transaction(async (tx) => {
			await tx.delete(matchedTable).where(eq(matchedTable.id, matchId));
			await tx
				.update(itemTable)
				.set({ state: 'idle' })
				.where(inArray(itemTable.id, [matchContext.foundItem.id, matchContext.lostItem.id]));
			await tx
				.insert(unmatchedTable)
				.values({ foundItemId: matchContext.foundItem.id, lostItemId: matchContext.lostItem.id });
		});
		redirect(303, matchesPage);
	}
};
