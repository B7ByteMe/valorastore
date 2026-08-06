import React, { useState, useEffect, useMemo, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { ProjectApp, CategoryType, PlatformType, AppReview, InstallProgress, UserAccount, UserRole } from './types';
import { INITIAL_APPS } from './data/sampleApps';
import { INITIAL_USERS } from './data/mockUsers';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { AppCard } from './components/AppCard';
import { AppDetailModal } from './components/AppDetailModal';
import { DeveloperConsoleModal } from './components/DeveloperConsoleModal';
import { MyLibraryPage } from './components/MyLibraryPage';
import { DeveloperProfilePage } from './components/DeveloperProfilePage';
import { UserProfilePage } from './components/UserProfilePage';
import { AuthModal } from './components/AuthModal';
import { DashboardModal } from './components/DashboardModal';
import { AdminPortal } from './components/AdminPortal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { SimulatorInstallerModal } from './components/SimulatorInstallerModal';
import {
  TrendingUp,
  Award,
  PlusCircle,
  Flame,
  LayoutGrid,
  Filter,
  CheckCircle,
  Download,
  Terminal,
  Smartphone,
  X
} from 'lucide-react';

export default function App() {
  // Initialize Apps from Firestore
  const [apps, setApps] = useState<ProjectApp[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'apps'), (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as ProjectApp);
      setApps(data);
    });
    return () => unsub();
  }, []);

  // Background GitHub Auto-Sync
  // Cek release terbaru dari GitHub untuk setiap app yang punya githubUrl
  // Cache per-app di localStorage (max 1x cek per jam)
  useEffect(() => {
    if (apps.length === 0) return;

    const CACHE_KEY = 'valora_github_sync';
    const ONE_HOUR = 60 * 60 * 1000;
    let cache: Record<string, number> = {};
    try {
      cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch {}

    const now = Date.now();
    const appsToCheck = apps.filter(
      (a) => a.githubUrl && (!cache[a.id] || now - cache[a.id] > ONE_HOUR)
    );

    if (appsToCheck.length === 0) return;

    const syncApp = async (app: ProjectApp) => {
      try {
        const match = (app.githubUrl || '').match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
        if (!match) return;
        const [, owner, repo] = match;

        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        if (!res.ok) return;
        const release = await res.json();

        const latestTag = (release.tag_name || '').replace(/^v/, '');
        const storedVersion = (app.version || '').replace(/^v/, '');

        // Jika versi sama, tidak perlu update
        if (latestTag === storedVersion || !latestTag) return;

        // Ada versi baru! Update Firestore secara otomatis
        const pubDate = new Date(release.published_at || Date.now());
        const formattedDate = pubDate.toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        });

        const updates: Record<string, any> = {
          version: latestTag,
          updatedDate: formattedDate,
        };

        // Update ukuran & URL download jika ada asset
        if (release.assets && release.assets.length > 0) {
          const asset = release.assets[0];
          updates.downloadUrl = asset.browser_download_url;
          updates.size = `${(asset.size / (1024 * 1024)).toFixed(1)} MB`;
        }

        // Update catatan rilis jika ada
        if (release.body && release.body.trim()) {
          updates.whatsNew = release.body.trim().slice(0, 500);
        }

        await updateDoc(doc(db, 'apps', app.id), updates);
        console.info(`[GitHub Sync] ${app.title}: ${storedVersion} → ${latestTag}`);
      } catch {
        // Gagal diam-diam, tidak ganggu pengguna
      } finally {
        // Tandai sudah dicek
        cache[app.id] = Date.now();
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      }
    };

    // Jalankan sync dengan jeda antar request agar tidak hit rate limit
    appsToCheck.forEach((app, i) => {
      setTimeout(() => syncApp(app), i * 1200);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps.length > 0]);


  // Users management & current login state
  const [users, setUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as UserAccount);
      setUsers(data);
    });
    return () => unsub();
  }, []);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'dev_acc' | 'upload_app' | 'manage_apps' | 'manage_users' | 'my_library' | 'profile_settings'>('overview');

  // Admin Portal Route State (/admin or #admin)
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminPortalOpen(true);
      } else {
        setIsAdminPortalOpen(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminPortalOpen(true);
    try {
      window.history.pushState(null, '', '/admin');
    } catch (e) {
      window.location.hash = 'admin';
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminPortalOpen(false);
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      window.location.hash = '';
    }
  };

  // User management handlers
  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const handleApplyBecomeDeveloper = async (studioName: string, whatsappNumber: string, reason: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const updatedUser: UserAccount = {
      ...currentUser,
      developerStudioName: studioName || `${currentUser.name} Studio`,
      whatsappNumber: whatsappNumber || '6281234567890',
      developerReason: reason,
      developerStatus: 'pending',
      developerRequestDate: today
    };

    setCurrentUser(updatedUser);
    await updateDoc(doc(db, 'users', currentUser.id), updatedUser as any);
  };

  const handleApproveDeveloper = async (userId: string) => {
    await updateDoc(doc(db, 'users', userId), { role: 'developer', developerStatus: 'approved' });
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, role: 'developer', developerStatus: 'approved' } : null
      );
    }
  };

  const handleRejectDeveloper = async (userId: string) => {
    await updateDoc(doc(db, 'users', userId), { developerStatus: 'rejected' });
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, developerStatus: 'rejected' } : null
      );
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateDoc(doc(db, 'users', userId), { status: user.status === 'active' ? 'blocked' : 'active' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  const handleAddUser = async (newUser: UserAccount) => {
    await setDoc(doc(db, 'users', newUser.id), newUser);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = async (newUser: UserAccount) => {
    await setDoc(doc(db, 'users', newUser.id), newUser);
    setCurrentUser(newUser);
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as UserAccount);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setShowDashboardModal(false);
    setShowUserProfilePage(false);
  };

  const handleUpdateUserProfile = async (updatedFields: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    // Bersihkan field undefined sebelum dikirim ke Firestore
    const cleanFields: Record<string, any> = {};
    for (const [key, val] of Object.entries(updatedFields)) {
      if (val !== undefined) {
        cleanFields[key] = val;
      }
    }
    await updateDoc(doc(db, 'users', currentUser.id), cleanFields);
  };

  const handleOpenDashboard = (tab: 'overview' | 'upload_app' | 'manage_apps' | 'manage_users' | 'my_library' | 'profile_settings' = 'overview') => {
    setDashboardTab(tab);
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (tab === 'upload_app' || tab === 'manage_apps') {
      if (currentUser.role === 'developer' || currentUser.role === 'admin' || currentUser.developerStatus === 'approved') {
        setShowDevConsole(true);
      } else {
        setShowUserProfilePage(true);
        setShowLibrary(false);
        setSelectedDevProfile(null);
        setSelectedApp(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (tab === 'manage_users') {
      setShowDashboardModal(true);
    } else {
      setShowUserProfilePage(true);
      setShowLibrary(false);
      setSelectedDevProfile(null);
      setSelectedApp(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'apps', appId));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Gagal menghapus aplikasi:", err);
    }
  };

  const [installToast, setInstallToast] = useState<{ app: ProjectApp; message: string } | null>(null);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (installToast) {
      const timer = setTimeout(() => {
        setInstallToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [installToast]);

  // Filters & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'All'>('All');
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'top' | 'new'>('all');
  const [activeMainTab, setActiveMainTab] = useState<'for_you' | 'top_charts' | 'pc' | 'categories'>('for_you');
  const [activeBottomTab, setActiveBottomTab] = useState<'games' | 'apps' | 'search' | 'library'>('apps');

  // Handle Bottom Tab Clicks
  const handleBottomTabChange = (tab: 'games' | 'apps' | 'search' | 'library') => {
    setActiveBottomTab(tab);
    if (tab === 'games') {
      setSelectedCategory('Games');
      setSelectedPlatform('All');
    } else if (tab === 'apps') {
      setSelectedCategory('All');
      setSelectedPlatform('All');
    } else if (tab === 'search') {
      // Focus mobile search
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) input.focus();
    }
  };

  // Modals state
  const [selectedApp, setSelectedApp] = useState<ProjectApp | null>(null);
  const [demoApp, setDemoApp] = useState<ProjectApp | null>(null);
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [editingApp, setEditingApp] = useState<ProjectApp | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showUserProfilePage, setShowUserProfilePage] = useState(false);
  const [selectedDevProfile, setSelectedDevProfile] = useState<string | null>(null);

  // Derived filtered apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (selectedCategory !== 'All' && app.category !== selectedCategory) return false;
      if (selectedPlatform !== 'All' && app.platform !== selectedPlatform) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = app.title.toLowerCase().includes(q);
        const matchTagline = app.tagline.toLowerCase().includes(q);
        const matchCategory = app.category.toLowerCase().includes(q);
        const matchDev = app.developer.toLowerCase().includes(q);
        const matchTech = (app.techStack || []).some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchTagline && !matchCategory && !matchDev && !matchTech) return false;
      }
      return true;
    });
  }, [apps, selectedCategory, selectedPlatform, searchQuery]);

  // Sections
  const featuredApps = useMemo(() => apps.filter((a) => a.badge === 'Editor Choice' || a.badge === 'Trending'), [apps]);
  const topRatedApps = useMemo(() => [...filteredApps].sort((a, b) => b.rating - a.rating), [filteredApps]);
  const mostDownloadedApps = useMemo(() => [...filteredApps].sort((a, b) => b.downloadCountNum - a.downloadCountNum), [filteredApps]);

  const installedApps = useMemo(() => apps.filter((a) => a.isInstalled), [apps]);
  const wishlistApps = useMemo(() => apps.filter((a) => a.isWishlisted), [apps]);

  const handleToggleInstall = async (targetApp: ProjectApp, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Jika belum ada file yang diunggah
    if (!targetApp.downloadUrl) {
      alert("Maaf, developer belum menyertakan file unduhan untuk aplikasi ini.");
      return;
    }

    // Trigger real download without opening a new tab
    const link = document.createElement('a');
    link.href = targetApp.downloadUrl;
    link.setAttribute('download', targetApp.title || 'download');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update statistics directly
    const nextDownloadNum = targetApp.downloadCountNum + 1;
    const downloadCount = `${nextDownloadNum >= 1000 ? Math.floor(nextDownloadNum / 1000) + 'K+' : nextDownloadNum}`;
    
    try {
      await updateDoc(doc(db, 'apps', targetApp.id), {
        isInstalled: true,
        downloadCountNum: nextDownloadNum,
        downloadCount: downloadCount
      });
      
      if (selectedApp && selectedApp.id === targetApp.id) {
        setSelectedApp((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            isInstalled: true,
            downloadCountNum: nextDownloadNum,
            downloadCount: downloadCount
          };
        });
      }
    } catch (err) {
      console.error(err);
    }

    setInstallToast({
      app: targetApp,
      message: `Mengunduh ${targetApp.title}...`
    });
  };

  const handleToggleWishlist = async (targetApp: ProjectApp) => {
    await updateDoc(doc(db, 'apps', targetApp.id), { isWishlisted: !targetApp.isWishlisted });
    if (selectedApp && selectedApp.id === targetApp.id) {
      setSelectedApp((prev) => (prev ? { ...prev, isWishlisted: !prev.isWishlisted } : null));
    }
  };

  const handleAddReview = async (appId: string, review: Omit<AppReview, 'id' | 'date' | 'likes'>) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const newRev: AppReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Hari ini',
      likes: 0
    };

    const newReviews = [newRev, ...app.reviews];
    const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / newReviews.length).toFixed(1));

    await updateDoc(doc(db, 'apps', appId), {
      reviews: newReviews,
      reviewCount: newReviews.length,
      rating: avgRating
    });

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          reviews: newReviews,
          reviewCount: newReviews.length,
          rating: avgRating
        };
      });
    }
  };

  const handleSaveProject = async (appToSave: ProjectApp) => {
    await setDoc(doc(db, 'apps', appToSave.id), appToSave);
    // Jangan auto-open detail setelah simpan agar tidak terjadi blank flash
    setEditingApp(null);
    setShowDevConsole(false);
  };

  if (isAdminPortalOpen) {
    return (
      <AdminPortal
        currentUser={currentUser}
        users={users}
        apps={apps}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onUpdateUserRole={handleUpdateUserRole}
        onApproveDeveloper={handleApproveDeveloper}
        onRejectDeveloper={handleRejectDeveloper}
        onToggleUserStatus={handleToggleUserStatus}
        onDeleteUser={handleDeleteUser}
        onDeleteApp={handleDeleteApp}
        onCloseAdmin={handleCloseAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F1F1F] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      
      {/* Play Store Top Header & Category Bar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        onOpenDeveloperConsole={() => handleOpenDashboard('upload_app')}
        onOpenDashboard={handleOpenDashboard}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenLibrary={() => setShowLibrary(true)}
        installedCount={installedApps.length}
        wishlistCount={wishlistApps.length}
        currentUser={currentUser}
        onOpenAdmin={handleOpenAdmin}
        onLogout={handleLogout}
      />

      {/* Main Container or Full-Page Views */}
      {selectedDevProfile ? (
        <DeveloperProfilePage
          developerName={selectedDevProfile}
          allApps={apps}
          currentUser={currentUser}
          users={users}
          onBack={() => setSelectedDevProfile(null)}
          onSelectApp={(app) => {
            setSelectedDevProfile(null);
            setSelectedApp(app);
          }}
        />
      ) : showUserProfilePage ? (
        <UserProfilePage
          currentUser={currentUser}
          allApps={apps}
          installedApps={installedApps}
          wishlistApps={wishlistApps}
          users={users}
          onBack={() => setShowUserProfilePage(false)}
          onApplyBecomeDeveloper={handleApplyBecomeDeveloper}
          onUpdateUserProfile={handleUpdateUserProfile}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenDevConsole={() => {
            setShowUserProfilePage(false);
            setShowDevConsole(true);
          }}
          onSelectApp={(a) => {
            setShowUserProfilePage(false);
            setSelectedApp(a);
          }}
          onToggleInstall={handleToggleInstall}
          onToggleWishlist={handleToggleWishlist}
          onApproveDeveloper={handleApproveDeveloper}
          onRejectDeveloper={handleRejectDeveloper}
          onLogout={handleLogout}
        />
      ) : showLibrary ? (
        <MyLibraryPage
          installedApps={installedApps}
          wishlistApps={wishlistApps}
          allApps={apps}
          currentUser={currentUser}
          onBack={() => {
            setShowLibrary(false);
            setActiveBottomTab('apps');
          }}
          onSelectApp={(a) => setSelectedApp(a)}
          onToggleInstall={handleToggleInstall}
          onToggleWishlist={handleToggleWishlist}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-8 space-y-10">
          
          {/* Spotlight Featured Carousel (shown if not searching and Category is All) */}
          {!searchQuery && selectedCategory === 'All' && selectedPlatform === 'All' && (
            <HeroCarousel
              featuredApps={featuredApps.length > 0 ? featuredApps : apps.slice(0, 3)}
              onSelectApp={(app) => setSelectedApp(app)}
              onOpenLiveDemo={(app) => setDemoApp(app)}
            />
          )}

          {/* Search Results / Filter Active Indicator */}
          {(searchQuery || selectedCategory !== 'All' || selectedPlatform !== 'All') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  Hasil Pencarian & Filter ({filteredApps.length} Project)
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {searchQuery && `Pencarian: "${searchQuery}" • `}
                  {selectedCategory !== 'All' && `Kategori: ${selectedCategory} • `}
                  {selectedPlatform !== 'All' && `Platform: ${selectedPlatform}`}
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedPlatform('All');
                }}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Section Tabs Switcher */}
          {!searchQuery && selectedCategory === 'All' && (
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTabSection('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  activeTabSection === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Semua Project
              </button>
              <button
                onClick={() => setActiveTabSection('top')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  activeTabSection === 'top'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Top Rated & Populer
              </button>
            </div>
          )}

          {/* SECTION 1: Standard App Grid */}
          {filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">
                Tidak ada aplikasi yang cocok dengan pencarian
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Coba kata kunci lain atau tambahkan hasil karya project baru Anda ke Valora Store dengan mengeklik tombol di bawah ini.
              </p>
              <button
                onClick={() => setShowDevConsole(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Upload Project Baru
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Main Showcase Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                      {selectedCategory === 'All' ? 'Hasil Karya Project Terbaru' : `Project Kategori ${selectedCategory}`}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Aplikasi interaktif yang siap diuji coba secara langsung
                    </p>
                  </div>
                  
                  <span className="text-xs font-bold text-gray-400">
                    {filteredApps.length} Aplikasi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      onSelectApp={(a) => setSelectedApp(a)}
                      onOpenLiveDemo={(a) => setDemoApp(a)}
                      onToggleInstall={handleToggleInstall}
                    />
                  ))}
                </div>
              </div>

              {/* Horizontal Rank List - Top Rated (Play Store Top Charts Style) */}
              {!searchQuery && selectedCategory === 'All' && (
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">
                          Top Charts & Rating Tertinggi
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          Project dengan ulasan dan performa terbaik dari penguji
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topRatedApps.slice(0, 3).map((app, index) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center gap-3"
                      >
                        <span className="font-['Outfit',sans-serif] text-2xl font-black text-emerald-600 w-6 text-center shrink-0">
                          #{index + 1}
                        </span>

                        <img
                          src={app.iconUrl}
                          alt={app.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                          referrerPolicy="no-referrer"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {app.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate">
                            {app.category} • ⭐ {app.rating}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* 1. App Detail Sheet Overlay */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          apps={apps}
          currentUser={currentUser}
          onClose={() => setSelectedApp(null)}
          onOpenLiveDemo={(a) => setDemoApp(a)}
          onToggleInstall={handleToggleInstall}
          onToggleWishlist={handleToggleWishlist}
          onAddReview={handleAddReview}
          onEditProject={(appToEdit) => {
            // Ambil versi terbaru dari apps state, bukan dari selectedApp yang mungkin stale
            const freshApp = apps.find(a => a.id === appToEdit.id) || appToEdit;
            setEditingApp(freshApp);
            setShowDevConsole(true);
          }}
          onOpenDevProfile={(devName) => {
            setSelectedApp(null);
            setSelectedDevProfile(devName);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}

      {/* 3. Developer Console / Publish App Modal */}
      {showDevConsole && (
        <DeveloperConsoleModal
          initialApp={editingApp}
          onClose={() => {
            setShowDevConsole(false);
            setEditingApp(null);
          }}
          onSaveProject={handleSaveProject}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Control Center Dashboard Modal (Account & App Management) */}
      {currentUser && (
        <DashboardModal
          isOpen={showDashboardModal}
          onClose={() => setShowDashboardModal(false)}
          currentUser={currentUser}
          users={users}
          apps={apps}
          onUpdateUserRole={handleUpdateUserRole}
          onToggleUserStatus={handleToggleUserStatus}
          onDeleteUser={handleDeleteUser}
          onAddUser={handleAddUser}
          onSaveApp={handleSaveProject}
          onDeleteApp={handleDeleteApp}
          onOpenAppDetail={(app) => setSelectedApp(app)}
          onLogout={handleLogout}
          onOpenAuthModal={() => {
            setShowDashboardModal(false);
            setShowAuthModal(true);
          }}
          onApproveDeveloper={handleApproveDeveloper}
          onRejectDeveloper={handleRejectDeveloper}
          initialTab={dashboardTab}
        />
      )}

      {/* Play Store Installation Toast Notification */}
      {installToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-emerald-500/40 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 max-w-md w-[92vw] sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-100 truncate">{installToast.message}</p>
            <p className="text-[10px] text-emerald-400 font-medium">Siap diuji coba melalui Simulator</p>
          </div>
          {installToast.app.demoUrl && (
            <button
              onClick={() => {
                setDemoApp(installToast.app);
                setInstallToast(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs transition-colors shrink-0 shadow-xs"
            >
              Buka
            </button>
          )}
          <button
            onClick={() => setInstallToast(null)}
            className="text-gray-400 hover:text-white p-1 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Google Play Bottom Navigation Bar */}
      <BottomNav
        activeBottomTab={activeBottomTab}
        setActiveBottomTab={handleBottomTabChange}
        onOpenSearchFocus={() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (input) input.focus();
        }}
        onOpenLibrary={() => setShowLibrary(true)}
        installedCount={installedApps.length}
      />

    </div>
  );
}

