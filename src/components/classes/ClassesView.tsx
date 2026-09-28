import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CreateClassModal } from './CreateClassModal';
import {
  Users,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  UserPlus,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, studentsRoster, currentUser, privacyMaskEnabled, addToastNotification } = useLMS();
  const [selectedClassId, setSelectedClassId] = useState('cls_8b');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit'>>({
    std_01: 'Hadir',
    std_02: 'Hadir',
    std_03: 'Hadir',
    std_04: 'Izin',
    std_05: 'Hadir',
    std_06: 'Hadir',
    std_07: 'Hadir',
    std_08: 'Hadir',
    std_09: 'Sakit',
    std_10: 'Hadir',
    std_11: 'Hadir',
    std_12: 'Hadir',
  });

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleToggleAttendance = (stdId: string) => {
    if (currentUser.role !== 'guru') {
      addToastNotification('Akses Terbatas', 'Hanya Guru yang dapat mengubah status presensi kehadiran.', 'system');
      return;
    }

    setAttendanceState((prev) => {
      const current = prev[stdId] || 'Hadir';
      const nextStatus = current === 'Hadir' ? 'Izin' : current === 'Izin' ? 'Sakit' : 'Hadir';
      return { ...prev, [stdId]: nextStatus };
    });
  };

  const filteredStudents = studentsRoster.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.nisn.includes(searchFilter)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manajemen Kelas & Roster Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pengelolaan rombel dan monitoring presensi SMPN 1 Wonosari
          </p>
        </div>

        <button
          onClick={() => setIsCreateClassModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Class Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-white'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black">{cls.name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {cls.studentCount} Siswa
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Wali: {cls.homeroomTeacher}
              </p>
            </button>
          );
        })}

        {/* Quick Add Class Card */}
        <button
          onClick={() => setIsCreateClassModalOpen(true)}
          className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-4 text-center transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/20 dark:hover:border-blue-700"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900 dark:text-blue-300">
            <PlusCircle className="h-5 w-5" />
          </div>
          <span className="mt-2 text-xs font-bold text-blue-700 dark:text-blue-400">
            + Tambah Kelas
          </span>
        </button>
      </div>

      {/* Selected Class Details Banner */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {activeClass.grade} • {activeClass.academicYear}
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {activeClass.name} — {activeClass.roomNumber}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Wali Kelas: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeClass.homeroomTeacher}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa di kelas..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Student Roster Grid / Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3 font-semibold">No</th>
                <th className="py-2.5 px-3 font-semibold">Nama Lengkap</th>
                <th className="py-2.5 px-3 font-semibold">NISN</th>
                <th className="py-2.5 px-3 font-semibold">L/P</th>
                <th className="py-2.5 px-3 font-semibold">Kehadiran</th>
                <th className="py-2.5 px-3 font-semibold text-center">Presensi Hari Ini</th>
                <th className="py-2.5 px-3 font-semibold text-right">Rata-rata Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((std, idx) => {
                const todayStatus = attendanceState[std.id] || 'Hadir';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {std.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{std.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {privacyMaskEnabled ? '••••••••••' : std.nisn}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {std.gender}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                      {std.attendance}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleAttendance(std.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                          todayStatus === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : todayStatus === 'Izin'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        }`}
                        title={currentUser.role === 'guru' ? 'Klik untuk mengganti status presensi' : 'Hanya guru yang dapat mengubah'}
                      >
                        {todayStatus} {currentUser.role === 'guru' && '⇄'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums dark:text-white">
                      {std.avg.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Kelas Baru */}
      <CreateClassModal
        isOpen={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
        onClassCreated={(newId) => setSelectedClassId(newId)}
      />
    </div>
  );
};
