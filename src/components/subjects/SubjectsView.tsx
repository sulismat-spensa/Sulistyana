import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Subject, LessonMaterial } from '../../types/lms';
import { CreateLessonModal } from './CreateLessonModal';
import {
  BookOpen,
  FlaskConical,
  Languages,
  Code,
  Globe2,
  FileText,
  Video,
  CheckCircle2,
  Circle,
  Download,
  Clock,
  ArrowLeft,
  X,
  Sparkles,
  PlusCircle,
  ExternalLink,
  Play,
  GraduationCap,
  FileCheck2,
  HardDrive,
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    lessons,
    toggleCompleteLesson,
    activeSubjectId,
    setActiveSubjectId,
    currentUser,
    startQuizSession,
    addToastNotification,
  } = useLMS();

  const [selectedLesson, setSelectedLesson] = useState<LessonMaterial | null>(null);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [selectedGradeTab, setSelectedGradeTab] = useState<'all' | 'Kelas 7' | 'Kelas 8' | 'Kelas 9'>('all');

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const currentSubject = subjects.find((s) => s.id === activeSubjectId);
  const subjectLessons = currentSubject
    ? lessons.filter((l) => l.subjectId === currentSubject.id)
    : [];

  const displayedSubjects = subjects.filter((s) => {
    if (selectedGradeTab === 'all') return true;
    if (selectedGradeTab === 'Kelas 7') return s.grade === 'Kelas 7' || s.code.includes('-7');
    if (selectedGradeTab === 'Kelas 8') return s.grade === 'Kelas 8' || s.code.includes('-8');
    if (selectedGradeTab === 'Kelas 9') return s.grade === 'Kelas 9' || s.code.includes('-9');
    return true;
  });

  const getSubjectIcon = (iconType: Subject['iconType']) => {
    switch (iconType) {
      case 'math':
        return <BookOpen className="h-6 w-6" />;
      case 'science':
        return <FlaskConical className="h-6 w-6" />;
      case 'code':
        return <Code className="h-6 w-6" />;
      case 'globe':
        return <Globe2 className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const handleDownloadOffline = (lesson: LessonMaterial) => {
    addToastNotification(
      'Materi Diunduh',
      `Modul "${lesson.title}" (${lesson.downloadSize}) telah tersimpan untuk dipelajari offline tanpa internet.`,
      'system'
    );
  };

  return (
    <div className="space-y-6">
      {/* If looking at all subjects list */}
      {!currentSubject ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mata Pelajaran & Modul Pembelajaran
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kurikulum Merdeka Kelas 8B SMPN 1 Wonosari
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Total {subjects.length} Mata Pelajaran
              </span>
              <button
                onClick={() => setIsCreateLessonOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Tambah Materi Baru</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => setActiveSubjectId(subj.id)}
                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                    style={{ backgroundColor: subj.color }}
                  >
                    {getSubjectIcon(subj.iconType)}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {subj.code}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {subj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Guru: {subj.teacherName}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Progres Belajar</span>
                    <span className="font-bold text-slate-900 tabular-nums dark:text-white">
                      {subj.progressPercent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subj.progressPercent}%`, backgroundColor: subj.color }}
                    />
                  </div>
                </div>

                {/* Chapter highlights */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {subj.topics.slice(0, 2).map((tp, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300"
                    >
                      {tp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Subject View */
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSubjectId(null)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Semua Mapel</span>
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {currentSubject.name} ({currentSubject.code})
            </h2>
          </div>

          {/* Subject Banner Overview */}
          <div
            className="rounded-3xl p-6 text-white shadow-md"
            style={{ backgroundColor: currentSubject.color }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  Modul Pembelajaran Mandiri
                </span>
                <h3 className="mt-2 text-2xl font-black">{currentSubject.name}</h3>
                <p className="mt-1 text-xs text-white/90 sm:text-sm">
                  Pengampu: {currentSubject.teacherName}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-xs">
                <p className="text-xs font-semibold text-white/80">Progres Selesai</p>
                <p className="text-3xl font-black tabular-nums">
                  {currentSubject.completedLessons} / {currentSubject.totalLessons}
                </p>
                <p className="text-xs font-bold">{currentSubject.progressPercent}% Tercapai</p>
              </div>
            </div>
          </div>

          {/* List of lessons / Bab */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar Modul & Materi Ajar
              </h3>
              <button
                onClick={() => setIsCreateLessonOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Tambah Materi ({currentSubject.name})</span>
              </button>
            </div>

            {subjectLessons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                Belum ada materi tambahan yang diunggah untuk modul ini. Silakan cek kembali nanti.
              </div>
            ) : (
              subjectLessons.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                    item.isCompleted
                      ? 'border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleCompleteLesson(item.id)}
                      title={item.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai dipelajari'}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {item.chapter}
                      </span>
                      <h4
                        onClick={() => setSelectedLesson(item)}
                        className="cursor-pointer text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {item.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{item.durationMinutes} menit baca</span>
                        </span>
                        <span>•</span>
                        <span className="uppercase">{item.type}</span>
                        <span>•</span>
                        <span>Ukuran: {item.downloadSize}</span>
                        {item.googleDriveWebViewLink && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <HardDrive className="h-3 w-3" />
                              <span>Google Drive</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleDownloadOffline(item)}
                      title="Unduh untuk dipelajari saat offline"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh Offline</span>
                    </button>
                    <button
                      onClick={() => setSelectedLesson(item)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      Baca Materi
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lesson Reader Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-full max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {selectedLesson.chapter}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              <div className="rounded-2xl bg-blue-50/70 p-4 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                <p className="font-bold">Deskripsi Ringkasan Pembelajaran:</p>
                <p className="mt-1 leading-relaxed">{selectedLesson.description}</p>
              </div>

              {/* Fasilitas Tersimpan di Google Drive */}
              {selectedLesson.googleDriveWebViewLink && (
                <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs dark:border-emerald-900/50 dark:bg-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                        <HardDrive className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 uppercase">
                            Tersimpan di Google Drive
                          </span>
                        </div>
                        <h4 className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                          Folder: {selectedLesson.googleDriveFolderName || 'SMPN 1 Wonosari - Modul Pembelajaran'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Berkas modul tersimpan di cloud Drive dan dapat diakses atau dibagikan
                        </p>
                      </div>
                    </div>

                    <a
                      href={selectedLesson.googleDriveWebViewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all self-start sm:self-auto"
                    >
                      <HardDrive className="h-3.5 w-3.5" />
                      <span>Buka di Google Drive</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* 1. Fasilitas Modul PDF Terlampir */}
              {(selectedLesson.pdfFileName || selectedLesson.type === 'pdf') && (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-xs dark:border-blue-900/50 dark:bg-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200 uppercase">
                            Modul Dokumen PDF
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {selectedLesson.pdfFileSize || selectedLesson.downloadSize}
                          </span>
                        </div>
                        <h4 className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                          {selectedLesson.pdfFileName || `${selectedLesson.title.replace(/\s+/g, '_')}_Modul.pdf`}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadOffline(selectedLesson)}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Unduh PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Fasilitas Video Pembelajaran */}
              {selectedLesson.videoUrl && (
                <div className="rounded-2xl border border-indigo-200 bg-white p-4 shadow-xs dark:border-indigo-900/50 dark:bg-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <Video className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {selectedLesson.videoTitle || 'Video Pembelajaran Interaktif'}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Tonton penjelasan konsep untuk memperdalam pemahaman materi
                        </p>
                      </div>
                    </div>

                    <a
                      href={selectedLesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      <span>Buka di Tab Baru</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* YouTube Embed or Video Player fallback */}
                  {getYouTubeEmbedUrl(selectedLesson.videoUrl) ? (
                    <div className="overflow-hidden rounded-xl bg-black aspect-video w-full">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedLesson.videoUrl)!}
                        title={selectedLesson.videoTitle || 'Video Pembelajaran'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-indigo-50/70 p-3.5 dark:bg-indigo-950/40">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Play className="h-4 w-4 fill-white" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-sm">
                          {selectedLesson.videoUrl}
                        </span>
                      </div>
                      <a
                        href={selectedLesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                      >
                        Tonton Video ➔
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Fasilitas Kuis / Asesmen Terkait */}
              {(selectedLesson.quizId || selectedLesson.quizUrl) && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="rounded-md bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 uppercase">
                          Kuis / Asesmen Terkait
                        </span>
                        <h4 className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                          {selectedLesson.quizTitle || 'Uji Pemahaman Mandiri Bab Ini'}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Evaluasi pemahaman Anda setelah membaca modul pembelajaran
                        </p>
                      </div>
                    </div>

                    <div>
                      {selectedLesson.quizId ? (
                        <button
                          onClick={() => {
                            const qId = selectedLesson.quizId!;
                            setSelectedLesson(null);
                            startQuizSession(qId);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                        >
                          <FileCheck2 className="h-4 w-4" />
                          <span>Mulai Kuis CBT Sekarang ➔</span>
                        </button>
                      ) : (
                        <a
                          href={selectedLesson.quizUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                        >
                          <span>Buka Asesmen / Google Form</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Uraian Poin Pembelajaran */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Uraian Isi Konsep Pembelajaran:
                </h4>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                  {selectedLesson.content.map((paragraph, pIdx) => (
                    <div
                      key={pIdx}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <p>{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs text-slate-500">
                Status:{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedLesson.isCompleted ? '✓ Telah Dipelajari' : 'Belum Selesai'}
                </span>
              </span>

              <button
                onClick={() => {
                  toggleCompleteLesson(selectedLesson.id);
                  setSelectedLesson((prev) =>
                    prev ? { ...prev, isCompleted: !prev.isCompleted } : null
                  );
                }}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all ${
                  selectedLesson.isCompleted
                    ? 'bg-slate-600 hover:bg-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
                }`}
              >
                {selectedLesson.isCompleted
                  ? 'Tandai Belum Selesai'
                  : 'Tandai Selesai Dipelajari (Perbarui Progres)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Materi Baru */}
      <CreateLessonModal
        isOpen={isCreateLessonOpen}
        onClose={() => setIsCreateLessonOpen(false)}
        defaultSubjectId={activeSubjectId}
      />
    </div>
  );
};
