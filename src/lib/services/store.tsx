'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ResearcherProfile, 
  Paper, 
  Project, 
  Review, 
  ReviewCreditTransaction, 
  Match, 
  ResearchPost, 
  Comment,
  NotificationItem,
  Recommendation,
  ResearchDomain
} from '@/types';
import { 
  CURRENT_USER, 
  MOCK_RESEARCHERS, 
  MOCK_PAPERS, 
  MOCK_PROJECTS, 
  MOCK_REVIEWS, 
  MOCK_TRANSACTIONS, 
  MOCK_MATCHES, 
  MOCK_POSTS, 
  MOCK_COMMENTS, 
  MOCK_NOTIFICATIONS 
} from '@/lib/data/mock-data';
import { getLivePapers, submitPaper as submitPaperServerAction } from '@/lib/actions/papers';
import { submitReview as submitReviewServerAction } from '@/lib/actions/reviews';

interface ProjectInput {
  title: string;
  researchQuestion: string;
  description?: string;
  domain: ResearchDomain;
  requiredSkills?: string[];
  openRoles?: string[];
  repositoryUrl?: string;
  datasetUrl?: string;
}

interface AppContextType {
  currentUser: ResearcherProfile;
  researchers: ResearcherProfile[];
  papers: Paper[];
  projects: Project[];
  reviews: Review[];
  transactions: ReviewCreditTransaction[];
  matches: Match[];
  posts: ResearchPost[];
  comments: Comment[];
  notifications: NotificationItem[];
  bookmarks: string[]; // Paper IDs
  bookmarkedProjects: string[]; // Project IDs
  
  // Actions
  submitReview: (reviewData: {
    paperId: string;
    paperTitle: string;
    paperSlug: string;
    summary: string;
    methodology: string;
    mathematicalConcerns: string;
    technicalConcerns: string;
    codeConcerns: string;
    strengths: string;
    weaknesses: string;
    suggestions: string;
    recommendation: Recommendation;
  }) => Promise<{ success: boolean; message: string; review?: Review }>;
  
  submitPaper: (paperData: {
    title: string;
    abstract: string;
    primaryDomain: ResearchDomain;
    subdomains: string[];
    keywords: string[];
    license: string;
    repositoryUrl?: string;
    datasetUrl?: string;
    contentMarkdown: string;
  }) => Promise<{ success: boolean; message: string; paper?: Paper }>;

  forkPaper: (originalPaperId: string, changesSummary: string) => Paper | null;
  
  toggleUpvotePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  toggleBookmarkPaper: (paperId: string) => void;
  toggleBookmarkProject: (projectId: string) => void;
  
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;
  createProject: (projectData: ProjectInput) => Project;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateCurrentUserProfile: (updates: Partial<ResearcherProfile>) => void;
  
