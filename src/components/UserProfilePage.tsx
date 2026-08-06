import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserCheck,
  Building2,
  Clock,
  BadgeCheck,
  Send,
  AlertCircle,
  Code2,
  Upload,
  MessageCircle,
  ShieldCheck,
  LogOut,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Trash2,
  KeyRound,
  User,
  Settings,
  Mail,
  Smartphone,
  Calendar,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Lock,
  Edit3,
  Check
} from 'lucide-react';
import { ProjectApp, UserAccount, UserRole } from '../types';

interface UserProfilePageProps {
  currentUser: UserAccount | null;
  allApps: ProjectApp[];
  installedApps: ProjectApp[];
  wishlistApps: ProjectApp[];
  users: UserAccount[];
  onBack: () => void;
  onApplyBecomeDeveloper: (studioName: string, whatsappNumber: string, reason: string) => void;
  onUpdateUserProfile?: (updatedUser: Partial<UserAccount>) => void;
  onOpenAuthModal: () => void;
  onOpenDevConsole: () => void;
  onSelectApp: (app: ProjectApp) => void;
  onToggleInstall: (app: ProjectApp) => void;
  onToggleWishlist: (app: ProjectApp) => void;
  onApproveDeveloper?: (userId: string) => void;
  onRejectDeveloper?: (userId: string) => void;
  onLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  allApps,
  installedApps,
  wishlistApps,
  users,
  onBack,
  onApplyBecomeDeveloper,
  onUpdateUserProfile,
  onOpenAuthModal,
  onOpenDevConsole,
  onSelectApp,
  onToggleInstall,
  onToggleWishlist,
  onApproveDeveloper,
  onRejectDeveloper,
  onLogout
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [activeTab, setActiveTab] = useState<'developer' | 'collection' | 'settings' | 'admin_approvals'>('developer');

