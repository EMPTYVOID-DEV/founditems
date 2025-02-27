import { error, type ServerLoad } from '@sveltejs/kit';
import { db, eq, foundItemTable, lostItemTable } from 'db';

export const load: ServerLoad = async ({ locals }) => {
	const { id } = locals.user!;
	const posts = await Promise.allSettled([
		db.query.foundItemTable.findMany({
			where: eq(foundItemTable.userId, id),
			columns: { category: true, lang: true, state: true, id: true }
		}),
		db.query.lostItemTable.findMany({
			where: eq(lostItemTable.userId, id),
			columns: { category: true, lang: true, state: true, id: true }
		})
	]);

	if (posts[0].status == 'rejected' || posts[1].status == 'rejected') error(503);

	return { foundItems: posts[0].value, lostItems: posts[1].value };
};
