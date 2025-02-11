import { env } from '$env/dynamic/private';
import { left, right, type Either } from 'fp-ts/lib/Either';
import path from 'path';
import { nanoid } from 'nanoid';
import { writeFile } from 'fs/promises';
import mime from 'mime-types';
import { createHash } from 'crypto';
import { handleFetchError } from './general';

export interface FileUpload {
	uploadFile(file: Blob): Promise<Either<Error, string>>;
}

export class FileUploadFactory {
	static create(): FileUpload {
		switch (env.STORAGE_PROVIDER) {
			case 'local':
				return new LocalStorageAdapter();
			case 'cloudinary':
				return new CloudinaryAdapter();
			default:
				throw new Error('Unsupported storage provider');
		}
	}
}

/**
 * local storage works with adapter node where base folder for files is statically served
 */
class LocalStorageAdapter implements FileUpload {
	private base: string;

	constructor() {
		this.base = env.LOCAL_STORAGE_FOLDER || '';
	}

	async uploadFile(file: Blob): Promise<Either<Error, string>> {
		const id = nanoid(8);
		const ext = mime.extension(file.type) || 'bin';
		const publicId = `/${id}.${ext}`;
		const filePath = path.join(process.cwd(), this.base, publicId);

		try {
			const arrayBuffer = await file.arrayBuffer();
			await writeFile(filePath, Buffer.from(arrayBuffer), {});
			return right(publicId);
		} catch (error) {
			return left(error instanceof Error ? error : new Error('File upload failed'));
		}
	}
}

/**
 * dloudinary is used for preview with vercel
 */
class CloudinaryAdapter implements FileUpload {
	private timestamp: string;
	private apiKey: string;
	private signature: string;
	private uploadUrl: string;
	private api_secret: string;

	constructor() {
		this.timestamp = Date.now().toString();
		this.apiKey = env.CLOUDINARY_API_KEY || '';
		this.api_secret = env.CLOUDINARY_API_SECRET || '';
		this.uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`;
		this.signature = this.generateSignature();
	}

	async uploadFile(file: Blob): Promise<Either<Error, string>> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', this.apiKey);
		formData.append('timestamp', this.timestamp);
		formData.append('signature', this.signature);

		const response = await handleFetchError(
			fetch(this.uploadUrl, { method: 'POST', body: formData })
		);
		if (response._tag === 'Right') return right(await this.extractAccessUrl(response.right));

		return left(new Error('File upload failed', { cause: response.left }));
	}

	private async extractAccessUrl(res: Response): Promise<string> {
		const data = await res.json();
		return data.secure_url;
	}

	private generateSignature(): string {
		return createHash('sha1').update(`timestamp=${this.timestamp}${this.api_secret}`).digest('hex');
	}
}
