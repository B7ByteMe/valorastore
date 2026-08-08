import React, { useState, useEffect } from 'react';
import { UserAccount, ProjectApp, UserRole } from '../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Smartphone,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  Bell,
  Eye,
  EyeOff,
  AlertCircle,
  Menu,
  X,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Shield,
  User,
  Store,
  Layers,
  Sparkles
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminPortalProps {
  currentUser: UserAccount | null;
  users: UserAccount[];
  apps: ProjectApp[];
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onApproveDeveloper: (userId: string) => void;
  onRejectDeveloper: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteApp: (appId: string) => void;
  onUpdateAppStatus: (appId: string, status: 'published' | 'rejected') => void;
  onCloseAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  users,
  apps,
  onLoginSuccess,
  onLogout,
  onUpdateUserRole,
  onApproveDeveloper,
  onRejectDeveloper,
  onToggleUserStatus,
  onDeleteUser,
  onDeleteApp,
  onCloseAdmin
}) => {
  const isAdmin = currentUser?.role === 'admin';

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Navigation Tab inside Admin Dashboard
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dev_acc' | 'manage_users' | 'published_apps' | 'pending_apps' | 'banner_settings' | 'admin_settings'>('dashboard');

  // Filter states
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [appSearch, setAppSearch] = useState('');
  const [devAccFilter, setDevAccFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');


  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Admin Direct Login Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetEmail = adminEmail.trim().toLowerCase();
    
    // Check if user exists in database first
    const found = users.find((u) => u.email.toLowerCase() === targetEmail);
    if (!found) {
      setLoginError('Email tidak ditemukan. Pastikan Anda mendaftar sebagai Admin.');
      return;
    }

    if (found.role !== 'admin') {
      setLoginError('Akun ini bukan akun Admin. Akses ditolak.');
      return;
    }

    if (found.status === 'blocked') {
      setLoginError('Akun Admin ini diblokir.');
      return;
    }

    try {
      // Authenticate with Real Firebase Auth
      await signInWithEmailAndPassword(auth, targetEmail, adminPassword);
      onLoginSuccess(found);
    } catch (error: any) {
      console.error("Admin Login Error:", error);
      setLoginError('Password yang Anda masukkan salah atau koneksi gagal.');
      await signOut(auth);
    }
  };

  // Metrics calculation
  const totalApps = apps.filter(a => a.appStatus === 'published' || !a.appStatus).length;
  const pendingApps = apps.filter(a => a.appStatus === 'pending');
  const pendingAppsCount = pendingApps.length;
  const totalUsers = users.length;
  const totalDevelopers = users.filter((u) => u.role === 'developer' || u.developerStatus === 'approved').length;
  const pendingDevCount = users.filter((u) => u.developerStatus === 'pending').length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchStudio = u.developerStudioName?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchStudio) return false;
    }
    return true;
  });

  // Filtered Apps
  const filteredApps = apps.filter((a) => {
    if (appSearch.trim()) {
      const q = appSearch.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchCategory = a.category.toLowerCase().includes(q);
      const matchDev = a.developer.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchDev) return false;
    }
    return true;
  });

  // IF NOT LOGGED IN AS ADMIN, SHOW ADMIN LOGIN PORTAL
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-full">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Admin Pusat</span>
            </h2>
            <button
              onClick={onCloseAdmin}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-6 text-center space-y-1">
              <p className="text-sm text-gray-500 font-medium">
                Silakan masuk menggunakan akun Administrator untuk mengelola platform Valora Store.
              </p>
            </div>

            {/* Admin Manual Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Email / Username Admin</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer mt-4"
              >
                Login Admin Pusat
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN AS ADMIN, RENDER FULL DASHBOARD MATCHING SCREENSHOT LAYOUT
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      
      {/* Top Main Navbar (White, Red/Dark Logo, Profile Info) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Admin Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                AD
              </div>
              <div className="leading-tight">
                <span className="font-black text-gray-900 text-base tracking-tight block">
                  Admin Pusat<span className="text-rose-600">_</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            <button
              onClick={onCloseAdmin}
              className="text-xs font-bold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Jelajahi Produk</span>
            </button>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              {/* Notification bell */}
              <div className="relative">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer relative">
                  <Bell className="w-4 h-4" />
                  {pendingDevCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  )}
                </button>
              </div>

              {/* User Avatar Badge */}
              <div className="flex items-center gap-2 pl-2">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
                <div className="hidden md:block text-left leading-tight">
                  <span className="block text-xs font-extrabold text-gray-900">{currentUser.name}</span>
                  <span className="block text-[10px] font-semibold text-rose-600">Super Admin</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer ml-1"
                  title="Keluar dari Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <aside
          className={`w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-200 fixed lg:static top-[57px] bottom-0 left-0 z-20 ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* User Info Header in Sidebar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-gray-900 truncate">{currentUser.name}</h3>
              <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
              <span className="inline-block mt-0.5 px-2 py-0.2 bg-rose-50 text-rose-700 text-[9px] font-black rounded-md">
                Admin Utama
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-3 space-y-1 flex-1 overflow-y-auto">
            <span className="px-3 text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block mb-2">
              ADMIN MENU
            </span>

            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Dashboard Utama</span>
            </button>

            <button
              onClick={() => { setActiveTab('dev_acc'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'dev_acc'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Pendaftaran Toko (ACC Dev)</span>
              </div>
              {pendingDevCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingDevCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('manage_users'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'manage_users'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Kelola User & Developer</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">{totalUsers}</span>
            </button>

            <button
              onClick={() => { setActiveTab('published_apps'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'published_apps'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>Daftar Aplikasi Rilis</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">{totalApps}</span>
            </button>

            <button
              onClick={() => { setActiveTab('pending_apps'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'pending_apps'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Review Aplikasi (Pending)</span>
              </div>
              {pendingAppsCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('banner_settings'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'banner_settings'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Pengaturan Banner</span>
            </button>

            <button
              onClick={() => { setActiveTab('admin_settings'); setIsSidebarOpen(false); }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'admin_settings'
                  ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border-l-4 border-emerald-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Pengaturan Admin</span>
            </button>
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-[10px] text-gray-400 text-center font-medium">
            Valora Store Admin v2.0 • Online
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          
          {/* TAB 1: DASHBOARD UTAMA */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-gray-900">Dashboard Utama</h1>
                  <p className="text-xs text-gray-500 font-medium">Ringkasan aktivitas platform dan statistik real-time.</p>
                </div>
              </div>

              {/* 4 Stat Cards Row Matching Screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Card 1: Total Transaksi Belanja */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500">Total Transaksi Belanja</p>
                    <p className="text-xl font-black text-gray-900">Rp 0</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 2: Total Pesanan / Unduhan */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500">Total Unduhan & Pesanan</p>
                    <p className="text-xl font-black text-gray-900">
                      {apps.reduce((acc, app) => acc + app.downloadCountNum, 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 3: Total Toko / Developer */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500">Total Toko / Dev Studio</p>
                    <p className="text-xl font-black text-gray-900">{totalDevelopers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 4: Total Pengguna */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500">Total Pengguna</p>
                    <p className="text-xl font-black text-gray-900">{totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Analytics Section Row (Chart Line & Semi-Doughnut Status) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Tren Pendapatan Chart (Line Chart) */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Tren Pendapatan & Rilis (7 Hari Terakhir)</span>
                    </h3>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="h-48 w-full pt-4 relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

                      {/* Line Path */}
                      <path
                        d="M0,100 L80,95 L160,98 L240,90 L320,85 L400,98 L500,100"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />

                      {/* Points */}
                      {[
                        { x: 0, y: 100, label: '07-31' },
                        { x: 80, y: 95, label: '08-01' },
                        { x: 160, y: 98, label: '08-02' },
                        { x: 240, y: 90, label: '08-03' },
                        { x: 320, y: 85, label: '08-04' },
                        { x: 400, y: 98, label: '08-05' },
                        { x: 500, y: 100, label: '08-06' },
                      ].map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                          <text x={p.x} y="118" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
                            {p.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Status Toko di Platform (Visual Chart) */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                  <h3 className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>Status Toko Developer</span>
                  </h3>

                  <div className="flex flex-col items-center justify-center py-4">
                    {/* Semi Doughnut Ring */}
                    <div className="relative w-36 h-20 flex items-center justify-center">
                      <div className="w-36 h-36 border-[12px] border-emerald-500 border-b-transparent border-l-amber-400 rounded-full rotate-45" />
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-bold mt-4">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Aktif ({totalDevelopers})
                      </span>
                      <span className="flex items-center gap-1 text-amber-700">
                        <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> Menunggu ({pendingDevCount})
                      </span>
                      <span className="flex items-center gap-1 text-rose-700">
                        <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Ditolak (0)
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACC Pending Developers Banner Alert */}
              {pendingDevCount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      {pendingDevCount}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-amber-950">
                        Ada {pendingDevCount} Permohonan Studio Developer Menunggu ACC Admin!
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">
                        Pengguna telah mengirimkan nomor WhatsApp dan deskripsi studio. Silakan tinjau dan berikan persetujuan.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('dev_acc')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Buka Panel ACC Developer →
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PENDAFTARAN TOKO & ACC DEVELOPER */}
          {activeTab === 'dev_acc' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <span>Pendaftaran Toko Developer & Persetujuan Admin (ACC)</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Tinjau permohonan pendaftaran Studio, kontak WhatsApp, dan berikan izin rilis APK.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-white p-1 border border-gray-200 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setDevAccFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-600'
                    }`}
                  >
                    Menunggu ({pendingDevCount})
                  </button>
                  <button
                    onClick={() => setDevAccFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'approved' ? 'bg-emerald-600 text-white' : 'text-gray-600'
                    }`}
                  >
                    Disetujui ({totalDevelopers})
                  </button>
                  <button
                    onClick={() => setDevAccFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      devAccFilter === 'all' ? 'bg-slate-800 text-white' : 'text-gray-600'
                    }`}
                  >
                    Semua
                  </button>
                </div>
              </div>

              {/* Grid List */}
              <div className="space-y-3">
                {users
                  .filter((u) => {
                    if (devAccFilter === 'pending') return u.developerStatus === 'pending';
                    if (devAccFilter === 'approved') return u.role === 'developer' || u.developerStatus === 'approved';
                    return u.developerStatus || u.role === 'developer';
                  })
                  .map((pUser) => {
                    const isPending = pUser.developerStatus === 'pending';
                    const isApproved = pUser.role === 'developer' || pUser.developerStatus === 'approved';

                    return (
                      <div
                        key={pUser.id}
                        className={`bg-white rounded-2xl p-5 border shadow-2xs space-y-4 ${
                          isPending ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={pUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt={pUser.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm text-gray-900">{pUser.name}</h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    isPending
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : isApproved
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {isPending ? 'Menunggu ACC Admin' : isApproved ? 'Terverifikasi (ACC)' : 'Ditolak'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-medium">{pUser.email}</p>
                              {pUser.developerRequestDate && (
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                  Pengajuan: {pUser.developerRequestDate}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2">
                            {pUser.whatsappNumber && (
                              <a
                                href={`https://wa.me/${pUser.whatsappNumber}?text=Halo%20${encodeURIComponent(pUser.name)},%20kami%20dari%20Admin%20Valora%20Store.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WA: {pUser.whatsappNumber}</span>
                              </a>
                            )}

                            {isPending && (
                              <>
                                <button
                                  onClick={() => onApproveDeveloper(pUser.id)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                >
                                  ✓ ACC / Setujui
                                </button>
                                <button
                                  onClick={() => onRejectDeveloper(pUser.id)}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-xs rounded-xl cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              Nama Studio
                            </span>
                            <p className="font-extrabold text-gray-900 text-sm">
                              {pUser.developerStudioName || 'Studio Belum Ditentukan'}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                              Catatan Pengajuan
                            </span>
                            <p className="font-medium text-gray-700 italic">
                              "{pUser.developerReason || 'Tidak ada catatan tambahan.'}"
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {users.filter((u) => u.developerStatus === 'pending').length === 0 && devAccFilter === 'pending' && (
                  <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-gray-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-xs text-gray-700">Semua pendaftaran telah diproses!</h4>
                    <p className="text-[11px] text-gray-400">Tidak ada antrean pendaftaran developer saat ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA USER & DEVELOPER */}
          {activeTab === 'manage_users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Pengelolaan Pengguna & Role ({users.length})</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Ubah peran akun (Admin, Developer, User) atau blokir akun.</p>
                </div>

                {/* Search & Role Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari user / email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                    />
                  </div>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                  >
                    <option value="All">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Pengguna</th>
                        <th className="p-3.5">Role saat ini</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Tanggal Bergabung</th>
                        <th className="p-3.5 text-right">Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {filteredUsers.map((u) => {
                        const isSelf = u.id === currentUser.id;

                        return (
                          <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-200"
                              />
                              <div>
                                <span className="font-extrabold text-gray-900 block text-xs">{u.name}</span>
                                <span className="text-[11px] text-gray-400 block">{u.email}</span>
                              </div>
                            </td>

                            <td className="p-3.5">
                              {!isSelf ? (
                                <select
                                  value={u.role}
                                  onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                                  className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-extrabold text-gray-900"
                                >
                                  <option value="user">User</option>
                                  <option value="developer">Developer</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-lg">
                                  Super Admin (Anda)
                                </span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                  u.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {u.status === 'active' ? 'Aktif' : 'Diblokir'}
                              </span>
                            </td>

                            <td className="p-3.5 text-gray-500 text-[11px]">
                              {u.joinedDate || '1 Januari 2026'}
                            </td>

                            <td className="p-3.5 text-right space-x-2">
                              {!isSelf && (
                                <>
                                  <button
                                    onClick={() => onToggleUserStatus(u.id)}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
                                  >
                                    {u.status === 'active' ? 'Blokir' : 'Aktifkan'}
                                  </button>

                                  <button
                                    onClick={() => onDeleteUser(u.id)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Hapus User"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DAFTAR APLIKASI RILIS */}
          {activeTab === 'published_apps' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span>Daftar Seluruh Aplikasi Terbit ({apps.length})</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Kelola dan atur aplikasi yang dirilis di Valora Store.</p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari judul / developer..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Apps Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Aplikasi</th>
                        <th className="p-3.5">Kategori</th>
                        <th className="p-3.5">Platform</th>
                        <th className="p-3.5">Developer</th>
                        <th className="p-3.5">Rating & Unduhan</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {filteredApps.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={a.iconUrl}
                              alt={a.title}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                            />
                            <div>
                              <span className="font-extrabold text-gray-900 block text-xs">{a.title}</span>
                              <span className="text-[10px] text-gray-400 block">v{a.version}</span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded-md text-[10px]">
                              {a.category}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-md text-[10px]">
                              {a.platform}
                            </span>
                          </td>

                          <td className="p-3.5 text-xs font-bold text-gray-900">
                            {a.developer}
                          </td>

                          <td className="p-3.5 text-[11px] text-gray-600">
                            ⭐ {a.rating} • {a.downloadCount}
                          </td>

                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => onDeleteApp(a.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Hapus Aplikasi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.5: REVIEW APLIKASI (PENDING) */}
          {activeTab === 'pending_apps' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span>Review Aplikasi Pending ({pendingAppsCount})</span>
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">Tinjau dan setujui aplikasi baru sebelum tayang di store.</p>
                </div>
              </div>

              {pendingAppsCount === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-gray-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-extrabold text-xs text-gray-700">Semua aplikasi telah ditinjau!</h4>
                  <p className="text-[11px] text-gray-400">Tidak ada aplikasi yang menunggu persetujuan saat ini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApps.map((a) => (
                    <div key={a.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xs border border-gray-200 flex flex-col md:flex-row gap-4">
                      {/* App Info */}
                      <div className="flex-1 flex gap-4">
                        <img
                          src={a.iconUrl}
                          alt={a.title}
                          className="w-16 h-16 rounded-2xl object-cover shadow-xs border border-gray-100"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-gray-900 text-sm">{a.title}</h3>
                            <span className="bg-amber-100 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Menunggu Review
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-gray-500 line-clamp-1">{a.tagline}</p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> {a.developer}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('id-ID') : 'Belum lama ini'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                        <button
                          onClick={() => onUpdateAppStatus(a.id, 'rejected')}
                          className="px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-bold text-xs rounded-xl cursor-pointer flex-1 md:flex-none transition-colors"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => onUpdateAppStatus(a.id, 'published')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex-1 md:flex-none transition-colors"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5 & 6: BANNER & SETTINGS */}
          {(activeTab === 'banner_settings' || activeTab === 'admin_settings') && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base text-gray-900">Pengaturan Sistem Pusat Aktif</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Sistem Valora Store berjalan secara otomatis. Semua kontrol pendaftaran toko, verifikasi studio developer, dan hak akses aplikasi sudah dikonfigurasi.
              </p>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
