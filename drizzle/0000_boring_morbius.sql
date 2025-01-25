CREATE TABLE "claim" (
	"id" varchar(8) PRIMARY KEY DEFAULT 'AbYZBNqG' NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"quiz_answers" json NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"state" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" varchar(8) PRIMARY KEY DEFAULT 'o2hCk_QV' NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"lang" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"category" text NOT NULL,
	"pictures" text[] NOT NULL,
	"quiz" json NOT NULL,
	"state" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(8) PRIMARY KEY DEFAULT 'S6x1asnB' NOT NULL,
	"fullname" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"address" text NOT NULL,
	"phone_number" text NOT NULL,
	"avatar" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "claim" ADD CONSTRAINT "claim_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim" ADD CONSTRAINT "claim_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;