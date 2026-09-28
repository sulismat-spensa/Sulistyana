import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  BookOpen,
  Eye,
  EyeOff,
  Filter,
  Check,
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  FileDown,
  ArrowRight,
  ShieldAlert,
  Lock,
  User as UserIcon,
  RefreshCw,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  FolderSync,
  MessageCircle,
  Send,
  Copy,
  Link,
  ExternalLink,
} from 'lucide-react';
import { User, UserRole } from '../../types/lms';

interface AdminUsersViewProps {
  initialTab?: 'users' | 'import' | 'cleaning' | 'admins' | 'wa';
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ initialTab = 'users' }) => {
  const {
    usersList,
    currentUser,
    addUserAccount,
    importUserAccounts,
    updateUserAccount,
    deleteUserAccount,
    deleteMultipleUsers,
    deleteAllUsers,
    resetUserPassword,
    toggleUserStatus,
    refreshSingleUser,
    refreshAllUsers,
    resetUsersDatabase,
    classes,
    addToastNotification,
    login,
    setActiveTab,
    setIsShareModalOpen,
  } = useLMS();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'import' | 'cleaning' | 'admins' | 'wa'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveAdminSubTab(initialTab);
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'guru' | 'siswa' | 'admin'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Selection states for batch actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDataCleaningModalOpen, setIsDataCleaningModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'siswa' as UserRole,
    password: '',
    className: 'Kelas VIII B',
    classId: 'cls_8b',
    nip: '',
    nisn: '',
    email: '',
    phone: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
  });

  const [newPasswordInput, setNewPasswordInput] = useState('smpn1wonosari');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Excel Import States
  const [importPreviewData, setImportPreviewData] = useState<Array<Omit<User, 'id'>>>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Auth Verification Prompt State for non-admins
  const [adminAuthInput, setAdminAuthInput] = useState({ id: 'Admin', password: '' });
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Permission Check: Only admin can access and modify user database
  const isAdmin = currentUser.role === 'admin';

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    setIsVerifyingAdmin(true);

    setTimeout(() => {
      const res = login(adminAuthInput.id, adminAuthInput.password);
      setIsVerifyingAdmin(false);
      if (!res.success) {
        setAdminAuthError(res.message || 'ID atau Kata Sandi Admin tidak sesuai.');
      } else {
        setAdminAuthInput({ id: 'Admin', password: '' });
      }
    }, 300);
  };

  // If not admin, display the dedicated authentication shield
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow-xl text-center dark:border-amber-900/60 dark:bg-slate-900">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 mb-4 shadow-md">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Akses Terbatas: Khusus Administrator
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Anda saat ini terhubung sebagai <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()}).
            Hanya Administrator (ID: <strong>Admin</strong>) yang berwenang menambah, mengimpor, menghapus, atau merefresh data pengguna.
          </p>

          {adminAuthError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              {adminAuthError}
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="mt-6 text-left space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ID Administrator
              </label>
              <input
                type="text"
                required
                value={adminAuthInput.id}
                onChange={(e) => setAdminAuthInput({ ...adminAuthInput, id: e.target.value })}
                placeholder="Admin"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kata Sandi Administrator
              </label>
              <input
                type="password"
                required
                value={adminAuthInput.password}
                onChange={(e) => setAdminAuthInput({ ...adminAuthInput, password: e.target.value })}
                placeholder="Masukkan kata sandi admin"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isVerifyingAdmin}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isVerifyingAdmin ? 'Memverifikasi...' : 'Verifikasi & Buka Akses Admin'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="rounded-xl border border-slate-200 hover:bg-slate-100 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Kembali ke Beranda
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Admin Views & Logic ---

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesClass =
      classFilter === 'all' || (u.className && u.className.toLowerCase().includes(classFilter.toLowerCase()));
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.nip && u.nip.includes(q)) ||
      (u.nisn && u.nisn.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q));

    return matchesRole && matchesClass && matchesSearch;
  });

  const totalTeachers = usersList.filter((u) => u.role === 'guru').length;
  const totalStudents = usersList.filter((u) => u.role === 'siswa').length;
  const totalAdmins = usersList.filter((u) => u.role === 'admin').length;
  const totalActive = usersList.filter((u) => u.status === 'aktif' || !u.status).length;

  // Checkbox selection helpers
  const selectableUsers = filteredUsers.filter((u) => u.id !== currentUser.id);
  const isAllSelected = selectableUsers.length > 0 && selectableUsers.every((u) => selectedUserIds.includes(u.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(selectableUsers.map((u) => u.id));
    }
  };

  const handleToggleSelectRow = (userId: string) => {
    if (userId === currentUser.id) return;
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      username: '',
      role: 'siswa',
      password: 'siswa123',
      className: 'Kelas VIII B',
      classId: 'cls_8b',
      nip: '',
      nisn: '',
      email: '',
      phone: '',
      status: 'aktif',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username || user.id,
      role: user.role,
      password: user.password || '',
      className: user.className || '',
      classId: user.classId || '',
      nip: user.nip || '',
      nisn: user.nisn || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'aktif',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPasswordInput(user.role === 'guru' ? 'guru123' : user.role === 'admin' ? 'admin123' : 'siswa123');
    setIsResetPasswordModalOpen(true);
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addUserAccount({
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase() || formData.name.toLowerCase().replace(/\s+/g, ''),
      role: formData.role,
      password: formData.password || (formData.role === 'guru' ? 'guru123' : formData.role === 'admin' ? 'admin123' : 'siswa123'),
      className: formData.className,
      classId: formData.classId,
      nip: formData.nip,
      nisn: formData.nisn,
      email: formData.email || `${formData.username || 'user'}@smpn1wonosari.sch.id`,
      phone: formData.phone,
      status: formData.status,
      avatar:
        formData.role === 'guru'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'
          : formData.role === 'admin'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formData.name.trim()) return;

    updateUserAccount(selectedUser.id, {
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase(),
      role: formData.role,
      className: formData.className,
      classId: formData.classId,
      nip: formData.nip,
      nisn: formData.nisn,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      ...(formData.password ? { password: formData.password } : {}),
    });

    setIsEditModalOpen(false);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPasswordInput.trim()) return;
    resetUserPassword(selectedUser.id, newPasswordInput.trim());
    setIsResetPasswordModalOpen(false);
  };

  // Single Deletion
  const handleConfirmSingleDelete = () => {
    if (!userToDelete) return;
    deleteUserAccount(userToDelete.id);
    setSelectedUserIds((prev) => prev.filter((id) => id !== userToDelete.id));
    setUserToDelete(null);
  };

  // Bulk Deletion
  const handleConfirmBulkDelete = () => {
    if (selectedUserIds.length === 0) return;
    deleteMultipleUsers(selectedUserIds);
    setSelectedUserIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // Bulk Refresh
  const handleRefreshSelected = () => {
    selectedUserIds.forEach((id) => refreshSingleUser(id));
    addToastNotification('Segarkan Berhasil', `${selectedUserIds.length} akun pengguna terpilih berhasil disegarkan ke status aktif.`, 'system');
    setSelectedUserIds([]);
  };

  // --- Excel Import Handlers ---

  const handleDownloadTemplate = () => {
    const templateData = [
      ['Nama Lengkap', 'Peran (guru/siswa/admin)', 'ID/Username', 'Kata Sandi', 'NIP/NISN', 'Kelas/Rombel', 'Email', 'No Telepon'],
      ['Sulistyana, S.Pd., M.Pd.', 'guru', 'sulistyana', 'guru123', '19740512 199903 2 004', 'Kelas VIII B', 'sulistyana90@guru.smp.belajar.id', '+62 813-9876-5432'],
      ['Raka Pratama', 'siswa', 'raka', 'siswa123', '0098712345', 'Kelas VIII B', 'raka.pratama@smpn1wonosari.sch.id', '+62 812-3456-7890'],
      ['Aisyah Putri Maharani', 'siswa', 'aisyah', 'siswa123', '0098712346', 'Kelas VIII B', 'aisyah.putri@smpn1wonosari.sch.id', '+62 812-9988-7766'],
      ['Admin IT Baru', 'admin', 'admin2', 'admin123', '198801012015011002', 'Biro IT & Kurikulum', 'admin2@smpn1wonosari.sch.id', '+62 811-3344-5566'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Pengguna');
    XLSX.writeFile(wb, 'Template_Impor_Pengguna_SMPN1_Wonosari.xlsx');
  };

  const parseExcelFile = (file: File) => {
    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          addToastNotification('File Kosong', 'File Excel yang dipilih tidak memiliki baris data.', 'system');
          return;
        }

        const parsedUsers: Array<Omit<User, 'id'>> = rawJson
          .map((row) => {
            const name = (row['Nama Lengkap'] || row['Nama'] || row['name'] || row['Name'] || '').toString().trim();
            const rawRole = (row['Peran (guru/siswa/admin)'] || row['Peran'] || row['role'] || row['Role'] || 'siswa')
              .toString()
              .toLowerCase()
              .trim();
            const role: UserRole = rawRole === 'admin' ? 'admin' : rawRole === 'guru' ? 'guru' : 'siswa';

            const username = (
              row['ID/Username'] ||
              row['Username'] ||
              row['ID'] ||
              row['username'] ||
              name.toLowerCase().replace(/\s+/g, '')
            )
              .toString()
              .trim();

            const password = (
              row['Kata Sandi'] ||
              row['Sandi'] ||
              row['Password'] ||
              row['password'] ||
              (role === 'guru' ? 'guru123' : role === 'admin' ? 'admin123' : 'siswa123')
            )
              .toString()
              .trim();

            const nipNisn = (row['NIP/NISN'] || row['NIP'] || row['NISN'] || row['nip'] || row['nisn'] || '').toString().trim();
            const className = (
              row['Kelas/Rombel'] ||
              row['Kelas'] ||
              row['Rombel'] ||
              row['className'] ||
              (role === 'guru' ? 'Guru Pengampu' : role === 'admin' ? 'Biro Administrasi' : 'Kelas VIII B')
            )
              .toString()
              .trim();

            const email = (row['Email'] || row['email'] || `${username}@smpn1wonosari.sch.id`).toString().trim();
            const phone = (row['No Telepon'] || row['Telepon'] || row['phone'] || '').toString().trim();

            return {
              name,
              role,
              username,
              password,
              nip: role === 'guru' || role === 'admin' ? nipNisn : undefined,
              nisn: role === 'siswa' ? nipNisn : undefined,
              className,
              classId: 'cls_8b',
              email,
              phone,
              status: 'aktif' as const,
              avatar:
                role === 'guru'
                  ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'
                  : role === 'admin'
                  ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            };
          })
          .filter((u) => u.name.length > 0);

        setImportPreviewData(parsedUsers);
      } catch (err) {
        console.error(err);
        addToastNotification('Format Tidak Sesuai', 'Gagal memproses file. Pastikan menggunakan format Excel (.xlsx/.xls) atau CSV yang valid.', 'system');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseExcelFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseExcelFile(file);
    }
  };

  const handleConfirmImport = () => {
    if (importPreviewData.length === 0) return;
    importUserAccounts(importPreviewData);
    setIsImportModalOpen(false);
    setImportPreviewData([]);
    setImportFileName('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Username', 'Nama Lengkap', 'Peran', 'Kelas / Jabatan', 'NIP / NISN', 'Email', 'No Telepon', 'Kata Sandi', 'Status'];
    const rows = usersList.map((u) => [
      `"${u.id}"`,
      `"${u.username || ''}"`,
      `"${u.name}"`,
      `"${u.role.toUpperCase()}"`,
      `"${u.className}"`,
      `"${u.nip || u.nisn || '-'}"`,
      `"${u.email}"`,
      `"${u.phone || '-'}"`,
      `"${u.password || (u.role === 'guru' ? 'guru123' : u.role === 'admin' ? 'admin123' : 'siswa123')}"`,
      `"${u.status || 'aktif'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [`"DATABASE PENGGUNA & KREDENSIAL LMS SMPN 1 WONOSARI"`, `"Diekspor pada: ${new Date().toLocaleString('id-ID')}"`, '']
        .concat([headers.join(',')])
        .concat(rows.map((e) => e.join(',')))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Database_Pengguna_LMS_SMPN1_Wonosari_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToastNotification('Ekspor Database Berhasil', 'File spreadsheet kredensial akun pengguna berhasil diunduh.', 'system');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div>
          <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Pusat Kendali Basis Data Administrator (Hak Akses Penuh)</span>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
            Basis Data Pengguna & Kredensial Akun
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Hanya Administrator yang memiliki hak akses untuk menambah akun, mengimpor dari Excel, merefresh data, atau menghapus pengguna baik sendiri-sendiri maupun langsung massal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tambah Pengguna */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 px-4 py-2.5 text-xs font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Pengguna</span>
          </button>

          {/* Impor dari Excel */}
          <button
            onClick={() => setActiveAdminSubTab('import')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
              activeAdminSubTab === 'import'
                ? 'bg-emerald-500 text-white shadow-emerald-950/30 ring-2 ring-white/50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/20'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Impor dari Excel / CSV</span>
          </button>

          {/* Opsi Pembersihan & Reset */}
          <button
            onClick={() => setActiveAdminSubTab('cleaning')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
              activeAdminSubTab === 'cleaning'
                ? 'bg-amber-400 text-amber-950 shadow-amber-950/30 ring-2 ring-white/50'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-950/20'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Pembersihan & Reset</span>
          </button>

          {/* Ekspor CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 1.5. SubTab Navigation */}
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100/90 p-1.5 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveAdminSubTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeAdminSubTab === 'users'
              ? 'bg-white text-blue-600 shadow-md dark:bg-slate-900 dark:text-blue-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Daftar & Kelola Pengguna</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
            activeAdminSubTab === 'users'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              : 'bg-slate-200 text-slate-600 dark:text-slate-700 dark:text-slate-300'
          }`}>
            {usersList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('import')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeAdminSubTab === 'import'
              ? 'bg-white text-emerald-600 shadow-md dark:bg-slate-900 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
          <span>Menu Impor File Excel</span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-extrabold">
            .xlsx / .csv
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('cleaning')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeAdminSubTab === 'cleaning'
              ? 'bg-white text-amber-600 shadow-md dark:bg-slate-900 dark:text-amber-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="h-4 w-4 text-amber-500" />
          <span>Pusat Hapus & Refresh Data</span>
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[10px] font-extrabold">
            Langsung Semua
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminSubTab('admins')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeAdminSubTab === 'admins'
              ? 'bg-white text-purple-600 shadow-md dark:bg-slate-900 dark:text-purple-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-purple-500" />
          <span>Kelola Administrator</span>
          <span className="rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 text-[10px] font-extrabold">
            {totalAdmins} Admin
          </span>
        </button>
      </div>

      {/* Tab Content: Users Table & Controls */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-150">

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Akun</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {usersList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dewan Guru</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {totalTeachers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Peserta Didik</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Administrator</span>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                {totalAdmins}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, ID pengguna, NIP, NISN, atau email..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Refresh All Button */}
          <button
            onClick={() => refreshAllUsers(false)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Segarkan sinkronisasi seluruh data akun"
          >
            <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Segarkan Data</span>
          </button>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            {(['all', 'guru', 'siswa', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {r === 'all' ? 'Semua Peran' : r === 'guru' ? 'Guru' : r === 'siswa' ? 'Siswa' : 'Admin'}
              </button>
            ))}
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Semua Rombel</option>
            <option value="Kelas VII">Tingkat VII</option>
            <option value="Kelas VIII">Tingkat VIII</option>
            <option value="Kelas IX">Tingkat IX</option>
            <option value="8B">Kelas VIII B</option>
            <option value="8A">Kelas VIII A</option>
            <option value="Biro">Biro Administrasi</option>
          </select>
        </div>
      </div>

      {/* 4. Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                {/* Select All Checkbox */}
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    title="Pilih semua baris yang tampil"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Peran</th>
                <th className="p-4">ID Login / Username</th>
                <th className="p-4">NIP / NISN</th>
                <th className="p-4">Rombel / Jabatan</th>
                <th className="p-4">Kata Sandi</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ada akun pengguna yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const pass =
                    user.password ||
                    (user.role === 'guru' ? 'guru123' : user.role === 'admin' ? 'admin123' : 'siswa123');
                  const isPassVisible = visiblePasswords[user.id];
                  const isSelected = selectedUserIds.includes(user.id);
                  const isCurrentActiveAdmin = user.id === currentUser.id;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isCurrentActiveAdmin}
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(user.id)}
                          className={`h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${
                            isCurrentActiveAdmin ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title={isCurrentActiveAdmin ? 'Akun aktif tidak dapat dipilih' : 'Pilih akun ini'}
                        />
                      </td>

                      {/* Name & Avatar */}
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                              {user.id.startsWith('usr_imp_') && (
                                <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-bold">
                                  Impor
                                </span>
                              )}
                              {isCurrentActiveAdmin && (
                                <span className="rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.2 text-[9px] font-bold">
                                  Anda
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <span
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'guru'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                              : user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* ID / Username */}
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {user.username || user.id}
                      </td>

                      {/* NIP / NISN */}
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                        {user.nip || user.nisn || '-'}
                      </td>

                      {/* Class */}
                      <td className="p-4 font-medium">{user.className || '-'}</td>

                      {/* Password with Eye Toggle */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {isPassVisible ? pass : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Tampilkan / Sembunyikan sandi"
                          >
                            {isPassVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user.id)}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                            user.status === 'nonaktif'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === 'nonaktif' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span>{user.status === 'nonaktif' ? 'Nonaktif' : 'Aktif'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Refresh Single User */}
                          <button
                            type="button"
                            onClick={() => refreshSingleUser(user.id)}
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title="Segarkan data akun ini (kembalikan status aktif & sandi default)"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => handleOpenResetPassword(user)}
                            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            title="Reset Kata Sandi"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Ubah Data Pengguna"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete Single User */}
                          <button
                            type="button"
                            disabled={isCurrentActiveAdmin}
                            onClick={() => setUserToDelete(user)}
                            className={`rounded-lg p-1.5 ${
                              isCurrentActiveAdmin
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                            }`}
                            title={isCurrentActiveAdmin ? 'Tidak dapat menghapus akun aktif' : 'Hapus Akun Pengguna'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredUsers.length} dari {usersList.length} total akun pengguna</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Sistem Basis Data Terintegrasi • SMPN 1 Wonosari
          </span>
        </div>
      </div>

      {/* Floating Bulk Action Bar when 1 or more rows selected */}
      {selectedUserIds.length > 0 && (
        <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md dark:border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              {selectedUserIds.length}
            </div>
            <div>
              <p className="text-xs font-bold">{selectedUserIds.length} Akun Pengguna Terpilih</p>
              <p className="text-[11px] text-slate-400">
                Pilih tindakan massal yang ingin Anda jalankan pada akun ini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshSelected}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
              <span>Segarkan Terpilih</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 transition-all active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus {selectedUserIds.length} Terpilih</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}
    </div>
  )}

  {/* TAB 2: MENU IMPOR FILE EXCEL */}
  {activeAdminSubTab === 'import' && (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Intro banner */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">
                Menu Impor Pengguna dari File Excel (.xlsx / .xls / .csv)
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Hanya Administrator yang memiliki hak akses untuk menambahkan akun guru, siswa, dan admin melalui file spreadsheet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 text-xs font-bold shadow-md shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <FileDown className="h-4 w-4" />
            <span>Unduh Template Excel Resmi (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 dark:border-emerald-400 dark:bg-emerald-950/40 scale-[1.01]'
            : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-inner">
          <Upload className="h-8 w-8" />
        </div>
        <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
          {importFileName ? `File Terpilih: ${importFileName}` : 'Klik untuk memilih file Excel atau seret file ke sini'}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Mendukung file format <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong>. Sistem akan membaca kolom Nama, Peran (guru/siswa/admin), ID/Username, Kata Sandi, dan NIP/NISN secara otomatis.
        </p>
        {importFileName && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            File berhasil dimuat & siap dipratinjau
          </span>
        )}
      </div>

      {/* Table Preview if file parsed */}
      {importPreviewData.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Preview header with metrics */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau Data Akun Hasil Pembacaan Excel ({importPreviewData.length} baris)
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Periksa baris data di bawah sebelum menyimpan ke basis data pengguna LMS sekolah.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setImportPreviewData([]);
                  setImportFileName('');
                }}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Check className="h-4 w-4" />
                <span>Simpan & Impor {importPreviewData.length} Akun ke Database</span>
              </button>
            </div>
          </div>

          {/* Breakdown badges */}
          <div className="px-5 py-3 bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500">Rincian Peran:</span>
            <span className="rounded-lg bg-blue-100 text-blue-800 px-2 py-0.5 font-bold dark:bg-blue-950 dark:text-blue-300">
              Guru: {importPreviewData.filter((u) => u.role === 'guru').length}
            </span>
            <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold dark:bg-emerald-950 dark:text-emerald-300">
              Siswa: {importPreviewData.filter((u) => u.role === 'siswa').length}
            </span>
            <span className="rounded-lg bg-purple-100 text-purple-800 px-2 py-0.5 font-bold dark:bg-purple-950 dark:text-purple-300">
              Admin: {importPreviewData.filter((u) => u.role === 'admin').length}
            </span>
            <span className="text-slate-400">• Duplikat otomatis disaring sistem</span>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500 sticky top-0 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Peran</th>
                  <th className="p-3">ID / Username</th>
                  <th className="p-3">Kata Sandi</th>
                  <th className="p-3">NIP / NISN</th>
                  <th className="p-3">Kelas / Jabatan</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">No Telepon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {importPreviewData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase ${
                          row.role === 'guru'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : row.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {row.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{row.username}</td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{row.password}</td>
                    <td className="p-3 font-mono text-slate-500">{row.nip || row.nisn || '-'}</td>
                    <td className="p-3">{row.className || '-'}</td>
                    <td className="p-3 text-[11px] text-slate-500">{row.email || '-'}</td>
                    <td className="p-3 text-[11px] text-slate-500">{row.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Step instruction card when no file is chosen yet */
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Petunjuk Format File Impor Excel:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-blue-600 dark:text-blue-400">1. Unduh Template</span>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Klik tombol hijau di atas untuk mengunduh template Excel resmi dengan format kolom yang sudah standar.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">2. Isi Data Pengguna</span>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Isi data guru, siswa, dan admin. Kolom peran diisi <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded font-mono">guru</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded font-mono">siswa</code>, atau <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded font-mono">admin</code>.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-purple-600 dark:text-purple-400">3. Unggah & Impor</span>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Seret file ke area unggah di atas, periksa pratinjau yang muncul otomatis, lalu klik tombol simpan untuk memasukkan seluruh akun ke database.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

  {/* TAB 3: PUSAT HAPUS & REFRESH DATA */}
  {activeAdminSubTab === 'cleaning' && (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Intro banner */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-600/30">
            <RotateCcw className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-950 dark:text-amber-200">
              Pusat Pembersihan & Reset Data (Hapus & Refresh Langsung Semua / Kategori)
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
              Sebagai Administrator, Anda dapat menghapus data yang sudah masuk secara langsung semua atau sendiri-sendiri, serta merefresh status seluruh akun atau memulihkan data bawaan sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Hapus Massal & Langsung Semua */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="h-4 w-4 text-red-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Opsi Hapus Data (Langsung Semua & Per Kategori)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Hapus Seluruh Data Pengguna */}
          <div className="rounded-3xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/40 dark:bg-red-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400 font-bold text-sm">
                <Trash2 className="h-5 w-5" />
                <span>Hapus Seluruh Data Pengguna (Kecuali Admin Aktif)</span>
              </div>
              <p className="mt-2 text-xs text-red-800/80 dark:text-red-300/80 leading-relaxed">
                Menghapus secara langsung seluruh akun siswa, guru, dan admin lain dari basis data sekolah. Akun Admin Anda ({currentUser.name}) akan tetap aman dan aktif.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                Total yang akan dihapus: {usersList.length - 1} akun
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('PERINGATAN TINGKAT TINGGI:\nApakah Anda yakin ingin menghapus SELURUH akun siswa dan guru di database?\n\nTindakan ini tidak dapat dibatalkan.')) {
                    deleteAllUsers('all');
                  }
                }}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-red-600/30 transition-all active:scale-95"
              >
                Hapus Semua Sekaligus
              </button>
            </div>
          </div>

          {/* Card 2: Hapus Seluruh Siswa */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <span>Hapus Semua Akun Siswa ({totalStudents})</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mengosongkan seluruh akun peserta didik ({totalStudents} siswa). Cocok digunakan saat persiapan tahun ajaran baru sebelum mengimpor siswa baru dari Excel.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Guru & Admin tetap dipertahankan</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Yakin ingin menghapus seluruh ${totalStudents} akun siswa dari database?`)) {
                    deleteAllUsers('siswa');
                  }
                }}
                className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 text-xs font-bold transition-all active:scale-95 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Hapus Seluruh Siswa
              </button>
            </div>
          </div>

          {/* Card 3: Hapus Seluruh Guru */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span>Hapus Semua Akun Guru ({totalTeachers})</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Menghapus seluruh akun dewan guru ({totalTeachers} guru) jika ingin menyetel ulang daftar pengampu mata pelajaran.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Siswa & Admin tetap dipertahankan</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Yakin ingin menghapus seluruh ${totalTeachers} akun guru dari database?`)) {
                    deleteAllUsers('guru');
                  }
                }}
                className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 text-xs font-bold transition-all active:scale-95 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Hapus Seluruh Guru
              </button>
            </div>
          </div>

          {/* Card 4: Hapus Akun Hasil Impor Excel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-100 font-bold text-sm">
                <FileSpreadsheet className="h-5 w-5 text-amber-600" />
                <span>Hapus Semua Akun Hasil Impor Excel</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Menghapus hanya data pengguna yang sebelumnya dimasukkan melalui menu impor file Excel, menjaga akun bawaan sekolah tetap utuh.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Akun bawaan sekolah aman</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Yakin ingin menghapus seluruh akun hasil impor file Excel?')) {
                    deleteAllUsers('imported');
                  }
                }}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-amber-600/20 transition-all active:scale-95"
              >
                Hapus Hasil Impor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Segarkan & Pulihkan Massal */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Opsi Refresh & Pemulihan Basis Data (Langsung Semua)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 5: Segarkan Seluruh Data Akun */}
          <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-blue-800 dark:text-blue-300 font-bold text-sm">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <span>Segarkan Seluruh Data Akun (Aktifkan Semua)</span>
              </div>
              <p className="mt-2 text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed">
                Menyinkronkan data, mengaktifkan kembali seluruh akun pengguna ke status aktif, dan menghapus status error tanpa menghapus akun manapun.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between">
              <span className="text-[11px] text-blue-700 dark:text-blue-400">Semua {usersList.length} akun</span>
              <button
                type="button"
                onClick={() => refreshAllUsers(false)}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
              >
                Segarkan Semua Sekarang
              </button>
            </div>
          </div>

          {/* Card 6: Pulihkan ke Bawaan Sekolah */}
          <div className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                <FolderSync className="h-5 w-5 text-indigo-600" />
                <span>Pulihkan Basis Data ke Bawaan Sekolah Resmi</span>
              </div>
              <p className="mt-2 text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                Mengembalikan seluruh data pengguna resmi: Bu Sulistyana, Pak Slamet, Pak Budi, Raka Pratama, dll., serta akun Administrator resmi SMPN 1 Wonosari.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-between">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-400">Reset ke konfigurasi sekolah</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Pulihkan seluruh data pengguna ke pengaturan awal bawaan sekolah?')) {
                    refreshAllUsers(true);
                  }
                }}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                Pulihkan ke Bawaan Sekolah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Panduan Sendiri-sendiri */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Ingin Menghapus atau Merefresh Data Sendiri-Sendiri?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setiap baris akun di tabel pengguna memiliki tombol khusus untuk tindakan individual:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveAdminSubTab('users')}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold dark:bg-slate-100 dark:text-slate-900 transition-all shrink-0"
          >
            Buka Tabel Pengguna
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <RotateCcw className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Segarkan Sendiri-sendiri</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Ikon hijau di baris tabel untuk merefresh 1 akun ke status aktif.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <Trash2 className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Hapus Sendiri-sendiri</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Ikon tempat sampah merah untuk menghapus 1 akun dengan konfirmasi.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <Edit2 className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Ubah Data Akun</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Ikon pensil biru untuk mengubah nama, ID/username, peran, atau sandi.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <CheckSquare className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Pilih Beberapa (Batch)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Centang kotak pada baris untuk aksi massal pada akun yang dipilih.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* TAB 4: KELOLA ADMINISTRATOR */}
  {activeAdminSubTab === 'admins' && (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-3xl border border-purple-200 bg-purple-50/70 p-6 dark:border-purple-900/40 dark:bg-purple-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-950 dark:text-purple-200">
                Manajemen Akun Administrator LMS Sekolah
              </h3>
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                ID Administrator bawaan: <strong className="font-mono bg-purple-200/70 dark:bg-purple-900/60 px-1.5 py-0.5 rounded text-purple-950 dark:text-white">Admin</strong> • Kata Sandi: <strong className="font-mono bg-purple-200/70 dark:bg-purple-900/60 px-1.5 py-0.5 rounded text-purple-950 dark:text-white">admin123</strong>.
                Hanya administrator yang mengetahui kata sandi ini. Administrator dapat menambah admin baru dengan ID dan kata sandi yang dikelola sendiri.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                username: '',
                role: 'admin',
                password: 'admin123',
                className: 'Biro Administrasi & Tata Usaha',
                classId: 'cls_admin',
                nip: '',
                nisn: '',
                email: '',
                phone: '',
                status: 'aktif',
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 text-xs font-bold shadow-md shadow-purple-950/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Administrator Baru</span>
          </button>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usersList
          .filter((u) => u.role === 'admin')
          .map((adminUser) => {
            const isCurrentActive = adminUser.id === currentUser.id;
            const isPassVisible = visiblePasswords[adminUser.id];
            const pass = adminUser.password || 'admin123';

            return (
              <div
                key={adminUser.id}
                className={`rounded-3xl border bg-white p-5 shadow-xs dark:bg-slate-900 transition-all ${
                  isCurrentActive
                    ? 'border-purple-300 ring-2 ring-purple-500/20 dark:border-purple-800'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={adminUser.avatar}
                      alt={adminUser.name}
                      className="h-12 w-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{adminUser.name}</p>
                        {isCurrentActive && (
                          <span className="rounded-md bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[9px] font-extrabold dark:bg-purple-950 dark:text-purple-300">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{adminUser.className}</p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-purple-950 dark:text-purple-300">
                    Admin
                  </span>
                </div>

                {/* Credentials Box */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ID / Username:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {adminUser.username || adminUser.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kata Sandi:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                        {isPassVisible ? pass : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(adminUser.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Tampilkan / sembunyikan sandi"
                      >
                        {isPassVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  {adminUser.nip && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">NIP:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{adminUser.nip}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{adminUser.email}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {isCurrentActive ? 'Sesi Admin Saat Ini' : 'Dikelola oleh Administrator'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => refreshSingleUser(adminUser.id)}
                      className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      title="Segarkan akun admin ini"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenResetPassword(adminUser)}
                      className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      title="Reset kata sandi admin"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(adminUser)}
                      className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      title="Ubah data admin"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isCurrentActive}
                      onClick={() => setUserToDelete(adminUser)}
                      className={`rounded-lg p-1.5 ${
                        isCurrentActive
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                      }`}
                      title={isCurrentActive ? 'Akun aktif tidak dapat dihapus' : 'Hapus admin ini'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  )}

      {/* Modal: Pusat Pembersihan & Reset Data */}
      {isDataCleaningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Pusat Pembersihan & Reset Basis Data
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hapus data massal atau pulihkan data pengguna sekolah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDataCleaningModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Option 1: Segarkan Seluruh Data */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Segarkan Seluruh Data Akun
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Menyinkronkan data dan mengaktifkan kembali seluruh akun tanpa menghapus akun manapun.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    refreshAllUsers(false);
                    setIsDataCleaningModalOpen(false);
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all"
                >
                  Segarkan
                </button>
              </div>

              {/* Option 2: Hapus Akun Hasil Impor Excel */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mt-0.5">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Hapus Akun Hasil Impor Excel
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Hapus hanya data pengguna yang ditambahkan melalui menu impor file Excel.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Yakin ingin menghapus seluruh akun hasil impor file Excel?')) {
                      deleteAllUsers('imported');
                      setIsDataCleaningModalOpen(false);
                    }
                  }}
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all"
                >
                  Hapus Impor
                </button>
              </div>

              {/* Option 3: Hapus Semua Siswa */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Hapus Semua Akun Siswa ({totalStudents})
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mengosongkan seluruh akun peserta didik untuk tahun ajaran baru.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Yakin ingin menghapus seluruh akun peserta didik (siswa)?')) {
                      deleteAllUsers('siswa');
                      setIsDataCleaningModalOpen(false);
                    }
                  }}
                  className="rounded-xl bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 transition-all"
                >
                  Hapus Siswa
                </button>
              </div>

              {/* Option 4: Pulihkan ke Bawaan Sekolah */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white mt-0.5">
                    <FolderSync className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Pulihkan Basis Data ke Bawaan Sekolah
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Mengembalikan seluruh daftar guru (Bu Sulistyana, Pak Slamet, dll.), siswa (Raka, dll.), dan Admin resmi.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Pulihkan seluruh data pengguna ke pengaturan awal bawaan sekolah?')) {
                      refreshAllUsers(true);
                      setIsDataCleaningModalOpen(false);
                    }
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 shadow-sm transition-all"
                >
                  Pulihkan
                </button>
              </div>

              {/* Option 5: Kosongkan Seluruh Pengguna */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-red-200 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-red-600 text-white mt-0.5">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                      Hapus Seluruh Data Pengguna
                    </h4>
                    <p className="text-[11px] text-red-700/80 dark:text-red-400">
                      Menghapus seluruh akun guru, siswa, dan admin lainnya (kecuali akun Admin yang sedang aktif).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('PERINGATAN: Tindakan ini akan menghapus seluruh akun guru dan siswa di database. Lanjutkan?')) {
                      deleteAllUsers('all');
                      setIsDataCleaningModalOpen(false);
                    }
                  }}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs font-bold shrink-0 shadow-sm transition-all"
                >
                  Kosongkan Semua
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDataCleaningModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Akun Tunggal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hapus Akun Pengguna</h3>
                <p className="text-[11px] text-slate-500">Konfirmasi tindakan penghapusan</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{userToDelete.name}</p>
              <p className="text-[11px] text-slate-500">
                Peran: <span className="font-bold uppercase text-blue-600">{userToDelete.role}</span> • ID: <span className="font-mono">{userToDelete.username || userToDelete.id}</span>
              </p>
              <p className="text-[11px] text-slate-500">{userToDelete.className}</p>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus akun ini dari basis data sekolah?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-red-600/30 transition-all"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Massal (Bulk Delete) */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Konfirmasi Hapus {selectedUserIds.length} Akun
                </h3>
                <p className="text-[11px] text-slate-500">Tindakan ini akan menghapus akun yang dipilih</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-300">
              Anda akan menghapus <strong>{selectedUserIds.length} akun pengguna</strong> yang telah dipilih secara permanen dari basis data sekolah.
            </p>

            <div className="mt-3 max-h-36 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/60 space-y-1">
              {usersList
                .filter((u) => selectedUserIds.includes(u.id))
                .map((u) => (
                  <div key={u.id} className="text-[11px] flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold truncate">{u.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({u.role})</span>
                  </div>
                ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-red-600/30 transition-all"
              >
                Hapus Semua Terpilih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Impor Pengguna dari File Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Impor Pengguna dari File Excel / CSV
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hanya Administrator yang memiliki wewenang mengimpor data akun massal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-slate-800/80">
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  Unduh Format Template Resmi
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Gunakan template ini untuk mengisi data nama guru, siswa, dan admin dengan format kolom yang tepat.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-blue-600/20 transition-all shrink-0 active:scale-95"
              >
                <FileDown className="h-4 w-4" />
                <span>Unduh Template Excel (.xlsx)</span>
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Upload className="h-9 w-9 text-slate-400" />
              <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                {importFileName ? `File Terpilih: ${importFileName}` : 'Klik untuk memilih file Excel atau seret ke sini'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Mendukung format .xlsx, .xls, atau .csv
              </p>
            </div>

            {importPreviewData.length > 0 && (
              <div className="mt-4 flex-1 overflow-hidden flex flex-col border border-slate-200 rounded-2xl dark:border-slate-700">
                <div className="bg-slate-100 p-3 text-xs font-bold flex items-center justify-between dark:bg-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ditemukan {importPreviewData.length} akun siap diimpor</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Duplikat akan otomatis disaring
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[220px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 sticky top-0 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5">Nama</th>
                        <th className="p-2.5">Peran</th>
                        <th className="p-2.5">ID / Username</th>
                        <th className="p-2.5">Kata Sandi</th>
                        <th className="p-2.5">NIP / NISN</th>
                        <th className="p-2.5">Kelas / Jabatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {importPreviewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{row.name}</td>
                          <td className="p-2.5">
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                row.role === 'guru'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                  : row.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {row.role}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400">{row.username}</td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">{row.password}</td>
                          <td className="p-2.5 font-mono text-slate-500">{row.nip || row.nisn || '-'}</td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.className}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {importPreviewData.length > 0 ? `${importPreviewData.length} baris terdeteksi` : 'Silakan pilih file Excel template di atas'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importPreviewData.length === 0}
                  onClick={handleConfirmImport}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  Mulai Impor Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Pengguna Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Tambah Akun Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-500">Dikelola langsung oleh Administrator</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Peran Pengguna <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex gap-2">
                  {(['siswa', 'guru', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          role: r,
                          password: r === 'guru' ? 'guru123' : r === 'admin' ? 'admin123' : 'siswa123',
                          className: r === 'guru' ? 'Wali Kelas & Guru Mata Pelajaran' : r === 'admin' ? 'Biro Administrasi & Tata Usaha' : 'Kelas VIII B',
                        })
                      }
                      className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase border transition-all ${
                        formData.role === r
                          ? r === 'admin'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {r === 'admin' ? '🛡️ Admin' : r === 'guru' ? '👩‍🏫 Guru' : '👨‍🎓 Siswa'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={
                    formData.role === 'guru'
                      ? 'Contoh: Sulistyana, S.Pd., M.Pd.'
                      : formData.role === 'admin'
                      ? 'Contoh: Administrator IT Budi Santoso'
                      : 'Contoh: Raka Pratama'
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    ID Login / Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={formData.role === 'admin' ? 'Contoh: admin2' : 'Contoh: sulistyana'}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kata Sandi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contoh: admin123"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formData.role === 'siswa' ? 'NISN (Nomor Induk Siswa)' : 'NIP / Nomor Pegawai'}
                  </label>
                  <input
                    type="text"
                    value={formData.role === 'siswa' ? formData.nisn : formData.nip}
                    onChange={(e) =>
                      formData.role === 'siswa'
                        ? setFormData({ ...formData, nisn: e.target.value })
                        : setFormData({ ...formData, nip: e.target.value })
                    }
                    placeholder="Contoh: 19740512... / 00987123..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kelas / Rombel / Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="Contoh: Kelas VIII B / Biro IT"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Pengguna */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Ubah Data Pengguna</h3>
                  <p className="text-[11px] text-slate-500">Kelola ID dan kata sandi pengguna</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Lengkap & Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    ID Login / Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Peran Pengguna
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formData.role === 'siswa' ? 'NISN' : 'NIP'}
                  </label>
                  <input
                    type="text"
                    value={formData.role === 'siswa' ? formData.nisn : formData.nip}
                    onChange={(e) =>
                      formData.role === 'siswa'
                        ? setFormData({ ...formData, nisn: e.target.value })
                        : setFormData({ ...formData, nip: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kelas / Rombel / Jabatan
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ubah Kata Sandi (Kosongkan jika tidak diubah)
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan kata sandi baru"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700"
                >
                  Perbarui Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Kata Sandi */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Reset Kata Sandi Pengguna</h3>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{selectedUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Masukkan Kata Sandi Baru
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/30 hover:bg-amber-700"
                >
                  Setel Sandi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
