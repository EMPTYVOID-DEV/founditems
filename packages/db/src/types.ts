import type {
	sessionTable,
	userTable,
	matchedTable,
	otpTable,
	itemTable,
	unmatchedTable
} from './schema.js';

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Item = typeof itemTable.$inferSelect;

export type Matched = typeof matchedTable.$inferSelect;

export type Otp = typeof otpTable.$inferSelect;

export type Unmatched = typeof unmatchedTable.$inferSelect;

export type SessionInsert = typeof sessionTable.$inferInsert;

export type UserInsert = typeof userTable.$inferInsert;

export type ItemInsert = typeof itemTable.$inferInsert;

export type MatchedInsert = typeof matchedTable.$inferInsert;

export type OtpInsert = typeof otpTable.$inferInsert;

export type UnmatchedInsert = typeof unmatchedTable.$inferInsert;
