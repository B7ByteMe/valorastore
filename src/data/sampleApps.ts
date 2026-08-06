import { ProjectApp } from '../types';

export const INITIAL_APPS: ProjectApp[] = [
  {
    id: 'icebeats',
    title: 'IceBeats',
    tagline: 'Pemutar musik minimalis modern berbasis Compose dengan pemutaran latar belakang premium',
    developer: 'B7ByteMe',
    developerEmail: 'developer@b7byteme.com',
    developerProjectsCount: 1,
    developerBadge: 'Verified Developer',
    iconUrl: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Entertainment',
    platform: 'Mobile',
    rating: 4.9,
    reviewCount: 42,
    downloadCount: '1.2K+',
    downloadCountNum: 1240,
    size: '10.8 MB',
    ageRating: 'Everyone',
    badge: 'Trending',
    githubUrl: 'https://github.com/B7ByteMe/IceBeats',
    downloadUrl: 'https://github.com/B7ByteMe/IceBeats/releases/download/v6.0.3/IceBeats-v6.0.3.apk',
    description: `IceBeats adalah pemutar musik minimalis modern untuk Android yang berfokus pada kecepatan, performa tinggi, dan kustomisasi penuh. Dibangun sepenuhnya menggunakan Jetpack Compose, aplikasi ini mendukung pemutaran berbagai format audio berkualias tinggi, integrasi deep linking yang mulus, perbaikan otomatis PoTokenWebView, serta tema gelap (Dark Mode) paksa yang elegan untuk menjaga kenyamanan mata Anda saat mendengarkan musik di malam hari.

Aplikasi ini bersifat open source dan didesain secara portabel dengan file APK universal yang ringan dan bebas dari segala jenis pelacak iklan.`,
    features: [
      'Antarmuka Jetpack Compose modern, minimalis, dan sangat responsif',
      'Tema Gelap paksa (Dark Mode) otomatis di semua perangkat Android',
      'Pemutaran audio latar belakang tanpa hambatan dengan optimasi PoTokenWebView',
      'Rilisan APK universal tunggal yang ringan dan hemat memori',
      'Open Source penuh, aman, dan tanpa iklan'
    ],
    techStack: ['Android SDK', 'Kotlin', 'Jetpack Compose', 'PoTokenWebView'],
    whatsNew: 'v6.0.3: Rebrand menjadi IceBeats, perbaikan masalah deep linking, dan perbaikan bug NullPointerException pada pemutaran.',
    updatedDate: 'August 5, 2026',
    releaseDate: '30 Jul 2026',
    version: '6.0.3',
    versionHistory: [
      {
        id: 'vh-ib-603',
        version: 'v6.0.3',
        date: '5 Agustus 2026',
        type: 'Major',
        whatsNew: 'Rebrand menjadi IceBeats, perbaikan deep linking, dan penanganan pemutaran audio.',
        changes: [
          'Rebrand nama aplikasi resmi menjadi IceBeats secara universal',
          'Perbaikan bug NullPointerException ketika memutar media tertentu',
          'Perbaikan sistem deep linking agar rujukan lagu mengarah ke halaman yang tepat'
        ]
      },
      {
        id: 'vh-ib-602',
        version: 'v6.0.2',
        date: '3 Agustus 2026',
        type: 'Minor',
        whatsNew: 'Dukungan Tema Gelap Otomatis secara paksa dan ikon HD baru.',
        changes: [
          'Memaksa tema gelap otomatis di semua perangkat Android guna kenyamanan pemakaian malam hari',
          'Ikon baru versi kustomisasi resolusi tinggi (HD)',
          'Fix: Masalah pemutaran musik pada build Release (PoTokenWebView)'
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-ib-1',
        userName: 'Ahmad Rafli',
        rating: 5,
        date: '5 Agustus 2026',
        comment: 'Sangat ringan dan UI Compose-nya bersih sekali! Dark modenya nyaman dipakai pas malam.',
        likes: 12
      },
      {
        id: 'rev-ib-2',
        userName: 'Siti Aminah',
        rating: 5,
        date: '4 Agustus 2026',
        comment: 'Pemutaran lancar, akhirnya bisa dengerin lagu tanpa iklan yang mengganggu.',
        likes: 8
      }
    ],
    isInstalled: false,
    isWishlisted: false
  },
  {
    id: 'gemini-canvas-ai',
    title: 'Gemini Canvas AI Studio',
    tagline: 'AI-powered multimodal creative workspace and smart writing assistant',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    developerProjectsCount: 14,
    developerBadge: 'Master Creator',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'AI & ML',
    platform: 'Web',
    rating: 4.9,
    reviewCount: 384,
    downloadCount: '50K+',
    downloadCountNum: 52000,
    size: 'Web App',
    ageRating: 'Everyone',
    badge: 'Editor Choice',
    demoUrl: 'https://example.com/demo/gemini-canvas',
    githubUrl: 'https://github.com/arumsari/gemini-canvas-ai',
    downloadUrl: 'https://github.com/arumsari/gemini-canvas-ai/releases/download/v2.1.0/app-release.apk',
    description: `Gemini Canvas AI Studio is a next-generation creative workspace powered by Google's Gemini LLM. It seamlessly integrates smart text generation, automated code refactoring, image generation, and dynamic markdown rendering in one fluid canvas interface.

Designed for developers, writers, and digital creators who need an intuitive space to brainstorm, draft documents, analyze datasets, and automate workflows effortlessly.

Featuring multi-agent chat modes, real-time code sandbox execution, export to GitHub Gist or PDF, and context-aware auto-completion.`,
    features: [
      'Multimodal AI chat & context-aware document canvas',
      'Instant code generation with live React & JavaScript preview',
      'Integrated text-to-image generator with prompt engineering presets',
      'Dark/Light mode with custom Material Design theme',
      'Offline caching & local browser project backup'
    ],
    techStack: ['React 19', 'TypeScript', 'Google Gemini API', 'Tailwind CSS', 'Vite'],
    whatsNew: 'v2.1.0: Added Gemini 2.5 Flash model integration, improved markdown table rendering, faster streaming response times, and customizable workspace themes.',
    updatedDate: 'August 1, 2026',
    releaseDate: '24 Sep 2024',
    version: '2.1.0',
    versionHistory: [
      {
        id: 'vh-210',
        version: 'v2.1.0',
        date: '1 Agustus 2026',
        type: 'Major',
        whatsNew: 'Integrasi Gemini 2.5 Flash, optimasi kecepatan streaming AI, dan tema workspace baru.',
        changes: [
          'Integrasi model AI Gemini 2.5 Flash untuk pemrosesan teks & kode 3x lebih cepat',
          'Peningkatan parser markdown untuk dukungan tabel dan rumus matematika LaTeX',
          'Dukungan ekspor dokumen langsung ke format PDF dan GitHub Gist',
          'Perbaikan bug memori leak saat mengunggah gambar latar belakang besar'
        ]
      },
      {
        id: 'vh-200',
        version: 'v2.0.0',
        date: '15 Mei 2026',
        type: 'Major',
        whatsNew: 'Pembaruan arsitektur besar-besaran: Dukungan multi-canvas dan sandbox React live.',
        changes: [
          'Fitur Multi-Canvas: Buat beberapa tab workspace simultaneously',
          'Live Preview Code Sandbox untuk komponen React & Tailwind',
          'Pencarian riwayat percakapan instan via keyboard shortcut (Ctrl+K)'
        ]
      },
      {
        id: 'vh-150',
        version: 'v1.5.0',
        date: '10 Februari 2026',
        type: 'Minor',
        whatsNew: 'Dukungan generator gambar AI bawaan dan mode gelap Twilight.',
        changes: [
          'Mode Text-to-Image terintegrasi langsung dalam kanvas',
          'Tema Twilight Dark Mode untuk kenyamanan mata di malam hari'
        ]
      },
      {
        id: 'vh-100',
        version: 'v1.0.0',
        date: '24 September 2024',
        type: 'Patch',
        whatsNew: 'Rilis perdana ke Valora Store dengan fitur dasar AI Chat & Note Assistant.',
        changes: [
          'Peluncuran awal aplikasi di Valora Store',
          'Fitur dasar AI Chat Assistant & Autosave local storage'
        ]
      }
    ],
    discussions: [
      {
        id: 'disc-1',
        title: 'Error: Infinite re-render saat mengunggah file markdown > 5MB',
        content: 'Halo dev, saat coba upload file markdown yang ukuran besar di atas 5MB, layar aplikasi mengalami freeze / lag parah di browser Firefox.',
        authorName: 'Budi Santoso (QA Tester)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        authorRole: 'Tester',
        type: 'bug_report',
        status: 'resolved',
        createdAt: '2 Agustus 2026',
        codeSnippet: `// Cause found in legacy chunker:
const parseLargeFile = (str) => {
  while(str.length > 0) {
    // missing chunk index increment causing CPU 100%
  }
}`,
        deviceInfo: 'Firefox 128.0 / Windows 11 x64',
        replies: [
          {
            id: 'rep-1',
            authorName: 'Arumsari Dev Studio',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorRole: 'Developer',
            comment: 'Terima kasih laporan detailnya Budi! Masalah ini sudah disolusikan di patch v2.1.0 dengan implementasi Web Worker streaming chunk parser.',
            createdAt: '2 Agustus 2026'
          }
        ]
      },
      {
        id: 'disc-2',
        title: 'Usulan Fitur: Tambahkan tombol Export ke format Word (.docx)',
        content: 'Aplikasi ini sudah sangat keren untuk drafting. Akan lebih sempurna jika hasil tulisan bisa diekspor ke Microsoft Word (.docx) selain PDF.',
        authorName: 'Dewi Lestari',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        authorRole: 'User',
        type: 'feature_request',
        status: 'investigating',
        createdAt: '3 Agustus 2026',
        replies: [
          {
            id: 'rep-2',
            authorName: 'Arumsari Dev Studio',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorRole: 'Developer',
            comment: 'Saran yang hebat! Kami sedang memasukkan pustaka docx exporter ke roadmap versi v2.2.0 mendatang.',
            createdAt: '4 Agustus 2026'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Rian Pratama',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'July 28, 2026',
        comment: 'Aplikasi AI buatan lokal yang sangat powerful! UI-nya bersih banget kaya Google Play Store official. Sangat membantu pas ngerjain project kodingan.',
        likes: 24
      },
      {
        id: 'r2',
        userName: 'Siti Nurhaliza',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'July 25, 2026',
        comment: 'Desainnya ciamik banget! Respon Gemini cepet dan hasilnya akurat. Pokoknya mantap buat portofolio!',
        likes: 12
      }
    ]
  },
  {
    id: 'pixel-dash-runner',
    title: 'Pixel Dash: Retro Runner',
    tagline: 'Fast-paced 8-bit endless runner game built with Canvas API',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Games',
    platform: 'Web',
    rating: 4.8,
    reviewCount: 215,
    downloadCount: '25K+',
    downloadCountNum: 26000,
    size: '8.4 MB',
    ageRating: 'Everyone',
    badge: 'Trending',
    demoUrl: 'https://example.com/demo/pixel-dash',
    githubUrl: 'https://github.com/arumsari/pixel-dash-runner',
    downloadUrl: 'https://github.com/arumsari/pixel-dash-runner/releases/download/v1.4/pixel-dash.apk',
    description: `Jump into retro nostalgia with Pixel Dash: Retro Runner! Navigate through vibrant cybernetic neon cities, dodge obstacles, collect power-ups, and compete for high scores on global developer leaderboards.

Built entirely with HTML5 Canvas, Web Audio API, and zero heavy game engine dependencies. Super lightweight, runs at smooth 60 FPS on both mobile browsers and desktop devices.`,
    features: [
      'Pure HTML5 Canvas 60 FPS physics engine',
      'Chiptune 8-bit procedural soundtrack & sound effects',
      'Dynamic power-ups: Shield, Double Jump, Magnet, and Turbo Boost',
      'Global online high score leaderboard stored in cloud',
      'Touch controls & Keyboard support (Arrow / Spacebar)'
    ],
    techStack: ['HTML5 Canvas', 'TypeScript', 'Web Audio API', 'Tailwind CSS'],
    whatsNew: 'v1.4.0: Added 3 new neon city stages, customizable character skins, double jump ability, and high score sharing!',
    updatedDate: 'July 15, 2026',
    version: '1.4.0',
    reviews: [
      {
        id: 'r3',
        userName: 'Budi Santoso',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'July 10, 2026',
        comment: 'Game ringan tapi adiktif banget! Mantap buat nunggu kodingan kelar.',
        likes: 18
      }
    ]
  },
  {
    id: 'zenith-task-studio',
    title: 'Zenith Task Studio',
    tagline: 'Minimalist Kanban board, Pomodoro timer, and daily habit tracker',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    iconUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Productivity',
    platform: 'Web',
    rating: 4.9,
    reviewCount: 512,
    downloadCount: '100K+',
    downloadCountNum: 105000,
    size: 'Web App',
    ageRating: 'Everyone',
    badge: 'Top Rated',
    demoUrl: 'https://example.com/demo/zenith-task',
    githubUrl: 'https://github.com/arumsari/zenith-task-studio',
    description: `Zenith Task Studio brings distraction-free focus to your daily workflow. Combine drag-and-drop Kanban boards with integrated Pomodoro timers, subtasks, priority tags, and weekly productivity insights.

All data is stored securely in local persistent cache with full export/import JSON capability and Markdown report generation.`,
    features: [
      'Fluid drag-and-drop task boards with custom swimlanes',
      'Integrated Pomodoro timer with ambient white noise sounds',
      'Weekly productivity analytics and task completion charts',
      'Markdown task descriptions with checklist support',
      'Instant JSON backup & restore'
    ],
    techStack: ['React 19', 'Framer Motion', 'Lucide Icons', 'Tailwind CSS'],
    whatsNew: 'v3.0: Complete Material 3 UI redesign, customizable ambient soundscapes, subtask checklists, and priority color coding.',
    updatedDate: 'June 29, 2026',
    version: '3.0.1',
    reviews: [
      {
        id: 'r4',
        userName: 'Dewi Anggraini',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        date: 'June 30, 2026',
        comment: 'Aplikasi manajemen tugas paling rapi yang pernah saya coba. Fitur Pomodoro-nya ngebantu banget pas kerja remote.',
        likes: 31
      }
    ]
  },
  {
    id: 'codecraft-snippet-vault',
    title: 'CodeCraft Snippet Vault',
    tagline: 'Developer code snippet manager with instant search & syntax highlighting',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    iconUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Tools',
    platform: 'Desktop',
    rating: 4.7,
    reviewCount: 180,
    downloadCount: '15K+',
    downloadCountNum: 16200,
    size: '18 MB',
    ageRating: 'Everyone',
    badge: 'Featured',
    demoUrl: 'https://example.com/demo/codecraft-vault',
    githubUrl: 'https://github.com/arumsari/codecraft-snippet-vault',
    downloadUrl: 'https://github.com/arumsari/codecraft-snippet-vault/releases/download/v1.2.0/codecraft-setup.exe',
    description: `Never lose useful code snippets, shell commands, or regex patterns again. CodeCraft Snippet Vault provides lightning-fast search across 30+ programming languages with tags, syntax highlighting, and copy-to-clipboard hotkeys.`,
    features: [
      'Fuzzy search across code snippets, tags, and titles',
      'Syntax highlighting for 30+ programming languages',
      'One-click copy to clipboard with notification feedback',
      'Gist sync & Markdown documentation exporter'
    ],
    techStack: ['Electron', 'React', 'PrismJS', 'TypeScript'],
    whatsNew: 'v1.2.0: Added GitHub Gist cloud synchronization, dark mode syntax themes, and custom tag colors.',
    updatedDate: 'May 12, 2026',
    version: '1.2.0',
    reviews: []
  },
  {
    id: 'cryptopulse-pro',
    title: 'CryptoPulse Pro Analytics',
    tagline: 'Real-time cryptocurrency tracking, portfolio valuation, and price alerts',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    iconUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Finance',
    platform: 'Web',
    rating: 4.6,
    reviewCount: 142,
    downloadCount: '10K+',
    downloadCountNum: 11000,
    size: 'Web App',
    ageRating: 'Everyone 3+',
    badge: 'New',
    demoUrl: 'https://example.com/demo/cryptopulse',
    githubUrl: 'https://github.com/arumsari/cryptopulse-pro',
    description: `Track global crypto assets with live price updates, interactive candlestick charts, profit/loss portfolio calculator, and instant news aggregator. Clean, fast, and light on system resources.`,
    features: [
      'Live crypto ticker for top 500+ coins',
      'Interactive historical candlestick charts',
      'Simulated portfolio tracker with ROI calculation',
      'Currency switcher (USD, IDR, EUR, JPY)'
    ],
    techStack: ['React', 'Recharts', 'Tailwind CSS', 'CoinGecko API'],
    whatsNew: 'v1.0.5: Added IDR currency formatting, watchlists, and live market trend indicators.',
    updatedDate: 'July 20, 2026',
    version: '1.0.5',
    reviews: []
  },
  {
    id: 'ecotrack-planner',
    title: 'EcoTrack Planet',
    tagline: 'Eco-friendly habit tracker and carbon footprint impact calculator',
    developer: 'Arumsari Dev Studio',
    developerEmail: 'developer@valorastore.com',
    iconUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=256&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80'
    ],
    category: 'Utilities',
    platform: 'Mobile',
    rating: 4.8,
    reviewCount: 94,
    downloadCount: '5K+',
    downloadCountNum: 5800,
    size: '14 MB',
    ageRating: 'Everyone',
    demoUrl: 'https://example.com/demo/ecotrack',
    githubUrl: 'https://github.com/arumsari/ecotrack-planner',
    downloadUrl: 'https://github.com/arumsari/ecotrack-planner/releases/download/v1.0/ecotrack.apk',
    description: `EcoTrack Planet helps you log daily eco-friendly habits like zero-waste shopping, recycling, public transport usage, and plant-based meals. Visualize your personal carbon offset and compete with friends for green achievements.`,
    features: [
      'Daily green habit logging with streak badges',
      'Carbon offset estimator based on energy & transport logs',
      'Community challenges and monthly sustainability goals',
      'Exportable Eco Certificate card for social sharing'
    ],
    techStack: ['React Native', 'TypeScript', 'Tailwind', 'Chart.js'],
    whatsNew: 'v1.1.0: New achievements system, green badges, and weekly summary notifications.',
    updatedDate: 'July 05, 2026',
    version: '1.1.0',
    reviews: []
  }
];
