export type PostgresError = {
	code: string;
	message: string;
	detail?: string;
};

export type HttpError = { status: number; statusText: string };
