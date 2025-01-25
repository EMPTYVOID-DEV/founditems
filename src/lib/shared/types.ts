import type { claimTable, postTable, sessionTable, userTable } from '@server/db/schema';
import type { validateSessionToken } from '@server/utils/auth';

export type PostStates =
	| 'Idle'
	| 'Processing claims'
	| 'Validated'
	| 'Payment'
	| 'Payment Validated'
	| 'Shipment'
	| 'Released';

export type ClaimsStates = 'Idle' | 'Rejected' | 'Accepted' | 'Post deleted';

export type Languages = 'ar' | 'fr';

export type QuizType = 'direct' | 'time' | 'address';

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Post = typeof postTable.$inferSelect;

export type Claim = typeof claimTable.$inferSelect;
