import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Laptop, Smartphone } from 'lucide-react';
import { CategoryType, PlatformType, UserAccount } from '../types';
import logoImg from '../assets/logo.png';


interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  selectedPlatform: PlatformType | 'All';
  setSelectedPlatform: (plat: PlatformType | 'All') => void;
  activeMainTab?: 'for_you' | 'top_charts' | 'pc' | 'categories';
  setActiveMainTab?: (tab: 'for_you' | 'top_charts' | 'pc' | 'categories') => void;
  onOpenDeveloperConsole: () => void;
  onOpenDashboard: (tab?: 'overview' | 'upload_app' | 'manage_apps' | 'manage_users' | 'my_library' | 'profile_settings') => void;
  onOpenAuthModal: () => void;
  onOpenLibrary: () => void;
  installedCount: number;
  wishlistCount: number;
  currentUser: UserAccount | null;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPlatform,
  setSelectedPlatform,
  activeMainTab = 'for_you',
  setActiveMainTab,
  onOpenDeveloperConsole,
  onOpenDashboard,
  onOpenAuthModal,
  onOpenLibrary,
  installedCount,
  wishlistCount,
  currentUser,
  onOpenAdmin,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: CategoryType[] = ['All', 'AI & ML', 'Tools', 'Productivity', 'Games', 'Finance', 'Utilities', 'Entertainment'];
  const platforms: (PlatformType | 'All')[] = ['All', 'Web', 'Mobile', 'Desktop', 'CLI'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer"
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedPlatform('All'); }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center group hover:scale-[1.04] transition-transform duration-200">
              <img
                src={logoImg}
                alt="Valora Store Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-['Outfit',sans-serif] text-base sm:text-xl font-extrabold tracking-tight text-gray-900">
                  Valora<span className="text-emerald-600">Store</span>
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                  Portfolio
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium hidden md:block">
                Showcase & Test Software Projects
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg lg:max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari aplikasi, game, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 bg-gray-50 focus:bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-500 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-hidden font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 text-gray-400 hover:text-gray-600 p-1"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-1.5 p-1.5 rounded-lg transition-colors ${
                  showFilters || selectedPlatform !== 'All'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
                title="Filter Platform"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Dropdown Popover */}
            {showFilters && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Filter Platform</span>
                  <button
                    onClick={() => { setSelectedPlatform('All'); setShowFilters(false); }}
                    className="text-[11px] text-emerald-600 font-semibold hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedPlatform(p); setShowFilters(false); }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        selectedPlatform === p
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p === 'Web' && <Laptop className="w-3.5 h-3.5" />}
                      {p === 'Mobile' && <Smartphone className="w-3.5 h-3.5" />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Admin Link & Profile Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            {false && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="Masuk ke Panel Admin (/admin)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Admin</span>
              </button>
            )}

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 hover:ring-2 hover:ring-emerald-400/50 transition-all cursor-pointer shadow-sm shrink-0 flex items-center justify-center bg-gray-100"
                  title={`Profil Akun (${currentUser.role})`}
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => { setIsDropdownOpen(false); onOpenDashboard('overview'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold flex items-center gap-2"
                    >
                      Pengaturan
                    </button>
                    <button
                      onClick={() => { setIsDropdownOpen(false); alert('Valora Store\nVersi 1.0.0 (Beta)\nCopyright 2024 Arumsari Dev Studio'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-bold flex items-center gap-2"
                    >
                      Versi
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { setIsDropdownOpen(false); if (onLogout) onLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-black flex items-center gap-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
              >
                Masuk
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Search Bar Row */}
        <div className="block md:hidden pb-2.5 pt-0.5">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Cari aplikasi, game, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 bg-gray-50 focus:bg-white text-xs text-gray-900 placeholder-gray-500 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-hidden font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-8 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-1 p-1 rounded-lg transition-colors ${
                showFilters || selectedPlatform !== 'All'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Filter Popover */}
          {showFilters && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-3 animate-in fade-in duration-150">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Filter Platform</span>
                <button
                  onClick={() => { setSelectedPlatform('All'); setShowFilters(false); }}
                  className="text-[10px] text-emerald-600 font-semibold"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setSelectedPlatform(p); setShowFilters(false); }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                      selectedPlatform === p
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Play Store Style Top Subtabs Row ("Untuk Anda", "Paling populer", "PC", "Kategori") */}
        <div className="flex items-center gap-6 sm:gap-8 border-t border-gray-100 pt-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              if (setActiveMainTab) setActiveMainTab('for_you');
              setSelectedCategory('All');
              setSelectedPlatform('All');
            }}
            className={`pb-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeMainTab === 'for_you'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900 font-bold'
            }`}
          >
            Untuk Anda
          </button>

          <button
            onClick={() => {
              if (setActiveMainTab) setActiveMainTab('top_charts');
            }}
            className={`pb-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeMainTab === 'top_charts'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900 font-bold'
            }`}
          >
            Paling populer
          </button>

          <button
            onClick={() => {
              if (setActiveMainTab) setActiveMainTab('pc');
              setSelectedPlatform('Web');
            }}
            className={`pb-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeMainTab === 'pc'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900 font-bold'
            }`}
          >
            PC & Web
          </button>

          <button
            onClick={() => {
              if (setActiveMainTab) setActiveMainTab('categories');
            }}
            className={`pb-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeMainTab === 'categories'
                ? 'border-emerald-600 text-emerald-700 font-black'
                : 'border-transparent text-gray-500 hover:text-gray-900 font-bold'
            }`}
          >
            Kategori
          </button>
        </div>

        {/* Category Horizontal Chips Bar (Modern Slate-Rounded Style) */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-gray-100/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
                  : 'bg-gray-150/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-950 border border-transparent'
              }`}
            >
              {cat === 'All' ? 'Semua' : cat}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};

