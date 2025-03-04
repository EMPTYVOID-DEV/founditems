import type { ServerLoad } from '@sveltejs/kit';
import { db, eq, itemTable } from 'db';

export const load: ServerLoad = async ({ locals }) => {
	const { id } = locals.user!;
	const posts = await db.query.itemTable.findMany({
		where: eq(itemTable.userId, id),
		columns: { category: true, state: true, id: true, isFound: true }
	});

	return { posts };
};
