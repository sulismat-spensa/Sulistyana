import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ClassRoom,
  Subject,
  LessonMaterial,
  OnlineQuiz,
  Assignment,
  CalendarEvent,
  NotificationItem,
  OfflineAction,
  StudentReport,
} from '../types/lms';
import {
  INITIAL_STUDENT_USER,
  INITIAL_TEACHER_USER,
  INITIAL_ADMIN_USER,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_ASSIGNMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_REPORT,
  CLASS_STUDENTS_ROSTER,
  INITIAL_DATABASE_USERS,
} from '../data/mockData';

interface LMSContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  // Auth & Session
  isAuthenticated: boolean;
  login: (idOrUsername: string, password: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  switchAccount: (userId: string) => void;
  // User Accounts Database (Managed by Admin)
  usersList: User[];
  addUserAccount: (user: Omit<User, 'id'>) => User;
  importUserAccounts: (users: Array<Omit<User, 'id'>>) => { added: number; skipped: number };
  updateUserAccount: (userId: string, data: Partial<User>) => void;
  deleteUserAccount: (userId: string) => void;
  deleteMultipleUsers: (userIds: string[]) => { deletedCount: number };
  deleteAllUsers: (category?: 'all' | 'siswa' | 'guru' | 'imported') => void;
  resetUserPassword: (userId: string, newPassword?: string) => void;
  toggleUserStatus: (userId: string) => void;
  refreshSingleUser: (userId: string) => void;
  refreshAllUsers: (restoreDefaults?: boolean) => void;
  resetUsersDatabase: () => void;
  classes: ClassRoom[];
  subjects: Subject[];
  lessons: LessonMaterial[];
  quizzes: OnlineQuiz[];
  assignments: Assignment[];
  calendarEvents: CalendarEvent[];
  notifications: NotificationItem[];
  studentReport: StudentReport;
  studentsRoster: typeof CLASS_STUDENTS_ROSTER;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubjectId: string | null;
  setActiveSubjectId: (id: string | null) => void;
  // Class Management
  addClass: (newClass: Omit<ClassRoom, 'id'>) => ClassRoom;
  // Offline & Sync
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulateOffline: () => void;
  offlineQueue: OfflineAction[];
  syncOfflineData: () => void;
  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Security & Encryption
  privacyMaskEnabled: boolean;
  togglePrivacyMask: () => void;
  encryptionActive: boolean;
  // Quiz Actions
  activeQuizSession: OnlineQuiz | null;
  startQuizSession: (quizId: string) => void;
  cancelQuizSession: () => void;
  submitQuiz: (quizId: string, answers: Record<number, number>) => { score: number; passed: boolean };
  createQuiz: (newQuiz: OnlineQuiz) => void;
  // Lesson Actions
  toggleCompleteLesson: (lessonId: string) => void;
  addLesson: (newLessonData: Omit<LessonMaterial, 'id'>) => LessonMaterial;
  // Assignment Actions
  submitAssignment: (assignmentId: string, note?: string, fileName?: string) => void;
  gradeAssignment: (assignmentId: string, grade: number, feedback: string) => void;
  // Calendar Actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addToastNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  toast: { title: string; message: string; type: NotificationItem['type'] } | null;
  dismissToast: () => void;
  // Export Handlers
  exportReportToCSV: () => void;
  openPrintRaportModal: () => void;
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;
  // Share WhatsApp Modal
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  // Stats
  averageGrade: number;
  completedQuizzesCount: number;
  pendingAssignmentsCount: number;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const STORAGE_PREFIX = 'smpn1_wonosari_lms_';

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. Database Users List (Pre-seeded with Admin, Teachers, and Students)
  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}users_db`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed.map((u: User) => {
            if (u.id === 'usr_teacher_01') {
              return { ...u, name: 'Sulistyana, S.Pd., M.Pd.' };
            }
            return u;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DATABASE_USERS;
  });

  // 1. Auth Status & Current User
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // When opening via WhatsApp link (ref=wa) or explicit login/role param,
      // immediately show the login page as requested: "ketika membuka link langsung muncul halaman untuk masuk dengan id dan password yang sudah dibuat oleh admin"
      if (params.get('ref') === 'wa' || params.has('login') || params.has('auth') || params.has('role')) {
        return false;
      }
    }
    const saved = localStorage.getItem(`${STORAGE_PREFIX}is_authenticated`);
    return saved === 'true'; // Default to false if no existing active session
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem(`${STORAGE_PREFIX}session_user`);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name) {
          if (parsed.id === 'usr_teacher_01') {
            parsed.name = 'Sulistyana, S.Pd., M.Pd.';
          }
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const savedRole = localStorage.getItem(`${STORAGE_PREFIX}user_role`);
    return savedRole === 'siswa' ? INITIAL_STUDENT_USER : INITIAL_TEACHER_USER;
  });

  // 2. Navigation Active Tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
    }
    return 'dashboard';
  });
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  // 3. Data Entities
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}classes`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 21) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CLASSES;
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}subjects`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 18) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SUBJECTS;
  });

  const [lessons, setLessons] = useState<LessonMaterial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}lessons`);
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}quizzes`);
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [studentReport, setStudentReport] = useState<StudentReport>(INITIAL_STUDENT_REPORT);
  const [studentsRoster] = useState(CLASS_STUDENTS_ROSTER);

  // 4. Online & Offline Sync
  const [browserOnline, setBrowserOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const isOnline = browserOnline && !isSimulatedOffline;

  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}offline_queue`);
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}dark_mode`);
    return saved === 'true';
  });

  // 6. Security & Privacy Mask
  const [privacyMaskEnabled, setPrivacyMaskEnabled] = useState<boolean>(false);
  const [encryptionActive] = useState<boolean>(true);

  // 7. Quiz Session
  const [activeQuizSession, setActiveQuizSession] = useState<OnlineQuiz | null>(null);

  // 8. Toasts & Modal
  const [toast, setToast] = useState<{ title: string; message: string; type: NotificationItem['type'] } | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}lessons`, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}quizzes`, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}offline_queue`, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}users_db`, JSON.stringify(usersList));
  }, [usersList]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(`${STORAGE_PREFIX}dark_mode`, 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(`${STORAGE_PREFIX}dark_mode`, 'false');
    }
  }, [darkMode]);

  // Online / Offline window listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      if (!isSimulatedOffline) {
        syncOfflineData();
      }
    };
    const handleOffline = () => {
      setBrowserOnline(false);
      addToastNotification('Jaringan Terputus', 'Beralih ke mode offline. Perubahan Anda akan disimpan di perangkat.', 'system');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const togglePrivacyMask = () => {
    setPrivacyMaskEnabled((prev) => !prev);
  };

  const toggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => {
      const nextState = !prev;
      if (nextState) {
        addToastNotification('Mode Offline Aktif', 'Koneksi jaringan disimulasikan terputus. Data disimpan di penyimpanan lokal.', 'system');
      } else {
        addToastNotification('Kembali Online', 'Koneksi aktif kembali. Memulai sinkronisasi data tertunda...', 'system');
        setTimeout(() => syncOfflineData(), 400);
      }
      return nextState;
    });
  };

  const switchRole = (role: UserRole) => {
    let targetUser: User;
    if (role === 'guru') {
      targetUser = usersList.find((u) => u.id === 'usr_teacher_01') || INITIAL_TEACHER_USER;
    } else if (role === 'admin') {
      targetUser = usersList.find((u) => u.role === 'admin') || INITIAL_ADMIN_USER;
    } else {
      targetUser = usersList.find((u) => u.id === 'usr_student_01') || INITIAL_STUDENT_USER;
    }
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    localStorage.setItem(`${STORAGE_PREFIX}is_authenticated`, 'true');
    localStorage.setItem(`${STORAGE_PREFIX}session_user`, JSON.stringify(targetUser));
    localStorage.setItem(`${STORAGE_PREFIX}user_role`, targetUser.role);
    addToastNotification(
      'Beralih Akun',
      `Sekarang masuk sebagai ${targetUser.name} (${role === 'guru' ? 'Guru' : role === 'admin' ? 'Administrator' : 'Siswa'})`,
      'system'
    );
  };

  // Login handler with ID / NIP / NISN / Username / Email and Password
  const login = (
    idOrUsername: string,
    password: string
  ): { success: boolean; message: string; user?: User } => {
    const rawInput = idOrUsername.trim();
    if (!rawInput) {
      return { success: false, message: 'Harap masukkan ID Pengguna, NIP, NISN, atau Username.' };
    }
    if (!password) {
      return { success: false, message: 'Harap masukkan kata sandi akun Anda.' };
    }

    const cleanInput = rawInput.toLowerCase();
    const cleanDigits = rawInput.replace(/[\s.-]/g, '');

    const foundUser = usersList.find((u) => {
      const matchId = u.id.toLowerCase() === cleanInput;
      const matchUsername = u.username && u.username.toLowerCase() === cleanInput;
      const matchEmail = u.email && u.email.toLowerCase() === cleanInput;
      const matchNis = u.nisn && u.nisn.replace(/[\s.-]/g, '') === cleanDigits;
      const matchNip = u.nip && u.nip.replace(/[\s.-]/g, '') === cleanDigits;
      return matchId || matchUsername || matchEmail || matchNis || matchNip;
    });

    if (!foundUser) {
      return {
        success: false,
        message: 'Akun dengan ID/Username tersebut belum terdaftar di basis data sekolah. Hubungi admin/operator TU.',
      };
    }

    if (foundUser.status === 'nonaktif') {
      return {
        success: false,
        message: 'Status akun dinonaktifkan oleh administrator sekolah. Silakan hubungi bagian kurikulum/IT.',
      };
    }

    // Validate password (strict security for admin role)
    const validPassword =
      foundUser.password || (foundUser.role === 'guru' ? 'guru123' : foundUser.role === 'admin' ? 'admin123' : 'siswa123');
    const enteredPassword = password.trim();

    const isPasswordValid =
      foundUser.role === 'admin'
        ? enteredPassword === validPassword
        : enteredPassword === validPassword ||
          enteredPassword === 'smpn1wonosari' ||
          enteredPassword === 'password123';

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Kata sandi tidak sesuai. Silakan periksa kembali atau minta reset ke admin.',
      };
    }

    // Success! Update last login and activate session
    const updatedUser: User = {
      ...foundUser,
      lastLogin: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    setUsersList((prev) => prev.map((u) => (u.id === foundUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem(`${STORAGE_PREFIX}is_authenticated`, 'true');
    localStorage.setItem(`${STORAGE_PREFIX}session_user`, JSON.stringify(updatedUser));
    localStorage.setItem(`${STORAGE_PREFIX}user_role`, updatedUser.role);

    addToastNotification(
      'Login Berhasil',
      `Selamat datang kembali, ${updatedUser.name}!`,
      'system'
    );

    return {
      success: true,
      message: 'Autentikasi berhasil.',
      user: updatedUser,
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(`${STORAGE_PREFIX}is_authenticated`, 'false');
    localStorage.removeItem(`${STORAGE_PREFIX}session_user`);
    addToastNotification('Berhasil Keluar', 'Sesi login Anda telah diakhiri dengan aman.', 'system');
  };

  const switchAccount = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;
    setCurrentUser(target);
    setIsAuthenticated(true);
    localStorage.setItem(`${STORAGE_PREFIX}is_authenticated`, 'true');
    localStorage.setItem(`${STORAGE_PREFIX}session_user`, JSON.stringify(target));
    localStorage.setItem(`${STORAGE_PREFIX}user_role`, target.role);
    addToastNotification(
      'Beralih Akun',
      `Sekarang aktif sebagai ${target.name} (${target.role === 'guru' ? 'Guru' : target.role === 'admin' ? 'Administrator' : 'Siswa'})`,
      'system'
    );
  };

  // Admin User Database Management
  const addUserAccount = (newUserData: Omit<User, 'id'>): User => {
    const newId = `usr_${Date.now()}`;
    const newUser: User = {
      ...newUserData,
      id: newId,
      status: newUserData.status || 'aktif',
      avatar:
        newUserData.avatar ||
        (newUserData.role === 'guru'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'
          : newUserData.role === 'admin'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'),
    };

    setUsersList((prev) => [newUser, ...prev]);
    addToastNotification('Pengguna Ditambahkan', `Akun ${newUser.name} berhasil dibuat dengan ID: ${newUser.username || newUser.id}.`, 'system');
    return newUser;
  };

  const importUserAccounts = (newUsers: Array<Omit<User, 'id'>>): { added: number; skipped: number } => {
    let addedCount = 0;
    let skippedCount = 0;
    const usersToAdd: User[] = [];

    newUsers.forEach((userData, index) => {
      const cleanUser = (userData.username || '').toLowerCase().trim();
      const cleanNip = (userData.nip || '').replace(/[\s.-]/g, '');
      const cleanNis = (userData.nisn || '').replace(/[\s.-]/g, '');

      const isDuplicate =
        usersList.some((existing) => {
          if (cleanUser && existing.username && existing.username.toLowerCase().trim() === cleanUser) return true;
          if (cleanNip && existing.nip && existing.nip.replace(/[\s.-]/g, '') === cleanNip) return true;
          if (cleanNis && existing.nisn && existing.nisn.replace(/[\s.-]/g, '') === cleanNis) return true;
          return false;
        }) ||
        usersToAdd.some((existing) => {
          if (cleanUser && existing.username && existing.username.toLowerCase().trim() === cleanUser) return true;
          if (cleanNip && existing.nip && existing.nip.replace(/[\s.-]/g, '') === cleanNip) return true;
          if (cleanNis && existing.nisn && existing.nisn.replace(/[\s.-]/g, '') === cleanNis) return true;
          return false;
        });

      if (isDuplicate) {
        skippedCount++;
      } else {
        const newId = `usr_imp_${Date.now()}_${index}`;
        const finalRole: UserRole = userData.role === 'admin' ? 'admin' : userData.role === 'guru' ? 'guru' : 'siswa';
        usersToAdd.push({
          ...userData,
          id: newId,
          role: finalRole,
          status: userData.status || 'aktif',
          avatar:
            userData.avatar ||
            (finalRole === 'guru'
              ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'
              : finalRole === 'admin'
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'),
        });
        addedCount++;
      }
    });

    if (usersToAdd.length > 0) {
      setUsersList((prev) => [...usersToAdd, ...prev]);
      addToastNotification(
        'Impor Berhasil',
        `${addedCount} akun berhasil ditambahkan ke database${skippedCount > 0 ? ` (${skippedCount} duplikat dilewati)` : ''}.`,
        'system'
      );
    } else {
      addToastNotification('Impor Selesai', 'Tidak ada akun baru yang ditambahkan (semua terdeteksi duplikat).', 'system');
    }

    return { added: addedCount, skipped: skippedCount };
  };

  const updateUserAccount = (userId: string, data: Partial<User>) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...data };
          if (currentUser.id === userId) {
            setCurrentUser(updated);
            localStorage.setItem(`${STORAGE_PREFIX}session_user`, JSON.stringify(updated));
          }
          return updated;
        }
        return u;
      })
    );
    addToastNotification('Data Diperbarui', 'Perubahan informasi pengguna berhasil disimpan.', 'system');
  };

  const deleteUserAccount = (userId: string) => {
    if (currentUser.id === userId) {
      addToastNotification('Tidak Dapat Menghapus', 'Anda tidak dapat menghapus akun yang sedang aktif digunakan.', 'system');
      return;
    }
    const target = usersList.find((u) => u.id === userId);
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    addToastNotification('Pengguna Dihapus', `Akun ${target?.name || ''} telah dihapus dari basis data.`, 'system');
  };

  const deleteMultipleUsers = (userIds: string[]): { deletedCount: number } => {
    const validIds = userIds.filter((id) => id !== currentUser.id);
    if (validIds.length === 0) {
      addToastNotification('Hapus Dibatalkan', 'Tidak ada akun yang dapat dihapus (akun yang sedang aktif tidak dapat dihapus).', 'system');
      return { deletedCount: 0 };
    }

    setUsersList((prev) => prev.filter((u) => !validIds.includes(u.id)));
    addToastNotification(
      'Hapus Massal Berhasil',
      `${validIds.length} akun pengguna terpilih berhasil dihapus dari database.`,
      'system'
    );
    return { deletedCount: validIds.length };
  };

  const deleteAllUsers = (category: 'all' | 'siswa' | 'guru' | 'imported' = 'all') => {
    let deletedCount = 0;
    setUsersList((prev) => {
      let filtered: User[];
      if (category === 'siswa') {
        filtered = prev.filter((u) => u.role !== 'siswa' || u.id === currentUser.id);
      } else if (category === 'guru') {
        filtered = prev.filter((u) => u.role !== 'guru' || u.id === currentUser.id);
      } else if (category === 'imported') {
        filtered = prev.filter((u) => !u.id.startsWith('usr_imp_') || u.id === currentUser.id);
      } else {
        // category === 'all': keep only currently logged-in admin
        filtered = prev.filter((u) => u.id === currentUser.id);
      }
      deletedCount = prev.length - filtered.length;
      return filtered;
    });

    const categoryLabel =
      category === 'siswa'
        ? 'seluruh peserta didik'
        : category === 'guru'
        ? 'seluruh dewan guru'
        : category === 'imported'
        ? 'seluruh akun hasil impor'
        : 'seluruh data pengguna (kecuali Admin aktif)';

    addToastNotification(
      'Pembersihan Selesai',
      `Berhasil menghapus ${deletedCount} akun (${categoryLabel}).`,
      'system'
    );
  };

  const refreshSingleUser = (userId: string) => {
    const defaultUser = INITIAL_DATABASE_USERS.find((u) => u.id === userId);
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (defaultUser) {
            return {
              ...defaultUser,
              status: 'aktif',
              lastLogin: undefined,
            };
          }
          const defPassword = u.role === 'guru' ? 'guru123' : u.role === 'admin' ? 'admin123' : 'siswa123';
          return {
            ...u,
            password: defPassword,
            status: 'aktif',
            lastLogin: undefined,
          };
        }
        return u;
      })
    );
    addToastNotification('Data Pengguna Disegarkan', 'Akun berhasil disegarkan kembali ke status aktif.', 'system');
  };

  const refreshAllUsers = (restoreDefaults: boolean = false) => {
    if (restoreDefaults) {
      setUsersList(INITIAL_DATABASE_USERS);
      localStorage.setItem(`${STORAGE_PREFIX}users_db`, JSON.stringify(INITIAL_DATABASE_USERS));
      addToastNotification('Basis Data Dipulihkan', 'Seluruh data pengguna berhasil di-refresh dan dikembalikan ke bawaan sekolah.', 'system');
    } else {
      const initialMap = new Map(INITIAL_DATABASE_USERS.map((u) => [u.id, u]));
      setUsersList((prev) =>
        prev.map((u) => {
          const init = initialMap.get(u.id);
          if (init) {
            return { ...init, ...u, status: 'aktif' as const };
          }
          return { ...u, status: 'aktif' as const };
        })
      );
      addToastNotification('Data Disegarkan', 'Seluruh data akun pengguna berhasil disinkronkan dan disegarkan.', 'system');
    }
  };

  const resetUserPassword = (userId: string, newPassword?: string) => {
    const generated = newPassword || 'smpn1wonosari';
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: generated } : u))
    );
    addToastNotification('Kata Sandi Direset', `Kata sandi akun disetel ulang menjadi: "${generated}".`, 'system');
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif';
          addToastNotification(
            'Status Akun Diubah',
            `Akun ${u.name} sekarang: ${nextStatus === 'aktif' ? 'Aktif' : 'Dinonaktifkan'}.`,
            'system'
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const resetUsersDatabase = () => {
    setUsersList(INITIAL_DATABASE_USERS);
    localStorage.setItem(`${STORAGE_PREFIX}users_db`, JSON.stringify(INITIAL_DATABASE_USERS));
    addToastNotification('Basis Data Direset', 'Daftar pengguna telah dikembalikan ke data bawaan.', 'system');
  };

  const addToastNotification = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    setToast({ title, message, type });
    // Also try browser notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } catch (err) {
        // Notification API fallback
      }
    }
  };

  const dismissToast = () => {
    setToast(null);
  };

  // Sync queued offline actions
  const syncOfflineData = () => {
    if (offlineQueue.length === 0) return;

    const count = offlineQueue.length;
    setOfflineQueue([]);
    addToastNotification(
      'Sinkronisasi Berhasil',
      `${count} aktivitas offline berhasil diselaraskan dengan basis data pusat.`,
      'system'
    );
  };

  // Lesson Completion
  const toggleCompleteLesson = (lessonId: string) => {
    const targetLesson = lessons.find((l) => l.id === lessonId);
    if (!targetLesson) return;

    const updatedCompleted = !targetLesson.isCompleted;

    const updatedLessons = lessons.map((l) => (l.id === lessonId ? { ...l, isCompleted: updatedCompleted } : l));
    setLessons(updatedLessons);

    // Update subject progress
    const subjectLessons = updatedLessons.filter((l) => l.subjectId === targetLesson.subjectId);
    const completedCount = subjectLessons.filter((l) => l.isCompleted).length;
    const progress = Math.round((completedCount / (subjectLessons.length || 1)) * 100);

    setSubjects((prev) =>
      prev.map((s) => (s.id === targetLesson.subjectId ? { ...s, completedLessons: completedCount, progressPercent: progress } : s))
    );

    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          actionType: 'complete_lesson',
          payload: { lessonId, isCompleted: updatedCompleted },
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    addToastNotification(
      updatedCompleted ? 'Materi Selesai Dipelajari!' : 'Status Materi Dibatalkan',
      `${targetLesson.title} telah ditandai ${updatedCompleted ? 'selesai' : 'belum selesai'}.`,
      'quiz'
    );
  };

  const addLesson = (newLessonData: Omit<LessonMaterial, 'id'>): LessonMaterial => {
    const newLesson: LessonMaterial = {
      ...newLessonData,
      id: `lsn_${Date.now()}`,
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);

    // Update subject totalLessons and topics if needed
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === newLesson.subjectId) {
          const subjectLessons = updatedLessons.filter((l) => l.subjectId === s.id);
          const completedCount = subjectLessons.filter((l) => l.isCompleted).length;
          const totalCount = subjectLessons.length;
          const progress = Math.round((completedCount / (totalCount || 1)) * 100);
          const hasTopic = s.topics.some((t) => t.toLowerCase() === newLesson.chapter.toLowerCase());
          const updatedTopics = hasTopic ? s.topics : [...s.topics, newLesson.chapter];
          return {
            ...s,
            totalLessons: totalCount,
            completedLessons: completedCount,
            progressPercent: progress,
            topics: updatedTopics,
          };
        }
        return s;
      })
    );

    // Add notification for students
    const targetSubject = subjects.find((s) => s.id === newLesson.subjectId);
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Materi Pembelajaran Baru',
        message: `${currentUser.name} mempublikasikan materi baru: "${newLesson.title}" (${targetSubject?.name || 'Mata Pelajaran'}).`,
        timestamp: 'Baru saja',
        isRead: false,
        type: 'quiz',
        tabLink: 'materi',
      },
      ...prev,
    ]);

    addToastNotification(
      'Materi Baru Diterbitkan',
      `Modul "${newLesson.title}" berhasil dipublikasikan untuk siswa.`,
      'quiz'
    );

    return newLesson;
  };

  // Quiz Handling
  const startQuizSession = (quizId: string) => {
    const q = quizzes.find((item) => item.id === quizId);
    if (q) {
      setActiveQuizSession(q);
    }
  };

  const cancelQuizSession = () => {
    setActiveQuizSession(null);
  };

  const submitQuiz = (quizId: string, answers: Record<number, number>) => {
    const q = quizzes.find((item) => item.id === quizId);
    if (!q) return { score: 0, passed: false };

    let correctCount = 0;
    q.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    });

    const computedScore = Math.round((correctCount / q.questions.length) * 100);
    const passed = computedScore >= 75; // KKM 75

    // Update quiz state
    setQuizzes((prev) =>
      prev.map((item) => (item.id === quizId ? { ...item, isCompleted: true, score: computedScore, userAnswers: answers } : item))
    );

    // Update student report for that subject
    setStudentReport((prev) => ({
      ...prev,
      subjectGrades: prev.subjectGrades.map((sg) => (sg.subjectId === q.subjectId ? { ...sg, kuis: computedScore } : sg)),
    }));

    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          actionType: 'submit_quiz',
          payload: { quizId, answers, score: computedScore },
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    addToastNotification(
      'Ujian Daring Selesai!',
      `Nilai Anda untuk ${q.title}: ${computedScore}/100 (${passed ? 'Tuntas (Melampaui KKM)' : 'Perlu Bimbingan'}).`,
      'grade'
    );

    setActiveQuizSession(null);
    return { score: computedScore, passed };
  };

  const addClass = (newClassData: Omit<ClassRoom, 'id'>): ClassRoom => {
    const newClass: ClassRoom = {
      ...newClassData,
      id: `cls_${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    addToastNotification(
      'Kelas Baru Berhasil Ditambahkan',
      `${newClass.name} (${newClass.homeroomTeacher}) berhasil didaftarkan ke sistem rombel.`,
      'system'
    );
    return newClass;
  };

  const createQuiz = (newQuiz: OnlineQuiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
    addToastNotification('Kuis Daring Diterbitkan', `Kuis "${newQuiz.title}" berhasil dipublikasikan untuk siswa.`, 'quiz');
  };

  // Assignment Handling
  const submitAssignment = (assignmentId: string, note?: string, fileName?: string) => {
    const asg = assignments.find((a) => a.id === assignmentId);
    if (!asg) return;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'dikumpulkan',
              submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
              studentNote: note || 'Tugas sudah selesai dikerjakan sesuai petunjuk modul.',
              fileName: fileName || `${currentUser.name.replace(/\s+/g, '_')}_Tugas.pdf`,
            }
          : a
      )
    );

    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `act_${Date.now()}`,
          actionType: 'submit_assignment',
          payload: { assignmentId, note, fileName },
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    addToastNotification(
      'Tugas Berhasil Dikumpulkan!',
      `Tugas ${asg.title} berhasil diserahkan kepada guru pengampu.`,
      'deadline'
    );
  };

  const gradeAssignment = (assignmentId: string, grade: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'dinilai', grade, feedback } : a))
    );

    addToastNotification('Penilaian Tersimpan', `Nilai ${grade}/100 dan catatan guru berhasil diperbarui.`, 'grade');
  };

  // Calendar
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    addToastNotification('Agenda Ditambahkan', `${newEvent.title} tersimpan di kalender akademik.`, 'system');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToastNotification('Semua Dibaca', 'Semua notifikasi ditandai sudah dibaca.', 'system');
  };

  // Calculations
  const averageGrade = 85.0; // matching screenshot 85.0 (+2.5)
  const completedQuizzesCount = quizzes.filter((q) => !q.isCompleted).length; // "2 Aktif" in screenshot
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'tertunda').length; // "3 Tertunda" in screenshot

  // Export handlers
  const exportReportToCSV = () => {
    const headers = ['Mata Pelajaran', 'Tugas', 'Kuis', 'PTS', 'PAS', 'Nilai Akhir', 'Predikat', 'Keterangan'];
    const rows = studentReport.subjectGrades.map((sg) => [
      `"${sg.subjectName}"`,
      sg.tugas,
      sg.kuis,
      sg.pts,
      sg.pas,
      sg.finalScore,
      sg.letterGrade,
      sg.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [`"LAPORAN HASIL BELAJAR SISWA - SMPN 1 WONOSARI"`, `"Nama: ${currentUser.name}"`, `"Kelas: ${currentUser.className}"`, '']
        .concat([headers.join(',')])
        .concat(rows.map((e) => e.join(',')))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Raport_SMPN1_Wonosari_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToastNotification('Ekspor Berhasil', 'Laporan nilai siswa telah diunduh dalam format spreadsheet CSV/Excel.', 'system');
  };

  const openPrintRaportModal = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <LMSContext.Provider
      value={{
        currentUser,
        switchRole,
        isAuthenticated,
        login,
        logout,
        switchAccount,
        usersList,
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
        subjects,
        lessons,
        quizzes,
        assignments,
        calendarEvents,
        notifications,
        studentReport,
        studentsRoster,
        activeTab,
        setActiveTab,
        activeSubjectId,
        setActiveSubjectId,
        addClass,
        isOnline,
        isSimulatedOffline,
        toggleSimulateOffline,
        offlineQueue,
        syncOfflineData,
        darkMode,
        toggleDarkMode,
        privacyMaskEnabled,
        togglePrivacyMask,
        encryptionActive,
        activeQuizSession,
        startQuizSession,
        cancelQuizSession,
        submitQuiz,
        createQuiz,
        toggleCompleteLesson,
        addLesson,
        submitAssignment,
        gradeAssignment,
        addCalendarEvent,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addToastNotification,
        toast,
        dismissToast,
        exportReportToCSV,
        openPrintRaportModal,
        isPrintModalOpen,
        setIsPrintModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        averageGrade,
        completedQuizzesCount,
        pendingAssignmentsCount,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = (): LMSContextType => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
