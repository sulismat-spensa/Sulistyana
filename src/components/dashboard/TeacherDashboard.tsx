import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Building2,
  Share2,
} from 'lucide-react';

interface TeacherDashboardProps {
  onOpenCreateQuiz: () => void;
  onOpenCreateClass?: () => void;
  onOpenCreateLesson?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenCreateQuiz,
  onOpenCreateClass,
  onOpenCreateLesson,
}) => {
  const {
    currentUser,
    classes,
    studentsRoster,
    exportReportToCSV,
    openPrintRaportModal,
    setActiveTab,
    privacyMaskEnabled,
    setIsShareModalOpen,
  } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalStudents = studentsRoster.length;
  const remedialStudents = studentsRoster.filter((s) => s.avg < 75);
  const passedStudents = studentsRoster.filter((s) => s.avg >= 75);
  const classAverage = (
    studentsRoster.reduce((acc, curr) => acc + curr.avg, 0) / (totalStudents || 1)
  ).toFixed(1);

  const filteredStudents = studentsRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* 1. Teacher Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 text-white shadow-lg shadow-blue-600/15 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-16 w-16 rounded-2xl border-2 border-white/80 object-cover shadow-md"
            />
            <div>
              <span className="rounded-full bg-blue-500/40 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100">
                Dasbor Guru & Wali Kelas
              </span>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">
                {currentUser.name}
              </h2>
              <p className="text-xs text-blue-100 sm:text-sm">
                SMP Negeri 1 Wonosari • Tahun Ajaran 2024/2025
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span>Bagi Link ke WA</span>
            </button>
            <button
              onClick={onOpenCreateClass || (() => setActiveTab('kelas'))}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
            >
              <Building2 className="h-4 w-4" />
              <span>Tambah Kelas</span>
            </button>
            <button
              onClick={onOpenCreateLesson || (() => setActiveTab('materi'))}
              className="flex items-center gap-2 rounded-xl bg-blue-600/80 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600"
            >
              <BookOpen className="h-4 w-4" />
              <span>Tambah Materi</span>
            </button>
            <button
              onClick={onOpenCreateQuiz}
              className="flex items-center gap-2 rounded-xl bg-blue-600/80 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Buat Kuis Baru</span>
            </button>
            <button
              onClick={exportReportToCSV}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={openPrintRaportModal}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Raport</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Siswa */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Siswa Kelas 8B
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {totalStudents}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            32 Aktif Terdaftar
          </p>
        </div>

        {/* Rata-rata Kelas */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rata-rata Nilai
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {classAverage}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Standar KKM: 75.0
          </p>
        </div>

        {/* Ketuntasan */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Ketuntasan Belajar
            </span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {Math.round((passedStudents.length / totalStudents) * 100)}%
          </p>
          <p className="mt-1 text-xs font-medium text-teal-600 dark:text-teal-400">
            {passedStudents.length} dari {totalStudents} Siswa Tuntas
          </p>
        </div>

        {/* Butuh Perhatian */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Butuh Remedial
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
            {remedialStudents.length} Siswa
          </p>
          <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Nilai &lt; KKM 75
          </p>
        </div>
      </div>

      {/* 3. Analytics Charts & Remedial List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Grade Distribution Bar Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sebaran Distribusi Nilai Siswa (Kurikulum Merdeka)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frekuensi capaian kompetensi Kelas 8B Matematika & Keilmuan
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              KKM 75
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="mt-6 space-y-4">
            {/* Grade Range A (90-100) */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  Sangat Mahir (Nilai 90 - 100)
                </span>
                <span className="font-bold text-emerald-600">3 Siswa (25%)</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Grade Range B (80-89) */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  Mahir / Baik (Nilai 80 - 89)
                </span>
                <span className="font-bold text-blue-600">6 Siswa (50%)</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '50%' }} />
              </div>
            </div>

            {/* Grade Range C (75-79) */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  Cukup Tuntas (Nilai 75 - 79)
                </span>
                <span className="font-bold text-teal-600">1 Siswa (8.3%)</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-teal-500" style={{ width: '8.3%' }} />
              </div>
            </div>

            {/* Grade Range D (<75 Remedial) */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-600 font-bold dark:text-amber-400">
                  Perlu Bimbingan Remedial (Nilai &lt; 75)
                </span>
                <span className="font-bold text-amber-600">2 Siswa (16.7%)</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '16.7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Siswa Butuh Pendampingan Remedial */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Siswa Butuh Remedial
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target penguatan materi PLSV
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              {remedialStudents.length} Siswa
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {remedialStudents.map((std) => (
              <div
                key={std.id}
                className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {std.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    NISN: {privacyMaskEnabled ? '••••••••••' : std.nisn} • Hadir: {std.attendance}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-md bg-amber-600 px-2 py-0.5 text-xs font-bold text-white">
                    {std.avg}
                  </span>
                  <p className="mt-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                    Remedial Bab 3
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">
              Tindakan Rekomendasi Guru:
            </p>
            <p className="mt-1 text-[11px] leading-relaxed">
              Jadwalkan sesi bimbingan sebaya atau kirimkan latihan soal interaktif PLSV berbobot khusus sebelum evaluasi PTS.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Complete Student Roster Table with Live Search */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Buku Nilai & Kehadiran Siswa Kelas 8B
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoring progres harian terintegrasi real-time
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari siswa / NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3 font-semibold">No</th>
                <th className="py-2.5 px-3 font-semibold">Nama Siswa</th>
                <th className="py-2.5 px-3 font-semibold">NISN</th>
                <th className="py-2.5 px-3 font-semibold">Kehadiran</th>
                <th className="py-2.5 px-3 font-semibold text-right">Rata-rata Nilai</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((std, idx) => (
                <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-400 tabular-nums">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {std.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {privacyMaskEnabled ? '••••••••••' : std.nisn}
                  </td>
                  <td className="py-3 px-3 tabular-nums">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {std.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums dark:text-white">
                    {std.avg.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        std.avg >= 75
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {std.avg >= 75 ? 'Tuntas' : 'Remedial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
