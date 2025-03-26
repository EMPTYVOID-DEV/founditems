// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
	pipeline,
	type FeatureExtractionPipeline,
	env as huggingfaceEnv
} from '@huggingface/transformers';
import { zodEnv } from '../shared/env.js';
import path from 'path';

export class TextSimilarity {
	private embedder: FeatureExtractionPipeline | null;
	private modelPath: string;

	constructor() {
		this.embedder = null;
		this.modelPath = path.join(zodEnv.ROOT_DIR, '.cache', zodEnv.XENOVA_MODEL);
		huggingfaceEnv.allowRemoteModels = false;
	}

	async initialize() {
		if (!this.embedder)
			this.embedder = await pipeline('feature-extraction', this.modelPath, {
				dtype: 'fp32'
			});
	}

	private async getEmbedding(text: string) {
		const result = await this.embedder!(text, { pooling: 'mean', normalize: true });
		return Float32Array.from(result.data);
	}

	private cosineSimilarity(vec1: Float32Array, vec2: Float32Array): number {
		let dotProduct = 0;
		let mag1 = 0;
		let mag2 = 0;

		for (let i = 0; i < vec1.length; i++) {
			dotProduct += vec1[i] * vec2[i];
			mag1 += vec1[i] * vec1[i];
			mag2 += vec2[i] * vec2[i];
		}

		mag1 = Math.sqrt(mag1);
		mag2 = Math.sqrt(mag2);

		return dotProduct / (mag1 * mag2);
	}

	async getSimilarity(text1: string, text2: string): Promise<number> {
		const embedding1 = await this.getEmbedding(text1);
		const embedding2 = await this.getEmbedding(text2);

		return this.cosineSimilarity(embedding1, embedding2);
	}
}
