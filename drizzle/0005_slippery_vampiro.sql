CREATE TABLE "otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"email" text NOT NULL
);
