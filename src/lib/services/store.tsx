'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  Recommendation
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
import { getLivePapers } from '@/lib/actions/papers';

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
  addReviewCredit: (amount: number, reason: string, refId?: string) => void;
  deductReviewCredit: (amount: number, reason: string, refId?: string) => boolean;
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
  }) => { success: boolean; message: string; review?: Review };
  
  submitPaper: (paperData: {
    title: string;
    abstract: string;
    primaryDomain: any;
    subdomains: string[];
    keywords: string[];
    license: string;
    repositoryUrl?: string;
    datasetUrl?: string;
    contentMarkdown: string;
  }) => { success: boolean; message: string; paper?: Paper };

  forkPaper: (originalPaperId: string, changesSummary: string) => Paper | null;
  
  toggleUpvotePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  toggleBookmarkPaper: (paperId: string) => void;
  toggleBookmarkProject: (projectId: string) => void;
  
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>) => void;
  updateMatchStatus: (matchId: string, status: Match['status']) => void;
  createProject: (projectData: any) => Project;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  updateUserProfile: (updates: { name?: string; institution?: string; researchStatement?: string }) => void;

  // Helper derived stats
  unreadNotificationsCount: number;
  availableCredits: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ResearcherProfile>(CURRENT_USER);
  const [researchers, setResearchers] = useState<ResearcherProfile[]>(MOCK_RESEARCHERS);
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);

  // Load live papers from Database via Drizzle ORM
  useEffect(() => {
    getLivePapers().then(liveData => {
      if (liveData && liveData.length > 0) {
        setPapers(liveData);
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

  // Load persisted state if available
  useEffect(() => {
    try {
      const savedCredits = localStorage.getItem('ipr_credits');
      if (savedCredits) {
        const val = parseInt(savedCredits, 10);
        if (!isNaN(val)) {
          setCurrentUser(prev => ({
            ...prev,
            stats: { ...prev.stats, reviewCredits: val }
          }));
        }
      }
    } catch (e) {
      // Ignore SSR/storage errors
    }
  }, []);

  const availableCredits = currentUser.stats.reviewCredits;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const addReviewCredit = (amount: number, reason: string, refId?: string) => {
    const newBalance = currentUser.stats.reviewCredits + amount;
    const newTx: ReviewCreditTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      amount,
      type: 'REVIEW_EARNED',
      referenceId: refId,
      reason,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    setTransactions(prev => [newTx, ...prev]);
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        stats: {
          ...prev.stats,
          reviewCredits: newBalance,
          reviewsCompleted: prev.stats.reviewsCompleted + (amount > 0 ? 1 : 0)
        }
      };
      try { localStorage.setItem('ipr_credits', String(newBalance)); } catch(e){}
      return updated;
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'CREDIT_EARNED',
      title: `+${amount} Review Credit Earned`,
      message: `Reason: ${reason}. Current balance: ${newBalance} credits.`,
      link: '/reviews',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const deductReviewCredit = (amount: number, reason: string, refId?: string): boolean => {
    if (currentUser.stats.reviewCredits < amount) {
      return false; // Insufficient credits
    }
    const newBalance = currentUser.stats.reviewCredits - amount;
    const newTx: ReviewCreditTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      amount: -amount,
      type: 'MANUSCRIPT_SUBMISSION',
      referenceId: refId,
      reason,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    setTransactions(prev => [newTx, ...prev]);
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        stats: {
          ...prev.stats,
          reviewCredits: newBalance
        }
      };
      try { localStorage.setItem('ipr_credits', String(newBalance)); } catch(e){}
      return updated;
    });
    return true;
  };

  const submitReview = (reviewData: {
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
    const fullText = `${reviewData.summary} ${reviewData.methodology} ${reviewData.mathematicalConcerns} ${reviewData.technicalConcerns} ${reviewData.codeConcerns} ${reviewData.strengths} ${reviewData.weaknesses} ${reviewData.suggestions}`;
    const words = fullText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 300) {
      return {
        success: false,
        message: `Your review contains ${wordCount} words. A qualifying peer review requires a minimum of 300 words with substantive technical feedback.`
      };
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
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
      qualityScores: {
        technicalDepth: Math.floor(88 + Math.random() * 10),
        specificity: Math.floor(85 + Math.random() * 12),
        methodology: Math.floor(90 + Math.random() * 9),
        reproducibility: Math.floor(84 + Math.random() * 14)
      },
      reviewCreditsEarned: 1,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);
    addReviewCredit(1, `Completed ${wordCount}-word qualifying peer review for "${reviewData.paperTitle}"`, newReview.id);

    return {
      success: true,
      message: `Review submitted successfully! +1 Review Credit awarded. Available balance: ${currentUser.stats.reviewCredits + 1} credits.`,
      review: newReview
    };
  };

  const submitPaper = (paperData: {
    title: string;
    abstract: string;
    primaryDomain: any;
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

    // Deduct 3 credits
    deductReviewCredit(3, `Submitted manuscript "${paperData.title}" for Free Community Peer Review`);

    const slug = paperData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPaper: Paper = {
      id: `pap_${Date.now()}`,
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
      status: 'UNDER_REVIEW',
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
      message: `Manuscript submitted for community review! 3 Review Credits deducted. Remaining balance: ${availableCredits - 3} credits.`,
      paper: newPaper
    };
  };

  const forkPaper = (originalPaperId: string, changesSummary: string): Paper | null => {
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
  };

  const toggleUpvotePost = (postId: string) => {
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
  };

  const toggleBookmarkPost = (postId: string) => {
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
  };

  const toggleBookmarkPaper = (paperId: string) => {
    setBookmarks(prev => 
      prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
    );
  };

  const toggleBookmarkProject = (projectId: string) => {
    setBookmarkedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>) => {
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
  };

  const updateMatchStatus = (matchId: string, status: Match['status']) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status } : m));
  };

  const createProject = (projectData: any): Project => {
    const slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      slug,
      title: projectData.title,
      researchQuestion: projectData.researchQuestion,
      description: projectData.description,
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
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
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
        addReviewCredit,
        deductReviewCredit,
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
        updateUserProfile: (updates: { name?: string; institution?: string; researchStatement?: string }) => {
          setCurrentUser(prev => ({
            ...prev,
            name: updates.name || prev.name,
            institution: updates.institution !== undefined ? updates.institution : prev.institution,
            researchStatement: updates.researchStatement !== undefined ? updates.researchStatement : prev.researchStatement,
          }));
          setResearchers(prev => prev.map(r => r.id === currentUser.id ? {
            ...r,
            name: updates.name || r.name,
            institution: updates.institution !== undefined ? updates.institution : r.institution,
            researchStatement: updates.researchStatement !== undefined ? updates.researchStatement : r.researchStatement,
          } : r));
        },
        unreadNotificationsCount,
        availableCredits
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
