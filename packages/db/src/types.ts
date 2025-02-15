import type {
	sessionTable,
	userTable,
	connectionTable,
	foundItemTable,
	otpTable,
	lostItemTable,
	unmatchedItemsTable
} from './schema.js';

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
