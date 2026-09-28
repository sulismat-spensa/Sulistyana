import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  BookOpen,
  FileText,
  Video,
  FileUp,
  Link2,
  CheckCircle2,
  UploadCloud,
  Plus,
  Trash2,
  HelpCircle,
  ExternalLink,
  GraduationCap,
  Play,
  FolderSync,
  FolderCheck,
  HardDrive,
  Loader2,
  CheckSquare,
  Square,
  Layers,
  Check,
} from 'lucide-react';
import { LessonMaterial } from '../../types/lms';
import {
  initAuth,
  googleSignIn,
  uploadLessonToDriveHierarchy,
  auth,
} from '../../services/googleDriveService';
import { User } from 'firebase/auth';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string | null;
  onLessonCreated?: (lessonId: string) => void;
}

// 21 Rombongan Belajar SMPN 1 Wonosari (Kelas VII A s/d IX G)
const CLASSES_VII = [
  'Kelas VII A',
  'Kelas VII B',
  'Kelas VII C',
  'Kelas VII D',
  'Kelas VII E',
  'Kelas VII F',
  'Kelas VII G',
];
const CLASSES_VIII = [
  'Kelas VIII A',
  'Kelas VIII B',
  'Kelas VIII C',
  'Kelas VIII D',
  'Kelas VIII E',
  'Kelas VIII F',
  'Kelas VIII G',
];
const CLASSES_IX = [
  'Kelas IX A',
  'Kelas IX B',
  'Kelas IX C',
  'Kelas IX D',
  'Kelas IX E',
  'Kelas IX F',
  'Kelas IX G',
];
const ALL_21_CLASSES = [...CLASSES_VII, ...CLASSES_VIII, ...CLASSES_IX];

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId,
  onLessonCreated,
}) => {
  const { subjects, quizzes, addLesson, currentUser, addToastNotification, classes } = useLMS();

  // Basic Information
  const [gradeFilter, setGradeFilter] = useState<'all' | 'Kelas 7' | 'Kelas 8' | 'Kelas 9'>('all');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Kelas VIII B']);
  const [subjectId, setSubjectId] = useState<string>(
    defaultSubjectId || subjects[0]?.id || 'sbj_math'
  );
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'video' | 'interactive'>('pdf');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [description, setDescription] = useState('');
  const [contentParagraphs, setContentParagraphs] = useState<string[]>([
    'Buku teks ini memuat konsep esensial dan penjelasan langkah demi langkah yang terstruktur.',
    'Siswa diharapkan mempelajari contoh soal dan menyelesaikan latihan mandiri yang tersedia.',
  ]);

  // 1. Fasilitas Upload Modul PDF
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [pdfFileUrl, setPdfFileUrl] = useState('');
  const [uploadedFileBlob, setUploadedFileBlob] = useState<File | null>(null);

  // 2. Fasilitas Link Video Pembelajaran
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // 3. Fasilitas Link Kuis / Asesmen
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizLinkType, setQuizLinkType] = useState<'internal' | 'external'>('internal');
  const [selectedInternalQuizId, setSelectedInternalQuizId] = useState('');
  const [externalQuizTitle, setExternalQuizTitle] = useState('');
  const [externalQuizUrl, setExternalQuizUrl] = useState('');

  // 4. Fasilitas Simpan ke Folder Google Drive
  const [saveToGoogleDrive, setSaveToGoogleDrive] = useState(true);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [isDriveConnecting, setIsDriveConnecting] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [isCustomFolder, setIsCustomFolder] = useState(false);
  const [customRootFolder, setCustomRootFolder] = useState('SMPN 1 Wonosari - Modul Pembelajaran');
  const [customSubFolder, setCustomSubFolder] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setDriveAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setDriveAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Selected subject object
  const currentSubjectObj = subjects.find((s) => s.id === subjectId) || subjects[0];
  const availableSubjectQuizzes = quizzes.filter((q) => q.subjectId === subjectId);

  const handleConnectGoogleDrive = async () => {
    setIsDriveConnecting(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setDriveAccessToken(res.accessToken);
        addToastNotification(
          'Google Drive Terhubung',
          `Akun ${res.user.email} berhasil diotorisasi untuk menyimpan modul ke folder Drive.`,
          'system'
        );
      }
    } catch (err: any) {
      console.error(err);
      addToastNotification(
        'Gagal Menghubungkan Google Drive',
        err.message || 'Silakan coba lagi.',
        'system'
      );
    } finally {
      setIsDriveConnecting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileBlob(file);
      setPdfFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setPdfFileSize(`${sizeInMB} MB`);
      const objectUrl = URL.createObjectURL(file);
      setPdfFileUrl(objectUrl);
    }
  };

  const handleRemovePdf = () => {
    setUploadedFileBlob(null);
    setPdfFileName('');
    setPdfFileSize('');
    setPdfFileUrl('');
  };

  const handleAddParagraph = () => {
    setContentParagraphs((prev) => [...prev, '']);
  };

  const handleRemoveParagraph = (index: number) => {
    if (contentParagraphs.length <= 1) return;
    setContentParagraphs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleParagraphChange = (index: number, text: string) => {
    setContentParagraphs((prev) =>
      prev.map((p, idx) => (idx === index ? text : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim() || !description.trim()) return;

    const filteredContent = contentParagraphs
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Resolve quiz linkage
    let linkedQuizId: string | undefined = undefined;
    let linkedQuizTitle: string | undefined = undefined;
    let linkedQuizUrl: string | undefined = undefined;

    if (hasQuiz) {
      if (quizLinkType === 'internal') {
        const found =
          quizzes.find((q) => q.id === selectedInternalQuizId) || availableSubjectQuizzes[0];
        if (found) {
          linkedQuizId = found.id;
          linkedQuizTitle = found.title;
        }
      } else {
        linkedQuizTitle = externalQuizTitle || 'Asesmen Formatif Online';
        linkedQuizUrl = externalQuizUrl || 'https://forms.google.com';
      }
    }

    // Process Google Drive Upload if selected and token is ready
    let driveResult: {
      fileId: string;
      fileName: string;
      folderId: string;
      folderName: string;
      webViewLink: string;
    } | null = null;

    if (saveToGoogleDrive && driveAccessToken) {
      setIsUploadingToDrive(true);
      try {
        let fileDataToUpload: Blob;
        let finalFileName = '';

        if (uploadedFileBlob) {
          fileDataToUpload = uploadedFileBlob;
          finalFileName = uploadedFileBlob.name;
        } else {
          // If no PDF file was uploaded, create a Markdown/Text document containing the module syllabus
          const docContent = [
            `# ${title}`,
            `Mata Pelajaran: ${currentSubjectObj?.name || 'Mata Pelajaran'} (${currentSubjectObj?.code})`,
            `Bab: ${chapter}`,
            `Waktu Belajar: ${durationMinutes} Menit`,
            `Guru Pengampu: ${currentUser.name}`,
            '',
            '## Deskripsi Capaian Pembelajaran',
            description,
            '',
            '## Uraian Materi Pembelajaran',
            ...filteredContent.map((c, i) => `${i + 1}. ${c}`),
            '',
            hasVideo && videoUrl ? `## Video Pembelajaran: ${videoTitle || videoUrl}` : '',
            hasQuiz ? `## Asesmen / Kuis Terkait: ${linkedQuizTitle || 'Kuis Pembelajaran'}` : '',
          ].join('\n\n');

          fileDataToUpload = new Blob([docContent], { type: 'text/markdown;charset=utf-8' });
          finalFileName = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}_Modul.md`;
        }

        const targetRootName = isCustomFolder && customRootFolder.trim()
          ? customRootFolder.trim()
          : 'SMPN 1 Wonosari - Modul Pembelajaran';
        const targetSubName = isCustomFolder && customSubFolder.trim()
          ? customSubFolder.trim()
          : currentSubjectObj?.name || 'Mata Pelajaran';

        driveResult = await uploadLessonToDriveHierarchy(
          fileDataToUpload,
          finalFileName,
          targetSubName,
          uploadedFileBlob ? uploadedFileBlob.type : 'text/plain',
          driveAccessToken,
          targetRootName,
          targetSubName
        );

        addToastNotification(
          'Tersimpan di Google Drive!',
          `Berkas berhasil diunggah ke folder: "${driveResult.folderName}"`,
          'system'
        );
      } catch (driveErr: any) {
        console.error('Google Drive upload error:', driveErr);
        addToastNotification(
          'Unggah Drive Tertunda',
          `Materi tetap disimpan di LMS. ${driveErr.message || 'Gagal menyimpan ke Google Drive.'}`,
          'system'
        );
      } finally {
        setIsUploadingToDrive(false);
      }
    }

    const created = addLesson({
      subjectId,
      chapter: chapter.trim(),
      title: title.trim(),
      type: hasVideo && type !== 'pdf' ? 'video' : type,
      durationMinutes: Number(durationMinutes) || 20,
      downloadSize: pdfFileSize || '2.4 MB',
      description: description.trim(),
      content:
        filteredContent.length > 0
          ? filteredContent
          : [
              'Modul ini memuat ringkasan konsep esensial, contoh soal kontekstual, dan panduan belajar mandiri siswa.',
              'Peserta didik diharapkan mencatat poin penting dan menyelesaikan latihan mandiri yang disediakan di akhir bab.',
            ],
      isCompleted: false,
      // Target Kelas / Rombel (VII A s/d IX G):
      targetGrade:
        gradeFilter === 'all'
          ? (currentSubjectObj?.grade || 'Semua Tingkat')
          : gradeFilter,
      targetClasses: selectedClasses.length > 0 ? selectedClasses : ['Semua Kelas (VII A - IX G)'],
      // 1. PDF Module
      pdfFileName:
        pdfFileName || (type === 'pdf' ? `${title.replace(/\s+/g, '_')}_Modul.pdf` : undefined),
      pdfFileSize: pdfFileSize || (type === 'pdf' ? '2.4 MB' : undefined),
      pdfFileUrl: pdfFileUrl || undefined,
      // 2. Video Link
      videoUrl: hasVideo && videoUrl.trim() ? videoUrl.trim() : undefined,
      videoTitle:
        hasVideo && videoTitle.trim()
          ? videoTitle.trim()
          : hasVideo
          ? 'Video Penjelasan Modul'
          : undefined,
      // 3. Quiz / Assessment Link
      quizId: linkedQuizId,
      quizTitle: linkedQuizTitle,
      quizUrl: linkedQuizUrl,
      // 4. Google Drive Folder & File Integration
      googleDriveFileId: driveResult?.fileId,
      googleDriveWebViewLink: driveResult?.webViewLink,
      googleDriveFolderId: driveResult?.folderId,
      googleDriveFolderName: driveResult?.folderName,
    });

    if (onLessonCreated) {
      onLessonCreated(created.id);
    }

    onClose();
    // Reset form
    setTitle('');
    setChapter('');
    setDescription('');
    setUploadedFileBlob(null);
    setPdfFileName('');
    setVideoUrl('');
    setVideoTitle('');
    setHasVideo(false);
    setHasQuiz(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unggah Materi & Modul Pembelajaran
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lengkap dengan integrasi folder Google Drive, modul PDF, video, dan kuis
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section A: Identitas Modul */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 dark:border-slate-800">
              A. Identitas Mata Pelajaran & Modul
            </h4>

            {/* 1. Filter Tingkat & Pilihan Mata Pelajaran */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span>Pilih Jenjang / Tingkat Kelas Pengampu:</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  {(['all', 'Kelas 7', 'Kelas 8', 'Kelas 9'] as const).map((grd) => (
                    <button
                      key={grd}
                      type="button"
                      onClick={() => {
                        setGradeFilter(grd);
                        if (grd === 'Kelas 7') {
                          setSelectedClasses(CLASSES_VII);
                          const first7 = subjects.find(s => s.grade === 'Kelas 7' || s.code.includes('-7'));
                          if (first7) setSubjectId(first7.id);
                        } else if (grd === 'Kelas 8') {
                          setSelectedClasses(CLASSES_VIII);
                          const first8 = subjects.find(s => s.grade === 'Kelas 8' || s.code.includes('-8'));
                          if (first8) setSubjectId(first8.id);
                        } else if (grd === 'Kelas 9') {
                          setSelectedClasses(CLASSES_IX);
                          const first9 = subjects.find(s => s.grade === 'Kelas 9' || s.code.includes('-9'));
                          if (first9) setSubjectId(first9.id);
                        }
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        gradeFilter === grd
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {grd === 'all' ? 'Semua Tingkat' : grd === 'Kelas 7' ? 'Kelas VII (7)' : grd === 'Kelas 8' ? 'Kelas VIII (8)' : 'Kelas IX (9)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject selector with optgroups */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <optgroup label="📘 KELAS VII (Tingkat 7)">
                      {subjects.filter(s => s.grade === 'Kelas 7' || s.code.includes('-7')).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </optgroup>
                    <optgroup label="📗 KELAS VIII (Tingkat 8)">
                      {subjects.filter(s => s.grade === 'Kelas 8' || s.code.includes('-8')).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </optgroup>
                    <optgroup label="📙 KELAS IX (Tingkat 9)">
                      {subjects.filter(s => s.grade === 'Kelas 9' || s.code.includes('-9')).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </optgroup>
                    {subjects.filter(s => !s.code.includes('-7') && !s.code.includes('-8') && !s.code.includes('-9')).length > 0 && (
                      <optgroup label="📂 Mata Pelajaran Lainnya">
                        {subjects.filter(s => !s.code.includes('-7') && !s.code.includes('-8') && !s.code.includes('-9')).map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bab / Pokok Bahasan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Contoh: Bab 4: Teorema Pythagoras / Aljabar"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pilihan Sasaran Rombongan Belajar (Rombel VII A sd IX G) */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/50 dark:bg-slate-800/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-blue-100 pb-2.5 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Sasaran Kelas / Rombel Pembelajaran (VII A s/d IX G)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tentukan kelas mana saja yang dapat mengakses materi modul ini
                    </p>
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const all7Selected = CLASSES_VII.every(c => selectedClasses.includes(c));
                      if (all7Selected) {
                        setSelectedClasses(prev => prev.filter(c => !CLASSES_VII.includes(c)));
                      } else {
                        setSelectedClasses(prev => Array.from(new Set([...prev, ...CLASSES_VII])));
                      }
                    }}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      CLASSES_VII.every(c => selectedClasses.includes(c))
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-300'
                    }`}
                  >
                    Semua VII (A-G)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const all8Selected = CLASSES_VIII.every(c => selectedClasses.includes(c));
                      if (all8Selected) {
                        setSelectedClasses(prev => prev.filter(c => !CLASSES_VIII.includes(c)));
                      } else {
                        setSelectedClasses(prev => Array.from(new Set([...prev, ...CLASSES_VIII])));
                      }
                    }}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      CLASSES_VIII.every(c => selectedClasses.includes(c))
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-300'
                    }`}
                  >
                    Semua VIII (A-G)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const all9Selected = CLASSES_IX.every(c => selectedClasses.includes(c));
                      if (all9Selected) {
                        setSelectedClasses(prev => prev.filter(c => !CLASSES_IX.includes(c)));
                      } else {
                        setSelectedClasses(prev => Array.from(new Set([...prev, ...CLASSES_IX])));
                      }
                    }}
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      CLASSES_IX.every(c => selectedClasses.includes(c))
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-300'
                    }`}
                  >
                    Semua IX (A-G)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedClasses.length === ALL_21_CLASSES.length) {
                        setSelectedClasses([]);
                      } else {
                        setSelectedClasses([...ALL_21_CLASSES]);
                      }
                    }}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
                  >
                    {selectedClasses.length === ALL_21_CLASSES.length ? 'Batal Semua' : 'Semua 21 Kelas'}
                  </button>
                </div>
              </div>

              {/* Class Checkbox Grid by Grade */}
              <div className="space-y-2.5">
                {/* Tingkat VII */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tingkat Kelas VII:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {CLASSES_VII.map((cls) => {
                      const isChecked = selectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSelectedClasses(prev =>
                              isChecked ? prev.filter(c => c !== cls) : [...prev, cls]
                            );
                          }}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                            isChecked
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          <span>{cls.replace('Kelas ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tingkat VIII */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tingkat Kelas VIII:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {CLASSES_VIII.map((cls) => {
                      const isChecked = selectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSelectedClasses(prev =>
                              isChecked ? prev.filter(c => c !== cls) : [...prev, cls]
                            );
                          }}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                            isChecked
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          <span>{cls.replace('Kelas ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tingkat IX */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tingkat Kelas IX:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {CLASSES_IX.map((cls) => {
                      const isChecked = selectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSelectedClasses(prev =>
                              isChecked ? prev.filter(c => c !== cls) : [...prev, cls]
                            );
                          }}
                          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                            isChecked
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          <span>{cls.replace('Kelas ', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-2 border-t border-blue-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">
                  Target Akses Siswa:
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {selectedClasses.length === 0
                    ? '⚠️ Belum ada kelas dipilih (Silakan pilih minimal 1 kelas)'
                    : selectedClasses.length === ALL_21_CLASSES.length
                    ? '✨ Seluruh Siswa SMPN 1 Wonosari (21 Kelas: VII A s/d IX G)'
                    : `✅ Terpilih ${selectedClasses.length} Kelas (${selectedClasses.map(c => c.replace('Kelas ', '')).join(', ')})`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Judul Materi Pembelajaran <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pembuktian Rumus Segitiga Siku-siku & Tripel Pythagoras"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Estimasi Durasi Belajar (Menit)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Format Utama Modul
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="pdf">Modul Dokumen PDF / E-Book</option>
                  <option value="video">Modul Berbasis Video</option>
                  <option value="interactive">Modul Interaktif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Deskripsi Ringkasan Materi <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan tujuan capaian pembelajaran atau instruksi belajar mandiri..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Section: FASILITAS PENYIMPANAN KE FOLDER GOOGLE DRIVE */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-700/60 dark:bg-emerald-950/20 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Penyimpanan Otomatis ke Folder Google Drive
                    </h4>
                    <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      Google Workspace
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Modul akan tersimpan rapi ke folder Google Drive akun Anda
                  </p>
                </div>
              </div>

              {googleUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 dark:border-emerald-800 dark:bg-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {googleUser.email || googleUser.displayName}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogleDrive}
                  disabled={isDriveConnecting}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {isDriveConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.16z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.13C3.25 21.46 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.32 14.29c-.24-.73-.38-1.5-.38-2.29s.14-1.56.38-2.29V6.57H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.43l4.11-3.14z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.54 1.21 6.57l4.11 3.14c.94-2.82 3.58-4.96 6.68-4.96z"
                      />
                    </svg>
                  )}
                  <span>Hubungkan Google Drive</span>
                </button>
              )}
            </div>

            {/* Folder Destination Preview & Customization */}
            <div className="rounded-xl border border-emerald-200 bg-white/95 p-3.5 text-xs dark:border-emerald-800/80 dark:bg-slate-900/90 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <FolderSync className="h-4 w-4 text-emerald-600" />
                  <span>Struktur Folder di Google Drive Anda:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {isCustomFolder ? '⚙️ Nama Folder Kustom' : '⚡ 100% Otomatis dari Aplikasi'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomFolder(!isCustomFolder)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline dark:text-emerald-400"
                  >
                    {isCustomFolder ? 'Pakai Nama Otomatis Saja' : '✏️ Mau Buat Nama Folder Sendiri?'}
                  </button>
                </div>
              </div>

              {/* Live Preview Path */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 px-3 py-2 rounded-xl dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 break-all">
                <span>
                  📁 {isCustomFolder && customRootFolder.trim() ? customRootFolder.trim() : 'SMPN 1 Wonosari - Modul Pembelajaran'} / 📁 {isCustomFolder && customSubFolder.trim() ? customSubFolder.trim() : (currentSubjectObj?.name || 'Mata Pelajaran')} / 📄 {pdfFileName || (title ? `${title.replace(/[\/\\?%*:|"<>]/g, '_')}_Modul` : 'Modul_Ajar')}
                </span>
              </div>

              {/* Custom Folder Input Fields (Shown only if user wants to customize) */}
              {isCustomFolder && (
                <div className="mt-2.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    💡 Anda bebas menentukan nama foldernya sendiri jika tidak ingin menggunakan nama bawaan sistem:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Nama Folder Utama
                      </label>
                      <input
                        type="text"
                        value={customRootFolder}
                        onChange={(e) => setCustomRootFolder(e.target.value)}
                        placeholder="SMPN 1 Wonosari - Modul Pembelajaran"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Nama Sub-Folder (Kategori / Mapel)
                      </label>
                      <input
                        type="text"
                        value={customSubFolder}
                        onChange={(e) => setCustomSubFolder(e.target.value)}
                        placeholder={currentSubjectObj?.name || 'Contoh: Matematika Kelas 8'}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToGoogleDrive}
                  onChange={(e) => setSaveToGoogleDrive(e.target.checked)}
                  className="h-4 w-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aktifkan penyimpanan otomatis ke folder Google Drive saat modul diterbitkan
                </span>
              </label>
            </div>
          </div>

          {/* Section 1: FASILITAS UPLOAD MODUL JENIS PDF */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    1. Upload Modul Jenis PDF
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unggah berkas e-book / modul ajar PDF untuk diunduh & dibaca siswa
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                Fasilitas PDF
              </span>
            </div>

            {pdfFileName ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-white p-3 dark:border-emerald-800 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {pdfFileName}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Ukuran: {pdfFileSize} • Berkas PDF Terverifikasi
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-white p-5 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all dark:border-slate-700 dark:bg-slate-800/80">
                <UploadCloud className="h-8 w-8 text-blue-500 mb-1.5" />
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Pilih atau Tarik Berkas PDF Modul di Sini
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Format didukung: .pdf (Maksimal 25 MB)
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Section 2: FASILITAS UPLOAD LINK VIDEO */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    2. Upload Link Video Pembelajaran
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sematkan tautan YouTube, Google Drive, atau Rumah Belajar Kemdikbud
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVideo}
                  onChange={(e) => setHasVideo(e.target.checked)}
                  className="h-4 w-4 rounded-sm text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aktifkan Video
                </span>
              </label>
            </div>

            {hasVideo && (
              <div className="mt-3 space-y-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    URL / Link Video Pembelajaran
                  </label>
                  <div className="mt-1 flex rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <span className="flex items-center px-3 text-slate-400 text-xs">
                      <Link2 className="h-4 w-4" />
                    </span>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... atau link streaming video"
                      className="w-full py-2 pr-3 text-xs text-slate-900 focus:outline-hidden dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Judul Video / Catatan Panduan
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Contoh: Animasi Eksperimen Fotosintesis dan Reaksi Terang Gelap"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: FASILITAS UPLOAD LINK KUIS / ASESMEN */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-4 dark:border-purple-900/60 dark:bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    3. Upload Link Kuis / Asesmen Pembelajaran
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tautkan kuis uji pemahaman setelah siswa membaca materi modul ini
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasQuiz}
                  onChange={(e) => setHasQuiz(e.target.checked)}
                  className="h-4 w-4 rounded-sm text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tautkan Kuis
                </span>
              </label>
            </div>

            {hasQuiz && (
              <div className="mt-3 space-y-3 pt-2 border-t border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quizLinkType"
                      checked={quizLinkType === 'internal'}
                      onChange={() => setQuizLinkType('internal')}
                      className="text-purple-600"
                    />
                    <span>Kuis CBT Internal LMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quizLinkType"
                      checked={quizLinkType === 'external'}
                      onChange={() => setQuizLinkType('external')}
                      className="text-purple-600"
                    />
                    <span>Link Asesmen Luar (Google Form / Quizizz / AKM)</span>
                  </label>
                </div>

                {quizLinkType === 'internal' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilih Kuis CBT yang Tersedia untuk Mapel Ini
                    </label>
                    <select
                      value={selectedInternalQuizId}
                      onChange={(e) => setSelectedInternalQuizId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {availableSubjectQuizzes.length > 0 ? (
                        availableSubjectQuizzes.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.title} ({q.questions.length} Butir Soal • {q.durationMinutes} Menit)
                          </option>
                        ))
                      ) : (
                        <option value="">-- Belum ada kuis khusus, pilih kuis umum --</option>
                      )}
                      {quizzes.map((q) => (
                        <option key={`all_${q.id}`} value={q.id}>
                          {q.subjectName}: {q.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nama Asesmen / Kuis Eksternal
                      </label>
                      <input
                        type="text"
                        value={externalQuizTitle}
                        onChange={(e) => setExternalQuizTitle(e.target.value)}
                        placeholder="Contoh: Asesmen Diagnostik Bab 4 - Google Form"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        URL / Link Asesmen
                      </label>
                      <input
                        type="url"
                        value={externalQuizUrl}
                        onChange={(e) => setExternalQuizUrl(e.target.value)}
                        placeholder="https://forms.gle/... atau https://quizizz.com/..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section B: Poin-poin Pembelajaran (Paragraf Bacaan) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  B. Ringkasan Uraian Pembelajaran ({contentParagraphs.length})
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Teks bacaan materi yang akan tampil pada lembar belajar siswa
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Paragraf</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {contentParagraphs.map((para, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2">
                  <span className="mt-2 text-xs font-bold text-slate-400 shrink-0">
                    #{pIdx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => handleParagraphChange(pIdx, e.target.value)}
                    placeholder={`Tuliskan uraian materi bagian ${pIdx + 1}...`}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {contentParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(pIdx)}
                      className="mt-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploadingToDrive}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploadingToDrive}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploadingToDrive && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isUploadingToDrive ? 'Mengunggah ke Drive & Menyimpan...' : 'Terbitkan Materi Lengkap'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
