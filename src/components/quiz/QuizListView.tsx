import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { OnlineQuiz } from '../../types/lms';
import {
  FileCheck2,
  Clock,
  Award,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface QuizListViewProps {
  onOpenCreateQuiz: () => void;
}

export const QuizListView: React.FC<QuizListViewProps> = ({ onOpenCreateQuiz }) => {
  const { quizzes, currentUser, startQuizSession } = useLMS();

  const [activeTabFilter, setActiveTabFilter] = useState<'aktif' | 'selesai'>('aktif');

  const activeQuizzes = quizzes.filter((q) => !q.isCompleted);
  const completedQuizzes = quizzes.filter((q) => q.isCompleted);

  const displayedQuizzes = activeTabFilter === 'aktif' ? activeQuizzes : completedQuizzes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kuis & Ujian Daring (CBT)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sistem Computer-Based Test dengan penilaian otomatis real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'guru' && (
            <button
              onClick={onOpenCreateQuiz}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Buat Kuis Baru</span>
            </button>
          )}

          {/* Tab Filter */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTabFilter('aktif')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTabFilter === 'aktif'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Aktif ({activeQuizzes.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('selesai')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTabFilter === 'selesai'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Selesai ({completedQuizzes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {displayedQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {quiz.subjectName}
                </span>

                {quiz.isCompleted ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Nilai: {quiz.score}/100
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Wajib Dikerjakan
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                {quiz.title}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Topik: {quiz.topic}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {quiz.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Durasi: {quiz.durationMinutes} Menit</span>
                </div>
                <div>•</div>
                <div>{quiz.questions.length} Butir Soal</div>
              </div>

              {!quiz.isCompleted && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.deadlineFormatted}</span>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
              {quiz.isCompleted ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ujian Telah Disubmit</span>
                  </span>
                  <button
                    onClick={() => startQuizSession(quiz.id)}
                    className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Buka Ulang Kuis ➔
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startQuizSession(quiz.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
                >
                  <span>Mulai Kuis Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
