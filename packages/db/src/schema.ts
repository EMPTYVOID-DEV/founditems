import type {
	ConnectionMetaData,
	ConnectionStates,
	ItemMetaData,
	ItemStates,
	ItemDate
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

export const foundItemTable = pgTable('found_item', {
	id: serial('id').primaryKey().notNull(),
	userId: varchar('user_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	lang: text('lang').$type().notNull(),
	creationDate: timestamp('creation_date', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	address: text('address').notNull(),
	foundDate: json('found_date').$type<ItemDate>().notNull(),
	category: text('category').array().notNull(),
	metadata: json('meta_data').array().$type<ItemMetaData>().notNull(),
	state: text('state').$type<ItemStates>().notNull().default('Idle')
});

export const lostItemTable = pgTable('lost_item', {
	id: serial('id').primaryKey().notNull(),
	userId: varchar('user_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	lang: text('lang').$type().notNull(),
	creationDate: timestamp('creation_date', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	address: text('address').notNull(),
	lostDate: json('lost_date').$type<ItemDate>().notNull(),
	category: text('category').array().notNull(),
	metadata: json('meta_data').array().$type<ItemMetaData>().notNull(),
	state: text('state').$type<ItemStates>().notNull().default('Idle'),
	description: text('description').notNull(),
	images: text('images').array().notNull()
});

export const unmatchedItemsTable = pgTable('unmatched_items', {
	id: serial('id').primaryKey().notNull(),
	lostItemId: integer('lost_item_id')
		.notNull()
		.references(() => lostItemTable.id, { onDelete: 'cascade' }),
	foundItemId: integer('found_item_id')
		.notNull()
		.references(() => foundItemTable.id, { onDelete: 'cascade' })
});

export const connectionTable = pgTable('connection', {
	id: serial('id').primaryKey().notNull(),
	lostItemId: integer('lost_item_id')
		.notNull()
		.references(() => lostItemTable.id, { onDelete: 'cascade' }),
	foundItemId: integer('found_item_id')
		.notNull()
		.references(() => foundItemTable.id, { onDelete: 'cascade' }),
	founderId: varchar('founder_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	victimId: varchar('victim_id', { length: 8 })
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	state: text('state').$type<ConnectionStates>().notNull().default('Idle'),
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
	lostItem: one(lostItemTable, {
		fields: [connectionTable.lostItemId],
		references: [lostItemTable.id]
	}),
	foundItem: one(foundItemTable, {
		fields: [connectionTable.foundItemId],
		references: [foundItemTable.id]
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
	lostItem: one(lostItemTable, {
		fields: [unmatchedItemsTable.lostItemId],
		references: [lostItemTable.id]
	}),
	foundItem: one(foundItemTable, {
		fields: [unmatchedItemsTable.foundItemId],
		references: [foundItemTable.id]
	})
}));

export const lostItemRelations = relations(lostItemTable, ({ one, many }) => ({
	unmatchedItem: many(unmatchedItemsTable),
	user: one(userTable, {
		fields: [lostItemTable.userId],
		references: [userTable.id]
	}),
	connection: one(connectionTable)
}));

export const foundItemRelations = relations(foundItemTable, ({ one, many }) => ({
	unmatchedItem: many(unmatchedItemsTable),
	user: one(userTable, {
		fields: [foundItemTable.userId],
		references: [userTable.id]
	}),
	connection: one(connectionTable)
}));
