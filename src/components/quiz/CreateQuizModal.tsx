import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { OnlineQuiz } from '../../types/lms';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose }) => {
  const { subjects, createQuiz } = useLMS();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sbj_math');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [deadlineTime, setDeadlineTime] = useState('16:00');

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    },
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleQuestionChange = (index: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, question: text } : q))
    );
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === qIndex) {
          const newOpts = [...q.options];
          newOpts[optIndex] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qIndex ? { ...q, correctAnswer: optIndex } : q))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;

    const selectedSubject = subjects.find((s) => s.id === subjectId);

    const newQuiz: OnlineQuiz = {
      id: `qz_custom_${Date.now()}`,
      subjectId,
      subjectName: selectedSubject?.name || 'Umum',
      title,
      topic,
      description: `Ujian daring interaktif untuk materi ${topic}.`,
      durationMinutes: Number(durationMinutes),
      deadline: new Date().toISOString(),
      deadlineFormatted: `Berakhir hari ini pukul ${deadlineTime} WIB`,
      isCompleted: false,
      maxScore: 100,
      questions: questions.map((q, i) => ({
        id: i + 1,
        question: q.question || `Soal Pertanyaan ke-${i + 1}`,
        options: q.options.map((opt, oIdx) => opt || `Pilihan ${String.fromCharCode(65 + oIdx)}`),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'Pembahasan telah diverifikasi oleh guru pengampu.',
      })),
    };

    createQuiz(newQuiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Buat Kuis & Ujian Daring Baru
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulir penyusunan bank soal CBT untuk Kelas 8B
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Judul Kuis / Ulangan
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Kuis: Bab 4 Teorema Pythagoras"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Mata Pelajaran
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Topik / Materi Pembelajaran
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Triple Pythagoras dan Segitiga Siku-siku"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Durasi (Menit)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tenggat Pukul
                </label>
                <input
                  type="text"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  placeholder="16:00"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Daftar Butir Soal ({questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Butir Soal</span>
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Pertanyaan {qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ketikkan teks soal di sini..."
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />

                  {/* 4 Options with radio for correct answer */}
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-2 rounded-xl border p-2 ${
                          q.correctAnswer === optIndex
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={q.correctAnswer === optIndex}
                          onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Pilihan ${String.fromCharCode(65 + optIndex)}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-hidden dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
            >
              Publikasikan Kuis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
