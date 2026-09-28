import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Award,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const QuizCBTModal: React.FC = () => {
  const {
    activeQuizSession,
    cancelQuizSession,
    submitQuiz,
    isOnline,
  } = useLMS();

  if (!activeQuizSession) return null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [doubtfulQuestions, setDoubtfulQuestions] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(activeQuizSession.durationMinutes * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  const totalQuestions = activeQuizSession.questions.length;
  const currentQ = activeQuizSession.questions[currentQuestionIndex];

  // Timer tick
  useEffect(() => {
    if (quizResult) return; // Stop timer if already submitted

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizResult]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleToggleDoubtful = () => {
    setDoubtfulQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleAutoSubmit = () => {
    const result = submitQuiz(activeQuizSession.id, userAnswers);
    setQuizResult(result);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    const result = submitQuiz(activeQuizSession.id, userAnswers);
    setQuizResult(result);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-3 sm:p-6 backdrop-blur-sm">
      <div className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-black text-white">
              CBT ONLINE
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                {activeQuizSession.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeQuizSession.subjectName} • {activeQuizSession.topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Display */}
            {!quizResult && (
              <div
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono text-sm font-bold shadow-xs ${
                  timeLeftSeconds < 300
                    ? 'bg-red-50 text-red-600 animate-pulse dark:bg-red-950/60 dark:text-red-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            {!quizResult && (
              <button
                onClick={cancelQuizSession}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                title="Keluar dari ujian"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body: Active Exam or Result Review */}
        {!quizResult ? (
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
            {/* Main Question View */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Soal Nomor {currentQuestionIndex + 1} dari {totalQuestions}
                </span>

                {doubtfulQuestions[currentQuestionIndex] && (
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    Ditandai Ragu-ragu
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="mt-6 text-base font-medium text-slate-800 sm:text-lg dark:text-slate-100 leading-relaxed">
                {currentQ.question}
              </div>

              {/* Multiple Choice Options */}
              <div className="mt-6 space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-sm dark:border-blue-500 dark:bg-blue-950/40 dark:text-white'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {letter}
                      </div>
                      <span className="text-sm font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Question Navigation Matrix */}
            <div className="w-full border-t border-slate-100 bg-slate-50/60 p-6 lg:w-72 lg:border-t-0 lg:border-l dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                Navigasi Soal
              </h4>

              {/* Matrix of numbers */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {activeQuizSession.questions.map((_, index) => {
                  const isCurrent = currentQuestionIndex === index;
                  const isAnswered = userAnswers[index] !== undefined;
                  const isDoubt = doubtfulQuestions[index];

                  let colorClasses = 'border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
                  if (isDoubt) {
                    colorClasses = 'border-amber-400 bg-amber-400 text-amber-950 font-bold';
                  } else if (isAnswered) {
                    colorClasses = 'border-emerald-500 bg-emerald-500 text-white font-bold';
                  }

                  if (isCurrent) {
                    colorClasses += ' ring-2 ring-blue-600 ring-offset-2';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${colorClasses}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Terjawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <span>Ragu-ragu ({Object.values(doubtfulQuestions).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Belum dijawab ({unansweredCount})</span>
                </div>
              </div>

              {/* Offline indicator */}
              {!isOnline && (
                <div className="mt-4 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  <p className="font-semibold">Mode Ujian Offline</p>
                  <p>Jawaban disimpan di perangkat dan disinkronkan saat online.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Result & Explanation Screen */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Award className="h-10 w-10" />
              </div>

              <h3 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">
                Ujian Daring Telah Diselesaikan!
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Hasil penilaian otomatis berbasis kunci jawaban resmi SMPN 1 Wonosari
              </p>

              {/* Score Display Card */}
              <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Nilai Akhir
                </p>
                <div className="mt-2 text-5xl font-black text-blue-600 tabular-nums dark:text-blue-400">
                  {quizResult.score} <span className="text-2xl text-slate-400">/ 100</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      quizResult.passed
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {quizResult.passed
                      ? '✓ Tuntas (Memenuhi KKM 75)'
                      : '⚠ Perlu Bimbingan Pengayaan / Remedial'}
                  </span>
                </div>
              </div>

              {/* Pembahasan / Review Soal */}
              <div className="mt-8 text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pembahasan dan Kunci Jawaban:
                </h4>

                <div className="mt-3 space-y-4">
                  {activeQuizSession.questions.map((q, qIndex) => {
                    const studentAns = userAnswers[qIndex];
                    const isCorrect = studentAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`rounded-2xl border p-4 text-xs ${
                          isCorrect
                            ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                            : 'border-red-200 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-800 dark:text-slate-200">
                            Soal {qIndex + 1}: {q.question}
                          </span>
                          <span
                            className={
                              isCorrect
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }
                          >
                            {isCorrect ? 'Benar (+20)' : 'Salah'}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Jawaban Anda:</span>{' '}
                          {studentAns !== undefined ? q.options[studentAns] : 'Tidak dijawab'}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            Kunci Jawaban:
                          </span>{' '}
                          {q.options[q.correctAnswer]}
                        </p>
                        <div className="mt-2 rounded-lg bg-white/70 p-2 font-mono text-[11px] text-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                          💡 Pembahasan: {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={cancelQuizSession}
                className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar for Question Paging */}
        {!quizResult && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleToggleDoubtful}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                doubtfulQuestions[currentQuestionIndex]
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'border border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400'
              }`}
            >
              {doubtfulQuestions[currentQuestionIndex] ? 'Hapus Ragu-ragu' : 'Tandai Ragu-ragu'}
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                <span>Kumpulkan Jawaban</span>
              </button>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Konfirmasi Penyelesaian Ujian
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Anda telah menjawab{' '}
                <span className="font-bold text-blue-600">{answeredCount}</span> dari{' '}
                <span className="font-bold">{totalQuestions}</span> soal.
                {unansweredCount > 0 && (
                  <span className="block mt-1 text-amber-600 font-semibold">
                    Perhatian: Masih ada {unansweredCount} soal yang belum Anda jawab!
                  </span>
                )}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Ya, Kumpulkan Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
