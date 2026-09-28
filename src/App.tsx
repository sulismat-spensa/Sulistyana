import React, { useState } from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { SubjectsView } from './components/subjects/SubjectsView';
import { ClassesView } from './components/classes/ClassesView';
import { QuizListView } from './components/quiz/QuizListView';
import { AssignmentsView } from './components/assignments/AssignmentsView';
import { GradesRaportView } from './components/grades/GradesRaportView';
import { CalendarView } from './components/calendar/CalendarView';
import { MessagesView } from './components/messages/MessagesView';
import { SettingsView } from './components/settings/SettingsView';
import { QuizCBTModal } from './components/quiz/QuizCBTModal';
import { CreateQuizModal } from './components/quiz/CreateQuizModal';
import { CreateClassModal } from './components/classes/CreateClassModal';
import { CreateLessonModal } from './components/subjects/CreateLessonModal';
import { PrintRaportModal } from './components/grades/PrintRaportModal';
import { ShareWhatsAppModal } from './components/common/ShareWhatsAppModal';
import { ToastNotification } from './components/common/ToastNotification';
import { LoginView } from './components/auth/LoginView';
import { AdminUsersView } from './components/admin/AdminUsersView';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck2,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    isAuthenticated,
    isPrintModalOpen,
    setIsPrintModalOpen,
    completedQuizzesCount,
    pendingAssignmentsCount,
  } = useLMS();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);

  // If user is not logged in, render the secure Login portal
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastNotification />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'admin') {
          return <AdminUsersView />;
        }
        return currentUser.role === 'guru' ? (
          <TeacherDashboard
            onOpenCreateQuiz={() => setIsCreateQuizOpen(true)}
            onOpenCreateClass={() => setIsCreateClassOpen(true)}
            onOpenCreateLesson={() => setIsCreateLessonOpen(true)}
          />
        ) : (
          <StudentDashboard />
        );
      case 'admin_users':
        return <AdminUsersView initialTab="users" />;
      case 'admin_import':
        return <AdminUsersView initialTab="import" />;
      case 'admin_wa':
        return <AdminUsersView initialTab="wa" />;
      case 'kelas':
        return <ClassesView />;
      case 'materi':
        return <SubjectsView />;
      case 'kuis':
        return <QuizListView onOpenCreateQuiz={() => setIsCreateQuizOpen(true)} />;
      case 'tugas':
        return <AssignmentsView />;
      case 'nilai':
        return <GradesRaportView />;
      case 'jadwal':
        return <CalendarView />;
      case 'pesan':
        return <MessagesView />;
      case 'pengaturan':
        return <SettingsView />;
      case 'bantuan':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Pusat Bantuan & Petunjuk Penggunaan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Panduan praktis LMS SMPN 1 Wonosari Digital Kelas Pintar
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Panduan untuk Siswa
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Mulai kuis melalui menu <strong>Kuis Online</strong> atau tombol di Beranda.</li>
                  <li>Periksa waktu countdown ujian agar jawaban terkirim sebelum tenggat.</li>
                  <li>Tandai materi yang telah selesai dipelajari di menu <strong>Mata Pelajaran</strong> untuk menaikkan progres.</li>
                  <li>Unggah tugas mandiri di menu <strong>Tugas</strong> sebelum batas waktu berakhir.</li>
                  <li>Cetak atau unduh raport resmi dari menu <strong>Nilai & Raport</strong>.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Panduan untuk Guru
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Beralih ke akun Guru melalui tombol profil di kanan atas.</li>
                  <li>Gunakan <strong>Buat Kuis Baru</strong> untuk mempublikasikan soal ujian daring.</li>
                  <li>Pantau sebaran nilai kelas dan siswa yang memerlukan remedial KKM di Dasbor Analitik.</li>
                  <li>Kelola presensi kehadiran siswa harian di menu <strong>Kelas Saya</strong>.</li>
                  <li>Ekspor transkrip nilai langsung ke format file Excel (.CSV) atau PDF Raport.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navbar */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Nav Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 md:hidden dark:border-slate-800 dark:bg-slate-900/95"
        aria-label="Navigasi cepat ponsel"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('materi')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${
            activeTab === 'materi' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span>Materi</span>
        </button>

        <button
          onClick={() => setActiveTab('kuis')}
          className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${
            activeTab === 'kuis' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <FileCheck2 className="h-5 w-5" />
          <span>Kuis</span>
          {completedQuizzesCount > 0 && (
            <span className="absolute top-0 right-3 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white">
              {completedQuizzesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tugas')}
          className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${
            activeTab === 'tugas' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <ClipboardList className="h-5 w-5" />
          <span>Tugas</span>
          {pendingAssignmentsCount > 0 && (
            <span className="absolute top-0 right-3 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">
              {pendingAssignmentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('nilai')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${
            activeTab === 'nilai' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="h-5 w-5" />
          <span>Raport</span>
        </button>
      </nav>

      {/* Global Modals */}
      <QuizCBTModal />
      <CreateQuizModal isOpen={isCreateQuizOpen} onClose={() => setIsCreateQuizOpen(false)} />
      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
        onClassCreated={() => setActiveTab('kelas')}
      />
      <CreateLessonModal
        isOpen={isCreateLessonOpen}
        onClose={() => setIsCreateLessonOpen(false)}
        onLessonCreated={() => setActiveTab('materi')}
      />
      <PrintRaportModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      <ShareWhatsAppModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <AppContent />
    </LMSProvider>
  );
}
