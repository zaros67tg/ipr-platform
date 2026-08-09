export type ResearchDomain = 
  | 'Theoretical Physics'
  | 'Systems Programming'
  | 'Neuroscience'
  | 'Robotics'
  | 'Mathematics'
  | 'Artificial Intelligence'
  | 'Quantum Computing'
  | 'Philosophy of Technology'
  | 'Materials Science'
  | 'Computational Biology'
  | 'Cybersecurity'
  | 'Computer Vision';

export type VerificationStatus = 
  | 'UNVERIFIED'
  | 'COMMUNITY_VERIFIED'
  | 'INSTITUTION_VERIFIED'
  | 'RESEARCH_VERIFIED';

export type AvailabilityStatus = 'AVAILABLE' | 'SELECTIVE' | 'BUSY';

export interface ResearcherProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  title: string;
  institution?: string;
  bio: string;
  researchStatement: string;
  primaryDomains: ResearchDomain[]; // Max 3
  secondaryDomains: string[]; // Max 8
  skills: string[]; // Max 15
  techStack: string[]; // Max 15
  activeProjectsCount: number; // Max 6 active
  projectNeeds: string[];
  projectOffers: string[];
  availability: AvailabilityStatus;
  verificationStatus: VerificationStatus;
  orcid?: string;
  stats: {
    papersCount: number;
    citationsCount: number;
    reviewCredits: number;
    reviewsCompleted: number;
    forksCount: number;
  };
}

export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'equation' 
  | 'figure' 
  | 'table' 
  | 'code' 
  | 'quote' 
  | 'callout';

export interface PaperBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    latex?: string;
    codeLanguage?: string;
    repoPath?: string;
    figureCaption?: string;
    figureUrl?: string;
    headingLevel?: 1 | 2 | 3;
  };
  commentsCount: number;
}

export interface PaperVersion {
  version: string; // e.g. "v1.0.0"
  releasedAt: string;
  changelog: string;
  blocks: PaperBlock[];
}

export type PaperStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'REVISED' 
  | 'PUBLISHED' 
  | 'ARCHIVED';

export interface PaperAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  institution?: string;
}

export interface Paper {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  authors: PaperAuthor[];
  primaryDomain: ResearchDomain;
  subdomains: string[];
  keywords: string[];
  currentVersion: string;
  versions: PaperVersion[];
  status: PaperStatus;
  license: string;
  readingTimeMinutes: number;
  repositoryUrl?: string;
  datasetUrl?: string;
  codespacesUrl?: string;
  citationCount: number;
  forkCount: number;
  upvoteCount: number;
  parentPaperId?: string;
  parentPaperTitle?: string;
  parentPaperAuthors?: string;
  parentVersion?: string;
  createdAt: string;
  publishedAt: string;
  coverImage?: string;
}

export type ProjectStatus = 
  | 'IDEA' 
  | 'SEEKING_COLLABORATORS' 
  | 'ACTIVE' 
  | 'UNDER_VALIDATION' 
  | 'PUBLISHED' 
  | 'ARCHIVED';

export interface Project {
  id: string;
  slug: string;
  title: string;
  researchQuestion: string;
  description: string;
  domain: ResearchDomain;
  status: ProjectStatus;
  team: {
    id: string;
    name: string;
    avatarUrl: string;
    role: string;
  }[];
  requiredSkills: string[];
  openRoles: string[];
  repositoryUrl?: string;
  datasetUrl?: string;
  papers: {
    id: string;
    title: string;
    slug: string;
  }[];
  activityCount: number;
  createdAt: string;
}

export type Recommendation = 'ACCEPT' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'REJECT';

export interface ReviewContent {
  summary: string;
  methodology: string;
  mathematicalConcerns: string;
  technicalConcerns: string;
  codeConcerns: string;
  strengths: string;
  weaknesses: string;
  suggestions: string;
}

export interface ReviewQualityScores {
  technicalDepth: number; // percentage e.g. 92
  specificity: number;
  methodology: number;
  reproducibility: number;
}

export interface Review {
  id: string;
  paperId: string;
  paperTitle: string;
  paperSlug: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerVerification: VerificationStatus;
  wordCount: number;
  content: ReviewContent;
  recommendation: Recommendation;
  qualityScores: ReviewQualityScores;
  reviewCreditsEarned: number;
  createdAt: string;
}

export type CreditTransactionType = 
  | 'REVIEW_EARNED' 
  | 'MANUSCRIPT_SUBMISSION' 
  | 'DOI_PUBLICATION_REQUEST' 
  | 'FEATURED_PLACEMENT' 
  | 'ADMIN_ADJUSTMENT';

export interface ReviewCreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: CreditTransactionType;
  referenceId?: string;
  reason: string;
  timestamp: string;
  balanceAfter: number;
}

export type MatchStatus = 'NEW' | 'SAVED' | 'PASSED' | 'CONNECTED' | 'DECLINED' | 'COLLABORATING';

export interface MatchScoreBreakdown {
  domainComplementarity: number; // 30%
  skillComplementarity: number; // 25%
  projectNeedAlignment: number; // 20%
  researchInterest: number; // 15%
  availability: number; // 10%
}

export interface Match {
  id: string;
  candidate: ResearcherProfile;
  project?: Project;
  compatibilityScore: number;
  scoreBreakdown: MatchScoreBreakdown;
  reason: string;
  matchedSkills: string[];
  matchedDomains: string[];
  status: MatchStatus;
  createdAt: string;
}

export type PostType = 
  | 'PAPER_RELEASE' 
  | 'RESEARCH_NOTE' 
  | 'PROJECT_UPDATE' 
  | 'REVIEW_REQUEST' 
  | 'CODE_RELEASE' 
  | 'DATASET_RELEASE' 
  | 'PAPER_FORK' 
  | 'CITATION_EVENT' 
  | 'COLLABORATION_EVENT';

export interface ResearchPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  authorDomain: ResearchDomain;
  type: PostType;
  title?: string;
  content: string;
  paperId?: string;
  paperTitle?: string;
  paperSlug?: string;
  projectId?: string;
  projectTitle?: string;
  projectSlug?: string;
  tags: string[];
  upvotes: number;
  commentsCount: number;
  bookmarksCount: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  image?: string;
}

export interface Comment {
  id: string;
  targetId: string;
  targetType: 'paper' | 'block' | 'equation' | 'figure' | 'post' | 'project';
  blockId?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  upvotes: number;
  isResolved?: boolean;
  parentCommentId?: string;
  replies?: Comment[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 
    | 'REVIEW_REQUEST' 
    | 'REVIEW_COMPLETED' 
    | 'MATCH_REQUEST' 
    | 'CONNECTION_ACCEPTED' 
    | 'PAPER_CITED' 
    | 'PAPER_FORKED' 
    | 'PROJECT_INVITATION' 
    | 'COMMENT_REPLY' 
    | 'CREDIT_EARNED';
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}
