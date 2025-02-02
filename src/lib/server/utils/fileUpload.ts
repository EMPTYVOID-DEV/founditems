import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';
import { handleFetchError } from './general';
import { left, right, type Either } from 'fp-ts/lib/Either';
import type { HttpError } from '@server/types';

export interface FileUpload {
	uploadFile(file: File): Promise<Either<HttpError, string>>;
}

export class FileUploadFactory {
	static create(assetType: 'image' | 'video' | 'raw'): FileUpload {
		const storageProvider = env.STORAGE_PROVIDER;
		if (storageProvider == 'cloudinary') return new Cloudinary(assetType);
		throw new Error('Invalid storage provider');
	}
}

export class Cloudinary implements FileUpload {
	timestamp: string;
	apiKey: string;
	signature: string;
	uploadUrl: string;

	constructor(assetType: 'image' | 'video' | 'raw') {
		this.timestamp = Date.now().toString();
		this.apiKey = env.CLOUDINARY_API_KEY;
		this.uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUNDINARY_CLOUD_NAME}/${assetType}/upload`;
		this.signature = this.getSignature();
	}

	async uploadFile(file: File) {
		const fd = new FormData();
		fd.append('file', file);
		fd.append('api_key', this.apiKey);
		fd.append('timestamp', this.timestamp);
		fd.append('signature', this.signature);
		const upload = await handleFetchError(fetch(this.uploadUrl, { method: 'POST', body: fd }));
		if (upload._tag == 'Right') return right(await this.extractAccessUrl(upload.right));
		return left(upload.left);
	}

	async extractAccessUrl(res: Response): Promise<string> {
		return res.json().then((data) => data.secure_url);
	}

	getSignature() {
		const signature = `timestamp=${this.timestamp}${env.CLOUDINARY_API_SECRET}`;
		return createHash('sha1').update(signature).digest('hex');
	}
}
