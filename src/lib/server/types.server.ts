import type { validateSessionToken } from './utils/auth';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;
