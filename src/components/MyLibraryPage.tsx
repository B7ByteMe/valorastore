import React, { useState, useMemo } from 'react';
import { ProjectApp, UserAccount } from '../types';
import {
  ArrowLeft,
  Download,
  Bookmark,
  Trash2,
  CheckCircle,
  RefreshCw,
  Zap,
  HardDrive,
  LayoutGrid,
  List,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  FileJson,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Tag
} from 'lucide-react';

interface MyLibraryPageProps {
  installedApps: ProjectApp[];
  wishlistApps: ProjectApp[];
  allApps: ProjectApp[];
  currentUser: UserAccount | null;
  onBack: () => void;
  onSelectApp: (app: ProjectApp) => void;
  onToggleInstall: (app: ProjectApp) => void;
  onToggleWishlist: (app: ProjectApp) => void;
}

export const MyLibraryPage: React.FC<MyLibraryPageProps> = ({
  installedApps,
  wishlistApps,
  allApps,
  currentUser,
  onBack,
  onSelectApp,
  onToggleInstall,
  onToggleWishlist,
}) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'wishlist' | 'updates' | 'storage'>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'size' | 'rating' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Simulation states for interactive features
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [updateSuccessToast, setUpdateSuccessToast] = useState<string | null>(null);
  const [isCleaningCache, setIsCleaningCache] = useState(false);
  const [cacheCleanedToast, setCacheCleanedToast] = useState<string | null>(null);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    installedApps.forEach((a) => set.add(a.category));
    wishlistApps.forEach((a) => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, [installedApps, wishlistApps]);

  // Calculate estimated total size in MB
  const totalInstalledMB = useMemo(() => {
    return installedApps.reduce((acc, app) => {
      const num = parseFloat(app.size.replace(/[^0-9.]/g, '')) || 25;
      return acc + num;
    }, 0);
  }, [installedApps]);

  // Simulated updates available
  const updatesAvailableList = useMemo(() => {
    return installedApps.slice(0, Math.min(2, installedApps.length));
  }, [installedApps]);

  // Active items based on current tab
  const rawList = activeTab === 'installed' ? installedApps : activeTab === 'wishlist' ? wishlistApps : updatesAvailableList;

  // Filtered and sorted items
  const filteredList = useMemo(() => {
    let list = [...rawList];

    if (selectedCategory !== 'All') {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.developer.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'size') {
        const sizeA = parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0;
        const sizeB = parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0;
        return sizeB - sizeA;
      }
      return b.id.localeCompare(a.id);
    });

    return list;
  }, [rawList, selectedCategory, searchQuery, sortBy]);

  // Batch Update Simulator
  const handleUpdateAll = () => {
    setIsUpdatingAll(true);
    setTimeout(() => {
      setIsUpdatingAll(false);
      setUpdateSuccessToast('Semua aplikasi berhasil diperbarui ke versi paling stabil!');
      setTimeout(() => setUpdateSuccessToast(null), 4000);
    }, 2000);
  };

  // Cache Cleaner Simulator
  const handleCleanCache = () => {
    setIsCleaningCache(true);
    setTimeout(() => {
      setIsCleaningCache(false);
      setCacheCleanedToast('Berhasil membersihkan 142 MB file temporary & cache aplikasi!');
      setTimeout(() => setCacheCleanedToast(null), 4000);
    }, 1500);
  };

  // Export JSON function
  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: currentUser?.name || 'Pengguna Valora',
      installedCount: installedApps.length,
      installedApps: installedApps.map((a) => ({ id: a.id, title: a.title, category: a.category, size: a.size })),
      wishlistApps: wishlistApps.map((a) => ({ id: a.id, title: a.title, category: a.category })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ValoraStore_Library_Backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 animate-in fade-in duration-200">
      
      {/* Toast Notification Banner */}
      {(updateSuccessToast || cacheCleanedToast) && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{updateSuccessToast || cacheCleanedToast}</span>
        </div>
      )}

      {/* Top Navigation Header Bar */}
      <div className="bg-white border-b border-gray-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-gray-800 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0 border border-gray-200/70"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Kembali ke Store</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
              <Bookmark className="w-5 h-5 text-emerald-700 fill-emerald-200" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-gray-900 tracking-tight leading-tight">
                Koleksi & Perpustakaan Aplikasi
              </h1>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Manajemen aplikasi terinstall, wishlist favorit, dan performa penyimpanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold transition-all border border-emerald-200/80 cursor-pointer"
              title="Ekspor Backup Koleksi JSON"
            >
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>Ekspor JSON</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Dynamic Metric Dashboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Card 1: Terinstall */}
          <div
            onClick={() => setActiveTab('installed')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${
              activeTab === 'installed'
                ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                : 'bg-white hover:bg-emerald-50/50 text-gray-900 border-gray-200/90'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-black uppercase tracking-wider ${activeTab === 'installed' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                Terinstall
              </span>
              <CheckCircle className={`w-5 h-5 ${activeTab === 'installed' ? 'text-white' : 'text-emerald-600'}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {installedApps.length} <span className="text-xs font-extrabold opacity-90">Aplikasi</span>
            </div>
            <p className={`text-[11px] font-semibold mt-1 ${activeTab === 'installed' ? 'text-emerald-100' : 'text-gray-500'}`}>
              Siap langsung digunakan
            </p>
          </div>

          {/* Card 2: Wishlist */}
          <div
            onClick={() => setActiveTab('wishlist')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${
              activeTab === 'wishlist'
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-500/30'
                : 'bg-white hover:bg-amber-50/50 text-gray-900 border-gray-200/90'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-black uppercase tracking-wider ${activeTab === 'wishlist' ? 'text-amber-100' : 'text-amber-700'}`}>
                Wishlist
              </span>
              <Bookmark className={`w-5 h-5 ${activeTab === 'wishlist' ? 'text-white' : 'text-amber-500 fill-amber-500'}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {wishlistApps.length} <span className="text-xs font-extrabold opacity-90">Tersimpan</span>
            </div>
            <p className={`text-[11px] font-semibold mt-1 ${activeTab === 'wishlist' ? 'text-amber-100' : 'text-gray-500'}`}>
              Item favorit pilihan
            </p>
          </div>

          {/* Card 3: Pembaruan */}
          <div
            onClick={() => setActiveTab('updates')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${
              activeTab === 'updates'
                ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-600/30'
                : 'bg-white hover:bg-blue-50/50 text-gray-900 border-gray-200/90'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-black uppercase tracking-wider ${activeTab === 'updates' ? 'text-blue-100' : 'text-blue-700'}`}>
                Pembaruan
              </span>
              <RefreshCw className={`w-5 h-5 ${activeTab === 'updates' ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {updatesAvailableList.length} <span className="text-xs font-extrabold opacity-90">Tersedia</span>
            </div>
            <p className={`text-[11px] font-semibold mt-1 ${activeTab === 'updates' ? 'text-blue-100' : 'text-gray-500'}`}>
              Versi baru & perbaikan bug
            </p>
          </div>

          {/* Card 4: Penyimpanan */}
          <div
            onClick={() => setActiveTab('storage')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${
              activeTab === 'storage'
                ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-600/30'
                : 'bg-white hover:bg-purple-50/50 text-gray-900 border-gray-200/90'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-black uppercase tracking-wider ${activeTab === 'storage' ? 'text-purple-100' : 'text-purple-700'}`}>
                Penyimpanan
              </span>
              <HardDrive className={`w-5 h-5 ${activeTab === 'storage' ? 'text-white' : 'text-purple-600'}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {totalInstalledMB.toFixed(0)} <span className="text-xs font-extrabold opacity-90">MB</span>
            </div>
            <p className={`text-[11px] font-semibold mt-1 ${activeTab === 'storage' ? 'text-purple-100' : 'text-gray-500'}`}>
              Aset lokal teralokasi
            </p>
          </div>

        </div>

        {/* Tabs & Controls Section Header */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            {/* Primary Tab Switches */}
            <div className="flex items-center bg-gray-100/80 p-1.5 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('installed')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'installed'
                    ? 'bg-white text-emerald-900 shadow-xs border border-gray-200/80'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Terinstall ({installedApps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-white text-amber-900 shadow-xs border border-gray-200/80'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Wishlist ({wishlistApps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'updates'
                    ? 'bg-white text-blue-900 shadow-xs border border-gray-200/80'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Pembaruan ({updatesAvailableList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('storage')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === 'storage'
                    ? 'bg-white text-purple-900 shadow-xs border border-gray-200/80'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HardDrive className="w-4 h-4 text-purple-600" />
                <span>Analisis Penyimpanan</span>
              </button>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab === 'updates' && (
                <button
                  onClick={handleUpdateAll}
                  disabled={isUpdatingAll || updatesAvailableList.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingAll ? 'animate-spin' : ''}`} />
                  <span>{isUpdatingAll ? 'Memperbarui...' : 'Update Semua Aplikasi'}</span>
                </button>
              )}

              <button
                onClick={handleCleanCache}
                disabled={isCleaningCache}
                className="px-3.5 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 rounded-xl text-xs font-extrabold transition-all border border-gray-200/80 flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-500 ${isCleaningCache ? 'animate-bounce' : ''}`} />
                <span>{isCleaningCache ? 'Pembersihan...' : 'Bersihkan Cache'}</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar Row (When in Installed/Wishlist/Updates) */}
          {activeTab !== 'storage' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Internal Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari di koleksi Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 focus:bg-white text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              {/* Category Filter Horizontal Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                    }`}
                  >
                    {cat === 'All' ? 'Semua Kategori' : cat}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-gray-500'
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-gray-500'
                  }`}
                  title="Tampilan List Detail"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Tab 1, 2, 3: Apps Grid or List View */}
        {activeTab !== 'storage' && (
          <div>
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <Bookmark className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {activeTab === 'installed'
                    ? 'Belum ada aplikasi yang terinstall'
                    : activeTab === 'wishlist'
                    ? 'Wishlist Anda masih kosong'
                    : 'Tidak ada pembaruan pending'}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Jelajahi toko untuk menemukan berbagai aplikasi menarik dan tambahkan ke koleksi pribadi Anda.
                </p>
                <button
                  onClick={onBack}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <span>Jelajahi Store Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredList.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <img
                          src={app.iconUrl}
                          alt={app.title}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-gray-200 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                          {app.category}
                        </span>
                      </div>

                      <div>
                        <h3
                          onClick={() => onSelectApp(app)}
                          className="font-black text-sm text-gray-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                        >
                          {app.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium truncate">
                          {app.developer} • {app.size}
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 font-normal">
                        {app.tagline || app.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        Lihat Detail
                      </button>

                      {activeTab === 'installed' ? (
                        <button
                          onClick={() => onToggleInstall(app)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Copot / Uninstall"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : activeTab === 'wishlist' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleInstall(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Install</span>
                          </button>
                          <button
                            onClick={() => onToggleWishlist(app)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="Hapus Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdateSuccessToast(`Aplikasi ${app.title} berhasil diperbarui!`);
                            setTimeout(() => setUpdateSuccessToast(null), 3000);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Layout */
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs divide-y divide-gray-100 overflow-hidden">
                {filteredList.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-gray-50/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div
                      onClick={() => onSelectApp(app)}
                      className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
                    >
                      <img
                        src={app.iconUrl}
                        alt={app.title}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-gray-900 truncate">
                            {app.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                            {app.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {app.developer} • {app.platform} • Ukuran: {app.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        Detail
                      </button>

                      {activeTab === 'installed' ? (
                        <button
                          onClick={() => onToggleInstall(app)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Copot</span>
                        </button>
                      ) : activeTab === 'wishlist' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleInstall(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Install</span>
                          </button>
                          <button
                            onClick={() => onToggleWishlist(app)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdateSuccessToast(`Aplikasi ${app.title} diperbarui!`);
                            setTimeout(() => setUpdateSuccessToast(null), 3000);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Storage & Analytics View */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">Alokasi Penyimpanan Lokal</h3>
                  <p className="text-xs text-gray-500 font-medium">Estimasi penggunaan memori oleh aplikasi terinstall di ValoraStore</p>
                </div>
                <span className="text-sm font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-xl border border-purple-200">
                  {totalInstalledMB.toFixed(0)} MB Terpakai
                </span>
              </div>

              {/* Graphical Storage Bar */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex p-0.5 border border-gray-200">
                  <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '45%' }} title="Aplikasi Utama" />
                  <div className="h-full bg-teal-400" style={{ width: '30%' }} title="Aset & Media" />
                  <div className="h-full bg-amber-400" style={{ width: '15%' }} title="Cache Data" />
                  <div className="h-full bg-purple-400 rounded-r-full" style={{ width: '10%' }} title="Lainnya" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-gray-700">Aplikasi ({ (totalInstalledMB * 0.45).toFixed(0) } MB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-400" />
                    <span className="text-gray-700">Aset Media ({ (totalInstalledMB * 0.30).toFixed(0) } MB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-gray-700">Cache Temp ({ (totalInstalledMB * 0.15).toFixed(0) } MB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="text-gray-700">Lainnya ({ (totalInstalledMB * 0.10).toFixed(0) } MB)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Sistem otomatis mengoptimalkan cache lokal saat memori sistem mencapai batas.
                </p>
                <button
                  onClick={handleCleanCache}
                  disabled={isCleaningCache}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {isCleaningCache ? 'Membersihkan...' : 'Kosongkan Cache'}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
