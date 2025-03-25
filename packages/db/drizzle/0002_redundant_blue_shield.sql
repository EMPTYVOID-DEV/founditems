ALTER TABLE "connection" RENAME TO "matched_items";--> statement-breakpoint
ALTER TABLE "matched_items" DROP CONSTRAINT "connection_lost_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "matched_items" DROP CONSTRAINT "connection_found_item_id_item_id_fk";
--> statement-breakpoint
ALTER TABLE "matched_items" ADD CONSTRAINT "matched_items_lost_item_id_item_id_fk" FOREIGN KEY ("lost_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matched_items" ADD CONSTRAINT "matched_items_found_item_id_item_id_fk" FOREIGN KEY ("found_item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;