import { pgTable, text, timestamp, integer, boolean, pgEnum, index } from 'drizzle-orm/pg-core';

// STRICT TYPE ENUMS FOR DATABASE INTEGRITY
export const paperStatusEnum = pgEnum('paper_status', [
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISED', 'PUBLISHED', 'ARCHIVED',
]);

export const matchStatusEnum = pgEnum('match_status', [
  'PENDING', 'ACCEPTED', 'DECLINED', 'NEW', 'SAVED', 'PASSED', 'CONNECTED', 'COLLABORATING',
]);

export const availabilityStatusEnum = pgEnum('availability_status', [
  'AVAILABLE', 'SELECTIVE', 'BUSY',
]);

// Better-Auth Core Tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  institution: text('institution'),
  isAcademicVerified: boolean('is_academic_verified').default(false).notNull(),
  reviewCredits: integer('review_credits').default(3).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// IPR Domain Tables
export const researcherProfiles = pgTable('researcher_profiles', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  domains: text('domains').array().notNull(),
  skills: text('skills').array().notNull(),
  researchStatement: text('research_statement'),
  lookingFor: text('looking_for'),
  availabilityStatus: availabilityStatusEnum('availability_status').default('AVAILABLE').notNull(),
});

export const papers = pgTable('papers', {
  id: text('id').primaryKey(),
  authorId: text('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar'),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  abstract: text('abstract').notNull(),
  contentMdx: text('content_mdx').notNull(),
  primaryDomain: text('primary_domain').notNull(),
  repositoryUrl: text('repository_url'),
  doi: text('doi'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  readingTimeMinutes: integer('reading_time_minutes').default(10).notNull(),
  citationCount: integer('citation_count').default(0).notNull(),
  forkCount: integer('fork_count').default(0).notNull(),
  upvoteCount: integer('upvote_count').default(1).notNull(),
  currentVersion: text('current_version').default('v1.0.0').notNull(),
  status: paperStatusEnum('status').default('PUBLISHED').notNull(),
  license: text('license').default('CC-BY-4.0').notNull(),
  // CRITICAL FIX: Self-referencing foreign key for paper forks
  parentPaperId: text('parent_paper_id').references(() => papers.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
}, (table) => ({
  // PERFORMANCE INDEXES - Prevents full table scans
  authorIdIdx: index('papers_author_id_idx').on(table.authorId),
  statusIdx: index('papers_status_idx').on(table.status),
  createdAtIdx: index('papers_created_at_idx').on(table.createdAt),
}));

export const reviewCreditsLedger = pgTable('review_credits_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  reason: text('reason').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  balanceAfter: integer('balance_after').notNull(),
}, (table) => ({
  userIdIdx: index('review_credits_ledger_user_id_idx').on(table.userId),
}));

export const peerReviews = pgTable('peer_reviews', {
  id: text('id').primaryKey(),
  paperId: text('paper_id').references(() => papers.id, { onDelete: 'cascade' }).notNull(),
  reviewerId: text('reviewer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  wordCount: integer('word_count').notNull(),
  summary: text('summary').notNull(),
  methodology: text('methodology').notNull(),
  technicalFeedback: text('technical_feedback').notNull(),
  recommendation: text('recommendation').notNull(),
  isVerified: boolean('is_verified').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  paperIdIdx: index('peer_reviews_paper_id_idx').on(table.paperId),
  reviewerIdIdx: index('peer_reviews_reviewer_id_idx').on(table.reviewerId),
}));

export const matches = pgTable('matches', {
  id: text('id').primaryKey(),
  requesterId: text('requester_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  targetId: text('target_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: matchStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  requesterIdIdx: index('matches_requester_id_idx').on(table.requesterId),
  targetIdIdx: index('matches_target_id_idx').on(table.targetId),
}));

export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TYPE EXPORTS
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type ResearcherProfileDB = typeof researcherProfiles.$inferSelect;
export type PaperDB = typeof papers.$inferSelect;
export type ReviewCreditsLedger = typeof reviewCreditsLedger.$inferSelect;
export type PeerReviewDB = typeof peerReviews.$inferSelect;
export type MatchDB = typeof matches.$inferSelect;
export type Topic = typeof topics.$inferSelect;