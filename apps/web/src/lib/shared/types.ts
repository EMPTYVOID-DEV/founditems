import type { validateSessionToken } from '@server/utils/auth';
import type { User } from 'db';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type ActionStatus = { status: 'valid' | 'invalid'; errorMsg: string };

export type Validator = (data: unknown) => ActionStatus;

export type UserContact = Omit<User, 'password' | 'verified' | 'id'>;
