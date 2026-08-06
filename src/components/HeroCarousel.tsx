import React, { useState, useEffect } from 'react';
import { ProjectApp } from '../types';
import { Star, Play, ChevronRight, ShieldCheck, Download } from 'lucide-react';

interface HeroCarouselProps {
  featuredApps: ProjectApp[];
  onSelectApp: (app: ProjectApp) => void;
  onOpenLiveDemo: (app: ProjectApp) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  featuredApps,
  onSelectApp,
  onOpenLiveDemo
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredApps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredApps.length]);

  if (!featuredApps || featuredApps.length === 0) return null;

  const currentApp = featuredApps[currentIndex];

  return (
    <div className="relative my-4 sm:my-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 text-gray-900 shadow-sm border border-gray-200/80">
      {/* Background Banner with ambient blur */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <img
          src={currentApp.bannerUrl}
          alt={currentApp.title}
          className="w-full h-full object-cover filter blur-2xl scale-125 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mobile Featured Card Layout (Google Play Style) */}
        <div className="block sm:hidden space-y-3">
          {/* Top Banner Artwork with Tagline Overlay */}
          <div
            onClick={() => onSelectApp(currentApp)}
            className="relative h-44 rounded-xl overflow-hidden cursor-pointer shadow-md group"
          >
            <img
              src={currentApp.bannerUrl || currentApp.screenshots[0] || currentApp.iconUrl}
              alt={currentApp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay & Tagline text */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-3.5">
              <p className="text-sm font-black text-white leading-tight drop-shadow-md line-clamp-2">
                {currentApp.tagline}
              </p>
            </div>
          </div>

          {/* Bottom App Info Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div
              onClick={() => onSelectApp(currentApp)}
              className="flex items-center gap-3 min-w-0 cursor-pointer"
            >
              <img
                src={currentApp.iconUrl}
                alt={currentApp.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-250 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-gray-900 truncate">
                  {currentApp.title}
                </h2>
                <p className="text-[11px] text-gray-500 truncate font-semibold">
                  {currentApp.developer} • <span className="text-amber-500 font-bold">★ {currentApp.rating}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectApp(currentApp)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shrink-0 transition-all shadow-sm active:scale-95"
            >
              Instal / Gratis
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Rich Layout */}
        <div className="hidden sm:flex flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-4 max-w-2xl">
            {/* Badge & Developer Tag */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-250">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {currentApp.badge || 'Pilihan Utama'}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                oleh <span className="text-gray-900 font-bold">{currentApp.developer}</span>
              </span>
            </div>

            {/* App Title & Tagline */}
            <div>
              <h2
                onClick={() => onSelectApp(currentApp)}
                className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors"
              >
                {currentApp.title}
              </h2>
              <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
                {currentApp.tagline}
              </p>
            </div>

            {/* Metrics bar */}
            <div className="flex items-center gap-6 text-xs text-gray-500 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{currentApp.rating}</span>
                <span className="text-gray-400 font-normal">({currentApp.reviewCount})</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1 text-gray-600 font-semibold">
                <Download className="w-3.5 h-3.5 text-emerald-650" />
                <span>{currentApp.downloadCount} Pengujian</span>
              </div>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1 text-gray-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-650" />
                <span>{currentApp.category}</span>
              </div>
            </div>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {currentApp.techStack.map((tech) => (
                <span key={tech} className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onSelectApp(currentApp)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-97 flex items-center gap-2 cursor-pointer"
              >
                Lihat Detail Aplikasi
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content - App Icon Showcase Card */}
          <div className="relative shrink-0">
            <div className="relative group cursor-pointer" onClick={() => onSelectApp(currentApp)}>
              <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gray-50 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={currentApp.iconUrl}
                  alt={currentApp.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Live Indicator Dot */}
              <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md border border-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                LIVE DEMO
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Slide Navigation Dots */}
      {featuredApps.length > 1 && (
        <div className="pb-3 flex justify-center items-center gap-1.5">
          {featuredApps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-emerald-500' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

