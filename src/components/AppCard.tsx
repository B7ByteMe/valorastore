import React from 'react';
import { ProjectApp, InstallProgress } from '../types';
import { Star, Download, Play, CheckCircle, X } from 'lucide-react';

interface AppCardProps {
  app: ProjectApp;
  installProgress?: InstallProgress;
  onSelectApp: (app: ProjectApp) => void;
  onOpenLiveDemo: (app: ProjectApp) => void;
  onToggleInstall: (app: ProjectApp, e: React.MouseEvent) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  installProgress,
  onSelectApp,
  onOpenLiveDemo,
  onToggleInstall
}) => {
  return (
    <div
      onClick={() => onSelectApp(app)}
      className="group bg-white rounded-xl p-4 border border-gray-200/60 hover:border-emerald-400 hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative"
    >
      <div>
        {/* App Icon & Header info */}
        <div className="flex items-start gap-3.5">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-3xs group-hover:scale-[1.03] transition-transform duration-300 relative">
              <img
                src={app.iconUrl}
                alt={app.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Progress Overlay Badge on Card Icon */}
              {installProgress && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-xs px-0.5 py-0.5 text-center">
                  <span className="text-[9px] font-extrabold text-emerald-400 block leading-none">
                    {Math.round(installProgress.progress)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <span>{app.category}</span>
              {app.badge && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-amber-600">{app.badge}</span>
                </>
              )}
            </div>

            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug truncate mt-1 group-hover:text-emerald-600 transition-colors">
              {app.title}
            </h3>

            <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
              {app.developer}
            </p>
          </div>
        </div>

        {/* Short Tagline */}
        <p className="text-xs text-gray-650 font-normal line-clamp-2 mt-3 leading-relaxed">
          {app.tagline}
        </p>
      </div>

      {/* Footer Details & Actions */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2 text-xs text-gray-500">
        
        {/* Rating & Downloads */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-gray-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{app.rating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 font-medium text-gray-600">
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>{app.downloadCount}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5">
          {installProgress ? (
            installProgress.status === 'download_completed' ? (
              <button
                onClick={(e) => onToggleInstall(app, e)}
                className="px-4 py-1.5 rounded-xl font-extrabold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                <Download className="w-3.5 h-3.5" />
                Pasang
              </button>
            ) : (
              <button
                onClick={(e) => onToggleInstall(app, e)}
                className="px-3 py-1.5 rounded-xl font-bold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 hover:bg-emerald-100 transition-colors shadow-3xs"
                title="Klik untuk membatalkan proses install"
              >
                {installProgress.status === 'pending' ? (
                  <>
                    <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Pending</span>
                  </>
                ) : installProgress.status === 'downloading' ? (
                  <>
                    <span className="font-extrabold text-emerald-700">{Math.round(installProgress.progress)}%</span>
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-rose-600 transition-colors" />
                  </>
                ) : installProgress.status === 'installing' ? (
                  <>
                    <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Menginstall</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Selesai</span>
                  </>
                )}
              </button>
            )
          ) : app.isInstalled ? (
            <button
              onClick={(e) => onToggleInstall(app, e)}
              className="px-3.5 py-1.5 rounded-xl font-extrabold text-xs bg-gray-50 text-emerald-700 hover:bg-gray-100 flex items-center gap-1 transition-all border border-gray-200 hover:border-emerald-300 shadow-3xs"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Terinstall
            </button>
          ) : (
            <button
              onClick={(e) => onToggleInstall(app, e)}
              className="px-4 py-1.5 rounded-xl font-extrabold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
