ALTER TABLE "found_item" DROP COLUMN "found_date";
ALTER TABLE "lost_item" DROP COLUMN "lost_date";
ALTER TABLE "found_item" ADD COLUMN "found_date" json;--> statement-breakpoint
ALTER TABLE "lost_item" ADD COLUMN "lost_date" json;--> statement-breakpoint
ALTER TABLE "found_item" ADD COLUMN "creation_date" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lost_item" ADD COLUMN "creation_date" timestamp with time zone DEFAULT now() NOT NULL;