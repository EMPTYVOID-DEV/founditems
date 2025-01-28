import type {
	ClaimsStates,
	Languages,
	PostMetadata,
	PostStates,
	QuizType
} from '$lib/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, json, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const userTable = pgTable('user', {
	id: varchar('id', { length: 8 })
		.primaryKey()
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
		.$default(() => nanoid(8)),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	lang: text('lang').$type<Languages>().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull(),
	category: text('category').notNull(),
	pictures: text('pictures').array().notNull(),
	quiz: json('quiz').$type<Record<string, QuizType>>().notNull(),
	state: text('state').$type<PostStates>().notNull(),
	metadata: json('metadata').array().$type<PostMetadata>().notNull()
});

export const claimTable = pgTable('claim', {
	id: varchar('id', { length: 8 })
		.primaryKey()
		.$default(() => nanoid(8)),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	postId: text('post_id')
		.notNull()
		.references(() => postTable.id, { onDelete: 'cascade' }),
	quizAnswers: json('quiz_answers').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull(),
	state: text('state').$type<ClaimsStates>().notNull(),
	lang: text('lang').$type<Languages>().notNull()
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
