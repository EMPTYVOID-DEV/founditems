import { zodEnv } from '../shared/env.js';
import type { CycleAction, MatchingPair } from '../shared/types.js';
import {
	db,
	eq,
	itemTable,
	asc,
	unmatchedTable,
	matchedTable,
	inArray,
	type Item,
	and,
	arrayContains,
	notExists,
	userTable,
	not
} from 'db';
import { TextSimilarity } from './textSimilarity.js';
import { Matcher } from './matcher.js';
import { Logger } from './logger.js';
import { sendNotification } from './mail.js';

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
		await this.textSimilarity.initialize();
		this.startCycle();
	}

	private async startCycle() {
		try {
			Logger.info('cycle starts');
			const lostItems = await this.fetchBlock();
			const matchingPairs = await this.createMatchingPairs(lostItems);
			await this.createActions(matchingPairs);
			await this.postCycle();
			this.updateCycleState(lostItems.length);
		} catch (error) {
			Logger.error(JSON.stringify(error), 'cycle error');
		} finally {
			Logger.info('cycle ends');
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
		return await db.query.itemTable.findMany({
			where: eq(itemTable.isFound, false),
			orderBy: asc(itemTable.creationDate),
			offset: this.blockIndex * zodEnv.ALGORITHM_BLOCK_SIZE,
			limit: zodEnv.ALGORITHM_BLOCK_SIZE
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
					not(eq(itemTable.userId, lostItem.userId)),
					eq(itemTable.isFound, true),
					eq(itemTable.state, 'idle'),
					arrayContains(itemTable.category, lostItem.category),
					notExists(
						db
							.select()
							.from(unmatchedTable)
							.where(
								and(
									eq(unmatchedTable.lostItemId, lostItem.id),
									eq(unmatchedTable.foundItemId, itemTable.id)
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
				return matcher.match().then((matchingResult) => {
					if (matchingResult)
						this.actions.push({
							type: 'match',
							foundItemId: pair.foundItem.id,
							lostItemId: pair.lostItem.id,
							finderId: pair.foundItem.userId,
							victimId: pair.lostItem.userId
						});
					else
						this.actions.push({
							type: 'unmatch',
							foundItemId: pair.foundItem.id,
							lostItemId: pair.lostItem.id
						});
				});
			})
		);
	}

	private async postCycle() {
		Logger.info('running post cycle actions');

		const unmatchActions = this.actions.filter((action) => action.type === 'unmatch');

		const matchActions = AlgorithmCycle.removeMatchDuplicates(
			this.actions.filter((action) => action.type === 'match')
		) as Extract<CycleAction, { type: 'match' }>[];

		const matchedItemIds = matchActions.flatMap((action) => [
			action.foundItemId,
			action.lostItemId
		]);

		await db.transaction(async (tx) => {
			if (unmatchActions.length > 0)
				await tx.insert(unmatchedTable).values(
					unmatchActions.map((action) => ({
						foundItemId: action.foundItemId,
						lostItemId: action.lostItemId
					}))
				);

			if (matchActions.length > 0)
				await tx.insert(matchedTable).values(
					matchActions.map((action) => ({
						foundItemId: action.foundItemId,
						lostItemId: action.lostItemId
					}))
				);

			await tx
				.update(itemTable)
				.set({ state: 'matched' })
				.where(inArray(itemTable.id, matchedItemIds));
		});

		AlgorithmCycle.notifyUsers(matchActions);

		this.actions = [];
	}

	private static removeMatchDuplicates(actions: CycleAction[]) {
		const seen = new Map<string, CycleAction>();
		for (const action of actions)
			if (!seen.has(action.foundItemId)) seen.set(action.foundItemId, action);
		return Array.from(seen.values());
	}

	private static notifyUsers(matches: Extract<CycleAction, { type: 'match' }>[]) {
		const uniqueUserIds = [
			...new Set(matches.flatMap(({ victimId, finderId }) => [finderId, victimId]))
		];

		db.query.userTable
			.findMany({
				where: inArray(userTable.id, uniqueUserIds)
			})
			.then((users) => {
				users.forEach((user) => sendNotification(user.email));
			})
			.catch((err) => {
				Logger.error(JSON.stringify(err), 'matching notification');
			});
	}
}
