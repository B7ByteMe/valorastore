import { UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    name: 'Super Admin Valora',
    email: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    developerStudioName: 'Valora Store Systems',
    joinedDate: '10 Jan 2024',
    bio: 'Administrator utama pengelola platform Valora Store & jaringan pengembang software.',
    password: 'admin',
    appsUploadedCount: 8
  },
  {
    id: 'usr-dev-1',
    name: 'Arumsari Studio (Developer)',
    email: 'arumsaricorporation@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'developer',
    status: 'active',
    developerStudioName: 'Arumsari Dev Studio',
    joinedDate: '15 Maret 2024',
    bio: 'Mobile & Fullstack Web Developer berfokus pada aplikasi produktivitas dan AI.',
    password: 'dev123',
    appsUploadedCount: 5
  },
  {
    id: 'usr-dev-2',
    name: 'Rian Kurniawan (Developer)',
    email: 'developer@valorastore.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'developer',
    status: 'active',
    developerStudioName: 'Nexa Software Tech',
    joinedDate: '20 April 2024',
    bio: 'Pengembang game indie & aplikasi utilities Android.',
    password: 'dev123',
    appsUploadedCount: 3
  },
  {
    id: 'usr-user-1',
    name: 'Budi Pratama',
    email: 'user@valorastore.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    joinedDate: '12 Mei 2024',
    bio: 'Pengguna aktif pencari aplikasi produktivitas & tools AI.',
    password: 'user123',
    appsUploadedCount: 0,
    developerStatus: 'none'
  },
  {
    id: 'usr-user-pending',
    name: 'Dimas Anggara',
    email: 'dimas.dev@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    developerStatus: 'pending',
    developerStudioName: 'Dimas Code Studio',
    developerRequestDate: '05 Agustus 2026',
    developerReason: 'Saya ingin mempublikasikan aplikasi Android Kasir UMKM & POS buatan saya ke Valora Store.',
    whatsappNumber: '6281298765432',
    joinedDate: '02 Juli 2024',
    bio: 'Android & Web Fullstack Developer.',
    password: 'user123',
    appsUploadedCount: 0
  },
  {
    id: 'usr-user-2',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    joinedDate: '01 Juni 2024',
    bio: 'Software QA Tester & UI Design enthusiast.',
    password: 'user123',
    appsUploadedCount: 0
  }
];