  // Developer Form State
  const [studioName, setStudioName] = useState(currentUser?.developerStudioName || (currentUser?.name ? `${currentUser.name} Studio` : ''));
  const [waInput, setWaInput] = useState(currentUser?.whatsappNumber || '6281234567890');
  const [editDevBio, setEditDevBio] = useState(currentUser?.developerBio || '');
  const [editDevWebsite, setEditDevWebsite] = useState(currentUser?.developerWebsite || '');
  const [reasonInput, setReasonInput] = useState(currentUser?.developerReason || '');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Edit Profile State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editPassword, setEditPassword] = useState(currentUser?.password || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [editBannerUrl, setEditBannerUrl] = useState(currentUser?.bannerUrl || '');
  const [editSavedToast, setEditSavedToast] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setStudioName(currentUser.developerStudioName || `${currentUser.name} Studio`);
      setWaInput(currentUser.whatsappNumber || '6281234567890');
      setEditDevBio(currentUser.developerBio || '');
      setEditDevWebsite(currentUser.developerWebsite || '');
      setReasonInput(currentUser.developerReason || '');
      setEditName(currentUser.name);
      setEditBio(currentUser.bio || '');
      setEditPassword(currentUser.password || '');
      setEditAvatarUrl(currentUser.avatarUrl || '');
      setEditBannerUrl(currentUser.bannerUrl || '');
    }
  }, [currentUser]);

  const handleDevFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    if (!studioName.trim() || !waInput.trim()) {
      alert('Mohon lengkapi Nama Studio Developer dan Nomor WhatsApp kontak Anda.');
      return;
    }
    onApplyBecomeDeveloper(studioName.trim(), waInput.trim(), reasonInput.trim());
    setShowToast('Pengajuan Developer Studio berhasil dikirim! Menunggu persetujuan (ACC) dari Admin.');
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onUpdateUserProfile) return;

    const updatedFields: Partial<typeof currentUser> = {
      name: editName.trim(),
      bio: editBio.trim(),
      password: editPassword.trim(),
      developerStudioName: studioName.trim(),
      whatsappNumber: waInput.trim(),
      developerBio: editDevBio.trim(),
      developerWebsite: editDevWebsite.trim(),
    };

    // Hanya update avatar/banner jika diisi (jangan hapus foto lama)
    if (editAvatarUrl.trim()) updatedFields.avatarUrl = editAvatarUrl.trim();
    if (editBannerUrl.trim()) updatedFields.bannerUrl = editBannerUrl.trim();

    onUpdateUserProfile(updatedFields);
    setEditSavedToast(true);
    setTimeout(() => setEditSavedToast(false), 3000);
  };


  const pendingDevUsers = users.filter((u) => u.developerStatus === 'pending');
  const isAdmin = currentUser?.role === 'admin';
  const isDeveloper = currentUser?.role === 'developer' || currentUser?.developerStatus === 'approved';

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 animate-fade-in">
      
      {/* Top Sticky Nav Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black text-gray-800 hover:text-emerald-600 bg-gray-100 hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-gray-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Store</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-gray-700 hidden sm:inline">Halaman Profil & Akun Saya</span>
          
          {currentUser && (
            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Global Toast Notification */}
        {showToast && (
          <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-lg border border-amber-600 flex items-center justify-between animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 shrink-0 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm">Pengajuan Terkirim!</h4>
                <p className="text-xs text-amber-100">{showToast}</p>
              </div>
            </div>
            <span className="text-xs font-black bg-black/20 px-3 py-1 rounded-full">PENDING</span>
          </div>
        )}

        {/* Top Header Profile Banner */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden relative">
          
          {/* Top Banner Gradient or Image */}
          <div className="h-40 sm:h-52 relative overflow-hidden bg-slate-900">
            {currentUser?.bannerUrl ? (
              <>
                <img src={currentUser.bannerUrl} alt="Profile Banner" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
              </>
            )}
            
            {/* Top Right Role Pill */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              {currentUser ? (
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-md ${
                  isAdmin
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 backdrop-blur-md'
                    : isDeveloper
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md'
                    : currentUser.developerStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md'
                    : 'bg-white/10 text-white border border-white/20 backdrop-blur-md'
                }`}>
                  <BadgeCheck className="w-4 h-4" />
                  {isAdmin
                    ? 'Super Admin Valora Store'
                    : isDeveloper
                    ? 'Developer Official Terverifikasi'
                    : currentUser.developerStatus === 'pending'
                    ? 'Pemohon Developer (Pending)'
                    : 'Valora Member'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                  Tamu / Belum Login
                </span>
              )}
            </div>
          </div>

          {/* Profile Basic Info Row */}
          <div className="px-6 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-4xl sm:text-5xl flex items-center justify-center border-4 border-white shadow-2xl ring-4 ring-emerald-50 shrink-0 overflow-hidden relative group">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    currentUser?.name.charAt(0) || 'U'
                  )}
                  <div className="absolute inset-0 shadow-inner rounded-full pointer-events-none" />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {currentUser?.name || 'Pengguna Valora Store'}
                    </h1>
                    {currentUser?.loginMethod && (
                      <span className="px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-sm">
                        {currentUser.loginMethod === 'Google' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        {currentUser.loginMethod === 'Facebook' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                        {currentUser.loginMethod === 'GitHub' && <span className="w-2 h-2 rounded-full bg-gray-800"></span>}
                        {currentUser.loginMethod === 'Email' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                        Masuk via {currentUser.loginMethod}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 font-medium flex items-center gap-3 flex-wrap">
                    <span>
                      {currentUser?.email || 'Belum Login'}
                    </span>
                    <span>
                      Bergabung: {currentUser?.joinedDate || '2024'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {!currentUser && (
                  <button
                    onClick={onOpenAuthModal}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Masuk / Register Akun</span>
                  </button>
                )}

                {(isDeveloper || isAdmin) && (
                  <button
                    onClick={onOpenDevConsole}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Developer Console / Unggah APK</span>
                  </button>
                )}
              </div>

            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-2xl border border-emerald-200/60 shadow-sm space-y-1.5 hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Aplikasi Terpasang</span>
                <div className="text-lg sm:text-xl font-black text-emerald-950 flex items-center gap-2 relative z-10">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{installedApps.length} APK</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 p-5 rounded-2xl border border-teal-200/60 shadow-sm space-y-1.5 hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">Wishlist Tersimpan</span>
                <div className="text-lg sm:text-xl font-black text-teal-950 flex items-center gap-2 relative z-10">
                  <Bookmark className="w-5 h-5 text-teal-600" />
                  <span>{wishlistApps.length} Item</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-2xl border border-amber-200/60 shadow-sm space-y-1.5 hover:shadow-md transition-shadow relative overflow-hidden group">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Status Akses Developer</span>
                <div className="text-sm font-black text-amber-950 flex items-center gap-1.5 pt-0.5 relative z-10">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">
                    {isAdmin
                      ? 'Super Admin'
                      : isDeveloper
                      ? 'Dev Verified'
                      : currentUser?.developerStatus === 'pending'
                      ? 'Menunggu ACC'
                      : 'Member Biasa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
              
              <button
                onClick={() => setActiveTab('developer')}
                className={`pb-3 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'developer'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Status & Fitur Developer</span>
                {currentUser?.developerStatus === 'pending' && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full animate-pulse">
                    ACC Pending
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('collection')}
                className={`pb-3 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'collection'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>Koleksi Saya ({installedApps.length + wishlistApps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Akun</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin_approvals')}
                  className={`pb-3 text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    activeTab === 'admin_approvals'
                      ? 'text-purple-700 border-b-2 border-purple-600'
                      : 'text-purple-600 hover:text-purple-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Persetujuan Admin ACC ({pendingDevUsers.length})</span>
                </button>
              )}

            </div>

          </div>
        </div>

        {/* TAB 1: Developer Feature & ACC Request */}
        {activeTab === 'developer' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 space-y-6 shadow-2xs">
            
            {/* Case A: Not Logged In */}
            {!currentUser && (
              <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4 text-center">
                <Building2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black">Ingin Mengunggah APK Sebagai Developer?</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Silakan masuk atau buat akun Valora Store terlebih dahulu untuk dapat mengajukan izin developer ke Admin.
                  </p>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Login / Register Akun Sekarang</span>
                </button>
              </div>
            )}

            {/* Case B: Approved Developer or Admin */}
            {currentUser && (isDeveloper || isAdmin) && (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <BadgeCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-emerald-950">
                      Status: Pengembang Terverifikasi (Official Developer)
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium">
                      Studio Anda: <b>{currentUser.developerStudioName || currentUser.name}</b>. Anda memiliki hak akses penuh untuk mengunggah, memperbarui, dan mengelola aplikasi di Valora Store.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={onOpenDevConsole}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Buka Developer Console / Unggah APK Baru</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case C: Pending ACC State */}
            {currentUser && !isDeveloper && !isAdmin && currentUser.developerStatus === 'pending' && (
              <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-5 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-amber-950">Status: Menunggu Persetujuan Admin (ACC)</h3>
                      <span className="px-3 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase">
                        PENDING ACC
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 font-normal leading-relaxed">
                      Pengajuan Developer Studio Anda dikirimkan pada <b>{currentUser.developerRequestDate || 'Hari ini'}</b> dan sedang dalam antrean peninjauan Admin.
                    </p>
                  </div>
                </div>

                {/* Submitted Details Box */}
                <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-3 text-xs">
                  <h4 className="font-extrabold text-gray-900 text-sm border-b border-amber-100 pb-2">Rincian Data Pengajuan Anda:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500 font-medium block">Nama Studio Developer:</span>
                      <span className="font-extrabold text-gray-900 text-sm">{currentUser.developerStudioName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block">Kontak WhatsApp:</span>
                      <span className="font-extrabold text-emerald-700 text-sm">+{currentUser.whatsappNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-gray-500 font-medium block">Deskripsi & Rencana APK:</span>
                    <p className="text-gray-800 font-medium bg-amber-50/60 p-3 rounded-xl border border-amber-100 italic">
                      "{currentUser.developerReason || 'Ingin mempublikasikan APK ke toko.'}"
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-100/80 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Harap tunggu persetujuan Admin (ACC). Setelah disetujui, tombol untuk mengunggah APK akan otomatis terbuka di halaman ini!</span>
                </div>
              </div>
            )}

            {/* Case D: Form to Register as Developer */}
            {currentUser && !isDeveloper && !isAdmin && currentUser.developerStatus !== 'pending' && (
              <form onSubmit={handleDevFormSubmit} className="space-y-6">
                <div className="border-b border-gray-200 pb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-gray-900">Form Pendaftaran Developer Studio</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Isi data studio Anda di bawah ini untuk mengajukan hak akses Developer ke Admin. Anda harus menunggu persetujuan (ACC) Admin sebelum dapat mengunggah APK.
                  </p>
                </div>

                {currentUser.developerStatus === 'rejected' && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Pengajuan sebelumnya belum disetujui oleh Admin. Silakan lengkapi ulang data Anda dan kirim kembali permohonan.</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nama Studio / Pengembang Developer *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="Contoh: Arumsari Dev Studio"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomor WhatsApp Kontak (Untuk Konfirmasi Admin) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={waInput}
                      onChange={(e) => setWaInput(e.target.value)}
                      placeholder="Contoh: 6281234567890"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Deskripsi Karya & Alasan Ingin Menjadi Developer</span>
                    </label>
                    <textarea
                      rows={3}
                      value={reasonInput}
                      onChange={(e) => setReasonInput(e.target.value)}
                      placeholder="Ceritakan aplikasi/game buatan Anda yang ingin Anda publikasikan ke Valora Store..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pengajuan ke Admin (Minta ACC)</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* TAB 2: Collection & Installed Apps */}
        {activeTab === 'collection' && (
          <div className="space-y-6">
            
            {/* Installed Apps */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aplikasi & Game Terpasang ({installedApps.length})</span>
                </h3>
              </div>

              {installedApps.length === 0 ? (
                <div className="py-8 text-center text-gray-400 space-y-2">
                  <p className="text-xs font-medium">Belum ada aplikasi yang terpasang dari store.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {installedApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onSelectApp(app)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <img
                          src={app.iconUrl}
                          alt={app.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-gray-900 truncate">{app.title}</h4>
                          <span className="text-[10px] text-gray-500 block truncate">{app.developer}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            Terpasang
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleInstall(app)}
                        className="p-2 rounded-xl hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Copot Pemasangan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Items */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/90 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-teal-600" />
                  <span>Wishlist / Item Tersimpan ({wishlistApps.length})</span>
                </h3>
              </div>

              {wishlistApps.length === 0 ? (
                <div className="py-8 text-center text-gray-400 space-y-2">
                  <p className="text-xs font-medium">Belum ada item wishlist yang disimpan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wishlistApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 flex items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onSelectApp(app)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <img
                          src={app.iconUrl}
                          alt={app.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-gray-900 truncate">{app.title}</h4>
                          <span className="text-[10px] text-gray-500 block truncate">{app.developer}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleInstall(app)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-extrabold hover:bg-emerald-700 transition-all cursor-pointer"
                        >
                          Pasang
                        </button>
                        <button
                          onClick={() => onToggleWishlist(app)}
                          className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Hapus dari wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: Account Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 space-y-6 shadow-2xs">
            <div className="border-b border-gray-200 pb-4 space-y-1">
              <h3 className="text-lg font-black text-gray-900">Pengaturan Profil & Keamanan</h3>
              <p className="text-xs text-gray-500 font-medium">Perbarui informasi diri dan kredensial akun Anda.</p>
            </div>

            {editSavedToast && (
              <div className="p-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-black flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Perubahan profil berhasil disimpan!</span>
              </div>
            )}

            {currentUser ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Nama Lengkap Akun</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">URL Avatar / Foto Profil</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">URL Banner Profil</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editBannerUrl}
                      onChange={(e) => setEditBannerUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-gray-800">Bio Singkat</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-emerald-500 transition-all"
                  />
                </div>
                {(!currentUser.loginMethod || currentUser.loginMethod === 'Email') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-800">Password Akun</label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-emerald-500 transition-all"
                    />
                  </div>
                )}

                {isDeveloper && (
                  <div className="pt-4 border-t border-gray-200 mt-4 space-y-4">
                    <h4 className="text-sm font-black text-emerald-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Profil Studio Developer
                    </h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-800">Nama Studio / Pengembang</label>
                      <input
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-800">Nomor WhatsApp Bisnis</label>
                      <input
                        type="text"
                        value={waInput}
                        onChange={(e) => setWaInput(e.target.value)}
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-800">Domain Portofolio / Website</label>
                      <input
                        type="text"
                        placeholder="Contoh: devplay.store"
                        value={editDevWebsite}
                        onChange={(e) => setEditDevWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-900 focus:outline-emerald-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-gray-800">Deskripsi / Tentang Pengembang</label>
                      <textarea
                        rows={3}
                        value={editDevBio}
                        onChange={(e) => setEditDevBio(e.target.value)}
                        placeholder="Ceritakan tentang pengalaman, spesialisasi, dan fokus studio Anda..."
                        className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 focus:outline-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-gray-500 font-medium">Silakan masuk untuk mengubah profil Anda.</p>
            )}
          </div>
        )}

        {/* TAB 4: Admin ACC Approvals (Admin Only) */}
        {activeTab === 'admin_approvals' && isAdmin && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 space-y-6 shadow-2xs">
            <div className="border-b border-purple-100 pb-4 space-y-1">
              <h3 className="text-lg font-black text-purple-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Panel Persetujuan Developer Studio (Admin ACC)</span>
              </h3>
              <p className="text-xs text-purple-800 font-medium">
                Berikan persetujuan (ACC) kepada pemohon agar akun mereka mendapatkan peran Developer dan dapat mengunggah APK.
              </p>
            </div>

            {pendingDevUsers.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-gray-700">Tidak ada pengajuan developer yang menunggu ACC saat ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDevUsers.map((pUser) => (
                  <div key={pUser.id} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={pUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={pUser.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-amber-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-sm text-gray-900 truncate">{pUser.name}</h4>
                        <span className="text-xs text-emerald-700 font-extrabold block">Studio: {pUser.developerStudioName || '-'}</span>
                        <span className="text-[11px] text-gray-500">{pUser.email}</span>
                      </div>
                    </div>

                    {pUser.developerReason && (
                      <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-amber-200 font-medium italic">
                        "{pUser.developerReason}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                      <span className="text-[10px] font-bold text-gray-500">Tgl: {pUser.developerRequestDate || 'Hari ini'}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onApproveDeveloper?.(pUser.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          ✓ ACC / Setujui
                        </button>
                        <button
                          onClick={() => onRejectDeveloper?.(pUser.id)}
                          className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-gray-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
