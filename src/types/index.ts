export type CategoryType = 'All' | 'Tools' | 'Productivity' | 'Games' | 'AI & ML' | 'Entertainment' | 'Finance' | 'Education' | 'Utilities';

export type PlatformType = 'Web' | 'Mobile' | 'Desktop' | 'CLI' | 'Extension';

export type UserRole = 'admin' | 'developer' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  loginMethod?: 'Email' | 'Google' | 'Facebook' | 'GitHub';
  role: UserRole;
  status: 'active' | 'blocked';
  developerStudioName?: string;
  joinedDate: string;
  bio?: string;
  password?: string;
  appsUploadedCount?: number;
  developerStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  developerRequestDate?: string;
  developerReason?: string;
  whatsappNumber?: string;
  developerBio?: string;
  developerWebsite?: string;
}

export interface AppReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  likes: number;
}

export interface AppVersionHistory {
  id: string;
  version: string;
  date: string;
  type?: 'Major' | 'Minor' | 'Patch' | 'Hotfix';
  whatsNew: string;
  changes?: string[];
}

export interface AppDiscussionReply {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'Developer' | 'User' | 'Tester';
  comment: string;
  createdAt: string;
}

export interface AppDiscussionItem {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'Developer' | 'User' | 'Tester';
  type: 'bug_report' | 'feature_request' | 'discussion' | 'error_log';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  codeSnippet?: string;
  deviceInfo?: string;
  replies: AppDiscussionReply[];
}

export interface DeveloperProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  joinDate: string;
  website?: string;
  github?: string;
  whatsappNumber?: string;
  verified: boolean;
  tierLevel: number; // 1 to 5
  tierTitle: string;
  reputationScore: number;
  unlockedBadges: string[];
}

export interface ProjectApp {
  id: string;
  title: string;
  tagline: string;
  developer: string;
  developerEmail?: string;
  iconUrl: string;
  bannerUrl: string;
  screenshots: string[];
  category: CategoryType;
  platform: PlatformType;
  rating: number; // e.g., 4.8
  reviewCount: number;
  downloadCount: string; // e.g. "10K+", "500+"
  downloadCountNum: number;
  size: string; // e.g., "12 MB", "Web App"
  ageRating: string; // "Everyone", "3+"
  badge?: 'Editor Choice' | 'Featured' | 'Trending' | 'Top Rated' | 'New';
  
  // Links & Purchasing
  demoUrl?: string; // Live web preview URL or embedded interactive URL
  githubUrl?: string; // GitHub repository URL
  downloadUrl?: string; // APK / release binary link
  sourceCodePrice?: string; // e.g. "Rp 150.000" or "Gratis / Open Source"
  whatsappNumber?: string; // e.g. "6281234567890"
  
  // Developer Verification & Level Badges
  developerProjectsCount?: number; // e.g. 12 uploaded apps
  developerBadge?: string; // e.g. "Master Developer", "Top Creator"
  
  description: string;
  features: string[];
  techStack: string[];
  whatsNew?: string;
  updatedDate: string;
  releaseDate?: string;
  version: string;
  
  versionHistory?: AppVersionHistory[];
  discussions?: AppDiscussionItem[];
  
  reviews: AppReview[];
  
  isInstalled?: boolean;
  isWishlisted?: boolean;
}

export interface InstallProgress {
  appId: string;
  status: 'pending' | 'downloading' | 'installing' | 'completed' | 'download_completed';
  progress: number; // 0 to 100
  downloadedMB: string;
  totalMB: string;
}
