import { zodEnv } from '../shared/env.js';
import type { CycleAction, MatchingPair } from '../shared/types.js';
import {
	db,
	eq,
	itemTable,
	asc,
	unmatchedItemsTable,
	matchedItemsTable,
	inArray,
	type Item,
	and,
	arrayContains,
	notExists,
	userTable
} from 'db';
import { TextSimilarity } from './textSimilarity.js';
import { Matcher } from './matcher.js';
import { Logger } from './logger.js';
import { sendEmail } from './mail.js';

export class AlgorithmCycle {
	blockIndex: number;
	actions: CycleAction[];
	textSimilarity: TextSimilarity;

	constructor() {
		this.blockIndex = 0;
		this.actions = [];
		this.textSimilarity = new TextSimilarity();
	}

	async startAlgorithm() {
		Logger.info('starting algorithm');
		await this.textSimilarity.initialize().catch((error) => {
			Logger.error(JSON.stringify(error), 'initializing text similarity');
		});
		this.startCycle();
	}

	private async startCycle() {
		Logger.info('cycle starts');

		const lostItems = await this.fetchBlock();

		const matchingPairs = await this.createMatchingPairs(lostItems);

		await this.createActions(matchingPairs);

		this.updateCycleState(lostItems.length);

		Logger.info('cycle ends');

		this.scheduleNewCycle();
	}

	private async scheduleNewCycle() {
		try {
			await this.postCycle();
		} catch (error) {
			Logger.error(JSON.stringify(error), 'post cycle');
		} finally {
			setTimeout(() => {
				this.startCycle();
			}, zodEnv.MATCHING_CYCLE_TIMEOUT);
		}
	}

	private updateCycleState(cycleItemsLength: number) {
		if (cycleItemsLength < zodEnv.ALGORITHM_BLOCK_SIZE) this.blockIndex = 0;
		else this.blockIndex++;
	}

	private async fetchBlock() {
		Logger.info('fetching a cycle block');
		return await db.query.itemTable
			.findMany({
				where: eq(itemTable.isFound, false),
				orderBy: asc(itemTable.creationDate),
				offset: this.blockIndex * zodEnv.ALGORITHM_BLOCK_SIZE,
				limit: zodEnv.ALGORITHM_BLOCK_SIZE
			})
			.catch((error) => {
				Logger.error(JSON.stringify(error), 'fetching the cycle block');
				return [];
			});
	}

	private async createMatchingPairs(lostItems: Item[]) {
		Logger.info('creating matching pairs');
		const pairs: MatchingPair[] = [];
		const idleLostItems = lostItems.filter((it) => it.state == 'idle');
		await Promise.allSettled(
			idleLostItems.map(async (lostItem) => {
				Logger.info(`finding a pre-match for lost_item_id:${lostItem.id}`);
				return AlgorithmCycle.fetchFoundItem(lostItem).then((foundItem) => {
					if (foundItem) pairs.push({ foundItem, lostItem });
				});
			})
		);
		return pairs;
	}

	private static async fetchFoundItem(lostItem: Item) {
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

	private async createActions(matchingPairs: MatchingPair[]) {
		Logger.info('creating cycle actions');
		await Promise.all(
			matchingPairs.map(async (pair) => {
				Logger.info(
					`started matching lost_item_id:${pair.lostItem.id} with found_item_id:${pair.foundItem.id}`
				);
				const matcher = new Matcher(pair.foundItem, pair.lostItem, this.textSimilarity);
				return matcher
					.match()
					.then((matchingResult) => {
						if (matchingResult)
							this.actions.push({
								type: 'match',
								foundItemId: pair.foundItem.id,
								lostItemId: pair.lostItem.id,
								founderId: pair.foundItem.userId,
								victimId: pair.lostItem.userId
							});
						else
							this.actions.push({
								type: 'unmatch',
								foundItemId: pair.foundItem.id,
								lostItemId: pair.lostItem.id
							});
					})
					.catch((error) =>
						Logger.error(
							JSON.stringify(error),
							`matching lost_item_id:${pair.lostItem.id} with found_item_id:${pair.foundItem.id}`
						)
					);
			})
		);
	}

	private async postCycle() {
		Logger.info('running post cycle actions');

		if (this.actions.length == 0) return;

		const unmatchActions = this.actions.filter((action) => action.type === 'unmatch');

		const matchActions = AlgorithmCycle.removeMatchDuplicates(
			this.actions.filter((action) => action.type === 'match')
		) as Extract<CycleAction, { type: 'match' }>[];

		if (unmatchActions.length > 0)
			await db.insert(unmatchedItemsTable).values(
				unmatchActions.map((action) => ({
					foundItemId: action.foundItemId,
					lostItemId: action.lostItemId
				}))
			);

		if (matchActions.length > 0) {
			await db.transaction(async (tx) => {
				await tx.insert(matchedItemsTable).values(
					matchActions.map((action) => ({
						foundItemId: action.foundItemId,
						lostItemId: action.lostItemId
					}))
				);

				const matchedItemIds = matchActions.flatMap((action) => [
					action.foundItemId,
					action.lostItemId
				]);

				await tx
					.update(itemTable)
					.set({ state: 'matched' })
					.where(inArray(itemTable.id, matchedItemIds));
			});

			await AlgorithmCycle.notifyUsers(matchActions);
		}

		this.actions = [];
	}

	private static removeMatchDuplicates(actions: CycleAction[]) {
		const seen = new Map<number, CycleAction>();
		for (const action of actions)
			if (!seen.has(action.lostItemId)) seen.set(action.lostItemId, action);
		return Array.from(seen.values());
	}

	private static async notifyUsers(matches: Extract<CycleAction, { type: 'match' }>[]) {
		for (const { founderId, victimId } of matches) {
			const users = await Promise.all([
				db.query.userTable.findFirst({ where: eq(userTable.id, founderId) }),
				db.query.userTable.findFirst({ where: eq(userTable.id, victimId) })
			]);

			for (const user of users) if (user) await AlgorithmCycle.sendNotification(user.email);
		}
	}

	private static sendNotification(email: string) {
		const subject = 'System Match';
		const html =
			'<h1>Matched your item</h1><p>We have matches your item. Please enter the site for more details.</p>';
		return sendEmail(email, subject, html);
	}
}
