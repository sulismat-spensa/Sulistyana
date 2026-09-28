export type UserRole = 'siswa' | 'guru' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  className: string;
  classId: string;
  nisn?: string;
  nip?: string;
  phone?: string;
  password?: string;
  status?: 'aktif' | 'nonaktif';
  lastLogin?: string;
  subjects?: string[];
}

export type UserAccount = User;

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  homeroomTeacher: string;
  studentCount: number;
  roomNumber: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  iconType: 'math' | 'science' | 'book' | 'globe' | 'code' | 'religion' | 'sports';
  teacherName: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  topics: string[];
  grade?: string; // 'Kelas 7' | 'Kelas 8' | 'Kelas 9' | 'Semua Tingkat'
  targetClasses?: string[]; // e.g. ['Kelas VII A', 'Kelas VII B', ...]
}

export interface LessonMaterial {
  id: string;
  subjectId: string;
  chapter: string;
  title: string;
  type: 'pdf' | 'video' | 'interactive';
  durationMinutes: number;
  downloadSize: string;
  description: string;
  content: string[];
  isCompleted: boolean;
  // Target Kelas / Tingkat:
  targetGrade?: string; // 'Kelas 7' | 'Kelas 8' | 'Kelas 9' | 'Semua Tingkat'
  targetClasses?: string[]; // ['Kelas VII A', 'Kelas VII B', ..., 'Kelas IX G']
  // Fasilitas unggah materi:
  pdfFileName?: string;
  pdfFileSize?: string;
  pdfFileUrl?: string;
  videoUrl?: string;
  videoTitle?: string;
  quizId?: string;
  quizTitle?: string;
  quizUrl?: string;
  // Google Drive Integration:
  googleDriveFileId?: string;
  googleDriveWebViewLink?: string;
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface OnlineQuiz {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  topic: string;
  description: string;
  durationMinutes: number;
  deadline: string;
  deadlineFormatted: string;
  isCompleted: boolean;
  score?: number;
  maxScore: number;
  questions: QuizQuestion[];
  userAnswers?: Record<number, number>;
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  deadline: string;
  deadlineFormatted: string;
  status: 'tertunda' | 'dikumpulkan' | 'dinilai';
  submittedAt?: string;
  grade?: number;
  maxGrade: number;
  feedback?: string;
  instruction: string;
  fileName?: string;
  studentNote?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'ujian' | 'tugas' | 'materi' | 'akademik';
  subject?: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'deadline' | 'quiz' | 'grade' | 'system';
  tabLink?: string;
}

export interface OfflineAction {
  id: string;
  actionType: 'submit_quiz' | 'complete_lesson' | 'submit_assignment' | 'mark_notification_read';
  payload: any;
  timestamp: string;
}

export interface StudentReport {
  id: string;
  studentId: string;
  name: string;
  nisn: string;
  className: string;
  rank: number;
  attendancePercent: number;
  subjectGrades: {
    subjectId: string;
    subjectName: string;
    tugas: number;
    kuis: number;
    pts: number;
    pas: number;
    finalScore: number;
    letterGrade: 'A' | 'B' | 'C' | 'D';
    predicate: string;
    status: 'Tuntas' | 'Remedial';
  }[];
}
