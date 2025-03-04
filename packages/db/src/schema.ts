import type {
	ConnectionMetaData,
	ConnectionStates,
	ItemMetaData,
	ItemStates,
	AvailableLocales,
	ItemAddress
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
import { relations } from 'drizzle-orm';

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

export const connectionTable = pgTable('connection', {
	id: serial('id').primaryKey().notNull(),
	lostItemId: integer('lost_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' }),
	foundItemId: integer('found_item_id')
		.notNull()
		.references(() => itemTable.id, { onDelete: 'cascade' }),
	founderId: varchar('founder_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	victimId: varchar('victim_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	state: text('state').$type<ConnectionStates>().notNull().default('idle'),
	metadata: json('meta_data').$type<ConnectionMetaData>().notNull()
});

export const otpTable = pgTable('otp', {
	id: serial('id').notNull().primaryKey(),
	code: varchar('code', { length: 6 }).notNull(),
	email: text('email').unique().notNull(),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const connectionRelations = relations(connectionTable, ({ one }) => ({
	lostItem: one(itemTable, {
		fields: [connectionTable.lostItemId],
		references: [itemTable.id]
	}),
	foundItem: one(itemTable, {
		fields: [connectionTable.foundItemId],
		references: [itemTable.id]
	}),
	founder: one(userTable, {
		fields: [connectionTable.founderId],
		references: [userTable.id]
	}),
	victim: one(userTable, {
		fields: [connectionTable.victimId],
		references: [userTable.id]
	})
}));

export const unmatchedItemsRelations = relations(unmatchedItemsTable, ({ one }) => ({
	lostItem: one(itemTable, {
		fields: [unmatchedItemsTable.lostItemId],
		references: [itemTable.id]
	}),
	foundItem: one(itemTable, {
		fields: [unmatchedItemsTable.foundItemId],
		references: [itemTable.id]
	})
}));

export const itemRelations = relations(itemTable, ({ one, many }) => ({
	unmatchedItem: many(unmatchedItemsTable),
	user: one(userTable, {
		fields: [itemTable.userId],
		references: [userTable.id]
	}),
	connection: one(connectionTable)
}));
