import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  Share2,
  Copy,
  Check,
  GraduationCap,
  BookOpen,
  Send,
  ExternalLink,
  MessageCircle,
  Users,
  Sparkles,
  Link,
  ShieldCheck,
} from 'lucide-react';

export const ShareWhatsAppModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, addToastNotification } = useLMS();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isShareModalOpen) return null;

  // Base URL: Prioritize production shared URL, or fallback to current origin
  const PRODUCTION_BASE_URL = 'https://ais-pre-3qnoshnfxdzydpyl3vvfve-82783687657.asia-southeast1.run.app';
  
  // Use current window origin if available and not localhost/dev, otherwise production URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (origin && !origin.includes('localhost') && !origin.includes('ais-dev')) {
        return origin;
      }
    }
    return PRODUCTION_BASE_URL;
  };

  const baseUrl = getBaseUrl();
  const studentUrl = `${baseUrl}?ref=wa&role=siswa`;
  const teacherUrl = `${baseUrl}?ref=wa&role=guru`;
  const adminUrl = `${baseUrl}?ref=wa&role=admin`;

  // WhatsApp Message Templates
  const studentMessageText = `*📚 PORTAL BELAJAR DIGITAL SMPN 1 WONOSARI*
_Untuk Siswa & Orang Tua/Wali Murid_

Halo Peserta Didik SMPN 1 Wonosari! Silakan akses portal pembelajaran digital kelas pintar untuk:
✅ Membaca Modul & E-Book Bahan Ajar (PDF)
✅ Menonton Video Pembelajaran Interaktif
✅ Mengerjakan Kuis & Asesmen CBT Berwaktu
✅ Mengumpulkan Tugas Harian
✅ Memantau Nilai & Raport Digital Mandiri

📲 *Klik Link Masuk Siswa di Sini:*
${studentUrl}

🔐 *PETUNJUK MASUK:*
Ketika tautan di atas dibuka, Anda akan langsung diarahkan ke *Halaman Masuk (Login)*.
Silakan masukkan *NISN / ID Pengguna* dan *Kata Sandi* yang telah dibuat dan dibagikan oleh Admin Sekolah.

_Dapat diakses langsung lewat HP Android, iPhone, Laptop, atau Tablet tanpa perlu install aplikasi._
*Semangat Belajar & Raih Prestasi Terbaik!* 🌟`;

  const teacherMessageText = `*👩‍🏫 PORTAL GURU & LMS SMPN 1 WONOSARI*
_Untuk Bapak/Ibu Dewan Guru Pengampu_

Yth. Bapak/Ibu Guru SMPN 1 Wonosari, berikut adalah tautan akses portal pengajar untuk:
📂 Mengunggah Modul Materi Pembelajaran (Otomatis ke Folder Google Drive)
📝 Membuat Soal & Pelaksanaan Ujian Kuis CBT Berwaktu
📊 Memeriksa & Memberi Nilai Tugas Siswa
📈 Merekap Nilai & Cetak Raport Digital Kurikulum Merdeka

📲 *Klik Link Masuk Portal Guru di Sini:*
${teacherUrl}

🔐 *PETUNJUK MASUK:*
Saat membuka link di atas, sistem akan langsung menampilkan *Halaman Masuk (Login)*.
Silakan masuk menggunakan *NIP / Username* dan *Kata Sandi* yang telah dibuat oleh Admin IT / Kurikulum.

_Akses langsung menggunakan akun guru. Simpan tautan ini untuk kemudahan pengelolaan KBM harian._`;

  const adminMessageText = `*🛡️ PORTAL ADMINISTRATOR SMPN 1 WONOSARI*
_Khusus Petugas IT / Operator Kurikulum_

Akses Pusat Kendali Manajemen Pengguna, Impor Excel, Pengelolaan Akun, & Reset Data:
${adminUrl}

🔐 Masuk dengan Username dan Password Administrator yang sah.`;

  const handleCopy = (text: string, type: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    addToastNotification(
      'Teks Berhasil Disalin',
      `${label} siap ditempel (paste) dan dikirim ke grup WhatsApp.`,
      'system'
    );
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const openWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-6 py-4 dark:border-slate-800 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bagikan Tautan Aplikasi via WhatsApp
                </h3>
                <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Resmi WA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih link sesuai peran agar guru dan siswa langsung masuk ke porsinya masing-masing
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Card 1: Khusus Siswa */}
          <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/50 to-blue-50/30 p-5 dark:border-sky-900/60 dark:bg-slate-800/80 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-sky-100 pb-3 dark:border-sky-900/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    1. Link Khusus Siswa & Orang Tua / Wali
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Otomatis membuka menu Belajar, Modul PDF, Video, Kuis CBT, Tugas & Raport
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Untuk Grup Kelas / Siswa
              </span>
            </div>

            {/* URL Display */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Tautan Langsung Siswa:
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
                <Link className="h-4 w-4 text-sky-500 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={studentUrl}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-800 focus:outline-hidden dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(studentUrl, 'student_url', 'Tautan Siswa')}
                  className="flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 hover:bg-sky-100 dark:bg-sky-950/80 dark:text-sky-300"
                >
                  {copiedType === 'student_url' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openWhatsApp(studentMessageText)}
                className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Pesan ke WhatsApp Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(studentMessageText, 'student_msg', 'Format Pesan WhatsApp Siswa')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {copiedType === 'student_msg' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Pesan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Format Pesan WA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Khusus Guru */}
          <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 p-5 dark:border-indigo-900/60 dark:bg-slate-800/80 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-indigo-100 pb-3 dark:border-indigo-900/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    2. Link Khusus Dewan Guru & Tenaga Pendidik
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Membuka dashboard Guru: Unggah Modul ke Drive, Buat Kuis CBT & Penilaian Tugas
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Untuk Dewan Guru
              </span>
            </div>

            {/* URL Display */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Tautan Langsung Guru:
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
                <Link className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={teacherUrl}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-800 focus:outline-hidden dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(teacherUrl, 'teacher_url', 'Tautan Guru')}
                  className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300"
                >
                  {copiedType === 'teacher_url' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openWhatsApp(teacherMessageText)}
                className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Pesan ke WhatsApp Dewan Guru</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(teacherMessageText, 'teacher_msg', 'Format Pesan WhatsApp Guru')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {copiedType === 'teacher_msg' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Pesan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Format Pesan WA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Card: Responsif & Praktis */}
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Akses Instan & Aman Tanpa Perlu Install Aplikasi Tambahan
              </p>
              <p className="text-[11px] leading-relaxed">
                Tautan di atas dapat langsung dibuka dari aplikasi WhatsApp melalui Chrome, Safari, atau peramban lainnya di HP Android, iPhone, dan komputer. Ketika tautan dibuka, peramban akan langsung memunculkan <strong>Halaman Masuk (Login)</strong> yang mewajibkan input ID Pengguna/NISN dan Kata Sandi yang telah dibuat oleh Admin Sekolah.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(false)}
            className="rounded-xl bg-slate-200 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
