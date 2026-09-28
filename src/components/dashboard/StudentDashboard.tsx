import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { StudentGradeTrendChart } from './StudentGradeTrendChart';
import {
  Building2,
  FileCheck2,
  ListTodo,
  Trophy,
  ArrowUpRight,
  Clock,
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Share2,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    subjects,
    quizzes,
    assignments,
    averageGrade,
    completedQuizzesCount,
    pendingAssignmentsCount,
    startQuizSession,
    setActiveTab,
    setActiveSubjectId,
    setIsShareModalOpen,
  } = useLMS();

  // Find the active math quiz matching screenshot
  const activeQuiz = quizzes.find((q) => !q.isCompleted) || quizzes[0];

  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome Banner (Rich Blue Gradient with Student Mascot) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-500/15 sm:p-8">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Selamat Datang Kembali, {currentUser.name.split(' ')[0]}! 👋
          </h2>
          <p className="mt-2 text-sm text-blue-100 sm:text-base leading-relaxed">
            Siap belajar hari ini? Kamu memiliki {completedQuizzesCount} kuis aktif dan {pendingAssignmentsCount} tugas yang perlu dikerjakan.
          </p>
        </div>

        {/* Mascot Illustration on the right */}
        <div className="pointer-events-none absolute -bottom-4 right-4 sm:right-10 flex items-end">
          <div className="relative h-44 w-44 sm:h-52 sm:w-52">
            <img
              src="/src/assets/images/smp_student_mascot_1790464615803.jpg"
              alt="Ilustrasi Siswa SMPN 1 Wonosari"
              className="h-full w-full object-contain drop-shadow-2xl"
              onError={(e) => {
                // Graceful fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 h-40 w-40 rounded-full bg-sky-400/20 blur-xl pointer-events-none" />
      </div>

      {/* 2. 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1: Total Kelas */}
        <div
          onClick={() => setActiveTab('kelas')}
          className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Kelas
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
              {classes.length}
            </p>
            <p className="mt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +1 kelas baru
            </p>
          </div>
        </div>

        {/* Card 2: Kuis Aktif */}
        <div
          onClick={() => setActiveTab('kuis')}
          className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kuis Aktif
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
              {completedQuizzesCount}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              Harus Selesai Hari Ini
            </p>
          </div>
        </div>

        {/* Card 3: Tugas Tertunda */}
        <div
          onClick={() => setActiveTab('tugas')}
          className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <ListTodo className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tugas Tertunda
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
              {pendingAssignmentsCount}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              Deadline Minggu Ini
            </p>
          </div>
        </div>

        {/* Card 4: Rata-rata Nilai */}
        <div
          onClick={() => setActiveTab('nilai')}
          className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rata-rata Nilai
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tabular-nums dark:text-white">
              {averageGrade.toFixed(1)}
            </p>
            <p className="mt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +2.5 dari bulan lalu
            </p>
          </div>
        </div>
      </div>

      {/* 2.5 Recharts Visualisasi Grafik Perkembangan Nilai Siswa */}
      <StudentGradeTrendChart />

      {/* 3. Main Split Section: Left Column (Mata Pelajaran) & Right Column (Kuis & Tugas) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Mata Pelajaran (approx 7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mata Pelajaran
            </h3>
            <button
              onClick={() => setActiveTab('materi')}
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Lihat Semua Modul ➔
            </button>
          </div>

          {/* Subject Card 1: Matematika */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Matematika
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Progress: 75% • 12/16 Materi
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>

                {/* Topics / Bab Pill */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveSubjectId('sbj_math');
                      setActiveTab('materi');
                    }}
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Bab 3: Persamaan Linear
                  </button>
                  <button
                    onClick={() => {
                      setActiveSubjectId('sbj_math');
                      setActiveTab('materi');
                    }}
                    className="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Bab 4: Teorema Pythagoras
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Card 2: IPA */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    IPA
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Progress: 60% • 9/15 Materi
                  </span>
                </div>

                {/* Multi-segment styled progress bar matching screenshot */}
                <div className="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: '35%' }} />
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: '25%' }} />
                </div>

                {/* Topics / Bab Pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveSubjectId('sbj_ipa');
                      setActiveTab('materi');
                    }}
                    className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    Bab 4: Fotosintesis
                  </button>
                  <button
                    onClick={() => {
                      setActiveSubjectId('sbj_indo');
                      setActiveTab('materi');
                    }}
                    className="rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    Bab 5: Teks Eksplanasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Kuis Online Aktif & Tugas Mendatang (approx 5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Section: Kuis Online Aktif */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Kuis Online Aktif
              </h3>
              <button
                onClick={() => setActiveTab('kuis')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Kuis Active Card */}
            <div className="mt-3.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {activeQuiz?.title || 'Kuis: Bab 3 Matematika'}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Topik: {activeQuiz?.topic || 'Persamaan Linear Satu Variabel'}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
                <span>{activeQuiz?.deadlineFormatted || 'Berakhir hari ini pukul 16:00 WIB'}</span>
              </div>

              <button
                onClick={() => {
                  if (activeQuiz) {
                    startQuizSession(activeQuiz.id);
                  }
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
              >
                <span>Mulai Kuis Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Section: Tugas Mendatang */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tugas Mendatang
              </h3>
              <button
                onClick={() => setActiveTab('tugas')}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Lihat Semua ➔
              </button>
            </div>

            {/* List of 3 tasks matching screenshot */}
            <div className="mt-3.5 space-y-2.5">
              {/* Task 1: Matematika (88) */}
              <div
                onClick={() => setActiveTab('tugas')}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white tabular-nums">
                    88
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Matematika
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-xs">
                      Laporan Percobaan Fotosintesis
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Nilai: Baik
                </span>
              </div>

              {/* Task 2: IPA (82) */}
              <div
                onClick={() => setActiveTab('tugas')}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-black text-white tabular-nums">
                    82
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      IPA
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-xs">
                      IPA – Praktikum Pengamatan Sel
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Nilai: Baik
                </span>
              </div>

              {/* Task 3: Bahasa Indonesia (90) */}
              <div
                onClick={() => setActiveTab('tugas')}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-sm font-black text-white tabular-nums">
                    90
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Bahasa Indonesia
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-xs">
                      Tugas Teks Eksplanasi
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Nilai: Sangat Baik
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching screenshot */}
      <footer className="pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          © 2024 SMPN 1 Wonosari • Digital Kelas Pintar • Versi 2.1.0 • Bantuan & Dukungan
        </p>
      </footer>
    </div>
  );
};
