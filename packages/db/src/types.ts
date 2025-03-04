import type {
	sessionTable,
	userTable,
	connectionTable,
	otpTable,
	itemTable,
	unmatchedItemsTable
} from './schema.js';

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Item = typeof itemTable.$inferSelect;

export type Connection = typeof connectionTable.$inferSelect;

export type Otp = typeof otpTable.$inferSelect;

export type unmatchItems = typeof unmatchedItemsTable.$inferSelect;

export type SessionInsert = typeof sessionTable.$inferInsert;

export type UserInsert = typeof userTable.$inferInsert;

export type ItemInsert = typeof itemTable.$inferInsert;

export type ConnectionInsert = typeof connectionTable.$inferInsert;

export type OtpInsert = typeof otpTable.$inferInsert;

export type UnmatchItemsInsert = typeof unmatchedItemsTable.$inferInsert;
