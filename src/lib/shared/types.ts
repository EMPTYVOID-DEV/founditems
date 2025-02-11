import type {
	sessionTable,
	userTable,
	connectionTable,
	foundItemTable,
	otpTable,
	lostItemTable,
	unmatchedItemsTable
} from '@server/db/schema';
import type { validateSessionToken } from '@server/utils/auth';

export type ItemStates = 'Idle' | 'Matched';

export type ConnectionStates =
	| 'Idle'
	| 'Validated'
	| 'Payment Validated'
	| 'Payment Failed'
	| 'Shipment Processing'
	| 'Shipment Failed'
	| 'Shipment Delivered'
	| 'Reporting'
	| 'Released';

export type ConnectionMetaData = Partial<Record<ConnectionStates, unknown>>;

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type FoundItem = typeof foundItemTable.$inferSelect;

export type LostItem = typeof lostItemTable.$inferSelect;

export type Connection = typeof connectionTable.$inferSelect;

export type Otp = typeof otpTable.$inferSelect;

export type unmatchItems = typeof unmatchedItemsTable.$inferSelect;

export type SessionInsert = typeof sessionTable.$inferInsert;

export type UserInsert = typeof userTable.$inferInsert;

export type FoundItemInsert = typeof foundItemTable.$inferInsert;

export type LostItemInsert = typeof lostItemTable.$inferInsert;

export type ConnectionInsert = typeof connectionTable.$inferInsert;

export type OtpInsert = typeof otpTable.$inferInsert;

export type UnmatchItemsInsert = typeof unmatchedItemsTable.$inferInsert;

export type ActionStatus = { status: 'valid' | 'invalid'; errorMsg: string };

export type Validator = (data: unknown) => ActionStatus;

export type ItemMetaData = {
	name: string;
	type: 'partial' | 'exact';
	value: string;
}[];
