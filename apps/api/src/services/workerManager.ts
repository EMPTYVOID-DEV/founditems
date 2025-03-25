import { Worker } from 'worker_threads';
import { zodEnv } from '../shared/env.js';
import path from 'path';

export class WorkerManager {
	static workerPath: string =
		zodEnv.NODE_ENV == 'dev'
			? path.join(import.meta.dirname, 'worker.ts')
			: path.join(import.meta.dirname, './services/worker.js');

	private static createDevWorker(devPath: string, workerData: unknown) {
		return new Worker(devPath, {
			execArgv: ['--loader', 'ts-node/esm/transpile-only'],
			workerData
		});
	}

	private static createProdWorker(prodPath: string, workerData: unknown) {
		return new Worker(prodPath, {
			workerData
		});
	}

	static runWorker(workerData?: unknown) {
		const isDevEnv = zodEnv.NODE_ENV === 'dev';

		const worker = isDevEnv
			? WorkerManager.createDevWorker(WorkerManager.workerPath, workerData)
			: WorkerManager.createProdWorker(WorkerManager.workerPath, workerData);

		return worker;
	}
}
