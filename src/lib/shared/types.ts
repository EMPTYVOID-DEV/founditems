import type { claimTable, postTable, sessionTable, userTable } from '@server/db/schema';
import type { validateSessionToken } from '@server/utils/auth';

export type PostStates =
	| 'Idle'
	| 'Processing claims'
	| 'Validated'
	| 'Payment Validated'
	| 'Payment Failed'
	| 'Shipment Processing'
	| 'Shipment Failed'
	| 'Shipment Delivered'
	| 'Reporting'
	| 'Released';

export type ClaimsStates = 'Idle' | 'Rejected' | 'Accepted';

export type PostMetadata = Partial<Record<PostStates, unknown>>;

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Post = typeof postTable.$inferSelect;

export type Claim = typeof claimTable.$inferSelect;

export type SessionInsert = typeof sessionTable.$inferInsert;

export type UserInsert = typeof userTable.$inferInsert;

export type PostInsert = typeof postTable.$inferInsert;

export type ClaimInsert = typeof claimTable.$inferInsert;

export type ActionStatus = { status: 'valid' | 'invalid'; errorMsg: string };

export type Validator = (text: string) => ActionStatus;
