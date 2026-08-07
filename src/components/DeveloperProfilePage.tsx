import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  MessageCircle,
  Star,
  Download,
  Award,
  ShieldCheck,
  Calendar,
  MapPin,
  Zap,
  Layers,
  Globe,
  Share2,
  Sparkles,
  ChevronRight,
  Building2,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { ProjectApp, UserAccount } from '../types';

interface DeveloperProfilePageProps {
  developerName: string;
  allApps: ProjectApp[];
  currentUser: UserAccount | null;
  users: UserAccount[];
  onBack: () => void;
  onSelectApp: (app: ProjectApp) => void;
  onUpdateUserProfile?: (updatedFields: Partial<UserAccount>) => void;
}

export const DeveloperProfilePage: React.FC<DeveloperProfilePageProps> = ({
  developerName,
  allApps,
  currentUser,
  users,
  onBack,
  onSelectApp,
  onUpdateUserProfile
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [developerName]);

  const devApps = allApps.filter(
    (app) => app.developer.toLowerCase().trim() === developerName.toLowerCase().trim()
  );

  // Fallback to display apps if no direct match
  const displayApps = devApps.length > 0 ? devApps : allApps;

  // Ambil email dari apps developer ini (untuk pencocokan akun)
  const devEmailFromApps = devApps[0]?.developerEmail || '';

  // Find Developer Account details if registered
  // Cocokkan berdasarkan: studioName, name, atau email dari apps
  const devAccount = users.find(
    (u) =>
      (u.developerStudioName && u.developerStudioName.toLowerCase().trim() === developerName.toLowerCase().trim()) ||
      (u.name && u.name.toLowerCase().trim() === developerName.toLowerCase().trim()) ||
      (devEmailFromApps && u.email && u.email.toLowerCase() === devEmailFromApps.toLowerCase()) ||
      (devEmailFromApps && u.developerEmail && u.developerEmail.toLowerCase() === devEmailFromApps.toLowerCase())
  );

  // Cek apakah user yang sedang login adalah pemilik profil ini
  // Tidak harus tergantung devAccount ditemukan — cukup cek ID atau nama
  const isOwner = !!(currentUser && (
    devAccount?.id === currentUser.id ||
    currentUser.developerStudioName?.toLowerCase().trim() === developerName.toLowerCase().trim() ||
    currentUser.name?.toLowerCase().trim() === developerName.toLowerCase().trim()
  ));

  // Jika owner, langsung pakai currentUser sebagai sumber data yang paling akurat
  // Jika bukan owner, pakai devAccount dari users array
  const effectiveAccount = isOwner ? currentUser : devAccount;

  // Nama yang akan ditampilkan di profil (prioritas data terbaru dari effectiveAccount)
  const displayDeveloperName = effectiveAccount?.developerStudioName || effectiveAccount?.name || developerName;

  // Gunakan foto profil dan banner dari akun asli di database
  const devAvatar = effectiveAccount?.avatarUrl || '';
  const devBanner = effectiveAccount?.bannerUrl || '';

  const sampleEmail = effectiveAccount?.developerEmail || effectiveAccount?.email || displayApps[0]?.developerEmail || 'developer@valorastore.com';
  const waNumber = effectiveAccount?.whatsappNumber || displayApps[0]?.whatsappNumber || '6281234567890';
  const devBioText = effectiveAccount?.developerBio || `${displayDeveloperName} adalah pengembang perangkat lunak profesional berpengalaman dalam membangun aplikasi web modern, sistem AI terintegrasi, serta solusi piranti lunak berperforma tinggi. Memiliki komitmen tinggi terhadap kualitas kode bersih (clean code) dan dukungan purna jual.`;
  const devWebsite = effectiveAccount?.developerWebsite || '';

  // Compute developer stats
  const totalAppsCount = displayApps.length;
  const totalDownloadsNum = displayApps.reduce((acc, item) => acc + (item.downloadCountNum || 120000), 0);
  const avgRating = (
    displayApps.reduce((acc, item) => acc + item.rating, 0) / (displayApps.length || 1)
  ).toFixed(1);

  // Developer Level Tier
  const getTier = (count: number) => {
    if (count >= 10) return { title: 'Master Developer (Level 5)', level: 5, badge: 'Grand Master', color: 'from-emerald-600 to-teal-700' };
    if (count >= 5) return { title: 'Senior Developer (Level 4)', level: 4, badge: 'Verified Senior', color: 'from-emerald-500 to-emerald-700' };
    if (count >= 3) return { title: 'Pro Developer (Level 3)', level: 3, badge: 'Verified Pro', color: 'from-teal-500 to-emerald-600' };
    return { title: 'Rising Developer (Level 2)', level: 2, badge: 'Active Creator', color: 'from-emerald-400 to-teal-500' };
  };

  const devTier = getTier(totalAppsCount);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'achievements' | 'about'>('portfolio');
  const [copiedShare, setCopiedShare] = useState(false);

  // Edit Studio Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editStudioName, setEditStudioName] = useState(effectiveAccount?.developerStudioName || '');
  const [editWa, setEditWa] = useState(effectiveAccount?.whatsappNumber || '');
  const [editDevEmail, setEditDevEmail] = useState(effectiveAccount?.developerEmail || effectiveAccount?.email || '');
  const [editWebsite, setEditWebsite] = useState(effectiveAccount?.developerWebsite || '');
  const [editBio, setEditBio] = useState(effectiveAccount?.developerBio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(effectiveAccount?.avatarUrl || '');
  const [editBannerUrl, setEditBannerUrl] = useState(effectiveAccount?.bannerUrl || '');
  const [savedToast, setSavedToast] = useState(false);

  // Sync edit fields when effectiveAccount changes
  useEffect(() => {
    if (effectiveAccount) {
      setEditStudioName(effectiveAccount.developerStudioName || '');
      setEditWa(effectiveAccount.whatsappNumber || '');
      setEditDevEmail(effectiveAccount.developerEmail || effectiveAccount.email || '');
      setEditWebsite(effectiveAccount.developerWebsite || '');
      setEditBio(effectiveAccount.developerBio || '');
      setEditAvatarUrl(effectiveAccount.avatarUrl || '');
      setEditBannerUrl(effectiveAccount.bannerUrl || '');
    }
  }, [effectiveAccount]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUserProfile) return;
    const updatedFields: Partial<UserAccount> = {
      developerStudioName: editStudioName.trim(),
      whatsappNumber: editWa.trim(),
      developerEmail: editDevEmail.trim(),
      developerWebsite: editWebsite.trim(),
      developerBio: editBio.trim(),
    };
    if (editAvatarUrl.trim()) updatedFields.avatarUrl = editAvatarUrl.trim();
    if (editBannerUrl.trim()) updatedFields.bannerUrl = editBannerUrl.trim();
    onUpdateUserProfile(updatedFields);
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 animate-fade-in">
      
      {/* Top sticky navigation bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black text-gray-800 hover:text-emerald-600 bg-gray-100 hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-gray-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Store</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 hidden sm:inline">Halaman Profil Pengembang</span>
          
          {/* Edit button — hanya tampil untuk pemilik profil */}
          {isOwner && onUpdateUserProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl transition-colors border cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isEditing
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border-gray-200'
              }`}
              title="Edit Profil Studio"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEditing ? 'Sedang Edit...' : 'Edit Profil'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Bagikan Profil"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedShare ? 'Tersalin!' : 'Bagikan'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Toast Saved */}
        {savedToast && (
          <div className="p-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg">
            <Check className="w-4 h-4" />
            <span>Profil Studio berhasil disimpan!</span>
          </div>
        )}

        {/* Inline Edit Form — hanya tampil untuk pemilik profil saat mode edit */}
        {isOwner && isEditing && onUpdateUserProfile && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Edit Profil Studio Developer
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Nama Studio / Pengembang</label>
                  <input
                    type="text"
                    value={editStudioName}
                    onChange={(e) => setEditStudioName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Nomor WhatsApp Bisnis</label>
                  <input
                    type="text"
                    value={editWa}
                    onChange={(e) => setEditWa(e.target.value)}
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Kontak Email Resmi</label>
                  <input
                    type="email"
                    value={editDevEmail}
                    onChange={(e) => setEditDevEmail(e.target.value)}
                    placeholder="developer@email.com"
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Domain Portofolio / Website</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="Contoh: devplay.store"
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">URL Foto Profil / Avatar</label>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-700">URL Banner Profil</label>
                  <input
                    type="url"
                    value={editBannerUrl}
                    onChange={(e) => setEditBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-gray-700">Deskripsi / Tentang Pengembang</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Ceritakan tentang pengalaman, spesialisasi, dan fokus studio Anda..."
                  className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 focus:outline-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </form>
          </div>
        )}

        {/* Main Header Banner Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden relative">
          
          {/* Top Decorative Gradient Banner */}
          <div 
            className="h-48 sm:h-64 bg-slate-900 relative overflow-hidden bg-cover bg-center"
            style={devBanner ? { backgroundImage: `url(${devBanner})` } : undefined}
          >
            {!devBanner && (
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
            )}
            
            {/* Top Right Verified Badge Floating */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-lg">
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pengembang Terverifikasi Valora Store</span>
            </div>
          </div>

          {/* Profile Details Header Section */}
          <div className="px-6 sm:px-8 pb-8 relative">
            
            {/* Avatar & Title Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Large Avatar Badge */}
                {devAvatar ? (
                  <img
                    src={devAvatar}
                    alt={displayDeveloperName}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-emerald-600 text-white font-black text-5xl sm:text-6xl flex items-center justify-center border-4 border-white shadow-xl shrink-0">
                    {displayDeveloperName.charAt(0)}
                  </div>
                )}

                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                      {displayDeveloperName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                      <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      {devTier.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" /> Indonesia
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" /> Bergabung 2024
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> {devTier.title}
                    </span>
                  </p>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
                <a
                  href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(displayDeveloperName)},%20saya%20tertarik%20dengan%20portofolio%20aplikasi%20Anda%20di%20Valora%20Store.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Key Performance Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
              <div className="bg-teal-50/80 rounded-2xl p-4 border border-teal-200/90 space-y-1 shadow-2xs">
                <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider block">Total Project</span>
                <div className="text-xl sm:text-2xl font-black text-teal-950 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{totalAppsCount} Aplikasi</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/90 space-y-1 shadow-2xs">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">Total Download</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{(totalDownloadsNum / 1000).toFixed(0)}K+</span>
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/90 space-y-1 shadow-2xs">
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider block">Rata-rata Rating</span>
                <div className="text-xl sm:text-2xl font-black text-amber-950 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500 shrink-0" />
                  <span>{avgRating} / 5.0</span>
                </div>
              </div>

              <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/90 space-y-1 shadow-2xs">
                <span className="text-[11px] font-extrabold text-purple-800 uppercase tracking-wider block">Level Badge</span>
                <div className="text-xl sm:text-2xl font-black text-purple-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Level {devTier.level}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 sm:gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-3.5 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer relative ${
                  activeTab === 'portfolio'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Portofolio Aplikasi ({totalAppsCount})
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`pb-3.5 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer relative ${
                  activeTab === 'achievements'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pencapaian & Sertifikasi
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3.5 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer relative ${
                  activeTab === 'about'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Informasi Pengembang
              </button>
            </div>

          </div>
        </div>

        {/* Tab Content 1: Portfolio Apps */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Seluruh Karya Aplikasi Oleh {displayDeveloperName}</span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                {displayApps.length} Project Publik
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApp(app)}
                  className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
                >
                  <img
                    src={app.iconUrl}
                    alt={app.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-200 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {app.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{app.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {app.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1 font-normal">
                      {app.tagline}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Achievements & Badges */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 space-y-6 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Pencapaian & Jaminan Kualitas</h3>
              <p className="text-xs text-gray-500 font-medium pt-0.5">
                Sertifikasi standar keamanan dan performa aplikasi dari platform Valora Store
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-950">Valora Security Verified</h4>
                  <p className="text-xs text-gray-700 font-normal leading-relaxed">
                    Seluruh source code telah lolos uji audit keamanan otomatis dan tidak mengandung malware atau kode berbahaya.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-amber-950">Top Code Quality Certificate</h4>
                  <p className="text-xs text-gray-700 font-normal leading-relaxed">
                    Struktur repositori bersih dengan arsitektur modular TypeScript & dokumentasi instalasi lengkap.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-blue-950">Fast Response Developer</h4>
                  <p className="text-xs text-gray-700 font-normal leading-relaxed">
                    Merespon pertanyaan pembeli & pelaporan bug rata-rata dalam waktu kurang dari 2 jam via WhatsApp.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-950">100K+ Download Club</h4>
                  <p className="text-xs text-gray-700 font-normal leading-relaxed">
                    Telah melayani lebih dari 100 ribu pengguna aktif di berbagai platform web dan mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: About Developer */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200/90 space-y-6 shadow-2xs">
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-gray-900">Tentang Pengembang</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-normal whitespace-pre-wrap">
                {devBioText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">Kontak Email Resmi</span>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sampleEmail}</span>
                </p>
              </div>

              {devWebsite && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider">Domain Portofolio</span>
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`https://${devWebsite.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:text-emerald-700 transition-colors">
                      {devWebsite}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
