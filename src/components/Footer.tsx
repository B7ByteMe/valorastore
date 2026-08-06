import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-gray-200/80 pt-16 pb-8 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                <img src={logoImg} alt="Valora Store Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">Valora Store</span>
            </div>
            <p className="text-gray-500 leading-relaxed font-medium">
              Platform ekosistem portofolio premium untuk menyimpan, mempublikasikan, dan menguji coba inovasi perangkat lunak secara interaktif.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-5 uppercase tracking-widest text-[11px] opacity-90">Fitur Toko</h4>
            <ul className="space-y-3">
              {['Uji Demo Live Simulator', 'Integrasi Source Code GitHub', 'Auto Generator Gemini AI', 'Ulasan & Rating Komunitas'].map((item) => (
                <li key={item} className="flex items-center gap-2 group cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span className="group-hover:text-emerald-600 text-gray-500 transition-colors font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-5 uppercase tracking-widest text-[11px] opacity-90">Kategori Utama</h4>
            <ul className="space-y-3">
              {['Tools & Utilities', 'AI & Machine Learning', 'Productivity & Office', 'Games & Web Apps'].map((item) => (
                <li key={item} className="flex items-center gap-2 group cursor-pointer">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  <span className="group-hover:text-emerald-600 text-gray-500 transition-colors font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 mb-5 uppercase tracking-widest text-[11px] opacity-90">Developer Studio</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              Dibuat khusus untuk pengembang aplikasi agar karya project tidak hanya menumpuk di local drive.
            </p>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Material Design 3 Certified
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-[11px] font-medium">
          <p>© {new Date().getFullYear()} Valora Store Showcase • Arumsari Dev Studio. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Syarat Ketentuan</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-gray-600 transition-colors cursor-pointer">Panduan Developer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
