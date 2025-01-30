ALTER TABLE "otp" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "otp" ADD CONSTRAINT "otp_email_unique" UNIQUE("email");