import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  School,
  Database,
  Search,
  MessageCircle,
} from 'lucide-react';
import { UserRole, User } from '../../types/lms';

export const LoginView: React.FC = () => {
  const { login, usersList, addToastNotification } = useLMS();

  // Check URL query parameters for role when opened from WhatsApp link or shared URL
  const getInitialRole = (): UserRole => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role')?.toLowerCase();
      if (roleParam === 'siswa' || roleParam === 'student') return 'siswa';
      if (roleParam === 'guru' || roleParam === 'teacher') return 'guru';
      if (roleParam === 'admin') return 'admin';
    }
    return 'siswa';
  };

  const isFromWhatsApp = typeof window !== 'undefined' && (
    window.location.search.includes('ref=wa') ||
    window.location.search.includes('whatsapp') ||
    window.location.search.includes('role=')
  );

  const [selectedRole, setSelectedRole] = useState<UserRole>(getInitialRole);
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCredentialDrawerOpen, setIsCredentialDrawerOpen] = useState(false);
  const [credentialSearch, setCredentialSearch] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const fillDemoAccount = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'guru') {
      setIdentifier('sulistyana');
      setPassword('guru123');
    } else if (role === 'siswa') {
      setIdentifier('0098712345');
      setPassword('siswa123');
    } else {
      setIdentifier('Admin');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    }, 350);
  };

  const handleQuickLogin = (user: User) => {
    setIdentifier(user.username || user.nisn || user.nip || user.id);
    setPassword(user.password || (user.role === 'guru' ? 'guru123' : user.role === 'admin' ? 'admin123' : 'siswa123'));
    setSelectedRole(user.role);
    setErrorMessage(null);

    // Auto submit
    setIsLoading(true);
    setTimeout(() => {
      login(user.username || user.nisn || user.nip || user.id, user.password || (user.role === 'guru' ? 'guru123' : user.role === 'admin' ? 'admin123' : 'siswa123'));
      setIsLoading(false);
      setIsCredentialDrawerOpen(false);
    }, 250);
  };

  const filteredCredentials = usersList.filter((u) => {
    const q = credentialSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.nip && u.nip.includes(q)) ||
      (u.nisn && u.nisn.includes(q)) ||
      u.className.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-900 to-indigo-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100">
      {/* Top School Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg shadow-black/20">
            <GraduationCap className="h-6 w-6 text-sky-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              SMPN 1 Wonosari
            </h1>
            <p className="text-xs text-sky-200">
              LMS Digital Kelas Pintar • Gunungkidul, D.I. Yogyakarta
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCredentialDrawerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <Database className="h-4 w-4 text-sky-300" />
          <span className="hidden sm:inline">Daftar Akun Database Admin</span>
          <span className="sm:hidden">Daftar Akun</span>
        </button>
      </header>

      {/* Main Login Card Center */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="relative rounded-3xl border border-white/15 bg-white/95 p-6 sm:p-8 text-slate-800 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:text-white">
          {/* Subtle Glow */}
          <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Masuk ke Kelas Pintar
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Gunakan ID Pengguna / NIP / NISN dan Kata Sandi yang diberikan sekolah
            </p>
          </div>

          {/* Role Tabs */}
          <div className="mt-6 flex rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 dark:border-slate-800 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => handleRoleChange('guru')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                selectedRole === 'guru'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>👩‍🏫 Guru</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('siswa')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                selectedRole === 'siswa'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>👨‍🎓 Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>🛡️ Admin</span>
            </button>
          </div>

          {/* WhatsApp Link Notice */}
          {isFromWhatsApp && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50/95 p-3.5 text-xs text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-xs">
              <MessageCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-900 dark:text-white">
                  Tautan WhatsApp Terbuka
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                  Silakan masuk dengan <strong>ID Pengguna / NISN / NIP</strong> dan <strong>Kata Sandi</strong> yang telah dibuat/didaftarkan oleh Administrator Sekolah.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* ID or Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedRole === 'guru'
                  ? 'ID Pengguna / NIP / Username Guru'
                  : selectedRole === 'siswa'
                  ? 'NISN / ID Pengguna Siswa'
                  : 'Username / ID Administrator'}
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'guru'
                      ? 'Contoh: sulistyana atau 19740512...'
                      : selectedRole === 'siswa'
                      ? 'Contoh: 0098712345 atau raka'
                      : 'ID: Admin (atau ID admin khusus)'
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setIsCredentialDrawerOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'Masukkan kata sandi admin (hanya admin yang tahu)'
                      : 'Masukkan kata sandi akun'
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3 w-3" /> Enkripsi Aktif
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:from-blue-700 hover:to-sky-700 hover:shadow-xl hover:shadow-blue-600/40 active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <span>Memverifikasi kredensial...</span>
              ) : (
                <>
                  <span>Masuk Aplikasi</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Buttons for Testing */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              <span className="font-semibold">Pilih Cepat Akun Contoh (1-Klik):</span>
              <button
                type="button"
                onClick={() => setIsCredentialDrawerOpen(true)}
                className="font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Lihat Semua ({usersList.length}) ➔
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  const teacher = usersList.find((u) => u.id === 'usr_teacher_01');
                  if (teacher) handleQuickLogin(teacher);
                }}
                className="flex flex-col items-start rounded-xl border border-blue-100 bg-blue-50/60 p-2 text-left hover:bg-blue-100/80 transition-all dark:border-blue-900/40 dark:bg-slate-800"
              >
                <span className="font-bold text-blue-900 dark:text-blue-300 truncate w-full">
                  Bu Sulistyana, M.Pd
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Guru Matematika • guru123
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const student = usersList.find((u) => u.id === 'usr_student_01');
                  if (student) handleQuickLogin(student);
                }}
                className="flex flex-col items-start rounded-xl border border-emerald-100 bg-emerald-50/60 p-2 text-left hover:bg-emerald-100/80 transition-all dark:border-emerald-900/40 dark:bg-slate-800"
              >
                <span className="font-bold text-emerald-900 dark:text-emerald-300 truncate w-full">
                  Raka Pratama
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Siswa Kelas 8B • siswa123
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center text-xs text-sky-200/80 py-3">
        <p>© 2024–2025 SMPN 1 Wonosari • Sistem Basis Data Manajemen Pengguna LMS • Layanan Bantuan IT TU</p>
      </footer>

      {/* Full Modal Drawer: Database Credentials Catalog */}
      {isCredentialDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Katalog Akun & Kredensial Database Sekolah
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daftar nama guru dan siswa yang telah disediakan admin di database
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCredentialDrawerOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Search filter */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={credentialSearch}
                  onChange={(e) => setCredentialSearch(e.target.value)}
                  placeholder="Cari nama guru, siswa, kelas, NIP, atau NISN..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Credentials List */}
            <div className="overflow-y-auto p-4 space-y-2.5 flex-1 max-h-[55vh]">
              {filteredCredentials.map((u) => {
                const pass =
                  u.password ||
                  (u.role === 'guru' ? 'guru123' : u.role === 'admin' ? 'admin123' : 'siswa123');

                return (
                  <div
                    key={u.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-800/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                              u.role === 'guru'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                                : u.role === 'admin'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {u.className} • {u.nip ? `NIP: ${u.nip}` : u.nisn ? `NISN: ${u.nisn}` : u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                      <div className="text-right text-[11px]">
                        <p className="text-slate-500">
                          ID: <span className="font-mono font-bold text-slate-800 dark:text-white">{u.username || u.nisn || u.nip}</span>
                        </p>
                        <p className="text-slate-500">
                          Sandi:{' '}
                          {u.role === 'admin' ? (
                            <span className="font-mono italic text-purple-600 dark:text-purple-400 font-semibold text-[10px]">
                              🔒 Rahasia Admin (Hanya Admin yang tahu)
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{pass}</span>
                          )}
                        </p>
                      </div>

                      {u.role === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole('admin');
                            setIdentifier(u.username || 'Admin');
                            setPassword('');
                            setIsCredentialDrawerOpen(false);
                          }}
                          className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all active:scale-95"
                        >
                          Masuk sebagai Admin ➔
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickLogin(u)}
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all active:scale-95"
                        >
                          Gunakan Akun ➔
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Total {usersList.length} Akun Tersedia di Database
              </span>
              <button
                type="button"
                onClick={() => setIsCredentialDrawerOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
