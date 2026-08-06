import React, { useState } from 'react';
import { UserAccount } from '../types';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterSuccess: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Handle Manual Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserAccount;
        if (userData.status === 'blocked') {
          setLoginError('Akun ini telah diblokir oleh administrator.');
          return;
        }
        onLoginSuccess({ ...userData, loginMethod: 'Email' });
        onClose();
      } else {
        setLoginError('Data pengguna tidak ditemukan di database.');
      }
    } catch (error: any) {
      setLoginError('Email atau password salah.');
    }
  };

  // Handle Social One-Click Login (Google)
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        onLoginSuccess({ ...(userDoc.data() as UserAccount), loginMethod: 'Google' });
      } else {
        const newUser: UserAccount = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email || '',
          avatarUrl: userCredential.user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google',
          loginMethod: 'Google',
          role: 'user',
          status: 'active',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          bio: 'Pengguna Google Valora Store',
          appsUploadedCount: 0
        };
        onRegisterSuccess(newUser);
      }
      onClose();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        onLoginSuccess({ ...(userDoc.data() as UserAccount), loginMethod: 'Facebook' });
      } else {
        const newUser: UserAccount = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'Facebook User',
          email: userCredential.user.email || '',
          avatarUrl: userCredential.user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Facebook',
          loginMethod: 'Facebook',
          role: 'user',
          status: 'active',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          bio: 'Pengguna Facebook Valora Store',
          appsUploadedCount: 0
        };
        onRegisterSuccess(newUser);
      }
      onClose();
    } catch (error: any) {
      console.error("Facebook Login Error:", error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        onLoginSuccess({ ...(userDoc.data() as UserAccount), loginMethod: 'GitHub' });
      } else {
        const newUser: UserAccount = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'GitHub User',
          email: userCredential.user.email || '',
          avatarUrl: userCredential.user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Github',
          loginMethod: 'GitHub',
          role: 'user',
          status: 'active',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          bio: 'Pengguna GitHub Valora Store',
          appsUploadedCount: 0
        };
        onRegisterSuccess(newUser);
      }
      onClose();
    } catch (error: any) {
      console.error("GitHub Login Error:", error);
    }
  };

  // Handle Standard Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regEmail || !regPassword) {
      setRegError('Mohon lengkapi semua kolom pendaftaran.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      const newUser: UserAccount = {
        id: userCredential.user.uid,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(regName)}`,
        loginMethod: 'Email',
        role: 'user',
        status: 'active',
        joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        bio: 'Pengguna terdaftar Valora Store',
        appsUploadedCount: 0
      };

      onRegisterSuccess(newUser);
      onClose();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setRegError('Email ini sudah terdaftar. Silakan login.');
      } else if (error.code === 'auth/weak-password') {
        setRegError('Password minimal 6 karakter.');
      } else {
        setRegError('Gagal mendaftar. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[420px] rounded-[28px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative p-6 sm:p-8 my-auto">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title & Subtitle */}
        <div className="text-center space-y-1 mb-6 pt-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {activeTab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          
          <p className="text-xs text-gray-500 font-medium">
            {activeTab === 'login' ? (
              <>
                Bergabung Sekarang{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError('');
                  }}
                  className="text-emerald-500 font-extrabold hover:underline cursor-pointer"
                >
                  Buat akun
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setRegError('');
                  }}
                  className="text-emerald-500 font-extrabold hover:underline cursor-pointer"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>

        {/* Social OAuth Login Buttons */}
        <div className="grid grid-cols-1 gap-2.5 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            <span>Google</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-2.5 px-4 bg-[#24292F] hover:bg-[#1F2328] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              <span>GitHub</span>
            </button>
          </div>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Atau dengan Email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </div>

        {/* Form Content */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-500 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Fitur Lupa Kata Sandi: Silakan hubungi admin di WhatsApp support jika membutuhkan pemulihan akun.')}
                className="text-emerald-500 font-bold hover:underline cursor-pointer"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-extrabold transition-all shadow-sm cursor-pointer mt-2"
            >
              Masuk
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600">Nama Lengkap</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600">Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-600">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-extrabold transition-all shadow-sm cursor-pointer mt-2"
            >
              Buat Akun
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

