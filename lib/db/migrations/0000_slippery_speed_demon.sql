CREATE SCHEMA "health_nice";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."admin" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"admin_role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."admin_key" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hashed_password" varchar(100) NOT NULL,
	"admin_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."admin_role" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."admin_role_permission" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."admin_session" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."doctor" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(100) NOT NULL,
	"password" varchar(100),
	"name" varchar(255),
	"specialization" json DEFAULT 'null'::json,
	"experience" integer DEFAULT 0,
	"fees" double precision DEFAULT 0,
	"address" varchar(255),
	"avatar" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "doctor_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."doctor_session" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" uuid NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."patient" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(100) NOT NULL,
	"password" varchar(100),
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."patient_data" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"name" varchar(255),
	"email" varchar(100) NOT NULL,
	"phone" varchar(100) NOT NULL,
	"birth_date" date NOT NULL,
	"gender" varchar NOT NULL,
	"address" varchar,
	"occupation" varchar,
	"emergency_contact_name" varchar,
	"emergency_contact_number" varchar(25),
	"primary_physician_id" uuid NOT NULL,
	"insurance_provider" varchar,
	"insurance_policy_number" varchar(25),
	"allergies" varchar,
	"current_medication" varchar,
	"family_medical_history" varchar,
	"past_medical_history" varchar,
	"identification_type" varchar,
	"identification_number" varchar,
	"identification_document" json DEFAULT 'null'::json,
	"treatment_consent" boolean DEFAULT false,
	"disclosure_consent" boolean DEFAULT false,
	"privacy_consent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_data_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."permission" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permission_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_nice"."patient_session" (
	"pk" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."admin" ADD CONSTRAINT "admin_admin_role_id_admin_role_pk_fk" FOREIGN KEY ("admin_role_id") REFERENCES "health_nice"."admin_role"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."admin_key" ADD CONSTRAINT "admin_key_admin_id_admin_pk_fk" FOREIGN KEY ("admin_id") REFERENCES "health_nice"."admin"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."admin_role_permission" ADD CONSTRAINT "admin_role_permission_admin_role_id_admin_role_pk_fk" FOREIGN KEY ("admin_role_id") REFERENCES "health_nice"."admin_role"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."admin_role_permission" ADD CONSTRAINT "admin_role_permission_permission_id_permission_pk_fk" FOREIGN KEY ("permission_id") REFERENCES "health_nice"."permission"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."admin_session" ADD CONSTRAINT "admin_session_admin_id_admin_pk_fk" FOREIGN KEY ("admin_id") REFERENCES "health_nice"."admin"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."doctor_session" ADD CONSTRAINT "doctor_session_doctor_id_doctor_pk_fk" FOREIGN KEY ("doctor_id") REFERENCES "health_nice"."doctor"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."patient_data" ADD CONSTRAINT "patient_data_patient_id_patient_pk_fk" FOREIGN KEY ("patient_id") REFERENCES "health_nice"."patient"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."patient_data" ADD CONSTRAINT "patient_data_primary_physician_id_doctor_pk_fk" FOREIGN KEY ("primary_physician_id") REFERENCES "health_nice"."doctor"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_nice"."patient_session" ADD CONSTRAINT "patient_session_patient_id_patient_pk_fk" FOREIGN KEY ("patient_id") REFERENCES "health_nice"."patient"("pk") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
