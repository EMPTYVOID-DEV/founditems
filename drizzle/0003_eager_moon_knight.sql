ALTER TABLE "post" ADD COLUMN "updated_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "metadata" json[] NOT NULL;