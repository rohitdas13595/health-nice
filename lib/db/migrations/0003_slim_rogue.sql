ALTER TABLE "health_nice"."appointments" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "health_nice"."appointments" ALTER COLUMN "updated_at" SET NOT NULL;