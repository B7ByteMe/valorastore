import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Play, CheckCircle2, Wifi, Battery, X } from 'lucide-react';
import { ProjectApp } from '../types';

interface SimulatorInstallerModalProps {
  app: ProjectApp;
  onClose: () => void;
  onInstallComplete: (app: ProjectApp) => void;
  onOpenLiveDemo: (app: ProjectApp) => void;
}

export const SimulatorInstallerModal: React.FC<SimulatorInstallerModalProps> = ({
  app,
  onClose,
  onInstallComplete,
  onOpenLiveDemo
}) => {
  const [step, setStep] = useState<'ready' | 'installing' | 'completed'>('ready');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'installing') {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setStep('completed');
            }, 300);
            return 100;
          }
          return prev + Math.random() * 15 + 10;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleInstallClick = () => {
    setStep('installing');
    setProgress(0);
  };

  const handleSelesai = () => {
    onInstallComplete(app);
    onClose();
  };

  const handleBuka = () => {
    onInstallComplete(app);
    onClose();
    onOpenLiveDemo(app);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      
      {/* Smartphone Frame Shell */}
      <div className="bg-slate-900 w-full max-w-[360px] rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col items-center relative my-auto overflow-hidden">
        
        {/* Notch / Speaker Earphone */}
        <div className="w-28 h-4.5 bg-slate-950 rounded-b-2xl absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Area */}
        <div className="w-full bg-[#f3f4f6] rounded-[28px] overflow-hidden flex flex-col min-h-[500px] relative z-10">
          
          {/* Status Bar */}
          <div className="bg-white/40 px-5 pt-6 pb-2.5 flex items-center justify-between text-[11px] text-gray-700 font-bold select-none">
            <span>19:10</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-gray-700" />
              <Battery className="w-4 h-4 text-gray-700" />
            </div>
          </div>

          {/* Installer Dialog Panel */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            {step === 'ready' && (
              <>
                <div className="space-y-6">
                  {/* Top Bar Label */}
                  <div className="flex items-center gap-2 text-gray-600 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Penginstal Paket</span>
                  </div>

                  {/* App Identity Card */}
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-3xs">
                    <img
                      src={app.iconUrl}
                      alt={app.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-gray-900 text-base truncate">
                        {app.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">
                        Versi {app.version}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium truncate">
                        Oleh {app.developer}
                      </p>
                    </div>
                  </div>

                  {/* Security Clearance Alert */}
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-start gap-2.5 text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold">Verifikasi Valora SafePlay</p>
                      <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                        Berkas APK telah dipindai dari malware dan tanda tangan rilisan cocok dengan {app.developer}.
                      </p>
                    </div>
                  </div>

                  {/* Installation Question Prompt */}
                  <div className="space-y-2.5 text-gray-700">
                    <h4 className="font-extrabold text-sm text-gray-900">
                      Apakah Anda ingin memasang aplikasi ini?
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Aplikasi akan terpasang di simulator internal web Anda. Tidak diperlukan akses khusus.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleInstallClick}
                    className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Pasang
                  </button>
                </div>
              </>
            )}

            {step === 'installing' && (
              <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                {/* App icon under animated orbit ring */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-250 shadow-md relative z-10">
                    <img
                      src={app.iconUrl}
                      alt={app.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -inset-2.5 rounded-[22px] border-2 border-emerald-500 border-t-transparent animate-spin" />
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    Sedang memasang {app.title}...
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider animate-pulse">
                    Mengekstrak paket & memvalidasi runtime...
                  </p>
                </div>

                {/* Custom geometric progress bar */}
                <div className="w-full max-w-[240px]">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300/40">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-150"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mt-1.5 px-0.5">
                    <span>PROGRESS</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            )}

            {step === 'completed' && (
              <>
                <div className="flex-1 flex flex-col justify-center items-center space-y-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-250 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-gray-900 text-base">
                      Aplikasi Terpasang.
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                      Aplikasi **{app.title}** siap digunakan pada simulator web Anda.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={handleSelesai}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
                  >
                    Selesai
                  </button>
                  <button
                    onClick={handleBuka}
                    className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Buka</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
