import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { X, Building2, UserCheck, Users, School, Sparkles } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassCreated?: (classId: string) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onClassCreated,
}) => {
  const { addClass, currentUser } = useLMS();

  const [className, setClassName] = useState('');
  const [grade, setGrade] = useState('Kelas 8');
  const [homeroomTeacher, setHomeroomTeacher] = useState(
    currentUser.role === 'guru' ? currentUser.name : 'Sulistyana, S.Pd., M.Pd.'
  );
  const [roomNumber, setRoomNumber] = useState('Gedung B - Ruang 207');
  const [studentCount, setStudentCount] = useState<number>(32);
  const [academicYear, setAcademicYear] = useState('2024/2025 Genap');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !homeroomTeacher.trim()) return;

    const created = addClass({
      name: className.trim(),
      grade,
      homeroomTeacher: homeroomTeacher.trim(),
      roomNumber: roomNumber.trim(),
      studentCount: Number(studentCount) || 30,
      academicYear,
    });

    if (onClassCreated) {
      onClassCreated(created.id);
    }

    onClose();
    // Reset form
    setClassName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Rombel / Kelas Baru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pendaftaran rombongan belajar SMPN 1 Wonosari
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Kelas / Rombel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Contoh: Kelas 8E"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Jenjang / Tingkat
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Kelas 7">Kelas 7 (Fase D)</option>
                <option value="Kelas 8">Kelas 8 (Fase D)</option>
                <option value="Kelas 9">Kelas 9 (Fase D)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Guru Wali Kelas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={homeroomTeacher}
              onChange={(e) => setHomeroomTeacher(e.target.value)}
              placeholder="Nama dan gelar guru wali kelas"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Ruang Belajar
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Contoh: Gedung B - Ruang 207"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kapasitas Siswa
              </label>
              <input
                type="number"
                min="10"
                max="45"
                required
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tahun Ajaran
            </label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="Contoh: 2024/2025 Genap"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Teacher guidance notice */}
          <div className="rounded-2xl bg-blue-50/70 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <p className="font-bold flex items-center gap-1.5">
              <School className="h-4 w-4" />
              <span>Integrasi Sistem Rombel Dapodik & Kurikulum Merdeka</span>
            </p>
            <p className="mt-1 text-[11px] leading-relaxed">
              Kelas baru akan otomatis terhubung dengan modul mata pelajaran aktif, daftar hadir presensi, dan buku nilai evaluasi akademik.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              Simpan & Tambah Kelas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
