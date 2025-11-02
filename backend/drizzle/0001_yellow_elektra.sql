CREATE TABLE "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"clicks" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
