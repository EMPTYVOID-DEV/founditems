import { workerData, parentPort } from 'worker_threads';
import {
	and,
	db,
	eq,
	itemTable,
	arrayContains,
	unmatchedItemsTable,
	type Item,
	notExists
} from 'db';
import { Matcher } from './matcher.js';
import { TextSimilarity } from './textSimilarity.js';
import type { CycleAction } from '../shared/types.js';

const lostItem: Item = workerData;

async function workerLogic() {
	const foundItem = await fetchFoundItem();
	if (!foundItem) process.exit(0);
	const textSimilarity = new TextSimilarity();
	const matcher = new Matcher(foundItem, lostItem, textSimilarity);
	const matchingResult = matcher.match();
	const action: CycleAction = {
		type: 'unmatch',
		foundItemId: foundItem.id,
		lostItemId: lostItem.id
	};
	if (matchingResult) action.type = 'match';
	if (parentPort) parentPort.postMessage(action);
}

async function fetchFoundItem() {
	return await db
		.select()
		.from(itemTable)
		.where(
			and(
				eq(itemTable.isFound, true),
				eq(itemTable.state, 'idle'),
				arrayContains(itemTable.category, lostItem.category),
				notExists(
					db
						.select()
						.from(unmatchedItemsTable)
						.where(
							and(
								eq(unmatchedItemsTable.lostItemId, lostItem.id),
								eq(unmatchedItemsTable.foundItemId, itemTable.id)
							)
						)
				)
			)
		)
		.limit(1)
		.then((values) => values.at(0));
}

workerLogic();
