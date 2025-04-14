import {
	type MatchMetaData,
	type MatchStates,
	type ItemMetaData,
	type ItemStates,
	type AvailableLocales,
	type ItemAddress,
	otpCodeLength
} from 'utils';

import {
	boolean,
	pgTable,
	text,
	timestamp,
	varchar,
	serial,
	json,
	integer
} from 'drizzle-orm/pg-core';
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
	userId: varchar('user_id', { length: 8 })
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const itemTable = pgTable('item', {
	id: serial('id').primaryKey().notNull(),
	userId: varchar('user_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	creationDate: timestamp('creation_date', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	lang: text('lang').$type<AvailableLocales>().notNull(),
	address: json('address').$type<ItemAddress>().notNull(),
	date: timestamp('date').notNull(),
	category: text('category').array().notNull(),
	metadata: json('meta_data').array().$type<ItemMetaData>().notNull(),
	state: text('state').$type<ItemStates>().notNull().default('idle'),
	description: text('description').notNull(),
	images: text('images').array().notNull(),
	isFound: boolean('is_found').notNull().default(true)
});

export const unmatchedItemsTable = pgTable('unmatched_items', {
	id: serial('id').primaryKey().notNull(),
	lostItemId: integer('lost_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' }),
	foundItemId: integer('found_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' })
});

export const matchedItemsTable = pgTable('matched_items', {
	id: serial('id').primaryKey().notNull(),
	lostItemId: integer('lost_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' }),
	foundItemId: integer('found_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' }),
	state: text('state').$type<MatchStates>().notNull().default('idle'),
	metadata: json('meta_data').$type<MatchMetaData>().notNull().default({})
});

export const otpTable = pgTable('otp', {
	id: serial('id').notNull().primaryKey(),
	code: varchar('code', { length: otpCodeLength }).notNull(),
	email: text('email').unique().notNull(),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
