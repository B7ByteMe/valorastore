import React, { useState } from 'react';
import { ProjectApp } from '../types';
import { X, Download, Bookmark, Play, Trash2, CheckCircle, ExternalLink } from 'lucide-react';

interface MyLibraryModalProps {
  installedApps: ProjectApp[];
  wishlistApps: ProjectApp[];
  onClose: () => void;
  onSelectApp: (app: ProjectApp) => void;
  onOpenLiveDemo: (app: ProjectApp) => void;
  onToggleInstall: (app: ProjectApp) => void;
  onToggleWishlist: (app: ProjectApp) => void;
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({
  installedApps,
  wishlistApps,
  onClose,
  onSelectApp,
  onOpenLiveDemo,
  onToggleInstall,
  onToggleWishlist
}) => {
  const [activeTab, setActiveTab] = useState<'installed' | 'wishlist'>('installed');

  const currentList = activeTab === 'installed' ? installedApps : wishlistApps;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start sm:py-8 p-2 md:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto border border-gray-100">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-gray-900">
              Koleksi & Perpustakaan Aplikasi
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1.5 px-6 gap-2">
          <button
            onClick={() => setActiveTab('installed')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'installed'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Aplikasi Terinstall ({installedApps.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            Wishlist Tersimpan ({wishlistApps.length})
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
          {currentList.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <Bookmark className="w-10 h-10 mx-auto text-gray-300 stroke-1" />
              <p className="text-xs font-semibold text-gray-500">
                {activeTab === 'installed'
                  ? 'Belum ada aplikasi yang Anda install.'
                  : 'Belum ada aplikasi di wishlist Anda.'}
              </p>
              <p className="text-[11px] text-gray-400">
                Jelajahi toko dan klik tombol Install atau Simpan untuk menambahkan project ke koleksi.
              </p>
            </div>
          ) : (
            currentList.map((app) => (
              <div
                key={app.id}
                className="p-3.5 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-200/80 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => { onSelectApp(app); onClose(); }}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <img
                    src={app.iconUrl}
                    alt={app.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                      {app.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      {app.category} • {app.developer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeTab === 'installed' ? (
                    <button
                      onClick={() => onToggleInstall(app)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Hapus Installasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleWishlist(app)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                      title="Hapus dari Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
