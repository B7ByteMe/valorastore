import React, { useState, useEffect } from 'react';
import { ProjectApp, UserAccount, UserRole, CategoryType, PlatformType } from '../types';
import {
  X,
  ShieldCheck,
  Users,
  Upload,
  Package,
  Zap,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Search,
  UserCheck,
  UserX,
  KeyRound,
  Building2,
  Layers,
  Download,
  Bookmark,
  Star,
  MessageSquare,
  Lock,
  ArrowRight,
  ExternalLink,
  Laptop,
  Smartphone,
  RefreshCw,
  Eye
} from 'lucide-react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  users: UserAccount[];
  apps: ProjectApp[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: (newUser: UserAccount) => void;
  onSaveApp: (app: ProjectApp) => void;
  onDeleteApp: (appId: string) => void;
  onOpenAppDetail: (app: ProjectApp) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onApproveDeveloper?: (userId: string) => void;
  onRejectDeveloper?: (userId: string) => void;
  initialTab?: 'overview' | 'dev_acc' | 'upload_app' | 'manage_apps' | 'manage_users' | 'my_library' | 'profile_settings';
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  apps,
  onUpdateUserRole,
  onToggleUserStatus,
  onDeleteUser,
  onAddUser,
  onSaveApp,
  onDeleteApp,
  onOpenAppDetail,
  onLogout,
  onOpenAuthModal,
  onApproveDeveloper,
  onRejectDeveloper,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dev ACC Filter State
  const [devAccFilter, setDevAccFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form (Admin creation)
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccRole, setNewAccRole] = useState<UserRole>('user');
  const [newAccStudio, setNewAccStudio] = useState('');

  // App Upload Form State (Inside Dashboard)
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<CategoryType>('Tools');
  const [platform, setPlatform] = useState<PlatformType>('Web');
  const [version, setVersion] = useState('1.0.0');
  const [size, setSize] = useState('15 MB');
  const [sourceCodePrice, setSourceCodePrice] = useState('Gratis / Open Source');
  const [iconUrl, setIconUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, Tailwind');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Fitur 1: Antarmuka modern\nFitur 2: Performa cepat');
  const [whatsNew, setWhatsNew] = useState('Rilis versi perdana ke Valora Store.');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Gemini AI Assistant State inside Dashboard
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const isAdmin = currentUser.role === 'admin';
  const isDeveloper = currentUser.role === 'developer' || isAdmin;

  // Protect tab access according to role
  useEffect(() => {
    if (!isDeveloper && (activeTab === 'upload_app' || activeTab === 'manage_apps')) {
      setActiveTab('overview');
    }
    if (!isAdmin && activeTab === 'manage_users') {
      setActiveTab('overview');
    }
  }, [currentUser, activeTab, isDeveloper, isAdmin]);

  if (!isOpen) return null;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  // User's own apps or all apps for admin
  const userApps = isAdmin ? apps : apps.filter((a) => a.developerEmail === currentUser.email || a.developer.toLowerCase().includes(currentUser.name.toLowerCase()));

  // AI Generator in Dashboard Upload
  const handleGenerateAI = async () => {
    if (!title) {
      alert('Masukkan Nama Aplikasi terlebih dahulu.');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/generate-app-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          tagline,
          techStack: techStackInput,
          prompt: aiPrompt
        })
      });
      const json = await response.json();
      if (json.success && json.data) {
        if (json.data.fullDescription) setDescription(json.data.fullDescription);
        if (json.data.featureHighlights) setFeaturesInput(json.data.featureHighlights.join('\n'));
        if (json.data.whatsNew) setWhatsNew(json.data.whatsNew);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Submit App Upload / Edit Form
  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = techStackInput.split(',').map((s) => s.trim()).filter(Boolean);
    const featArray = featuresInput.split('\n').map((s) => s.trim()).filter(Boolean);

    const defaultIcon = iconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80';
    const defaultBanner = bannerUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';

    const appToSave: ProjectApp = {
      id: editingAppId || `app-${Date.now()}`,
      title: title || 'Aplikasi Baru',
      tagline: tagline || 'Aplikasi unggulan di Valora Store',
      developer: currentUser.developerStudioName || currentUser.name,
      developerEmail: currentUser.email,
      iconUrl: defaultIcon,
      bannerUrl: defaultBanner,
      screenshots: [defaultBanner, defaultIcon],
      category,
      platform,
      rating: 5.0,
      reviewCount: 1,
      downloadCount: '1.000+ download',
      downloadCountNum: 1000,
      size: size || '15 MB',
      ageRating: 'Everyone',
      badge: 'New',
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      downloadUrl: downloadUrl.trim() || undefined,
      sourceCodePrice: sourceCodePrice.trim() || 'Gratis',
      description: description || 'Deskripsi lengkap aplikasi.',
      features: featArray.length > 0 ? featArray : ['Dukungan performa tinggi', 'Desain responsif'],
      techStack: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'Tailwind'],
      whatsNew: whatsNew || 'Versi perdana',
      updatedDate: 'Hari Ini',
      releaseDate: 'Agustus 2026',
      version: version || '1.0.0',
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Valora System',
          rating: 5,
          date: 'Hari ini',
          comment: 'Aplikasi berhasil diverifikasi dan dipublikasikan di Valora Store.',
          likes: 1
        }
      ]
    };

    onSaveApp(appToSave);
    setUploadSuccessMsg(`Aplikasi "${appToSave.title}" berhasil dipublikasikan!`);
    setTimeout(() => setUploadSuccessMsg(''), 5000);

    // Reset Form
    setEditingAppId(null);
    setTitle('');
    setTagline('');
    setIconUrl('');
    setBannerUrl('');
    setDownloadUrl('');
    setDemoUrl('');
    setGithubUrl('');
    setDescription('');
    setActiveTab('manage_apps');
  };

  // Edit App Helper
  const handleStartEditApp = (app: ProjectApp) => {
    setEditingAppId(app.id);
    setTitle(app.title);
    setTagline(app.tagline);
    setCategory(app.category);
    setPlatform(app.platform);
    setVersion(app.version);
    setSize(app.size);
    setSourceCodePrice(app.sourceCodePrice || '');
    setIconUrl(app.iconUrl);
    setBannerUrl(app.bannerUrl);
    setDownloadUrl(app.downloadUrl || '');
    setDemoUrl(app.demoUrl || '');
    setGithubUrl(app.githubUrl || '');
    setTechStackInput(app.techStack.join(', '));
    setDescription(app.description);
    setFeaturesInput(app.features.join('\n'));
    setWhatsNew(app.whatsNew || '');
    setActiveTab('upload_app');
  };

  // Admin handle add user
  const handleAdminAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccEmail) return;

    const created: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newAccName.trim(),
      email: newAccEmail.trim().toLowerCase(),
      role: newAccRole,
      status: 'active',
      developerStudioName: newAccRole === 'developer' ? (newAccStudio.trim() || `${newAccName} Dev`) : undefined,
      joinedDate: 'Hari ini',
      bio: 'Akun ditambahkan oleh Admin',
      appsUploadedCount: 0
    };

    onAddUser(created);
    setShowAddUserModal(false);
    setNewAccName('');
    setNewAccEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl min-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col relative my-auto">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-5 flex items-center justify-between border-b border-slate-800 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl border-2 border-emerald-400 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">{currentUser.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : currentUser.role === 'developer'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-blue-500 text-white shadow-xs'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Admin Utama' : currentUser.role === 'developer' ? 'Developer' : 'User'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {currentUser.email} • {currentUser.developerStudioName || 'Valora Store Member'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ganti Akun</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-500/30 cursor-pointer"
            >
              Keluar
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Dashboard Main Horizontal Navigation Tabs */}
        <div className="bg-slate-900 px-5 sm:px-8 border-b border-slate-800 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Ringkasan Dashboard</span>
          </button>

          {/* Upload App Tab - Developer & Admin Only */}
          {isDeveloper && (
            <button
              onClick={() => setActiveTab('upload_app')}
              className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'upload_app'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Aplikasi / APK</span>
            </button>
          )}

          {/* Manage Apps Tab - Developer & Admin Only */}
          {isDeveloper && (
            <button
              onClick={() => setActiveTab('manage_apps')}
              className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'manage_apps'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Kelola Aplikasi ({userApps.length})</span>
            </button>
          )}

          {/* Manage Users Tab - Admin Only */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('manage_users')}
              className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'manage_users'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kelola Akun & Role ({users.length})</span>
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">Admin</span>
            </button>
          )}

          {/* Dev ACC Tab - Admin Only */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('dev_acc')}
              className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'dev_acc'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Pendaftaran Studio (ACC Dev)</span>
              {users.filter((u) => u.developerStatus === 'pending').length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {users.filter((u) => u.developerStatus === 'pending').length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('my_library')}
            className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'my_library'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Koleksi Saya</span>
          </button>

          <button
            onClick={() => setActiveTab('profile_settings')}
            className={`py-3.5 text-xs sm:text-sm font-black whitespace-nowrap flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile_settings'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Profil & Akun</span>
          </button>
        </div>

        {/* Dashboard Body Content */}
        <div className="p-5 sm:p-8 flex-1 overflow-y-auto max-h-[72vh] bg-slate-50">
          
          {uploadSuccessMsg && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-black flex items-center gap-3 animate-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-500 uppercase">Total Aplikasi Toko</span>
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">{apps.length} Aplikasi</div>
                  <p className="text-[11px] text-gray-500 font-medium">{userApps.length} dikelola oleh Anda</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-500 uppercase">Pengguna Terdaftar</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-gray-900">{users.length} Akun</div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {users.filter((u) => u.role === 'developer').length} Developer, {users.filter((u) => u.role === 'admin').length} Admin
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-500 uppercase">Status Peran Anda</span>
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900 capitalize">{currentUser.role}</div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {isDeveloper ? 'Hak Akses Upload & Edit APK' : 'Akses Unduh & Ulasan'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-500 uppercase">Verifikasi Keamanan</span>
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900">Valora Shield</div>
                  <p className="text-[11px] text-emerald-600 font-bold">Terverifikasi Bebas Virus</p>
                </div>
              </div>

              {/* ADMIN: Pending Developer Approval Box */}
              {isAdmin && users.some((u) => u.developerStatus === 'pending') && (
                <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                        !
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-amber-950">
                          Pengajuan Developer Menunggu ACC ({users.filter((u) => u.developerStatus === 'pending').length})
                        </h3>
                        <p className="text-[11px] text-amber-800 font-medium">
                          Tinjau dan klik ACC (Setujui) agar pemohon dapat mengunggah APK ke Valora Store.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage_users')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Kelola Pengguna
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {users.filter((u) => u.developerStatus === 'pending').map((pDev) => (
                      <div key={pDev.id} className="bg-white p-4 rounded-xl border border-amber-200 space-y-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={pDev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={pDev.name}
                            className="w-10 h-10 rounded-xl object-cover border border-amber-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-gray-900 truncate">{pDev.name}</h4>
                            <span className="text-[10px] text-emerald-700 font-bold block">Studio: {pDev.developerStudioName || '-'}</span>
                            <span className="text-[10px] text-gray-400">{pDev.email}</span>
                          </div>
                        </div>

                        {pDev.developerReason && (
                          <p className="text-[11px] text-gray-600 bg-amber-50/60 p-2 rounded-lg border border-amber-100 font-medium line-clamp-2">
                            "{pDev.developerReason}"
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                          {pDev.whatsappNumber && (
                            <a
                              href={`https://wa.me/${pDev.whatsappNumber}?text=Halo%20${encodeURIComponent(pDev.name)},%20kami%20dari%20Admin%20Valora%20Store%20mengenai%20pengajuan%20Developer%20Studio%20Anda.`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 font-extrabold hover:underline flex items-center gap-1"
                            >
                              WA: {pDev.whatsappNumber}
                            </a>
                          )}
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              onClick={() => {
                                if (onApproveDeveloper) onApproveDeveloper(pDev.id);
                                else onUpdateUserRole(pDev.id, 'developer');
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer shadow-2xs"
                            >
                              ✓ ACC / Setujui
                            </button>
                            <button
                              onClick={() => {
                                if (onRejectDeveloper) onRejectDeveloper(pDev.id);
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-[11px] rounded-lg transition-all cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Information Banner if user is standard 'user' */}
              {!isDeveloper && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-emerald-300">Akses Peran Pengguna (User)</h3>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Akun Anda terdaftar sebagai <b>User</b>. Anda memiliki akses penuh untuk menjelajahi toko, mengunduh aplikasi/APK, memberikan rating dan ulasan bintang, serta mengirimkan laporan bug dan saran. Pengunggahan APK dan pengeditan data aplikasi hanya tersedia untuk akun role <b>Developer</b> dan <b>Admin</b>.
                  </p>
                </div>
              )}

              {/* Quick Actions & Recent Apps Grid */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/90 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Aplikasi Dalam Platform</span>
                  </h3>
                  {isDeveloper && (
                    <button
                      onClick={() => setActiveTab('upload_app')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload APK Baru</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {apps.slice(0, 6).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onOpenAppDetail(app)}
                      className="p-3 bg-gray-50 hover:bg-emerald-50/60 rounded-xl border border-gray-200/80 flex items-center gap-3 transition-all cursor-pointer group"
                    >
                      <img src={app.iconUrl} alt={app.title} className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 truncate">{app.title}</h4>
                        <p className="text-[10px] text-gray-500 truncate">{app.developer}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span>{app.category}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-extrabold">{app.version}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD APLIKASI BARU / EDIT APK (INTEGRATED DASHBOARD FORM) */}
          {activeTab === 'upload_app' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {!isDeveloper && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-medium space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Mode Pengguna Terbatas</span>
                  </div>
                  <p>
                    Anda saat ini masuk sebagai <b>User</b>. Klik tombol di bawah ini untuk upgrade otomatis ke role <b>Developer</b> agar dapat mengunggah APK secara bebas!
                  </p>
                  <button
                    onClick={() => {
                      onUpdateUserRole(currentUser.id, 'developer');
                      alert('Role Anda berhasil diubah menjadi Developer! Silakan isi form di bawah.');
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Ubah Role ke Developer Sekarang
                  </button>
                </div>
              )}

              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-emerald-600" />
                      <span>{editingAppId ? 'Edit Detail Aplikasi' : 'Form Upload Aplikasi & APK Baru'}</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Publikasikan installer software atau web app Anda langsung ke katalog Valora Store
                    </p>
                  </div>

                  {editingAppId && (
                    <button
                      onClick={() => {
                        setEditingAppId(null);
                        setTitle('');
                        setTagline('');
                      }}
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 underline"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                {/* Gemini AI Helper Assistant inside Dashboard Upload */}
                <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-extrabold text-xs text-emerald-950">Gemini AI Assistant (Auto Copywriting)</h3>
                  </div>
                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                    Ketik Nama Aplikasi di bawah, lalu klik untuk membiarkan AI membuat deskripsi, daftar fitur, dan catatan rilis secara otomatis!
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Petunjuk khusus untuk AI (misal: 'Aplikasi kasir minimarket offline')..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs text-gray-900 focus:outline-emerald-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAI}
                      disabled={isGeneratingAI}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      {isGeneratingAI ? 'Memproses...' : 'Auto-Generate via Gemini'}
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleAppSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Aplikasi / Game *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Smart Inventory POS"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tagline Singkat *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sistem manajemen stok minimarket realtime"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CategoryType)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      >
                        {['Tools', 'Productivity', 'Games', 'AI & ML', 'Finance', 'Utilities', 'Entertainment', 'Education'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Platform</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as PlatformType)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      >
                        {['Web', 'Mobile', 'Desktop', 'CLI', 'Extension'].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Versi</label>
                      <input
                        type="text"
                        placeholder="Contoh: 1.0.0"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Ukuran Download</label>
                      <input
                        type="text"
                        placeholder="Contoh: 24.5 MB"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL File APK / Installer Direct</label>
                      <input
                        type="url"
                        placeholder="https://github.com/.../app-release.apk"
                        value={downloadUrl}
                        onChange={(e) => setDownloadUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL Live Web Demo</label>
                      <input
                        type="url"
                        placeholder="https://my-demo.vercel.app"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL GitHub Repo</label>
                      <input
                        type="url"
                        placeholder="https://github.com/user/project"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL Icon Aplikasi (1:1 Square)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={iconUrl}
                        onChange={(e) => setIconUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL Banner Banner (16:9)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tech Stack (pisah koma)</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Tailwind CSS, Express"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Lengkap Aplikasi *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Jelaskan kegunaan, keunggulan, dan solusi dari aplikasi Anda..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Fitur Utama (1 per baris)</label>
                    <textarea
                      rows={3}
                      placeholder="- Fitur 1: Autentikasi aman\n- Fitur 2: Ekspor data PDF\n- Fitur 3: Mode offline"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-normal text-gray-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{editingAppId ? 'Simpan Perubahan Aplikasi' : 'Publikasikan Aplikasi Ke Valora Store'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA APLIKASI SAYA / TOKO */}
          {activeTab === 'manage_apps' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900">Daftar Aplikasi Publikasi</h2>
                  <p className="text-xs text-gray-500 font-medium">Kelola, edit detail, atau hapus aplikasi dari toko</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAppId(null);
                    setTitle('');
                    setTagline('');
                    setActiveTab('upload_app');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Aplikasi Baru</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {userApps.map((app) => (
                    <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4 hover:bg-gray-50/80 transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img src={app.iconUrl} alt={app.title} className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-gray-900 truncate">{app.title}</h3>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              {app.version}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{app.tagline}</p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                            <span>Kategori: <b>{app.category}</b></span>
                            <span>•</span>
                            <span>Platform: <b>{app.platform}</b></span>
                            <span>•</span>
                            <span>Pengembang: <b>{app.developer}</b></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onOpenAppDetail(app)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Toko</span>
                        </button>

                        <button
                          onClick={() => handleStartEditApp(app)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus aplikasi "${app.title}" dari store?`)) {
                              onDeleteApp(app.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {userApps.length === 0 && (
                    <div className="p-8 text-center space-y-2">
                      <Package className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-xs font-bold text-gray-600">Belum ada aplikasi yang dipublikasikan.</p>
                      <button
                        onClick={() => setActiveTab('upload_app')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Upload Sekarang
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PENDAFTARAN STUDIO & PERSERTUJUAN DEVELOPER (ACC DEV) */}
          {activeTab === 'dev_acc' && isAdmin && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <span>Pendaftaran Studio Developer & Persetujuan Admin (ACC)</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Tinjau pengajuan pembuatan Studio dari pengguna, verifikasi nomor WhatsApp kontak, dan berikan persetujuan (ACC).
                  </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 bg-white p-1 border border-gray-200 rounded-xl text-xs font-bold flex-wrap">
                  <button
                    onClick={() => setDevAccFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Menunggu ACC ({users.filter((u) => u.developerStatus === 'pending').length})
                  </button>
                  <button
                    onClick={() => setDevAccFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Terverifikasi ({users.filter((u) => u.role === 'developer' || u.developerStatus === 'approved').length})
                  </button>
                  <button
                    onClick={() => setDevAccFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Ditolak ({users.filter((u) => u.developerStatus === 'rejected').length})
                  </button>
                  <button
                    onClick={() => setDevAccFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'all'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Semua ({users.filter((u) => u.developerStatus || u.role === 'developer').length})
                  </button>
                </div>
              </div>

              {/* Developer Requests Grid */}
              <div className="space-y-3">
                {users
                  .filter((u) => {
                    if (devAccFilter === 'pending') return u.developerStatus === 'pending';
                    if (devAccFilter === 'approved') return u.role === 'developer' || u.developerStatus === 'approved';
                    if (devAccFilter === 'rejected') return u.developerStatus === 'rejected';
                    return u.developerStatus || u.role === 'developer';
                  })
                  .map((pUser) => {
                    const isPending = pUser.developerStatus === 'pending';
                    const isApproved = pUser.role === 'developer' || pUser.developerStatus === 'approved';

                    return (
                      <div
                        key={pUser.id}
                        className={`bg-white rounded-2xl p-5 border shadow-2xs transition-all space-y-4 ${
                          isPending
                            ? 'border-amber-300 bg-amber-50/20'
                            : isApproved
                            ? 'border-emerald-200'
                            : 'border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={pUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt={pUser.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm text-gray-900">{pUser.name}</h3>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    isPending
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : isApproved
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {isPending ? 'Menunggu ACC Admin' : isApproved ? 'Terverifikasi (ACC)' : 'Pengajuan Ditolak'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-medium">{pUser.email}</p>
                              {pUser.developerRequestDate && (
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                  Diajukan tanggal: {pUser.developerRequestDate}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2">
                            {pUser.whatsappNumber && (
                              <a
                                href={`https://wa.me/${pUser.whatsappNumber}?text=Halo%20${encodeURIComponent(pUser.name)},%20kami%20dari%20Admin%20Valora%20Store%20mengenai%20pengajuan%20Developer%20Studio%20Anda.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WA: {pUser.whatsappNumber}</span>
                              </a>
                            )}

                            {isPending && (
                              <>
                                <button
                                  onClick={() => {
                                    if (onApproveDeveloper) onApproveDeveloper(pUser.id);
                                    else onUpdateUserRole(pUser.id, 'developer');
                                  }}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                >
                                  ✓ ACC / Setujui
                                </button>
                                <button
                                  onClick={() => {
                                    if (onRejectDeveloper) onRejectDeveloper(pUser.id);
                                  }}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </>
                            )}

                            {!isPending && isApproved && (
                              <button
                                onClick={() => onUpdateUserRole(pUser.id, 'user')}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                              >
                                Ubah ke User
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              Nama Studio Yang Diajukan
                            </span>
                            <p className="font-extrabold text-gray-900 text-sm">
                              {pUser.developerStudioName || 'Studio Belum Ditentukan'}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              Alasan / Deskripsi Rencana Aplikasi
                            </span>
                            <p className="font-medium text-gray-700 italic">
                              "{pUser.developerReason || 'Tidak ada catatan tambahan dari pemohon.'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {users.filter((u) => {
                  if (devAccFilter === 'pending') return u.developerStatus === 'pending';
                  if (devAccFilter === 'approved') return u.role === 'developer' || u.developerStatus === 'approved';
                  if (devAccFilter === 'rejected') return u.developerStatus === 'rejected';
                  return u.developerStatus || u.role === 'developer';
                }).length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-gray-200">
                    <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
                    <h4 className="font-extrabold text-xs text-gray-700">Tidak ada data pendaftaran developer.</h4>
                    <p className="text-[11px] text-gray-400">
                      Semua pengajuan telah diproses atau belum ada permohonan baru.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: KELOLA AKUN-AKUN PENGGUNA (MANAGE USERS & ROLES) */}
          {activeTab === 'manage_users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>Manajemen Pengguna & Hak Akses (Role Management)</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Kelola peran akun (Admin, Developer, User), status aktif/blokir, dan akun pengguna
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Akun Baru</span>
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama atau email akun..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-1 border border-gray-200 rounded-xl">
                  {['All', 'admin', 'developer', 'user'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        userRoleFilter === r
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {r === 'All' ? 'Semua Role' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-extrabold">
                      <tr>
                        <th className="px-4 py-3">Pengguna</th>
                        <th className="px-4 py-3">Role Saat Ini</th>
                        <th className="px-4 py-3">Studio / Bio</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Bergabung</th>
                        <th className="px-4 py-3 text-right">Aksi Kelola</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {filteredUsers.map((u) => {
                        const isSelf = u.id === currentUser.id;
                        return (
                          <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                                />
                                <div>
                                  <div className="font-extrabold text-gray-900 flex items-center gap-1">
                                    <span>{u.name}</span>
                                    {isSelf && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-black">(Anda)</span>}
                                  </div>
                                  <span className="text-[10px] text-gray-500">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5">
                              {isAdmin && !isSelf ? (
                                <select
                                  value={u.role}
                                  onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                                  className="px-2.5 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs font-black text-gray-900 focus:outline-emerald-500"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="developer">Developer</option>
                                  <option value="user">User</option>
                                </select>
                              ) : (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                    u.role === 'admin'
                                      ? 'bg-rose-100 text-rose-800'
                                      : u.role === 'developer'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {u.role}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="text-gray-700 font-bold block">{u.developerStudioName || '-'}</span>
                              <span className="text-[10px] text-gray-400 truncate block max-w-[180px]">{u.bio || 'Tidak ada bio'}</span>
                            </td>

                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {u.status === 'active' ? 'Aktif' : 'Diblokir'}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-gray-500 text-[11px]">{u.joinedDate}</td>

                            <td className="px-4 py-3.5 text-right">
                              {isAdmin && !isSelf ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onToggleUserStatus(u.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer border ${
                                      u.status === 'active'
                                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                  >
                                    {u.status === 'active' ? 'Blokir' : 'Aktifkan'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus akun ${u.name}?`)) onDeleteUser(u.id);
                                    }}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Hapus Akun"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">Hak Terproteksi</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <form onSubmit={handleAdminAddUserSubmit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-gray-100">
                    <h3 className="text-sm font-black text-gray-900">Tambah Akun Pengguna Baru</h3>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={newAccName}
                        onChange={(e) => setNewAccName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={newAccEmail}
                        onChange={(e) => setNewAccEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Role *</label>
                      <select
                        value={newAccRole}
                        onChange={(e) => setNewAccRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                      >
                        <option value="user">User</option>
                        <option value="developer">Developer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {newAccRole === 'developer' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama Studio Developer</label>
                        <input
                          type="text"
                          value={newAccStudio}
                          onChange={(e) => setNewAccStudio(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-600"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold"
                      >
                        Simpan Akun
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: KOLEKSI SAYA */}
          {activeTab === 'my_library' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900">Aplikasi & Koleksi Terpasang</h2>
                <p className="text-xs text-gray-500 font-medium">Daftar installer APK & wishlist yang disimpan akun Anda</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {apps.filter((a) => a.isInstalled || a.isWishlisted).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onOpenAppDetail(app)}
                    className="p-4 bg-white rounded-2xl border border-gray-200/90 shadow-2xs space-y-3 cursor-pointer hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={app.iconUrl} alt={app.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-gray-900 truncate">{app.title}</h3>
                        <p className="text-[10px] text-gray-500">{app.developer}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {app.isInstalled && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">
                              Terpasang
                            </span>
                          )}
                          {app.isWishlisted && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-black">
                              Wishlist
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PENGATURAN PROFIL & ROLE */}
          {activeTab === 'profile_settings' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900">Pengaturan Profil & Hak Akses</h2>
                <p className="text-xs text-gray-500 font-medium">Ubah peran akun Anda atau perbarui informasi profil</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Peran Akun Saat Ini</label>
                  {isAdmin ? (
                    <div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateUserRole(currentUser.id, 'user')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            currentUser.role === 'user' ? 'bg-blue-50 border-blue-500 font-black' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-black">User</div>
                          <div className="text-[9px] text-gray-500">Biasa</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onUpdateUserRole(currentUser.id, 'developer')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            currentUser.role === 'developer' ? 'bg-emerald-50 border-emerald-500 font-black' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-black text-emerald-700">Developer</div>
                          <div className="text-[9px] text-gray-500">Upload APK</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onUpdateUserRole(currentUser.id, 'admin')}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            currentUser.role === 'admin' ? 'bg-rose-50 border-rose-500 font-black' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-xs font-black text-rose-700">Admin</div>
                          <div className="text-[9px] text-gray-500">Kelola Semua</div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 uppercase">
                          {currentUser.role === 'developer' ? 'Developer' : 'User (Pengguna)'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">
                        Ditentukan oleh Administrator
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
