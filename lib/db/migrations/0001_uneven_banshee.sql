CREATE TABLE IF NOT EXISTS "health_nice"."appointments" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"patient_data_id" uuid NOT NULL,
	"doctor_id" uuid NOT NULL,
	"time" timestamp NOT NULL,
	"status" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."appointments" ADD CONSTRAINT "appointments_patient_id_patient_pk_fk" FOREIGN KEY ("patient_id") REFERENCES "health_nice"."patient"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."appointments" ADD CONSTRAINT "appointments_patient_data_id_patient_data_pk_fk" FOREIGN KEY ("patient_data_id") REFERENCES "health_nice"."patient_data"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."appointments" ADD CONSTRAINT "appointments_doctor_id_doctor_pk_fk" FOREIGN KEY ("doctor_id") REFERENCES "health_nice"."doctor"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