  // Helper derived stats
  unreadNotificationsCount: number;
  availableCredits: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ResearcherProfile>(CURRENT_USER);
  const [researchers, setResearchers] = useState<ResearcherProfile[]>(MOCK_RESEARCHERS);
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);

  // Load live papers from Database via Drizzle ORM.
  // FIX (split-brain): merge live DB papers with mock seed data instead of
  // replacing it, so papers referenced by reviews/comments/bookmarks survive.
  useEffect(() => {
    getLivePapers().then(liveData => {
      if (liveData && liveData.length > 0) {
        setPapers(prev => {
          const liveIds = new Set(liveData.map(p => p.id));
          const seeds = prev.filter(p => !liveIds.has(p.id));
          return [...liveData, ...seeds];
        });
      }
    }).catch(console.error);
  }, []);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [transactions, setTransactions] = useState<ReviewCreditTransaction[]>(MOCK_TRANSACTIONS);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [posts, setPosts] = useState<ResearchPost[]>(MOCK_POSTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [bookmarks, setBookmarks] = useState<string[]>(['pap_neuromorphic_stability']);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>(['proj_neuromorphic_vision']);

  const availableCredits = currentUser.stats.reviewCredits;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const submitReview = useCallback(async (reviewData: {
    paperId: string;
    paperTitle: string;
    paperSlug: string;
    summary: string;
    methodology: string;
    mathematicalConcerns: string;
    technicalConcerns: string;
    codeConcerns: string;
    strengths: string;
    weaknesses: string;
    suggestions: string;
    recommendation: Recommendation;
  }) => {
    // STRICT WORD COUNT: count real alphanumeric words, not whitespace chunks.
    // This is a UX pre-check only — the server re-counts and enforces it.
    const fullText = `${reviewData.summary} ${reviewData.methodology} ${reviewData.mathematicalConcerns} ${reviewData.technicalConcerns} ${reviewData.codeConcerns} ${reviewData.strengths} ${reviewData.weaknesses} ${reviewData.suggestions}`;
    const words = fullText.trim().match(/\b[a-zA-Z0-9]+\b/g) || [];
    const wordCount = words.length;

    if (wordCount < 300) {
      return {
        success: false,
        message: `Your review contains ${wordCount} words. A qualifying peer review requires a minimum of 300 words with substantive technical feedback.`
      };
    }

    // Map the extended feedback fields into the DB's technicalFeedback column
    const technicalFeedback = [
      reviewData.mathematicalConcerns,
      reviewData.technicalConcerns,
      reviewData.codeConcerns,
      reviewData.strengths,
      reviewData.weaknesses,
      reviewData.suggestions,
    ].filter(Boolean).join('\n\n');

    // SINGLE SOURCE OF TRUTH: persist via the authenticated server action.
    // The server validates the session, re-counts words, verifies the paper via
    // FK, and awards the credit under a row lock — then returns the
    // authoritative balance. No local credit math, no localStorage.
    const result = await submitReviewServerAction({
      paperId: reviewData.paperId,
      summary: reviewData.summary,
      methodology: reviewData.methodology,
      technicalFeedback,
      recommendation: reviewData.recommendation,
    });

    if (!result.success) {
      return { success: false, message: result.error || 'Failed to submit review.' };
    }

    const newBalance = result.newBalance!;

    const newReview: Review = {
      id: result.reviewId || `rev_${Date.now()}`,
      paperId: reviewData.paperId,
      paperTitle: reviewData.paperTitle,
      paperSlug: reviewData.paperSlug,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatarUrl,
      reviewerVerification: currentUser.verificationStatus,
      wordCount,
      content: {
        summary: reviewData.summary,
        methodology: reviewData.methodology,
        mathematicalConcerns: reviewData.mathematicalConcerns,
        technicalConcerns: reviewData.technicalConcerns,
        codeConcerns: reviewData.codeConcerns,
        strengths: reviewData.strengths,
        weaknesses: reviewData.weaknesses,
        suggestions: reviewData.suggestions
      },
      recommendation: reviewData.recommendation,
      // Deterministic quality based on review length
      qualityScores: {
        technicalDepth: Math.min(99, Math.floor((wordCount / 300) * 100)),
        specificity: Math.min(99, Math.floor((wordCount / 300) * 95)),
        methodology: Math.min(99, Math.floor((wordCount / 300) * 98)),
        reproducibility: Math.min(99, Math.floor((wordCount / 300) * 92))
      },
      reviewCreditsEarned: 1,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Local ledger mirror (display only) using the server-authoritative balance
    const newTx: ReviewCreditTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      amount: 1,
      type: 'REVIEW_EARNED',
      referenceId: newReview.id,
      reason: `Completed ${wordCount}-word qualifying peer review for "${reviewData.paperTitle}"`,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };
    setTransactions(prev => [newTx, ...prev]);

    // UI balance updates ONLY from the server's returned value
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        reviewCredits: newBalance,
        reviewsCompleted: prev.stats.reviewsCompleted + 1
      }
    }));

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'CREDIT_EARNED',
      title: '+1 Review Credit Earned',
      message: `Completed ${wordCount}-word peer review for "${reviewData.paperTitle}". Current balance: ${newBalance} credits.`,
      link: '/reviews',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      message: `Review submitted successfully! +1 Review Credit awarded. Available balance: ${newBalance} credits.`,
      review: newReview
    };
  }, [currentUser]);

  const submitPaper = useCallback(async (paperData: {
    title: string;
    abstract: string;
    primaryDomain: ResearchDomain;
    subdomains: string[];
    keywords: string[];
    license: string;
    repositoryUrl?: string;
    datasetUrl?: string;
    contentMarkdown: string;
  }) => {
    // Check credit balance >= 3 required
    if (availableCredits < 3) {
      return {
        success: false,
        message: `Insufficient Review Credits. Submitting a manuscript for community review requires at least 3 Review Credits. Available: ${availableCredits}. Please review another manuscript to earn credits.`
      };
    }

    // FIX (split-brain): persist to the database FIRST via the authenticated
    // server action, then update local React state from the source of truth.
    // The server action deducts credits inside an atomic transaction, so we
    // must NOT call deductReviewCredit here (that would double-charge).
    const result = await submitPaperServerAction({
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      title: paperData.title,
      abstract: paperData.abstract,
      contentMdx: paperData.contentMarkdown,
      primaryDomain: paperData.primaryDomain,
      repositoryUrl: paperData.repositoryUrl,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to submit manuscript.'
      };
    }

    const slug = result.slug || paperData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPaper: Paper = {
      id: result.paperId || `pap_${Date.now()}`,
      slug,
      title: paperData.title,
      abstract: paperData.abstract,
      authors: [
        {
          id: currentUser.id,
          name: currentUser.name,
          handle: currentUser.handle,
          avatarUrl: currentUser.avatarUrl,
          institution: currentUser.institution
        }
      ],
      primaryDomain: paperData.primaryDomain,
      subdomains: paperData.subdomains,
      keywords: paperData.keywords,
      currentVersion: 'v1.0.0',
      status: 'PUBLISHED',
      license: paperData.license || 'CC-BY-4.0',
      readingTimeMinutes: Math.max(5, Math.ceil(paperData.contentMarkdown.length / 800)),
      repositoryUrl: paperData.repositoryUrl,
      datasetUrl: paperData.datasetUrl,
      codespacesUrl: paperData.repositoryUrl ? `https://github.com/codespaces/new?repo=${paperData.repositoryUrl.replace('https://github.com/', '')}` : undefined,
      citationCount: 0,
      forkCount: 0,
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      versions: [
        {
          version: 'v1.0.0',
          releasedAt: new Date().toISOString(),
          changelog: 'Initial submission for peer review.',
          blocks: [
            {
              id: `b_sub_${Date.now()}_1`,
              type: 'heading',
              content: '1. Abstract & Introduction',
              metadata: { headingLevel: 1 },
              commentsCount: 0
            },
            {
              id: `b_sub_${Date.now()}_2`,
              type: 'paragraph',
              content: paperData.contentMarkdown || paperData.abstract,
              commentsCount: 0
            }
          ]
        }
      ]
    };

    setPapers(prev => [newPaper, ...prev]);

    // Sync credit balance + ledger from the server's authoritative value
    if (result.newBalance !== undefined) {
      const newTx: ReviewCreditTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.id,
        amount: -3,
        type: 'MANUSCRIPT_SUBMISSION',
        referenceId: result.paperId,
        reason: `Submitted manuscript "${paperData.title}" for Free Community Peer Review`,
        timestamp: new Date().toISOString(),
        balanceAfter: result.newBalance
      };
      setTransactions(prev => [newTx, ...prev]);
      setCurrentUser(prev => ({
        ...prev,
        stats: { ...prev.stats, reviewCredits: result.newBalance! }
      }));
    }

    // Create stream post
    const newPost: ResearchPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorHandle: currentUser.handle,
      authorDomain: currentUser.primaryDomains[0],
      type: 'REVIEW_REQUEST',
      title: `Manuscript Submitted: ${paperData.title}`,
      content: `I have submitted a new manuscript for community review in ${paperData.primaryDomain}. Abstract: ${paperData.abstract.substring(0, 240)}...`,
      paperId: newPaper.id,
      paperTitle: newPaper.title,
      paperSlug: newPaper.slug,
      tags: ['ReviewRequest', paperData.primaryDomain.replace(/\s+/g, '')],
      upvotes: 1,
      commentsCount: 0,
      bookmarksCount: 0,
      createdAt: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);

    return {
      success: true,
      message: result.message || `Manuscript submitted for community review! 3 Review Credits deducted. Remaining balance: ${result.newBalance ?? availableCredits - 3} credits.`,
      paper: newPaper
    };
  }, [availableCredits, currentUser]);

  const forkPaper = useCallback((originalPaperId: string, changesSummary: string): Paper | null => {
    const orig = papers.find(p => p.id === originalPaperId);
    if (!orig) return null;

    const newSlug = `${orig.slug}-fork-${Date.now()}`;
    const newPaper: Paper = {
      ...orig,
      id: `pap_fork_${Date.now()}`,
      slug: newSlug,
      title: `${orig.title} (Derivative Fork)`,
      authors: [
        {
          id: currentUser.id,
          name: currentUser.name,
          handle: currentUser.handle,
          avatarUrl: currentUser.avatarUrl,
          institution: currentUser.institution
        },
        ...orig.authors
      ],
      parentPaperId: orig.id,
      parentPaperTitle: orig.title,
      parentPaperAuthors: orig.authors.map(a => a.name).join(', '),
      parentVersion: orig.currentVersion,
      citationCount: 0,
      forkCount: 0,
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };

    // Increment original paper fork count
    setPapers(prev => prev.map(p => p.id === originalPaperId ? { ...p, forkCount: p.forkCount + 1 } : p).concat(newPaper));

    // Post to research stream
    const forkPost: ResearchPost = {
      id: `post_fork_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorHandle: currentUser.handle,
      authorDomain: currentUser.primaryDomains[0],
      type: 'PAPER_FORK',
      title: `Forked Research: ${orig.title}`,
      content: `Forked derivative research work from "${orig.title}" (Original Authors: ${orig.authors.map(a => a.name).join(', ')}). Fork Summary: ${changesSummary}`,
      paperId: newPaper.id,
      paperTitle: newPaper.title,
      paperSlug: newPaper.slug,
      tags: ['Fork', 'DerivativeResearch', orig.primaryDomain.replace(/\s+/g, '')],
      upvotes: 2,
      commentsCount: 0,
      bookmarksCount: 0,
      createdAt: new Date().toISOString()
    };
    setPosts(prev => [forkPost, ...prev]);

    return newPaper;
  }, [papers, currentUser]);

  const toggleUpvotePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isUp = !p.isUpvoted;
        return {
          ...p,
          isUpvoted: isUp,
          upvotes: isUp ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  }, []);

  const toggleBookmarkPost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isBm = !p.isBookmarked;
        return {
          ...p,
          isBookmarked: isBm,
          bookmarksCount: isBm ? p.bookmarksCount + 1 : p.bookmarksCount - 1
        };
      }
      return p;
    }));
  }, []);

  const toggleBookmarkPaper = useCallback((paperId: string) => {
    setBookmarks(prev => 
      prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
    );
  }, []);

  const toggleBookmarkProject = useCallback((projectId: string) => {
    setBookmarkedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  }, []);

  const addComment = useCallback((commentData: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c_${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0
    };
    setComments(prev => [newComment, ...prev]);

    // Update block comment count if applicable
    if (commentData.targetType === 'block' || commentData.targetType === 'equation') {
      setPapers(prev => prev.map(pap => {
        if (pap.id === commentData.targetId) {
          const updatedVersions = pap.versions.map(v => ({
            ...v,
            blocks: v.blocks.map(b => b.id === commentData.blockId ? { ...b, commentsCount: b.commentsCount + 1 } : b)
          }));
          return { ...pap, versions: updatedVersions };
        }
        return pap;
      }));
    }
  }, []);

  const updateMatchStatus = useCallback((matchId: string, status: Match['status']) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));
  }, []);

  const createProject = useCallback((projectData: ProjectInput): Project => {
    const slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      slug,
      title: projectData.title,
      researchQuestion: projectData.researchQuestion,
      description: projectData.description ?? '',
      domain: projectData.domain,
      status: 'SEEKING_COLLABORATORS',
      team: [
        { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl, role: 'Lead Architect' }
      ],
      requiredSkills: projectData.requiredSkills || [],
      openRoles: projectData.openRoles || [],
      repositoryUrl: projectData.repositoryUrl,
      datasetUrl: projectData.datasetUrl,
      papers: [],
      activityCount: 1,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  }, [currentUser]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const updateCurrentUserProfile = useCallback((updates: Partial<ResearcherProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setResearchers(prev => prev.map(r => r.id === currentUser.id ? { ...r, ...updates } : r));
  }, [currentUser.id]);

  // MEMOIZE CONTEXT: prevent the entire app from re-rendering on a single state change
  const contextValue = useMemo(() => ({
    currentUser,
    researchers,
    papers,
    projects,
    reviews,
    transactions,
    matches,
    posts,
    comments,
    notifications,
    bookmarks,
    bookmarkedProjects,
    submitReview,
    submitPaper,
    forkPaper,
    toggleUpvotePost,
    toggleBookmarkPost,
    toggleBookmarkPaper,
    toggleBookmarkProject,
    addComment,
    updateMatchStatus,
    createProject,
    markNotificationRead,
    markAllNotificationsRead,
    updateCurrentUserProfile,
    unreadNotificationsCount,
    availableCredits
  }), [
    currentUser,
    researchers,
    papers,
    projects,
    reviews,
    transactions,
    matches,
    posts,
    comments,
    notifications,
    bookmarks,
    bookmarkedProjects,
    submitReview,
    submitPaper,
    forkPaper,
    toggleUpvotePost,
    toggleBookmarkPost,
    toggleBookmarkPaper,
    toggleBookmarkProject,
    addComment,
    updateMatchStatus,
    createProject,
    markNotificationRead,
    markAllNotificationsRead,
    updateCurrentUserProfile,
    unreadNotificationsCount,
    availableCredits
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
