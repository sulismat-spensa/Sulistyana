import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  ShieldCheck,
  Eye,
  EyeOff,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  RotateCw,
  CheckCircle2,
  Clock,
  Share2,
  LogOut,
  Database,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const {
    currentUser,
    switchRole,
    logout,
    usersList,
    switchAccount,
    darkMode,
    toggleDarkMode,
    isOnline,
    toggleSimulateOffline,
    offlineQueue,
    syncOfflineData,
    privacyMaskEnabled,
    togglePrivacyMask,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setIsShareModalOpen,
  } = useLMS();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-blue-100 bg-white/95 px-4 backdrop-blur-md transition-colors md:px-8 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Brand Zone */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex cursor-pointer items-center gap-3 select-none"
        >
          {/* Logo icon with graduation cap and book motif from screenshot */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
            <div className="absolute -bottom-1 h-1.5 w-6 rounded-full bg-white/70"></div>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 transition-colors md:text-2xl dark:text-blue-400">
              SMPN 1 Wonosari
            </h1>
            <p className="text-xs font-semibold tracking-wide text-sky-600 dark:text-sky-400">
              Digital Kelas Pintar
            </p>
          </div>
        </div>
      </div>

      {/* Middle & Right Controls Zone */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Offline / Online Status Indicator */}
        <button
          onClick={toggleSimulateOffline}
          title={isOnline ? 'Koneksi Online. Klik untuk simulasi mode offline.' : 'Mode Offline Aktif. Klik untuk kembali online.'}
          className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all sm:flex ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 animate-pulse hover:bg-amber-200 dark:bg-amber-950/80 dark:text-amber-300'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" />
              <span>Offline ({offlineQueue.length} antrean)</span>
            </>
          )}
        </button>

        {/* Sync Offline Queue button if pending */}
        {offlineQueue.length > 0 && isOnline && (
          <button
            onClick={syncOfflineData}
            title="Ada data offline yang siap disinkronkan"
            className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700 animate-bounce"
          >
            <RotateCw className="h-3 w-3 animate-spin" />
            <span>Sinkronkan ({offlineQueue.length})</span>
          </button>
        )}

        {/* Sensitive Data Privacy Mask */}
        <button
          onClick={togglePrivacyMask}
          title={privacyMaskEnabled ? 'Buka samaran data pribadi (NISN/NIK)' : 'Samarkan data pribadi untuk privasi'}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {privacyMaskEnabled ? (
            <EyeOff className="h-5 w-5 text-indigo-500" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">Pemberitahuan</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    {unreadCount} baru
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 space-y-2.5 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationAsRead(item.id);
                      if (item.tabLink) setActiveTab(item.tabLink);
                      setIsNotifOpen(false);
                    }}
                    className={`cursor-pointer rounded-xl p-3 text-left transition-all ${
                      item.isRead
                        ? 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                        : 'bg-blue-50/70 border-l-4 border-blue-500 hover:bg-blue-50 dark:bg-blue-950/40 dark:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message bubble icon with badge */}
        <button
          onClick={() => setActiveTab('pesan')}
          className="relative rounded-lg p-2 text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Pesan"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
            5
          </span>
        </button>

        {/* Profile Card & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 rounded-full p-1 pl-1.5 transition-colors hover:bg-blue-50 dark:hover:bg-slate-800"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full border-2 border-blue-500 object-cover shadow-sm"
              onError={(e) => {
                // Fallback styled avatar if needed
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden text-left md:block">
              <p className="text-sm font-bold text-slate-800 leading-tight dark:text-white">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{currentUser.className}</span>
                <span>•</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
                  {currentUser.role}
                </span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </button>

          {/* Profile & Account Switcher Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Active User Identity Info */}
              <div className="mb-2.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{currentUser.username || currentUser.id}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.nip ? `NIP: ${currentUser.nip}` : currentUser.nisn ? `NISN: ${currentUser.nisn}` : currentUser.className}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin_users');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 transition-all dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Basis Data Pengguna (Admin)</span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                    {usersList.length}
                  </span>
                </button>
              </div>

              {/* Quick Account Switcher */}
              <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Beralih Akun Cepat (Uji Coba):
                </p>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      switchRole('guru');
                      setIsProfileOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      currentUser.role === 'guru'
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span className="truncate">Sulistyana, S.Pd., M.Pd. (Guru)</span>
                    </div>
                    {currentUser.role === 'guru' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('siswa');
                      setIsProfileOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      currentUser.role === 'siswa'
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span className="truncate">Raka Pratama (Siswa 8B)</span>
                    </div>
                    {currentUser.role === 'siswa' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (currentUser.role !== 'admin') {
                        setActiveTab('admin_users');
                      } else {
                        switchRole('admin');
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 font-bold dark:bg-purple-950/60 dark:text-purple-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                      <span className="truncate">Admin IT & Kurikulum</span>
                    </div>
                    {currentUser.role === 'admin' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        <Lock className="h-3 w-3" />
                        <span>Sandi</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-2.5 border-t border-slate-100 pt-2 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Keluar Sesi / Ganti Pengguna</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
