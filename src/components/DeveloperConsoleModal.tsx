import React, { useState, useEffect } from 'react';
import { ProjectApp, CategoryType, PlatformType } from '../types';
import { X, Zap, Plus, Trash2, CheckCircle, Upload, Link, AlertCircle, Github, Loader2 } from 'lucide-react';

interface DeveloperConsoleModalProps {
  onClose: () => void;
  onSaveProject: (project: ProjectApp) => void;
  initialApp?: ProjectApp | null;
}

export const DeveloperConsoleModal: React.FC<DeveloperConsoleModalProps> = ({
  onClose,
  onSaveProject,
  initialApp
}) => {
  const [title, setTitle] = useState(initialApp?.title || '');
  const [tagline, setTagline] = useState(initialApp?.tagline || '');
  const [developer, setDeveloper] = useState(initialApp?.developer || 'Arumsari Dev Studio');
  const [developerEmail, setDeveloperEmail] = useState(initialApp?.developerEmail || 'developer@devplay.store');
  const [category, setCategory] = useState<CategoryType>(initialApp?.category || 'Tools');
  const [platform, setPlatform] = useState<PlatformType>(initialApp?.platform || 'Web');
  const [iconUrl, setIconUrl] = useState(initialApp?.iconUrl || '');
  const [bannerUrl, setBannerUrl] = useState(initialApp?.bannerUrl || '');
  const [screenshot1, setScreenshot1] = useState(initialApp?.screenshots?.[0] || '');
  const [screenshot2, setScreenshot2] = useState(initialApp?.screenshots?.[1] || '');
  const [screenshot3, setScreenshot3] = useState(initialApp?.screenshots?.[2] || '');
  const [screenshot4, setScreenshot4] = useState(initialApp?.screenshots?.[3] || '');
  const [screenshot5, setScreenshot5] = useState(initialApp?.screenshots?.[4] || '');
  const [demoUrl, setDemoUrl] = useState(initialApp?.demoUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialApp?.githubUrl || '');
  const [downloadUrl, setDownloadUrl] = useState(initialApp?.downloadUrl || '');
  const [sourceCodePrice, setSourceCodePrice] = useState(initialApp?.sourceCodePrice || 'Rp 150.000');
  const [whatsappNumber, setWhatsappNumber] = useState(initialApp?.whatsappNumber || '6281234567890');
  const [size, setSize] = useState(initialApp?.size || 'Web App');
  const [version, setVersion] = useState(initialApp?.version || '2.1.0');
  const [updatedDate, setUpdatedDate] = useState(initialApp?.updatedDate || 'August 1, 2026');
  const [releaseDate, setReleaseDate] = useState(initialApp?.releaseDate || '24 Sep 2024');
  const [techStackInput, setTechStackInput] = useState(initialApp?.techStack?.join(', ') || 'React, TypeScript, Tailwind');
  const [description, setDescription] = useState(initialApp?.description || '');
  const [featuresInput, setFeaturesInput] = useState(initialApp?.features?.join('\n') || '');
  const [whatsNew, setWhatsNew] = useState(initialApp?.whatsNew || 'Pembaruan stabilitas sistem, perbaikan bug minor, dan optimasi performa antarmuka pengguna.');

  // Reset semua field form setiap kali initialApp berubah (misal buka edit untuk ke-2, ke-3 kali)
  useEffect(() => {
    setTitle(initialApp?.title || '');
    setTagline(initialApp?.tagline || '');
    setDeveloper(initialApp?.developer || 'Arumsari Dev Studio');
    setDeveloperEmail(initialApp?.developerEmail || 'developer@devplay.store');
    setCategory(initialApp?.category || 'Tools');
    setPlatform(initialApp?.platform || 'Web');
    setIconUrl(initialApp?.iconUrl || '');
    setBannerUrl(initialApp?.bannerUrl || '');
    setScreenshot1(initialApp?.screenshots?.[0] || '');
    setScreenshot2(initialApp?.screenshots?.[1] || '');
    setScreenshot3(initialApp?.screenshots?.[2] || '');
    setScreenshot4(initialApp?.screenshots?.[3] || '');
    setScreenshot5(initialApp?.screenshots?.[4] || '');
    setDemoUrl(initialApp?.demoUrl || '');
    setGithubUrl(initialApp?.githubUrl || '');
    setDownloadUrl(initialApp?.downloadUrl || '');
    setSourceCodePrice(initialApp?.sourceCodePrice || 'Rp 150.000');
    setWhatsappNumber(initialApp?.whatsappNumber || '6281234567890');
    setSize(initialApp?.size || 'Web App');
    setVersion(initialApp?.version || '2.1.0');
    setUpdatedDate(initialApp?.updatedDate || 'August 1, 2026');
    setReleaseDate(initialApp?.releaseDate || '24 Sep 2024');
    setTechStackInput(initialApp?.techStack?.join(', ') || 'React, TypeScript, Tailwind');
    setDescription(initialApp?.description || '');
    setFeaturesInput(initialApp?.features?.join('\n') || '');
    setWhatsNew(initialApp?.whatsNew || 'Pembaruan stabilitas sistem, perbaikan bug minor, dan optimasi performa antarmuka pengguna.');
    setGithubFetchMsg(null);
    setSaveError(null);
  }, [initialApp?.id]);

  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubFetchMsg, setGithubFetchMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const categories: CategoryType[] = ['Tools', 'Productivity', 'Games', 'AI & ML', 'Finance', 'Utilities', 'Entertainment', 'Education'];
  const platforms: PlatformType[] = ['Web', 'Mobile', 'Desktop', 'CLI', 'Extension'];

  // Auto-fetch metadata dari GitHub Releases API
  const handleFetchGithub = async () => {
    if (!githubUrl.trim()) {
      setGithubFetchMsg({ type: 'error', text: 'Masukkan URL GitHub Repository terlebih dahulu.' });
      return;
    }

    // Parse owner/repo dari URL github.com/owner/repo
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (!match) {
      setGithubFetchMsg({ type: 'error', text: 'URL GitHub tidak valid. Contoh: https://github.com/username/repo' });
      return;
    }

    const [, owner, repo] = match;
    setIsFetchingGithub(true);
    setGithubFetchMsg(null);

    try {
      // Ambil data release terbaru
      const releaseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
      
      if (!releaseRes.ok) {
        // Coba ambil semua releases jika latest tidak ada
        const allRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
        if (!allRes.ok) throw new Error('Tidak ada release yang ditemukan di repository ini.');
        const allReleases = await allRes.json();
        if (!allReleases.length) throw new Error('Repository belum memiliki GitHub Release.');
        // Gunakan release pertama
        const latest = allReleases[0];
        applyGithubData(latest);
        return;
      }

      const latest = await releaseRes.json();
      applyGithubData(latest);

    } catch (err: any) {
      setGithubFetchMsg({ type: 'error', text: err.message || 'Gagal mengambil data dari GitHub.' });
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const applyGithubData = (release: any) => {
    // Versi dari tag name (hilangkan prefix 'v')
    const tag = release.tag_name || '';
    setVersion(tag.replace(/^v/, ''));

    // Tanggal update (published_at)
    if (release.published_at) {
      const pubDate = new Date(release.published_at);
      const formatted = pubDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      setUpdatedDate(formatted);
      setReleaseDate(formatted);
    }

    // Ukuran download dari asset pertama
    if (release.assets && release.assets.length > 0) {
      const asset = release.assets[0];
      // URL download otomatis
      setDownloadUrl(asset.browser_download_url || '');
      // Ukuran dalam MB
      const sizeMB = (asset.size / (1024 * 1024)).toFixed(1);
      setSize(`${sizeMB} MB`);
    } else {
      setSize('Web App');
    }

    // Whats new dari body release
    if (release.body && release.body.trim()) {
      setWhatsNew(release.body.trim().slice(0, 500));
    }

    setGithubFetchMsg({ type: 'success', text: `✓ Berhasil! Data release "${release.tag_name || 'latest'}" dari GitHub berhasil diisi otomatis.` });
    setTimeout(() => setGithubFetchMsg(null), 5000);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const techStackArray = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const featuresArray = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const defaultIcon = iconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80';
    const defaultBanner = bannerUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';

    const screenshots = [
      screenshot1.trim() || defaultBanner,
      screenshot2.trim() || defaultIcon,
      screenshot3.trim(),
      screenshot4.trim(),
      screenshot5.trim()
    ].filter(Boolean);

    const appToSave: ProjectApp = {
      ...(initialApp || {}), // Spread existing fields to preserve reviews, versionHistory, discussions, etc.
      id: initialApp ? initialApp.id : `app-${Date.now()}`,
      title: title || 'Aplikasi Tanpa Nama',
      tagline: tagline || 'Aplikasi buatan pengembang',
      developer: developer || 'Arumsari Dev Studio',
      developerEmail: developerEmail || 'developer@devplay.store',
      iconUrl: defaultIcon,
      bannerUrl: defaultBanner,
      screenshots,
      category,
      platform,
      rating: initialApp ? initialApp.rating : 5.0,
      reviewCount: initialApp ? initialApp.reviewCount : 1,
      downloadCount: initialApp ? initialApp.downloadCount : '0',
      downloadCountNum: initialApp ? initialApp.downloadCountNum : 0,
      size: size.trim() || 'Web App',
      ageRating: initialApp ? initialApp.ageRating : 'Everyone',
      badge: initialApp ? initialApp.badge : 'New',
      demoUrl: demoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      downloadUrl: downloadUrl.trim() || undefined,
      sourceCodePrice: sourceCodePrice.trim() || 'Rp 6.000 - Rp 2.490.000 per item',
      whatsappNumber: whatsappNumber.trim() || '6281234567890',
      description: description || 'Aplikasi portofolio berkualitas buatan pengembang.',
      features: featuresArray.length > 0 ? featuresArray : ['Desain responsif', 'Performa cepat', 'Mudah digunakan'],
      techStack: techStackArray.length > 0 ? techStackArray : ['React', 'TypeScript', 'Tailwind'],
      whatsNew: whatsNew || 'Pembaruan stabilitas sistem, perbaikan bug minor, dan optimasi performa antarmuka pengguna.',
      updatedDate: updatedDate.trim() || '30 Jul 2026',
      releaseDate: releaseDate.trim() || '24 Sep 2024',
      version: version.trim() || '2.1.0',
      reviews: initialApp ? initialApp.reviews : [
        {
          id: `rev-${Date.now()}`,
          userName: 'Valora System',
          rating: 5,
          date: 'Hari ini',
          comment: 'Selamat! Project berhasil diperbarui di Valora Store.',
          likes: 1
        }
      ],
      isInstalled: initialApp ? initialApp.isInstalled : false,
      isWishlisted: initialApp ? initialApp.isWishlisted : false
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSaveProject(appToSave);
      onClose();
    } catch (err: any) {
      setSaveError(err?.message || 'Gagal menyimpan ke database. Cek koneksi internet Anda.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center items-start sm:py-6 p-0 md:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-3xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto border border-gray-100">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              {initialApp ? `Atur Detail: ${initialApp.title}` : 'Publikasikan Project Baru'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {initialApp
                ? 'Sesuaikan versi, tanggal rilis, pengembang, harga, dan semua detail toko'
                : 'Tambahkan hasil karya aplikasi Anda ke portofolio Valora Store'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[82vh]">
          

          {/* Core Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
              1. Informasi Dasar Project
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Aplikasi / Project *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Smart Inventory System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tagline Singkat *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Sistem manajemen stok modern dengan grafik realtime"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Platform Target</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ditawarkan Oleh (Developer)</label>
                <input
                  type="text"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  placeholder="Misal: Arumsari Dev Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Metadata Rilis & Detail Toko */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 border-b border-gray-100 pb-1 flex items-center justify-between">
              <span>2. Parameter Rilis & Metadata Toko</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Atur Detail Toko</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Versi Aplikasi
                </label>
                <input
                  type="text"
                  placeholder="Misal: 2.1.0"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Diupdate Pada
                </label>
                <input
                  type="text"
                  placeholder="Misal: August 1, 2026 atau 30 Jul 2026"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dirilis Pada
                </label>
                <input
                  type="text"
                  placeholder="Misal: 24 Sep 2024"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ukuran Download
                </label>
                <input
                  type="text"
                  placeholder="Misal: Web App atau 15.4 MB"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pembelian Dalam Apl / Harga
                </label>
                <input
                  type="text"
                  placeholder="Misal: Rp 6.000 - Rp 2.490.000 per item"
                  value={sourceCodePrice}
                  onChange={(e) => setSourceCodePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Kontak Pengembang
                </label>
                <input
                  type="email"
                  placeholder="developer@devplay.store"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Links & Previews */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
              2. Link Live Demo & Repository
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Live Demo (Web Preview)
                </label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Harga Source Code / Lisensi
                </label>
                <input
                  type="text"
                  placeholder="Rp 150.000"
                  value={sourceCodePrice}
                  onChange={(e) => setSourceCodePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp Developer
                </label>
                <input
                  type="text"
                  placeholder="6281234567890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL GitHub Repository
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleFetchGithub}
                    disabled={isFetchingGithub}
                    title="Auto-Fetch versi, tanggal, dan ukuran dari GitHub Release"
                    className="px-3.5 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {isFetchingGithub
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Mengambil...</span></>
                      : <><Github className="w-3.5 h-3.5" /><span>Auto-Fetch Release</span></>}
                  </button>
                </div>
                {githubFetchMsg && (
                  <p className={`mt-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg ${
                    githubFetchMsg.type === 'success'
                      ? 'text-emerald-800 bg-emerald-50'
                      : 'text-rose-800 bg-rose-50'
                  }`}>
                    {githubFetchMsg.text}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL File Installer / APK Direct
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/user/project/releases/..."
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
              3. Visual & Screenshots (URL Gambar)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Icon Aplikasi (Square 1:1)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Banner Hero (16:9)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Screenshot 1
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={screenshot1}
                  onChange={(e) => setScreenshot1(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Screenshot 2
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={screenshot2}
                  onChange={(e) => setScreenshot2(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Screenshot 3
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={screenshot3}
                  onChange={(e) => setScreenshot3(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Screenshot 4
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={screenshot4}
                  onChange={(e) => setScreenshot4(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Screenshot 5
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={screenshot5}
                  onChange={(e) => setScreenshot5(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-1">
              4. Detail & Tech Stack
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tech Stack (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind CSS, Express, Node.js"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Deskripsi Lengkap Toko Play Store
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan kegunaan, solusi yang ditawarkan, serta keunggulan project Anda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Daftar Fitur Utama (pisahkan dengan baris baru Enter)
              </label>
              <textarea
                rows={3}
                placeholder={"Fitur 1: Autentikasi pengguna aman\nFitur 2: Dashboard analitik realtime\nFitur 3: Ekspor data ke PDF"}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {saveError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
                ) : (
                  <span>{initialApp ? 'Simpan Perubahan Detail' : 'Publikasikan ke Valora Store'}</span>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
};
