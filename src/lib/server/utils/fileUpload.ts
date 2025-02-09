import { env } from '$env/dynamic/private';
import { left, right, type Either } from 'fp-ts/lib/Either';
import path from 'path';
import { nanoid } from 'nanoid';
import { writeFile, unlink } from 'fs/promises';
import mime from 'mime-types';
import { localStorage } from '@shared/const';

export interface FileUpload {
	uploadFile(file: Blob): Promise<Either<Error, string>>;
	deleteFile(publicId: string): Promise<Either<Error, null>>;
}

export class FileUploadFactory {
	static create(container: string): FileUpload {
		switch (env.STORAGE_PROVIDER) {
			case 'local':
				return new LocalFileUpload(container);
			default:
				throw new Error('Unsupported storage provider');
		}
	}
}

class LocalFileUpload implements FileUpload {
	private container: string;

	constructor(container: string) {
		this.container = container;
	}

	async uploadFile(file: Blob): Promise<Either<Error, string>> {
		const id = nanoid(8);
		const ext = mime.extension(file.type);
		const publicId = `/${this.container}/${id}.${ext}`;
		const filePath = path.join(localStorage, publicId);

		try {
			const arrayBuffer = await file.arrayBuffer();
			await writeFile(filePath, Buffer.from(arrayBuffer));
			return right(publicId);
		} catch (error) {
			return left(error instanceof Error ? error : new Error('File upload failed'));
		}
	}

	async deleteFile(publicId: string): Promise<Either<Error, null>> {
		try {
			const filePath = path.join(localStorage, publicId);
			await unlink(filePath);
			return right(null);
		} catch (error) {
			return left(error instanceof Error ? error : new Error('File deletion failed'));
		}
	}
}
