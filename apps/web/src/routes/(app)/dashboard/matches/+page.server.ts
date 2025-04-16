import type { ServerLoad } from '@sveltejs/kit';
import { and, db, eq, itemTable, matchedTable, or } from 'db';

export const load: ServerLoad = async ({ locals }) => {
	const id = locals.user!.id;
	const joinResult = await db
		.select({ match: matchedTable, category: itemTable.category, ownItemId: itemTable.id })
		.from(itemTable)
		.where(and(eq(itemTable.userId, id), eq(itemTable.state, 'matched')))
		.innerJoin(
			matchedTable,
			or(eq(matchedTable.lostItemId, itemTable.id), eq(matchedTable.foundItemId, itemTable.id))
		);

	return {
		matches: joinResult.map((i) => ({
			id: i.match.id,
			state: i.match.state,
			category: i.category,
			ownItemId: i.ownItemId,
			isFound: i.match.foundItemId == i.ownItemId
		}))
	};
};
