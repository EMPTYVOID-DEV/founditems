import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { env } from '@shared/env.js';

class TextSimilarity {
	private embedder: FeatureExtractionPipeline | null;

	constructor() {
		this.embedder = null;
	}

	async initialize() {
		if (!this.embedder)
			this.embedder = await pipeline('feature-extraction', env.XENOVA_MODEL, {
				dtype: 'fp32'
			});
	}

	private async getEmbedding(text: string) {
		await this.initialize();
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

export const textSimilarity = new TextSimilarity();
