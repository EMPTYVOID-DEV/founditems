CREATE TABLE "item" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"user_id" varchar(8) NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now() NOT NULL,
	"lang" text NOT NULL,
	"address" json NOT NULL,
	"date" timestamp NOT NULL,
	"category" text[] NOT NULL,
	"meta_data" json[] NOT NULL,
	"state" text DEFAULT 'idle' NOT NULL,
	"description" text NOT NULL,
	"images" text[] NOT NULL,
	"is_found" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matched_item" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"lost_item_id" varchar(8) NOT NULL,
	"found_item_id" varchar(8) NOT NULL,
	"state" text DEFAULT 'idle' NOT NULL,
	"meta_data" json DEFAULT '{}'::json NOT NULL
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
CREATE TABLE "unmatched_item" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"lost_item_id" varchar(8) NOT NULL,
	"found_item_id" varchar(8) NOT NULL
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
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matched_item" ADD CONSTRAINT "matched_item_lost_item_id_item_id_fk" FOREIGN KEY ("lost_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matched_item" ADD CONSTRAINT "matched_item_found_item_id_item_id_fk" FOREIGN KEY ("found_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmatched_item" ADD CONSTRAINT "unmatched_item_lost_item_id_item_id_fk" FOREIGN KEY ("lost_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmatched_item" ADD CONSTRAINT "unmatched_item_found_item_id_item_id_fk" FOREIGN KEY ("found_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;