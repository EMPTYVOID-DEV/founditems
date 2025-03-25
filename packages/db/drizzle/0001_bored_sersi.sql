ALTER TABLE "connection" DROP CONSTRAINT "connection_founder_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "connection" DROP CONSTRAINT "connection_victim_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "connection" DROP COLUMN "founder_id";--> statement-breakpoint
ALTER TABLE "connection" DROP COLUMN "victim_id";