import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ProjectApp, AppReview, InstallProgress, AppVersionHistory, AppDiscussionItem, AppDiscussionReply, UserAccount } from '../types';
import {
  X,
  Star,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Play,
  Github,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  MessageCircle,
  ShoppingBag,
  Layers,
  Calendar,
  Smartphone,
  Laptop,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ArrowRight,
  Info,
  MoreVertical,
  Gamepad2,
  Shield,
  Lock,
  Check,
  Award,
  Crown,
  Trophy,
  Zap,
  BadgeCheck,
  Medal,
  Code,
  Edit3,
  Bug,
  AlertTriangle,
  Send,
  History,
  UserCheck,
  Plus,
  Terminal,
  FileCode,
  Trash2
} from 'lucide-react';

export interface DevBadgeTier {
  level: number;
  badgeTitle: string;
  badgeSubtitle: string;
  minProjects: number;
  nextProjects: number;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  colorBadgeBg: string;
  perks: string[];
}

export function getDeveloperTier(projectCount: number = 5): DevBadgeTier {
  if (projectCount >= 20) {
    return {
      level: 5,
      badgeTitle: 'Legendary Studio',
      badgeSubtitle: 'Tingkat Tertinggi (20+ Project Uploaded)',
      minProjects: 20,
      nextProjects: 50,
      colorBg: 'bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600',
      colorText: 'text-amber-300',
      colorBorder: 'border-amber-400/50',
      colorBadgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      perks: ['Verified Gold Badge', 'Prioritas Utama Showcase', 'Bebas Biaya Platform', 'Direct WhatsApp Contact VIP']
    };
  } else if (projectCount >= 10) {
    return {
      level: 4,
      badgeTitle: 'Master Developer',
      badgeSubtitle: 'Pengembang Handal (10 - 19 Project Uploaded)',
      minProjects: 10,
      nextProjects: 20,
      colorBg: 'bg-gradient-to-r from-emerald-600 to-teal-700',
      colorText: 'text-emerald-300',
      colorBorder: 'border-emerald-400/50',
      colorBadgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      perks: ['Verified Badge', 'Editor Choice Priority', 'Featured App Rank', 'WhatsApp Direct Link']
    };
  } else if (projectCount >= 5) {
    return {
      level: 3,
      badgeTitle: 'Top Creator',
      badgeSubtitle: 'Kreator Produktif (5 - 9 Project Uploaded)',
      minProjects: 5,
      nextProjects: 10,
      colorBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      colorText: 'text-blue-300',
      colorBorder: 'border-blue-400/50',
      colorBadgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
      perks: ['Verified Badge', 'Trending Priority', 'Statistik Lanjutan']
    };
  } else if (projectCount >= 3) {
    return {
      level: 2,
      badgeTitle: 'Rising Star',
      badgeSubtitle: 'Pengembang Berbakat (3 - 4 Project Uploaded)',
      minProjects: 3,
      nextProjects: 5,
      colorBg: 'bg-gradient-to-r from-violet-600 to-purple-700',
      colorText: 'text-violet-300',
      colorBorder: 'border-violet-400/50',
      colorBadgeBg: 'bg-violet-50 text-violet-800 border-violet-300',
      perks: ['Verified Badge', 'Dukungan Portofolio']
    };
  } else {
    return {
      level: 1,
      badgeTitle: 'Junior Creator',
      badgeSubtitle: 'Pengembang Baru (1 - 2 Project Uploaded)',
      minProjects: 1,
      nextProjects: 3,
      colorBg: 'bg-gradient-to-r from-slate-700 to-slate-900',
      colorText: 'text-slate-300',
      colorBorder: 'border-slate-500/50',
      colorBadgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      perks: ['Verified Badge']
    };
  }
}

