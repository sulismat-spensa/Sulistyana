import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Trophy,
  Award,
  Calendar,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const GradesRaportView: React.FC = () => {
  const {
    studentReport,
    currentUser,
    averageGrade,
    exportReportToCSV,
    openPrintRaportModal,
    privacyMaskEnabled,
  } = useLMS();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nilai & Raport Hasil Belajar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transkrip capaian kompetensi semester genap SMPN 1 Wonosari
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportReportToCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Ekspor Excel (.CSV)</span>
          </button>
          <button
            onClick={openPrintRaportModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Raport Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rata-rata Nilai
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {averageGrade.toFixed(1)}
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Predikat B (Sangat Baik)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Peringkat di Kelas
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            Ke-5 <span className="text-base text-slate-400 font-normal">/ 32</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            15% Terbaik di Kelas 8B
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kehadiran Kumulatif
            </span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
            {studentReport.attendancePercent}%
          </p>
          <p className="mt-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            Disiplin Sangat Tinggi
          </p>
        </div>
      </div>

      {/* Grades Table Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Nilai Semua Mata Pelajaran
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kriteria Ketuntasan Minimal (KKM): 75.0
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Semua Mapel Tuntas</span>
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3 font-semibold">No</th>
                <th className="py-2.5 px-3 font-semibold">Mata Pelajaran</th>
                <th className="py-2.5 px-3 font-semibold text-center">Tugas</th>
                <th className="py-2.5 px-3 font-semibold text-center">Kuis</th>
                <th className="py-2.5 px-3 font-semibold text-center">PTS</th>
                <th className="py-2.5 px-3 font-semibold text-center">PAS</th>
                <th className="py-2.5 px-3 font-semibold text-right">Nilai Akhir</th>
                <th className="py-2.5 px-3 font-semibold text-center">Predikat</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentReport.subjectGrades.map((sg, idx) => (
                <tr key={sg.subjectId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-400 tabular-nums">{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {sg.subjectName}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {sg.tugas}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {sg.kuis}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {sg.pts}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums text-slate-700 dark:text-slate-300">
                    {sg.pas}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums dark:text-white">
                    {sg.finalScore}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {sg.letterGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {sg.status}
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
