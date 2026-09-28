import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Moon,
  Sun,
  Bell,
  Wifi,
  WifiOff,
  ShieldCheck,
  Eye,
  EyeOff,
  RotateCw,
  RefreshCw,
  Lock,
  Smartphone,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    isOnline,
    toggleSimulateOffline,
    offlineQueue,
    syncOfflineData,
    privacyMaskEnabled,
    togglePrivacyMask,
    addToastNotification,
  } = useLMS();

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          addToastNotification(
            'Notifikasi Push Diaktifkan',
            'Anda sekarang akan menerima pengingat tenggat kuis & tugas secara real-time langsung di perangkat.',
            'system'
          );
        } else {
          addToastNotification(
            'Izin Ditolak',
            'Izin notifikasi browser belum diberikan. Notifikasi in-app tetap aktif.',
            'system'
          );
        }
      } catch (err) {
        addToastNotification('Notifikasi Aktif', 'Notifikasi in-app aktif untuk pengingat tenggat waktu.', 'system');
      }
    } else {
      addToastNotification('Notifikasi In-App', 'Sistem menggunakan notifikasi in-app otomatis.', 'system');
    }
  };

  const handleTestPushNotification = () => {
    addToastNotification(
      'Uji Coba Pengingat Tenggat',
      'Pemberitahuan: Kuis Bab 3 Matematika berakhir hari ini pukul 16:00 WIB. Segera selesaikan!',
      'deadline'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pengaturan Sistem & Preferensi
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Konfigurasi tampilan, keamanan data enkripsi, sinkronisasi offline, dan notifikasi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 1. Tampilan & Mode Gelap */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Mode Gelap (Dark Mode)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kenyamanan mata saat belajar di malam hari
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tema Saat Ini: <span className="font-bold">{darkMode ? 'Gelap (Dark)' : 'Terang (Light)'}</span>
            </span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2. Sistem Notifikasi Push Real-time */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Notifikasi Push Real-time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peringatan dini tenggat waktu tugas & ujian aktif
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={handleRequestPushPermission}
              className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-600"
            >
              Aktifkan Notifikasi Perangkat
            </button>
            <button
              onClick={handleTestPushNotification}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Uji Notifikasi Sekarang
            </button>
          </div>
        </div>

        {/* 3. Sinkronisasi Data Offline */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dukungan Sinkronisasi Offline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses materi dan kerjakan kuis saat koneksi terputus
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Status Jaringan:</span>
              <span className={`font-bold ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isOnline ? 'Terhubung (Online)' : 'Mode Offline Aktif'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Perubahan Belum Tersinkron:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {offlineQueue.length} data lokal
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={toggleSimulateOffline}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              {isOnline ? 'Simulasikan Putus Jaringan' : 'Pulihkan Jaringan (Online)'}
            </button>
            {offlineQueue.length > 0 && isOnline && (
              <button
                onClick={syncOfflineData}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-700"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Paksa Sinkronisasi</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. Keamanan & Enkripsi Data Pribadi */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Keamanan & Privasi Data Enkripsi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standar enkripsi 256-bit untuk data NISN & Nilai Siswa
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Protokol Keamanan:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                AES-256 Data Masking
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Penyamaran NISN/NIK:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {privacyMaskEnabled ? 'Aktif (Disamarkan ••••••)' : 'Tampil Terbuka'}
              </span>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={togglePrivacyMask}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {privacyMaskEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{privacyMaskEnabled ? 'Tampilkan Data Asli' : 'Samarkan Data Sensitif (NISN)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Info className="h-4 w-4 text-blue-600" />
          <span>Sistem Informasi LMS SMPN 1 Wonosari - Digital Kelas Pintar</span>
        </div>
        <p className="mt-1 leading-relaxed">
          Dirancang untuk mendukung pembelajaran interaktif, evaluasi daring CBT yang akurat, analitik ketuntasan KKM bagi guru, serta sinkronisasi luring ramah perangkat bergerak.
        </p>
      </div>
    </div>
  );
};