interface AppDetailModalProps {
  app: ProjectApp | null;
  currentUser?: UserAccount | null;
  installProgress?: InstallProgress;
  onClose: () => void;
  onOpenLiveDemo: (app: ProjectApp) => void;
  onToggleInstall: (app: ProjectApp) => void;
  onToggleWishlist: (app: ProjectApp) => void;
  onAddReview: (appId: string, review: Omit<AppReview, 'id' | 'date' | 'likes'>) => void;
  onEditProject?: (app: ProjectApp) => void;
  onOpenDevProfile?: (developerName: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  currentUser,
  installProgress,
  onClose,
  onOpenLiveDemo,
  onToggleInstall,
  onToggleWishlist,
  onAddReview,
  onEditProject,
  onOpenDevProfile
}) => {
  const isDevOrAdmin = Boolean(
    currentUser && (currentUser.role === 'developer' || currentUser.role === 'admin' || currentUser.developerStatus === 'approved')
  );

  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'changelog' | 'discussions' | 'reviews'>('overview');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Screenshots Gallery scroll ref
  const screenshotScrollRef = useRef<HTMLDivElement>(null);

  const scrollScreenshots = (direction: 'left' | 'right') => {
    if (screenshotScrollRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      screenshotScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Compute screenshots list with rich fallbacks so every app has vertical phone mockups
  const appScreenshots = useMemo(() => {
    const existing = app?.screenshots && app.screenshots.length > 0 ? app.screenshots : [];

    const fallbacksByCategory: Record<string, string[]> = {
      'AI & ML': [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
      ],
      'Tools': [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80'
      ],
      'Productivity': [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
      ],
      'Games': [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
      ],
      'Finance': [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
      ]
    };

    const catKey = app?.category || 'Tools';
    const pool = fallbacksByCategory[catKey] || [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ];

    const combined = [...existing];
    for (const url of pool) {
      if (combined.length < 4 && !combined.includes(url)) {
        combined.push(url);
      }
    }
    return combined;
  }, [app]);
  
  // Play Store exact states
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [votedHelpful, setVotedHelpful] = useState<Record<string, 'ya' | 'tidak'>>({});
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDevBadgeModal, setShowDevBadgeModal] = useState(false);

  // Version History Timeline state
  const defaultHistory: AppVersionHistory[] = [
    {
      id: 'vh-current',
      version: app?.version ? `v${app.version}` : 'v2.1.0',
      date: app?.updatedDate || '1 Agustus 2026',
      type: 'Major',
      whatsNew: app?.whatsNew || 'Pembaruan arsitektur sistem, peningkatan performa UI, dan perbaikan bug.',
      changes: [
        'Optimasi kecepatan loading halaman & kompresi aset',
        'Pembaruan kompatibilitas browser modern',
        'Perbaikan isu navigasi dan respon touch di layar mobile'
      ]
    },
    {
      id: 'vh-init',
      version: 'v1.0.0',
      date: app?.releaseDate || '24 Sep 2024',
      type: 'Patch',
      whatsNew: 'Rilis versi perdana ke Valora Store.',
      changes: [
        'Peluncuran pertama aplikasi di Valora Store',
        'Fitur utama dan integrasi dasar'
      ]
    }
  ];

  const [versionHistoryList, setVersionHistoryList] = useState<AppVersionHistory[]>(
    app?.versionHistory && app.versionHistory.length > 0 ? app.versionHistory : defaultHistory
  );
  const [isFetchingGithubHistory, setIsFetchingGithubHistory] = useState(false);

  useEffect(() => {
    if (app?.githubUrl) {
      const match = app.githubUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
      if (match) {
        setIsFetchingGithubHistory(true);
        const [, owner, repo] = match;
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              const history = data.map(release => {
                // Determine release type based on tag
                let type: any = 'Minor';
                if (release.tag_name?.endsWith('.0.0')) type = 'Major';
                else if (release.tag_name?.includes('-')) type = 'Hotfix';
                
                return {
                  id: `gh-${release.id}`,
                  version: release.tag_name || 'v1.0.0',
                  date: new Date(release.published_at || release.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  type,
                  whatsNew: release.name || `Rilis ${release.tag_name}`,
                  changes: (release.body || '').split('\n').map((s: string) => s.trim().replace(/^[-*]\s*/, '')).filter(Boolean)
                };
              });
              setVersionHistoryList(history);
            }
          })
          .catch(() => {})
          .finally(() => setIsFetchingGithubHistory(false));
      }
    }
  }, [app?.githubUrl]);


  // Latest active version derived directly from versionHistoryList for total synchronization
  const latestVersionItem = useMemo(() => {
    if (versionHistoryList && versionHistoryList.length > 0) {
      return versionHistoryList[0];
    }
    return {
      id: 'vh-fallback',
      version: app?.version ? (app.version.startsWith('v') ? app.version : `v${app.version}`) : 'v1.0.0',
      date: app?.updatedDate || 'Terbaru',
      type: 'Major' as const,
      whatsNew: app?.whatsNew || `Versi ${app?.version || '1.0.0'}: Pembaruan stabilitas sistem, perbaikan bug minor, dan optimasi performa antarmuka pengguna.`,
      changes: ['Perbaikan Bug & Stabilitas', 'Optimasi Performa', 'Keamanan Ditingkatkan']
    };
  }, [versionHistoryList, app]);

  const [showAddVersion, setShowAddVersion] = useState(false);
  const [verNum, setVerNum] = useState('');
  const [verDate, setVerDate] = useState('Hari ini');
  const [verType, setVerType] = useState<'Major' | 'Minor' | 'Patch' | 'Hotfix'>('Minor');
  const [verWhatsNew, setVerWhatsNew] = useState('');
  const [verChangesStr, setVerChangesStr] = useState('');

  // Discussions – load dari Firestore (app.discussions), tanpa data dummy
  const [discussionsList, setDiscussionsList] = useState<AppDiscussionItem[]>(
    app?.discussions && app.discussions.length > 0 ? app.discussions : []
  );

  // Sync ke Firestore setiap kali discussionsList berubah (tapi bukan pada mount awal)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!app?.id) return;
    updateDoc(doc(db, 'apps', app.id), { discussions: discussionsList }).catch(() => {});
  }, [discussionsList]);


  const [discFilter, setDiscFilter] = useState<'all' | 'bug_report' | 'feature_request' | 'discussion' | 'error_log'>('all');
  const [showNewDiscForm, setShowNewDiscForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'bug_report' | 'feature_request' | 'discussion' | 'error_log'>('bug_report');
  const [newCode, setNewCode] = useState('');
  const [newDevice, setNewDevice] = useState('');

  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verNum.trim() || !verWhatsNew.trim()) return;

    const changesArray = verChangesStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newVh: AppVersionHistory = {
      id: `vh-${Date.now()}`,
      version: verNum.startsWith('v') ? verNum : `v${verNum}`,
      date: verDate || 'Hari ini',
      type: verType,
      whatsNew: verWhatsNew,
      changes: changesArray.length > 0 ? changesArray : ['Perbaikan stabilitas sistem & optimasi performa.']
    };

    setVersionHistoryList([newVh, ...versionHistoryList]);
    setVerNum('');
    setVerWhatsNew('');
    setVerChangesStr('');
    setShowAddVersion(false);
  };

  const handleAddDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    if (!currentUser) {
      alert('Anda harus login terlebih dahulu untuk membuat diskusi.');
      return;
    }

    const authorRole: 'Developer' | 'User' | 'Tester' =
      currentUser.role === 'developer' || currentUser.role === 'admin' ? 'Developer' : 'User';

    const newDisc: AppDiscussionItem = {
      id: `disc-${Date.now()}`,
      title: newTitle,
      content: newContent,
      authorName: currentUser.name || 'Pengguna Valora',
      authorAvatar: currentUser.avatarUrl || undefined,
      authorRole,
      type: newType,
      status: 'open',
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      codeSnippet: newCode.trim() || undefined,
      deviceInfo: newDevice.trim() || undefined,
      replies: []
    };

    setDiscussionsList([newDisc, ...discussionsList]);
    setNewTitle('');
    setNewContent('');
    setNewCode('');
    setNewDevice('');
    setShowNewDiscForm(false);
  };

  const handleAddReplySubmit = (discId: string) => {
    if (!currentUser) {
      alert('Anda harus login terlebih dahulu untuk membalas diskusi.');
      return;
    }
    if (!isDevOrAdmin) {
      alert('Hanya Developer atau Admin yang dapat membalas diskusi.');
      return;
    }
    if (!replyText.trim()) return;

    const newReply: AppDiscussionReply = {
      id: `rep-${Date.now()}`,
      authorName: currentUser.developerStudioName || currentUser.name || app?.developer || 'Developer Official',
      authorAvatar: currentUser.avatarUrl || undefined,
      authorRole: 'Developer',
      comment: replyText.trim(),
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    setDiscussionsList(
      discussionsList.map((d) =>
        d.id === discId ? { ...d, replies: [...d.replies, newReply] } : d
      )
    );

    setReplyText('');
    setReplyingId(null);
  };

  if (!app) return null;

  // Normalisasi data dari Firestore agar tidak crash jika field array kosong/undefined
  const safeApp = {
    ...app,
    techStack: app.techStack || [],
    features: app.features || [],
    reviews: app.reviews || [],
    screenshots: app.screenshots || [],
    downloadCountNum: app.downloadCountNum ?? 0,
    downloadCount: app.downloadCount || '0',
  };

  const projectCount = app.developerProjectsCount || 12;
  const devTier = getDeveloperTier(projectCount);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const computedName = currentUser ? currentUser.name : userName.trim();
    if (!computedName) {
      alert("Masukkan nama Anda terlebih dahulu.");
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      onAddReview(app.id, {
        userName: computedName,
        userAvatar: currentUser?.avatarUrl || undefined,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setUserName('');
      setIsSubmittingReview(false);
      setShowWriteReview(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start sm:py-6 p-0 md:p-4 animate-in fade-in duration-200">
      
      {/* Container - Play Store Sheet Layout */}
      <div className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto border border-gray-100">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
            title="Kembali"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {isDevOrAdmin && onEditProject && (
              <button
                onClick={() => onEditProject(app)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Atur / Edit Detail Informasi Aplikasi"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Atur Detail</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition-colors relative"
              title="Bagikan Link App"
            >
              <Share2 className="w-5 h-5" />
              {copiedShare && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                  Link tersalin!
                </span>
              )}
            </button>

            <button
              onClick={() => onToggleWishlist(app)}
              className={`p-2 rounded-full transition-colors ${
                app.isWishlisted ? 'text-amber-500 bg-amber-50' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={app.isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
            >
              {app.isWishlisted ? <BookmarkCheck className="w-5 h-5 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[85vh]">
          
          {/* Main App Overview Header */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="relative w-22 h-22 sm:w-28 sm:h-28 shrink-0">
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/90 shadow-md relative">
                <img
                  src={app.iconUrl}
                  alt={app.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Clean Progress Badge on Icon during download */}
                {installProgress && (
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-xs p-1 text-center border-t border-emerald-500/40">
                    <span className="text-[10px] font-extrabold text-emerald-400 block leading-none">
                      {Math.round(installProgress.progress)}%
                    </span>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-150"
                        style={{ width: `${Math.min(100, Math.max(3, installProgress.progress))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {app.category}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  {app.platform === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-gray-500" /> : <Laptop className="w-3.5 h-3.5 text-gray-500" />}
                  {app.platform}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {app.title}
              </h1>

              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <button
                  type="button"
                  onClick={() => onOpenDevProfile?.(app.developer)}
                  className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                  title="Lihat Portofolio Lengkap Developer"
                >
                  <span>{app.developer}</span>
                  <ShieldCheck className="w-4 h-4 fill-emerald-600 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDevProfile?.(app.developer)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/90 hover:bg-emerald-100 transition-colors cursor-pointer group shadow-2xs"
                  title="Lihat Profil & Portofolio Pengembang"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                  <span>{devTier.badgeTitle}</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-black">
                    {projectCount} Project
                  </span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed pt-0.5">
                {app.tagline}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (Rating, Reviews, Downloads, Age Rating, Size) */}
          <div className="grid grid-cols-4 divide-x divide-gray-200 border-y border-gray-200/80 py-3.5 text-center bg-gray-50/50 rounded-2xl">
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 font-extrabold text-gray-900 text-xs sm:text-base">
                <span>{app.rating}</span>
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{app.reviewCount} ulasan</p>
            </div>

            <div className="px-1">
              <div className="font-extrabold text-gray-900 text-xs sm:text-base">{app.downloadCount}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Pengujian</p>
            </div>

            <div className="px-1">
              <div className="font-extrabold text-gray-900 text-xs sm:text-base">{app.size}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Ukuran App</p>
            </div>

            <div className="px-1">
              <div className="font-extrabold text-gray-900 text-xs sm:text-base">{app.ageRating}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">Rating Usia</p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto no-scrollbar pt-2">
            <button
              onClick={() => setActiveMainTab('overview')}
              className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative whitespace-nowrap cursor-pointer ${
                activeMainTab === 'overview'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ikhtisar & Detail
            </button>
            <button
              onClick={() => setActiveMainTab('changelog')}
              className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'changelog'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Versi</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black">
                {versionHistoryList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveMainTab('discussions')}
              className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'discussions'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Diskusi & Bug Report</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black">
                {discussionsList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveMainTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-extrabold transition-all relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'reviews'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ulasan ({app.reviews.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & DETAILS */}
          {activeMainTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* CTA Action Buttons - Play Store Installation Container */}
          <div className="w-full">
            {installProgress ? (
              installProgress.status === 'download_completed' ? (
                <div className="w-full bg-emerald-50 text-gray-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs border border-emerald-250 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-gray-900">Unduhan Selesai!</p>
                      <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
                        Berkas APK siap dipasang di simulator.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleInstall(app)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => onToggleInstall(app)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-97 flex items-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Download className="w-4 h-4" />
                      Pasang Aplikasi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-emerald-50 text-gray-900 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs border border-emerald-200 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0">
                        {installProgress.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {installProgress.status === 'pending' && 'Menyiapkan pengunduhan berkas...'}
                          {installProgress.status === 'downloading' && `Mendownload ${installProgress.downloadedMB} / ${installProgress.totalMB}`}
                          {installProgress.status === 'installing' && 'Memasang paket ke simulator...'}
                          {installProgress.status === 'completed' && 'Instalasi selesai!'}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-semibold truncate">
                          {installProgress.status === 'downloading' ? 'Mengunduh paket resmi via Valora Engine' : 'Terverifikasi aman & bebas malware'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                        {Math.round(installProgress.progress)}%
                      </span>
                      <button
                        onClick={() => onToggleInstall(app)}
                        className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>

                  {/* High precision Progress Bar */}
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-gray-300">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-150 shadow-2xs"
                      style={{ width: `${Math.min(100, Math.max(3, installProgress.progress))}%` }}
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                {app.isInstalled ? (
                  <button
                    onClick={() => onToggleInstall(app)}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-extrabold text-xs transition-all border border-gray-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Terinstall</span>
                    <span className="text-[10px] text-gray-400 font-normal">(Copot)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleInstall(app)}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Install App ({app.size})</span>
                  </button>
                )}

                {/* GitHub & Direct Link Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 justify-end">
                  {app.githubUrl && (
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors border border-gray-200/80 flex items-center justify-center"
                      title="Lihat Source Code di GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  {app.downloadUrl && (
                    <a
                      href={app.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors border border-gray-200/80 flex items-center justify-center"
                      title="Unduh File Installer Direct"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Buy Source Code via WhatsApp Card */}
          {(() => {
            const waNumber = (app.whatsappNumber || '6281234567890').replace(/[^0-9]/g, '');
            const waPrice = app.sourceCodePrice || 'Rp 150.000';
            const waMessage = encodeURIComponent(
              `Halo ${app.developer}, saya tertarik membeli Source Code / Lisensi aplikasi *${app.title}* (${waPrice}) yang ada di ValoraStore. Boleh minta rincian transaksi dan pengirimannya?`
            );
            const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

            return (
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-emerald-500/30 shadow-md">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        Lisensi & Source Code
                      </span>
                      <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                        {waPrice}
                      </span>
                    </div>
                    <p className="text-sm font-extrabold text-white">Beli Source Code Resmi via WhatsApp</p>
                    <p className="text-xs text-gray-300 font-normal">Full repository, dokumentasi instalasi, & lisensi komersial langsung dari pengembang.</p>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Beli via WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            );
          })()}

          {/* What's New / Yang Baru Section - Synchronized with Version History */}
          <div className="space-y-3 pt-4 border-t border-gray-200/80">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Yang Baru</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
                  {latestVersionItem.version.startsWith('v') ? latestVersionItem.version : `v${latestVersionItem.version}`}
                </span>
                {latestVersionItem.type && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                    {latestVersionItem.type}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {latestVersionItem.date}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMainTab('changelog')}
                  className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Riwayat Versi ({versionHistoryList.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Catatan Rilis & Pembaruan Terbaru</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                  CHANGELOG
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                {latestVersionItem.whatsNew}
              </p>

              {/* Quick Update Bullet Tags / Rincian Perubahan */}
              {latestVersionItem.changes && latestVersionItem.changes.length > 0 ? (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {latestVersionItem.changes.map((chg, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{chg}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Perbaikan Bug & Stabilitas
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Optimasi Performa
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Keamanan Ditingkatkan
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Play Store Category Tags & Badges */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shrink-0 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              #1 gratis - populer di {app.category.toLowerCase()}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold shrink-0">
              {app.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold shrink-0">
              {app.platform} App
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold shrink-0">
              Widget & Tools
            </span>
          </div>

          {/* PLAY STORE SCREENSHOTS GALLERY / FOTO-FOTO TAMPILAN DALAM APLIKASI */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Foto & Cuplikan Tampilan Dalam Aplikasi</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium pt-0.5">
                  Tampilan antarmuka asli {app.title} (Klik foto untuk memperbesar)
                </p>
              </div>

              {/* Scroll Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => scrollScreenshots('left')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200 cursor-pointer"
                  title="Geser Kiri"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollScreenshots('right')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200 cursor-pointer"
                  title="Geser Kanan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Screenshots Horizontal Scroll Container */}
            <div
              ref={screenshotScrollRef}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 scroll-smooth"
            >
              {appScreenshots.map((shotUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveScreenshot(shotUrl)}
                  className="group relative shrink-0 w-[150px] sm:w-[180px] aspect-[9/16] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all cursor-pointer bg-gray-100"
                >
                  <img
                    src={shotUrl}
                    alt={`Cuplikan layar ${app.title} ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover Overlay for previewing */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About this app */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Tentang Aplikasi Ini
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {app.tagline}
                </p>
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById('full-app-description');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
                title="Lihat Rincian Selengkapnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-normal">
              {app.description}
            </p>

            {/* Key Features Bullet Points */}
            {safeApp.features && safeApp.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Fitur Utama Project:
                </h3>
                <ul className="space-y-2">
                  {safeApp.features.map((feat, i) => (
                    <li key={i} className="text-xs sm:text-sm text-gray-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Teknologi yang Digunakan (Tech Stack):
              </h3>
              <div className="flex flex-wrap gap-2">
                {safeApp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

          {/* TAB 2: RIWAYAT VERSI & CHANGELOG TIMELINE */}
          {activeMainTab === 'changelog' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-600" />
                    <span>Riwayat Versi & Timeline Updates</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Daftar rilis versi, changelog lengkap, dan pembaruan {app.title}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {app?.githubUrl && (
                    <div className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-[10px] font-extrabold flex items-center gap-1.5 shrink-0">
                      <Github className="w-3.5 h-3.5" />
                      {isFetchingGithubHistory ? 'Syncing GitHub...' : 'Synced with GitHub'}
                    </div>
                  )}

                  {isDevOrAdmin && !app?.githubUrl && (
                    <button
                      onClick={() => setShowAddVersion(!showAddVersion)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddVersion ? 'Batal' : 'Catat Versi Baru'}</span>
                    </button>
                  )}
                </div>
              </div>


              {/* Form Add Version */}
              {isDevOrAdmin && showAddVersion && (
                <form onSubmit={handleAddVersionSubmit} className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2">
                  <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Tambah Catatan Rilis Versi Baru</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Versi *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: v2.2.0"
                        value={verNum}
                        onChange={(e) => setVerNum(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Rilis</label>
                      <input
                        type="text"
                        placeholder="Contoh: 15 Agustus 2026"
                        value={verDate}
                        onChange={(e) => setVerDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Rilis</label>
                      <select
                        value={verType}
                        onChange={(e) => setVerType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      >
                        <option value="Major">Major (Fitur Besar)</option>
                        <option value="Minor">Minor (Pengembangan)</option>
                        <option value="Patch">Patch (Perbaikan Bug)</option>
                        <option value="Hotfix">Hotfix (Urgent Fix)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ringkasan Pembaruan (Whats New) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ringkasan singkat perubahan utama..."
                      value={verWhatsNew}
                      onChange={(e) => setVerWhatsNew(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Daftar Rincian Perubahan (1 per baris)</label>
                    <textarea
                      rows={3}
                      placeholder="- Perbaikan bug login\n- Optimasi loading\n- Dukungan mode offline"
                      value={verChangesStr}
                      onChange={(e) => setVerChangesStr(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddVersion(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-2xs"
                    >
                      Simpan Rilis Versi
                    </button>
                  </div>
                </form>
              )}

              {/* Version History Timeline */}
              <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
                {versionHistoryList.map((item, idx) => {
                  const isCurrent = idx === 0;
                  const typeBadgeColors = {
                    Major: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    Minor: 'bg-blue-100 text-blue-800 border-blue-300',
                    Patch: 'bg-amber-100 text-amber-800 border-amber-300',
                    Hotfix: 'bg-rose-100 text-rose-800 border-rose-300'
                  }[item.type || 'Minor'];

                  return (
                    <div key={item.id} className="relative group">
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isCurrent
                            ? 'bg-emerald-600 border-emerald-200 ring-4 ring-emerald-100'
                            : 'bg-white border-emerald-400'
                        }`}
                      >
                        {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 space-y-3 shadow-xs hover:border-emerald-300 transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                              {item.version}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-600 text-white">
                                Versi Aktif
                              </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${typeBadgeColors}`}>
                              {item.type || 'Minor'} Release
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {item.date}
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                          <span className="font-extrabold text-emerald-950 block mb-0.5">Catatan Rilis Singkat:</span>
                          {item.whatsNew}
                        </div>

                        {item.changes && item.changes.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rincian Perubahan:</span>
                            <ul className="space-y-1">
                              {item.changes.map((chg, i) => (
                                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{chg}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DISKUSI & PELAPORAN ERROR (BUG REPORT) */}
          {activeMainTab === 'discussions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span>Forum Diskusi & Pelaporan Error (Bug Report)</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Wadah interaksi pengguna, tester, dan dev untuk konsultasi & laporan bug {app.title}
                  </p>
                </div>

                <button
                  onClick={() => setShowNewDiscForm(!showNewDiscForm)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNewDiscForm ? 'Tutup Form' : 'Buat Topik / Laporkan Bug'}</span>
                </button>
              </div>

              {/* Topic Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'Semua Topik', icon: MessageSquare },
                  { id: 'bug_report', label: 'Bug & Error', icon: Bug },
                  { id: 'feature_request', label: 'Saran Fitur', icon: Zap },
                  { id: 'discussion', label: 'Diskusi Umum', icon: MessageCircle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = discFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDiscFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form New Discussion / Bug Report */}
              {showNewDiscForm && (
                <form onSubmit={handleAddDiscussionSubmit} className="bg-white text-gray-900 border border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <h3 className="text-sm font-extrabold text-emerald-800 flex items-center gap-2">
                      <Bug className="w-4 h-4 text-emerald-600" />
                      <span>Form Diskusi / Pelaporan Kendala Teknis</span>
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">Valora Dev Network</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-800 mb-1">Judul Topik / Error *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Error saat klik tombol cetak laporan"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Kategori Topik *</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-all"
                      >
                        <option value="bug_report">Laporan Bug / Error</option>
                        <option value="feature_request">Saran Fitur Baru</option>
                        <option value="discussion">Diskusi Umum</option>
                        <option value="error_log">Log Error System</option>
                      </select>
                    </div>
                  </div>

                  {/* Automatic Account Identity Banner */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold text-gray-600">Pelapor Otomatis:</span>
                      <span className="font-extrabold text-gray-900">{currentUser?.name || 'Pengguna Valora'}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-200 text-emerald-900 uppercase tracking-wide">
                      Peran: {currentUser?.role === 'developer' || currentUser?.role === 'admin' ? 'Developer' : 'User'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">Deskripsi & Langkah Reproduksi Error *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Jelaskan secara detail apa yang terjadi, langkah menuju error, dan ekspektasi..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-all placeholder:text-gray-400 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Potongan Code / Error Log (Opsional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="TypeError: Cannot read properties of undefined..."
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-emerald-800 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Perangkat / Browser (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Windows 11 / Chrome v126"
                        value={newDevice}
                        onChange={(e) => setNewDevice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowNewDiscForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      Kirim Topik / Laporan Bug
                    </button>
                  </div>
                </form>
              )}

              {/* Discussions Threads List */}
              <div className="space-y-4">
                {discussionsList
                  .filter((item) => discFilter === 'all' || item.type === discFilter)
                  .map((disc) => {
                    const typeLabels = {
                      bug_report: { text: 'Bug Report', color: 'bg-rose-100 text-rose-800 border-rose-200' },
                      feature_request: { text: 'Saran Fitur', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                      discussion: { text: 'Diskusi', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                      error_log: { text: 'Error Log', color: 'bg-amber-100 text-amber-800 border-amber-200' }
                    }[disc.type];

                    const statusBadges = {
                      resolved: { text: 'Resolved (Selesai)', color: 'bg-emerald-100 text-emerald-800' },
                      investigating: { text: 'Investigating (Ditinjau)', color: 'bg-amber-100 text-amber-800' },
                      open: { text: 'Open (Terbuka)', color: 'bg-blue-100 text-blue-800' }
                    }[disc.status || 'open'];

                    return (
                      <div key={disc.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            {disc.authorAvatar ? (
                              <img
                                src={disc.authorAvatar}
                                alt={disc.authorName}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0">
                                {disc.authorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-black text-gray-900">{disc.authorName}</span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
                                    disc.authorRole === 'Developer'
                                      ? 'bg-emerald-600 text-white'
                                      : disc.authorRole === 'Tester'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {disc.authorRole}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-medium">{disc.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeLabels.color}`}>
                              {typeLabels.text}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${statusBadges.color}`}>
                              {statusBadges.text}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">{disc.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">{disc.content}</p>
                        </div>

                        {disc.codeSnippet && (
                          <div className="bg-slate-950 text-emerald-400 rounded-xl p-3 text-xs font-mono overflow-x-auto border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans border-b border-slate-800 pb-1 mb-1">
                              <span className="flex items-center gap-1">
                                <Terminal className="w-3 h-3 text-emerald-400" /> Potongan Kode / Stack trace:
                              </span>
                            </div>
                            <pre>{disc.codeSnippet}</pre>
                          </div>
                        )}

                        {disc.deviceInfo && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                            <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                            <span>Perangkat: <b>{disc.deviceInfo}</b></span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-100 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tanggapan ({disc.replies.length})</span>
                            </span>

                            {isDevOrAdmin ? (
                              <button
                                onClick={() => setReplyingId(replyingId === disc.id ? null : disc.id)}
                                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Balas Topik (Dev / Admin)</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                                🔒 Balasan khusus Developer & Admin
                              </span>
                            )}
                          </div>

                          {disc.replies.map((reply) => {
                            const isDevReply = reply.authorRole === 'Developer';
                            return (
                              <div
                                key={reply.id}
                                className={`p-3 rounded-xl space-y-1 border ${
                                  isDevReply
                                    ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
                                    : 'bg-gray-50 border-gray-200/80 text-gray-800'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                    {reply.authorAvatar ? (
                                      <img
                                        src={reply.authorAvatar}
                                        alt={reply.authorName}
                                        className="w-5 h-5 rounded-full object-cover border border-gray-200 shrink-0"
                                      />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[9px] flex items-center justify-center shrink-0">
                                        {reply.authorName.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <span className="font-extrabold text-gray-900">{reply.authorName}</span>
                                    {isDevReply && (
                                      <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-600 text-white flex items-center gap-0.5">
                                        <BadgeCheck className="w-2.5 h-2.5" /> Dev Official
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-medium">{reply.createdAt}</span>
                                </div>
                                <p className="text-xs font-medium leading-relaxed">{reply.comment}</p>
                              </div>
                            );
                          })}

                          {replyingId === disc.id && (
                            <div className="pt-2 flex items-center gap-2 animate-in fade-in duration-150">
                              <input
                                type="text"
                                placeholder="Tulis balasan Anda..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddReplySubmit(disc.id);
                                  }
                                }}
                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                              />
                              <button
                                onClick={() => handleAddReplySubmit(disc.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
                              >
                                Kirim
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: ULASAN & RATING */}
          {activeMainTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. Beri Rating Aplikasi Ini */}
              <div className="space-y-3 border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Beri rating aplikasi ini</h2>
                <p className="text-xs text-gray-500 font-medium">Sampaikan pendapat Anda</p>
              </div>
              
              <button
                type="button"
                onClick={() => setShowWriteReview(!showWriteReview)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors border border-emerald-200"
              >
                {showWriteReview ? 'Tutup Form' : 'Tulis ulasan'}
              </button>
            </div>

            {/* 5 Big Star Picker */}
            <div className="flex items-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setNewRating(star);
                    setShowWriteReview(true);
                  }}
                  className="p-1 hover:scale-110 active:scale-95 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 sm:w-9 sm:h-9 ${
                      star <= newRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Expandable Review Form */}
            {showWriteReview && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50/90 rounded-2xl p-4 sm:p-5 border border-gray-200/90 space-y-3 animate-in fade-in duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Tulis Ulasan Baru ({newRating} Bintang)
                </h3>

                {currentUser ? (
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 text-xs">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-700">Mengulas sebagai <span className="font-extrabold text-gray-900">{currentUser.name}</span></span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Nama Anda / Reviewer"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                )}

                <textarea
                  placeholder="Berikan masukan atau pengalaman Anda mencoba aplikasi ini..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden h-20"
                  required
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWriteReview(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Rating & Ulasan Section (Exact Play Store Style) */}
          <div className="space-y-5 pt-6 border-t border-gray-200/80">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 group cursor-pointer">
                <span>Rating dan ulasan</span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </h2>
            </div>

            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 leading-relaxed">
              <span>Rating dan ulasan diverifikasi dan berasal dari orang yang menggunakan jenis perangkat yang sama dengan yang Anda gunakan</span>
              <Info className="w-4 h-4 text-gray-400 shrink-0 inline" />
            </p>

            {/* Overall Score + Star Distribution Bars */}
            {(() => {
              const reviews = safeApp.reviews;
              const total = reviews.length;
              const countByStar = [5, 4, 3, 2, 1].map(star => ({
                star,
                count: reviews.filter(r => Math.round(r.rating) === star).length,
                pct: total > 0 ? Math.round((reviews.filter(r => Math.round(r.rating) === star).length / total) * 100) : 0
              }));
              const avgRating = total > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
                : (app.rating?.toFixed(1) || '0.0');

              return (
                <div className="flex items-center gap-6 sm:gap-10 py-1">
                  <div className="shrink-0 space-y-1 text-center sm:text-left">
                    <div className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none">
                      {avgRating.replace('.', ',')}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-0.5 pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${ i < Math.round(Number(avgRating)) ? 'fill-emerald-600 text-emerald-600' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-gray-500 pt-0.5">
                      {total.toLocaleString('id-ID')} ulasan
                    </p>
                  </div>

                  {/* Progress bars for 5 to 1 stars - computed from real reviews */}
                  <div className="flex-1 space-y-1.5 max-w-xs sm:max-w-md">
                    {countByStar.map((item) => (
                      <div key={item.star} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                        <span className="w-2 text-right">{item.star}</span>
                        <div className="flex-1 h-2 bg-gray-200/90 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* List of Reviews */}
            <div className="space-y-5 pt-3">
              {app.reviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic">
                  Belum ada ulasan. Jadilah orang pertama yang memberikan ulasan!
                </p>
              ) : (
                app.reviews.map((rev, idx) => {
                  const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600'];
                  const avatarBg = bgColors[idx % bgColors.length];
                  const voteState = votedHelpful[rev.id];

                  return (
                    <div key={rev.id} className="space-y-2 border-b border-gray-100 pb-5 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {rev.userAvatar ? (
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-full ${avatarBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs`}>
                              {rev.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs sm:text-sm font-bold text-gray-900">{rev.userName}</span>
                        </div>

                        {/* Hapus Ulasan - hanya untuk Developer/Admin APK ini */}
                        {isDevOrAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm(`Hapus ulasan dari "${rev.userName}"?`)) return;
                              const newReviews = safeApp.reviews.filter(r => r.id !== rev.id);
                              const totalRating = newReviews.reduce((s, r) => s + r.rating, 0);
                              const avgRating = newReviews.length > 0 ? Number((totalRating / newReviews.length).toFixed(1)) : 0;
                              updateDoc(doc(db, 'apps', app.id), {
                                reviews: newReviews,
                                reviewCount: newReviews.length,
                                rating: avgRating
                              }).catch(() => {});
                            }}
                            className="text-rose-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                            title="Hapus ulasan ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating
                                  ? 'fill-emerald-600 text-emerald-600'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">{rev.date}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal pt-0.5">
                        {rev.comment}
                      </p>

                      <p className="text-[11px] text-gray-500 font-medium pt-1">
                        {(rev.likes || 1) + (voteState === 'ya' ? 1 : 0)} orang menganggap ulasan ini berguna
                      </p>

                      {/* Apakah ulasan ini membantu? [Ya] [Tidak] */}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-gray-600 font-medium">Apakah ulasan ini membantu?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setVotedHelpful({ ...votedHelpful, [rev.id]: 'ya' })}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                              voteState === 'ya'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Ya
                          </button>
                          <button
                            type="button"
                            onClick={() => setVotedHelpful({ ...votedHelpful, [rev.id]: 'tidak' })}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                              voteState === 'tidak'
                                ? 'bg-gray-800 text-white border-gray-800 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Tidak
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

          {/* OVERVIEW EXTRA: Info Aplikasi & Developer Profile (Rendered when activeMainTab is overview) */}
          {activeMainTab === 'overview' && (
            <div className="space-y-8 pt-6 border-t border-gray-200/80 animate-in fade-in duration-200">
              {/* 3. Info Game / Info Aplikasi (Detail APK Section) */}
          <div className="space-y-4 pt-6 border-t border-gray-200/80">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                {app.category === 'Games' ? 'Info game' : 'Info aplikasi'}
              </h2>

              {isDevOrAdmin && onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(app)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-2xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Atur / Edit Detail Ini</span>
                </button>
              )}
            </div>

            {/* Badges / Notices */}
            <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-200/80 text-gray-700 flex items-center justify-center shrink-0 font-black text-[11px] tracking-tight">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Berisi iklan</p>
                  <p className="text-[11px] text-gray-600">
                    Iklan ditempatkan oleh developer aplikasi.{' '}
                    <span className="text-emerald-700 font-bold underline cursor-pointer">Pelajari Lebih Lanjut</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2.5 border-t border-gray-200/60">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Menggunakan Valora Game & Security Engine</p>
                  <p className="text-[11px] text-gray-600">
                    Untuk login otomatis, papan peringkat, pencapaian, dan proteksi integritas aplikasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Clean Key-Value Table matching Screenshot 2 */}
            <div className="divide-y divide-gray-100 pt-1">
              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Versi</span>
                <span className="font-extrabold text-gray-900">{app.version}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Diupdate pada</span>
                <span className="font-extrabold text-gray-900">{app.updatedDate || '30 Jul 2026'}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Download</span>
                <span className="font-extrabold text-gray-900">
                  {app.downloadCount || (app.downloadCountNum ? app.downloadCountNum.toLocaleString('id-ID') + '+ download' : '104.032.000+ download')}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Ukuran download</span>
                <span className="font-extrabold text-gray-900">{app.size}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Pembelian dalam apl</span>
                <span className="font-extrabold text-gray-900">{app.sourceCodePrice || 'Rp 6.000 - Rp 2.490.000 per item'}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Ditawarkan oleh</span>
                <button
                  type="button"
                  onClick={() => onOpenDevProfile?.(app.developer)}
                  className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  {app.developer}
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Dirilis pada</span>
                <span className="font-extrabold text-gray-900">{app.releaseDate || '24 Sep 2024'}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Izin aplikasi</span>
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(true)}
                  className="text-emerald-700 font-bold hover:underline transition-all"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>



          {/* Developer Contact Footer */}
          <div className="bg-gray-100/80 rounded-2xl p-4 border border-gray-200/80 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800">Kontak Pengembang (Developer Support)</p>
            <p>Pengembang: {app.developer}</p>
            <p>Email resmi: {app.developerEmail || 'arumsaricorporation@gmail.com'}</p>
            <p>Keamanan: Verifikasi Lisensi Play Protect & Valora Security Shield</p>
          </div>
        </div>
      )}

        </div>
      </div>

      {/* App Permissions Modal */}
      {showPermissionsModal && (
        <div
          onClick={() => setShowPermissionsModal(false)}
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Izin Aplikasi (APK Permissions)</h3>
                <p className="text-xs text-gray-500 font-medium">Versi {app.version} oleh {app.developer}</p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-emerald-900 font-medium">
                  Aplikasi ini telah diverifikasi bebas dari malware dan memenuhi standar keamanan Google Play Protect & Valora Shield.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-gray-900">Izin yang Diperlukan:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Akses Jaringan Penuh (INTERNET)</span>
                      <span className="text-[11px] text-gray-500">Memungkinkan aplikasi berkomunikasi dengan server dan mengunduh pembaruan data.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Lihat Koneksi Jaringan (ACCESS_NETWORK_STATE)</span>
                      <span className="text-[11px] text-gray-500">Mendeteksi status koneksi internet Wi-Fi / Seluler untuk menghemat data.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Kontrol Getaran & Notifikasi (VIBRATE & NOTIFY)</span>
                      <span className="text-[11px] text-gray-500">Mengirimkan umpan balik haptik dan pemberitahuan penting.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Layanan di Latar Depan (FOREGROUND_SERVICE)</span>
                      <span className="text-[11px] text-gray-500">Menjaga proses unduhan tetap stabil saat berpindah aplikasi.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Level System Modal */}
      {showDevBadgeModal && (
        <div
          onClick={() => setShowDevBadgeModal(false)}
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-3xl p-6 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Sistem Lencana Verified Developer</h3>
                  <p className="text-xs text-gray-500 font-medium">Valora Store Creator Verification Network</p>
                </div>
              </div>
              <button
                onClick={() => setShowDevBadgeModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Developer Summary */}
            <div className="bg-emerald-50 text-emerald-950 rounded-2xl p-4 space-y-2 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase block">Status Pengembang</span>
                  <h4 className="text-lg font-black text-emerald-950">{app.developer}</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
                  {devTier.badgeTitle}
                </span>
              </div>

              <p className="text-xs text-gray-800 leading-relaxed font-medium">
                Telah mengunggah <b className="text-emerald-900 font-black">{projectCount} Project</b> portofolio berkualitas ke Valora Store.
              </p>

              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-emerald-900 mb-1">
                  <span>Progres ke Level Berikutnya</span>
                  <span>{projectCount} / {devTier.nextProjects} Project</span>
                </div>
                <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.min(100, (projectCount / devTier.nextProjects) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 5 Developer Badge Tiers Explanation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">5 Tingkatan Lencana Verified Developer:</h4>

              <div className="space-y-2.5">
                {[
                  {
                    lvl: 1,
                    title: 'Junior Creator',
                    range: '1 - 2 Project Uploaded',
                    icon: Check,
                    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
                    desc: 'Akses publikasi standar, verifikasi keamanan Play Protect.'
                  },
                  {
                    lvl: 2,
                    title: 'Rising Star',
                    range: '3 - 4 Project Uploaded',
                    icon: Zap,
                    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200',
                    desc: 'Dukungan khusus portofolio dan prioritas pencarian kata kunci.'
                  },
                  {
                    lvl: 3,
                    title: 'Top Creator',
                    range: '5 - 9 Project Uploaded',
                    icon: Award,
                    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
                    desc: 'Prioritas masuk tab Trending, statistik lengkap kunjungan & download.'
                  },
                  {
                    lvl: 4,
                    title: 'Master Developer',
                    range: '10 - 19 Project Uploaded',
                    icon: Trophy,
                    badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
                    desc: 'Akses banner "Editor Choice", kontak WhatsApp langsung di detail aplikasi.'
                  },
                  {
                    lvl: 5,
                    title: 'Legendary Studio',
                    range: '20+ Project Uploaded',
                    icon: Crown,
                    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold',
                    desc: 'Status VIP Emas, sorotan khusus di halaman utama Store & bebas komisi.'
                  }
                ].map((tier) => {
                  const IconComp = tier.icon;
                  const isCurrent = devTier.level === tier.lvl;

                  return (
                    <div
                      key={tier.lvl}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-gray-50/60 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-xl border text-xs ${tier.badgeColor}`}>
                            <IconComp className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-xs font-black text-gray-900 block">{tier.title}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{tier.range}</span>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                            Level Anda Saat Ini
                          </span>
                        ) : devTier.level > tier.lvl ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Terlampaui
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">
                            Terkunci
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 pt-1.5 leading-snug">
                        {tier.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDevBadgeModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition-colors"
              >
                Mengerti & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Screenshot Modal */}
      {activeScreenshot && (
        <div
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activeScreenshot}
              alt="Enlarged screenshot"
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
            <button
              onClick={() => setActiveScreenshot(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/20 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
