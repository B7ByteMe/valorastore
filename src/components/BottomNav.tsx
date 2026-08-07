import React from 'react';
import { Home, MessageSquare, Search, Bookmark } from 'lucide-react';

interface BottomNavProps {
  activeBottomTab: 'games' | 'apps' | 'search' | 'library';
  setActiveBottomTab: (tab: 'games' | 'apps' | 'search' | 'library') => void;
  onOpenSearchFocus?: () => void;
  onOpenLibrary: () => void;
  installedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeBottomTab,
  setActiveBottomTab,
  onOpenSearchFocus,
  onOpenLibrary,
  installedCount
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 py-2 px-4 shadow-lg sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Game Tab */}
        <button
          onClick={() => setActiveBottomTab('games')}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div
            className={`px-4 py-1.5 rounded-xl transition-all flex items-center justify-center ${
              activeBottomTab === 'games'
                ? 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900 border border-transparent'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeBottomTab === 'games' ? 'text-emerald-800 font-extrabold' : 'text-gray-500'
            }`}
          >
            Home
          </span>
        </button>

        {/* Aplikasi Tab */}
        <button
          onClick={() => setActiveBottomTab('apps')}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div
            className={`px-4 py-1.5 rounded-xl transition-all flex items-center justify-center ${
              activeBottomTab === 'apps'
                ? 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900 border border-transparent'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeBottomTab === 'apps' ? 'text-emerald-800 font-extrabold' : 'text-gray-500'
            }`}
          >
            Forum
          </span>
        </button>

        {/* Telusuri Tab */}
        <button
          onClick={() => {
            setActiveBottomTab('search');
            if (onOpenSearchFocus) onOpenSearchFocus();
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div
            className={`px-4 py-1.5 rounded-xl transition-all flex items-center justify-center ${
              activeBottomTab === 'search'
                ? 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900 border border-transparent'
            }`}
          >
            <Search className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeBottomTab === 'search' ? 'text-emerald-800 font-extrabold' : 'text-gray-500'
            }`}
          >
            Telusuri
          </span>
        </button>

        {/* Koleksi Tab */}
        <button
          onClick={() => {
            setActiveBottomTab('library');
            onOpenLibrary();
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group relative"
        >
          <div
            className={`px-4 py-1.5 rounded-xl transition-all flex items-center justify-center relative ${
              activeBottomTab === 'library'
                ? 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50 shadow-3xs'
                : 'text-gray-500 hover:text-gray-900 border border-transparent'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            {installedCount > 0 && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <span
            className={`text-[10px] font-bold tracking-tight transition-colors ${
              activeBottomTab === 'library' ? 'text-emerald-800 font-extrabold' : 'text-gray-500'
            }`}
          >
            Koleksi
          </span>
        </button>

      </div>
    </div>
  );
};
