import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck2,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Sparkles,
  Database,
  FileSpreadsheet,
  MessageCircle,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    completedQuizzesCount,
    pendingAssignmentsCount,
    currentUser,
    switchRole,
    logout,
    addToastNotification,
  } = useLMS();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'kelas',
      label: 'Kelas Saya',
      icon: Users,
    },
    {
      id: 'materi',
      label: 'Mata Pelajaran',
      icon: BookOpen,
    },
    {
      id: 'kuis',
      label: 'Kuis Online',
      icon: FileCheck2,
      badge: completedQuizzesCount > 0 ? `${completedQuizzesCount} Aktif` : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'tugas',
      label: 'Tugas',
      icon: ClipboardList,
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} Tertunda` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'nilai',
      label: 'Nilai & Raport',
      icon: GraduationCap,
    },
    {
      id: 'jadwal',
      label: 'Jadwal',
      icon: CalendarDays,
    },
    {
      id: 'pesan',
      label: 'Pesan',
      icon: MessageSquare,
      badge: '5',
      badgeColor: 'bg-blue-500 text-white',
    },
    ...(currentUser.role === 'admin'
      ? [
          {
            id: 'admin_users',
            label: 'Basis Data Pengguna',
            icon: Database,
            badge: 'Admin',
            badgeColor: 'bg-purple-600 text-white',
          },
          {
            id: 'admin_import',
            label: 'Impor Pengguna (Excel)',
            icon: FileSpreadsheet,
            badge: 'Excel',
            badgeColor: 'bg-emerald-600 text-white',
          },
          {
            id: 'admin_wa',
            label: 'Tautan WhatsApp (WA)',
            icon: MessageCircle,
            badge: 'WA',
            badgeColor: 'bg-emerald-600 text-white',
          },
        ]
      : [
          {
            id: 'admin_users',
            label: 'Basis Data Pengguna',
            icon: Database,
            badge: undefined,
            badgeColor: 'bg-purple-600 text-white',
          },
        ]),
    {
      id: 'bantuan',
      label: 'Bantuan',
      icon: HelpCircle,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-40 w-64 md:w-72 flex-col justify-between border-r border-blue-100 bg-[#eef5ff] p-5 transition-transform duration-300 md:static md:flex md:translate-x-0 dark:border-slate-800 dark:bg-slate-900/90 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Section Category */}
          <div className="mb-4 px-3">
            <span className="text-xs font-bold tracking-wider text-blue-400 uppercase dark:text-blue-500">
              MENU
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Menu navigasi utama">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-700 hover:bg-blue-100/70 hover:text-blue-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-200/60 pt-4 dark:border-slate-800">
          {/* Quick role indicator hint */}
          <div className="mb-3 rounded-xl bg-white/70 p-3 shadow-xs dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Peran Aktif</span>
              <button
                onClick={() => switchRole(currentUser.role === 'siswa' ? 'guru' : 'siswa')}
                className="font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Ganti ➔
              </button>
            </div>
            <p className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-white">
              {currentUser.name}
            </p>
          </div>

          {/* Logout / Switch */}
          <button
            onClick={() => {
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
