import type { validateSessionToken } from '@server/utils/auth';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type ActionStatus = { status: 'valid' | 'invalid'; errorMsg: string };

export type Validator = (data: unknown) => ActionStatus;
