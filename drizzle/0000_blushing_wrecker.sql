CREATE TYPE "public"."availability_status" AS ENUM('AVAILABLE', 'SELECTIVE', 'BUSY');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'NEW', 'SAVED', 'PASSED', 'CONNECTED', 'COLLABORATING');--> statement-breakpoint
CREATE TYPE "public"."paper_status" AS ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISED', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" text PRIMARY KEY NOT NULL,
	"requester_id" text NOT NULL,
	"target_id" text NOT NULL,
	"status" "match_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "papers" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"author_avatar" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"abstract" text NOT NULL,
	"content_mdx" text NOT NULL,
	"primary_domain" text NOT NULL,
	"repository_url" text,
	"doi" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"reading_time_minutes" integer DEFAULT 10 NOT NULL,
	"citation_count" integer DEFAULT 0 NOT NULL,
	"fork_count" integer DEFAULT 0 NOT NULL,
	"upvote_count" integer DEFAULT 1 NOT NULL,
	"current_version" text DEFAULT 'v1.0.0' NOT NULL,
	"status" "paper_status" DEFAULT 'PUBLISHED' NOT NULL,
	"license" text DEFAULT 'CC-BY-4.0' NOT NULL,
	"parent_paper_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "papers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "peer_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"paper_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"word_count" integer NOT NULL,
	"summary" text NOT NULL,
	"methodology" text NOT NULL,
	"technical_feedback" text NOT NULL,
	"recommendation" text NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researcher_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"domains" text[] NOT NULL,
	"skills" text[] NOT NULL,
	"research_statement" text,
	"looking_for" text,
	"availability_status" "availability_status" DEFAULT 'AVAILABLE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_credits_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"type" text NOT NULL,
	"reason" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"balance_after" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "topics_name_unique" UNIQUE("name"),
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"institution" text,
	"is_academic_verified" boolean DEFAULT false NOT NULL,
	"review_credits" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_parent_paper_id_papers_id_fk" FOREIGN KEY ("parent_paper_id") REFERENCES "public"."papers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_profiles" ADD CONSTRAINT "researcher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_credits_ledger" ADD CONSTRAINT "review_credits_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "matches_requester_id_idx" ON "matches" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "matches_target_id_idx" ON "matches" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "papers_author_id_idx" ON "papers" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "papers_status_idx" ON "papers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "papers_created_at_idx" ON "papers" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "peer_reviews_paper_id_idx" ON "peer_reviews" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "peer_reviews_reviewer_id_idx" ON "peer_reviews" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "review_credits_ledger_user_id_idx" ON "review_credits_ledger" USING btree ("user_id");