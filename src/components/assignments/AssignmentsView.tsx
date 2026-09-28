import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Assignment } from '../../types/lms';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileCheck,
  FileText,
  X,
  MessageSquare,
  Award,
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    currentUser,
    submitAssignment,
    gradeAssignment,
    addToastNotification,
  } = useLMS();

  const [activeFilter, setActiveFilter] = useState<'semua' | 'tertunda' | 'dikumpulkan' | 'dinilai'>('semua');
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState<Assignment | null>(null);
  const [selectedAssignmentForGrade, setSelectedAssignmentForGrade] = useState<Assignment | null>(null);

  // Submit modal form state
  const [noteInput, setNoteInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');

  // Grade modal form state
  const [scoreInput, setScoreInput] = useState(85);
  const [feedbackInput, setFeedbackInput] = useState('');

  const filteredAssignments = assignments.filter((a) => {
    if (activeFilter === 'semua') return true;
    return a.status === activeFilter;
  });

  const handleOpenSubmitModal = (asg: Assignment) => {
    setSelectedAssignmentForSubmit(asg);
    setFileNameInput(`${currentUser.name.replace(/\s+/g, '_')}_${asg.subjectName}_Tugas.pdf`);
    setNoteInput('');
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForSubmit) return;

    submitAssignment(selectedAssignmentForSubmit.id, noteInput, fileNameInput);
    setSelectedAssignmentForSubmit(null);
  };

  const handleOpenGradeModal = (asg: Assignment) => {
    setSelectedAssignmentForGrade(asg);
    setScoreInput(asg.grade || 85);
    setFeedbackInput(asg.feedback || 'Pengerjaan tugas baik dan sistematis.');
  };

  const handleConfirmGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForGrade) return;

    gradeAssignment(selectedAssignmentForGrade.id, scoreInput, feedbackInput);
    setSelectedAssignmentForGrade(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tugas & Lembar Kerja Siswa (LKS)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penugasan akademik terstruktur dengan notifikasi tenggat waktu
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['semua', 'tertunda', 'dikumpulkan', 'dinilai'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveFilter(filterKey)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                activeFilter === filterKey
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredAssignments.map((asg) => {
          const isPending = asg.status === 'tertunda';
          const isSubmitted = asg.status === 'dikumpulkan';
          const isGraded = asg.status === 'dinilai';

          return (
            <div
              key={asg.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {asg.subjectName}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold shrink-0 ${
                      isPending
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : isSubmitted
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {asg.status.toUpperCase()}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.instruction}
                </p>

                {/* Deadline Info */}
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Tenggat: {asg.deadlineFormatted}</span>
                </div>

                {/* If graded, show grade & teacher feedback */}
                {isGraded && asg.grade !== undefined && (
                  <div className="mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Nilai Resmi Tugas
                      </span>
                      <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {asg.grade} <span className="text-xs font-normal">/ 100</span>
                      </span>
                    </div>
                    {asg.feedback && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 italic">
                        💬 Catatan Guru: "{asg.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-end gap-2">
                {currentUser.role === 'siswa' ? (
                  isPending ? (
                    <button
                      onClick={() => handleOpenSubmitModal(asg)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>Kumpulkan Tugas</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Sudah Dikumpulkan</span>
                    </span>
                  )
                ) : (
                  /* Teacher Actions */
                  <button
                    onClick={() => handleOpenGradeModal(asg)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                  >
                    <Award className="h-4 w-4" />
                    <span>{isGraded ? 'Edit Nilai' : 'Beri Nilai Siswa'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Submit Modal */}
      {selectedAssignmentForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pengumpulan Tugas: {selectedAssignmentForSubmit.title}
              </h3>
              <button
                onClick={() => setSelectedAssignmentForSubmit(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nama Dokumen Tugas (PDF / Word)
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-dashed border-blue-400 bg-blue-50/50 p-4 dark:bg-blue-950/20">
                  <UploadCloud className="h-8 w-8 text-blue-600 mr-3 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800 dark:text-white">{fileNameInput}</p>
                    <p className="text-slate-500">Ukuran: 1.4 MB • Status Siap Diunggah</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan untuk Guru (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ketik catatan pengerjaan atau kesulitan yang dihadapi..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForSubmit(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Kirim Tugas Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Grade Modal */}
      {selectedAssignmentForGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Penilaian Tugas Siswa
              </h3>
              <button
                onClick={() => setSelectedAssignmentForGrade(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmGrade} className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Tugas:</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedAssignmentForGrade.title}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nilai Akhir (Skala 0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Umpan Balik Guru (Feedback Konstruktif)
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Berikan apresiasi dan catatan perbaikan..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForGrade(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  Simpan Nilai Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
