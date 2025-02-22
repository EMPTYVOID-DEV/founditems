CREATE TABLE "connection" (
	"id" serial PRIMARY KEY NOT NULL,
	"lost_item_id" integer NOT NULL,
	"found_item_id" integer NOT NULL,
	"founder_id" varchar(8) NOT NULL,
	"victim_id" varchar(8) NOT NULL,
	"state" text DEFAULT 'Idle' NOT NULL,
	"meta_data" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "found_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(8) NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now() NOT NULL,
	"lang" text NOT NULL,
	"address" json NOT NULL,
	"found_date" timestamp NOT NULL,
	"category" text[] NOT NULL,
	"meta_data" json[] NOT NULL,
	"state" text DEFAULT 'Idle' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lost_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(8) NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now() NOT NULL,
	"lang" text NOT NULL,
	"address" json NOT NULL,
	"lost_date" timestamp NOT NULL,
	"category" text[] NOT NULL,
	"meta_data" json[] NOT NULL,
	"state" text DEFAULT 'Idle' NOT NULL,
	"description" text NOT NULL,
	"images" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "otp_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(8) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unmatched_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"lost_item_id" integer NOT NULL,
	"found_item_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"fullname" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"phone_number" text DEFAULT '' NOT NULL,
	"avatar" text DEFAULT '' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_lost_item_id_lost_item_id_fk" FOREIGN KEY ("lost_item_id") REFERENCES "public"."lost_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_found_item_id_found_item_id_fk" FOREIGN KEY ("found_item_id") REFERENCES "public"."found_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_founder_id_user_id_fk" FOREIGN KEY ("founder_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_victim_id_user_id_fk" FOREIGN KEY ("victim_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "found_item" ADD CONSTRAINT "found_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_item" ADD CONSTRAINT "lost_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmatched_items" ADD CONSTRAINT "unmatched_items_lost_item_id_lost_item_id_fk" FOREIGN KEY ("lost_item_id") REFERENCES "public"."lost_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmatched_items" ADD CONSTRAINT "unmatched_items_found_item_id_found_item_id_fk" FOREIGN KEY ("found_item_id") REFERENCES "public"."found_item"("id") ON DELETE cascade ON UPDATE no action;