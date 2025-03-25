import { zodEnv } from '../shared/env.js';
import type { CycleAction, Signal } from '../shared/types.js';
import { and, db, eq, itemTable, asc, unmatchedItemsTable, matchedItemsTable, inArray } from 'db';
import { effect, signal } from './signal.js';
import { WorkerManager } from './workerManager.js';

export class AlgorithmCycle {
	blockIndex: number;
	workersCounter: Signal<number>;
	actions: CycleAction[];

	constructor() {
		this.blockIndex = 0;
		this.workersCounter = signal(0);
		this.actions = [];

		effect(async () => {
			if (this.workersCounter.value == 0) {
				try {
					await this.postCycle();
					setTimeout(() => {
						this.startCycle();
					}, zodEnv.MATCHING_CYCLE_TIMEOUT);
				} catch (error) {
					console.log('unable to run post cycle');
				}
			}
		});
	}

	private async startCycle() {
		const cycleItems = await db.query.itemTable.findMany({
			where: and(eq(itemTable.isFound, false), eq(itemTable.state, 'idle')),
			orderBy: asc(itemTable.creationDate),
			offset: this.blockIndex * zodEnv.ALGORITHM_BLOCK_SIZE,
			limit: zodEnv.ALGORITHM_BLOCK_SIZE
		});

		this.cycleInitState(cycleItems.length);

		for (const item of cycleItems) {
			const worker = WorkerManager.runWorker(item);
			worker.on('message', (action: CycleAction) => {
				this.actions.push(action);
			});
			worker.on('exit', () => {
				this.workersCounter.value--;
			});
		}
	}

	private cycleInitState(cycleItemsLength: number) {
		if (cycleItemsLength < zodEnv.ALGORITHM_BLOCK_SIZE) this.blockIndex = 0;
		else this.blockIndex++;
		this.workersCounter.value = cycleItemsLength;
	}

	private async postCycle() {
		const unmatchActions = this.actions.filter((action) => action.type === 'unmatch');
		const matchActions = AlgorithmCycle.removeMatchDuplicates(
			this.actions.filter((action) => action.type === 'match')
		);

		if (unmatchActions.length > 0)
			await db.insert(unmatchedItemsTable).values(
				unmatchActions.map((action) => ({
					foundItemId: action.foundItemId,
					lostItemId: action.lostItemId
				}))
			);

		if (matchActions.length > 0)
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

		this.actions = [];
	}

	static removeMatchDuplicates(actions: CycleAction[]) {
		const seen = new Map<number, CycleAction>();
		for (const action of actions)
			if (!seen.has(action.lostItemId)) seen.set(action.lostItemId, action);
		return Array.from(seen.values());
	}
}
