import type { ClaimsStates, PostMetadata, PostStates } from '@shared/types';
import type { Locales } from '@shared/i18n/i18n-types';
import { relations, sql } from 'drizzle-orm';
import { boolean, json, pgTable, text, timestamp, varchar, serial } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const userTable = pgTable('user', {
	id: varchar('id', { length: 8 })
		.primaryKey()
		.notNull()
		.$default(() => nanoid(8)),
	fullname: text('fullname').notNull(),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	verified: boolean('verified').notNull().default(false),
	address: text('address').notNull().default(''),
	phoneNumber: text('phone_number').notNull().default(''),
	avatar: text('avatar').notNull().default('')
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const postTable = pgTable('post', {
	id: varchar('id', { length: 8 })
		.primaryKey()
		.notNull()
		.$default(() => nanoid(8)),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	lang: text('lang').$type<Locales>().notNull(),
	address: text('address').notNull(),
	foundDate: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	isSecret: boolean('is_secret').notNull(),
	category: text('category').notNull(),
	state: text('state').$type<PostStates>().notNull(),
	metadata: json('metadata').$type<PostMetadata>().notNull()
});

export const claimTable = pgTable('claim', {
	id: varchar('id', { length: 8 })
		.primaryKey()
		.notNull()
		.$default(() => nanoid(8)),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	postId: text('post_id')
		.notNull()
		.references(() => postTable.id, { onDelete: 'cascade' }),
	lang: text('lang').$type<Locales>().notNull(),
	proof: text('proof').notNull(),
	images: text('images')
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
	state: text('state').$type<ClaimsStates>().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const otpTable = pgTable('otp', {
	id: serial('id').notNull().primaryKey(),
	code: varchar('code', { length: 6 }).notNull(),
	email: text('email').unique().notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const userRelation = relations(userTable, ({ many }) => ({
	posts: many(postTable),
	claims: many(claimTable)
}));

export const postRelation = relations(postTable, ({ many, one }) => ({
	claims: many(claimTable),
	user: one(userTable, { fields: [postTable.userId], references: [userTable.id] })
}));

export const claimsRelation = relations(claimTable, ({ one }) => ({
	user: one(userTable, { fields: [claimTable.userId], references: [userTable.id] }),
	post: one(postTable, { fields: [claimTable.postId], references: [postTable.id] })
}));
