import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { Printer, Download, X, GraduationCap } from 'lucide-react';

interface PrintRaportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintRaportModal: React.FC<PrintRaportModalProps> = ({ isOpen, onClose }) => {
  const { studentReport, currentUser, privacyMaskEnabled, exportReportToCSV } = useLMS();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-2 sm:p-6 backdrop-blur-sm">
      <div className="relative flex h-full max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header Toolbar (no-print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              Pratinjau Raport Hasil Belajar Siswa (Format Resmi PDF)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportReportToCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh Spreadsheet (.CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Raport / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-slate-900 bg-white" id="print-raport-container">
          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              PEMERINTAH KABUPATEN GUNUNGKIDUL
            </h4>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              DINAS PENDIDIKAN
            </h3>
            <h2 className="text-lg font-black uppercase text-blue-900 sm:text-xl">
              SMP NEGERI 1 WONOSARI
            </h2>
            <p className="text-[11px] text-slate-600">
              Jl. Brigjen Katamso No. 4, Purbosari, Wonosari, Gunungkidul, D.I. Yogyakarta 55812
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Website: smpn1wonosari.sch.id • Email: info@smpn1wonosari.sch.id • NPSN: 20402107
            </p>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-sm font-black underline uppercase tracking-wide">
              LAPORAN CAPAIAN HASIL BELAJAR PESERTA DIDIK
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              Tahun Ajaran 2024/2025 - Semester Genap (Kurikulum Merdeka)
            </p>
          </div>

          {/* Student Biodata Box */}
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-slate-300 p-4 text-xs">
            <div className="space-y-1">
              <p>
                <span className="font-semibold inline-block w-28">Nama Peserta Didik</span>: {currentUser.name}
              </p>
              <p>
                <span className="font-semibold inline-block w-28">Nomor Induk / NISN</span>: {privacyMaskEnabled ? '••••••••••' : currentUser.nisn || '0098712345'}
              </p>
              <p>
                <span className="font-semibold inline-block w-28">Kelas / Rombel</span>: {currentUser.className || 'Kelas 8B'}
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-semibold inline-block w-28">Nama Sekolah</span>: SMPN 1 Wonosari
              </p>
              <p>
                <span className="font-semibold inline-block w-28">Wali Kelas</span>: Sulistyana, S.Pd., M.Pd.
              </p>
              <p>
                <span className="font-semibold inline-block w-28">Peringkat Kelas</span>: Ke-5 dari 32 Siswa
              </p>
            </div>
          </div>

          {/* Grades Table */}
          <div className="mt-6">
            <table className="w-full border-collapse border border-slate-400 text-xs">
              <thead>
                <tr className="bg-slate-100 text-center font-bold">
                  <th className="border border-slate-400 p-2 w-10">No</th>
                  <th className="border border-slate-400 p-2 text-left">Mata Pelajaran</th>
                  <th className="border border-slate-400 p-2 w-14">Tugas</th>
                  <th className="border border-slate-400 p-2 w-14">Kuis</th>
                  <th className="border border-slate-400 p-2 w-14">PTS</th>
                  <th className="border border-slate-400 p-2 w-14">PAS</th>
                  <th className="border border-slate-400 p-2 w-16">Nilai Akhir</th>
                  <th className="border border-slate-400 p-2 w-16">Predikat</th>
                  <th className="border border-slate-400 p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {studentReport.subjectGrades.map((sg, idx) => (
                  <tr key={sg.subjectId} className="text-center">
                    <td className="border border-slate-400 p-2">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 text-left font-bold">{sg.subjectName}</td>
                    <td className="border border-slate-400 p-2 tabular-nums">{sg.tugas}</td>
                    <td className="border border-slate-400 p-2 tabular-nums">{sg.kuis}</td>
                    <td className="border border-slate-400 p-2 tabular-nums">{sg.pts}</td>
                    <td className="border border-slate-400 p-2 tabular-nums">{sg.pas}</td>
                    <td className="border border-slate-400 p-2 font-black tabular-nums bg-slate-50">{sg.finalScore}</td>
                    <td className="border border-slate-400 p-2 font-bold">{sg.letterGrade}</td>
                    <td className="border border-slate-400 p-2 text-emerald-800 font-semibold">{sg.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance & Character */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-300 p-3">
              <p className="font-bold border-b border-slate-200 pb-1 mb-1">Ketidakhadiran</p>
              <p>Sakit: 1 Hari</p>
              <p>Izin: 1 Hari</p>
              <p>Tanpa Keterangan: 0 Hari</p>
              <p className="font-semibold text-emerald-700 mt-1">Persentase Kehadiran: 98%</p>
            </div>
            <div className="rounded-xl border border-slate-300 p-3">
              <p className="font-bold border-b border-slate-200 pb-1 mb-1">Catatan Perkembangan Wali Kelas</p>
              <p className="italic text-slate-700">
                "Ananda Raka menunjukkan antusiasme yang tinggi dalam mata pelajaran Matematika dan Bahasa. Terus pertahankan kedisiplinan belajar mandiri."
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p>Mengetahui,</p>
              <p>Orang Tua / Wali Siswa,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">( ............................................ )</p>
            </div>
            <div>
              <p>Wonosari, {today}</p>
              <p>Wali Kelas 8B,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Sulistyana, S.Pd., M.Pd.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP. 19740512 199903 2 004</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
