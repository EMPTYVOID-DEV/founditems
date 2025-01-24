import type { claimTable, postTable, sessionTable, userTable } from './db/schema';
import type { validateSessionToken } from './utils/auth';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Post = typeof postTable.$inferSelect;

export type Claim = typeof claimTable.$inferSelect;
