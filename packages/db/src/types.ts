import type {
	sessionTable,
	userTable,
	matchedItemsTable,
	otpTable,
	itemTable,
	unmatchedItemsTable
} from './schema.js';

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Item = typeof itemTable.$inferSelect;

export type MatchedItems = typeof matchedItemsTable.$inferSelect;

export type Otp = typeof otpTable.$inferSelect;

export type UnmatchedItems = typeof unmatchedItemsTable.$inferSelect;

export type SessionInsert = typeof sessionTable.$inferInsert;

export type UserInsert = typeof userTable.$inferInsert;

export type ItemInsert = typeof itemTable.$inferInsert;

export type MatchedItemsInsert = typeof matchedItemsTable.$inferInsert;

export type OtpInsert = typeof otpTable.$inferInsert;

export type UnmatchedItemsInsert = typeof unmatchedItemsTable.$inferInsert;
