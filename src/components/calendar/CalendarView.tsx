import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { CalendarEvent } from '../../types/lms';
import {
  CalendarDays,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  FileCheck2,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent } = useLMS();

  const [currentDate] = useState(new Date('2026-09-27'));
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-09-28');
  const [newEventTime, setNewEventTime] = useState('10:00 WIB');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('tugas');
  const [newEventSubject, setNewEventSubject] = useState('Matematika');
  const [newEventDesc, setNewEventDesc] = useState('');

  const filteredEvents = calendarEvents.filter((evt) => {
    if (selectedCategory === 'semua') return true;
    return evt.type === selectedCategory;
  });

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    addCalendarEvent({
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      type: newEventType,
      subject: newEventSubject,
      description: newEventDesc || 'Pengingat jadwal akademik mandiri.',
    });

    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
  };

  // Calendar matrix for September 2026
  // Sept 1, 2026 is Tuesday
  const daysInMonth = 30;
  const startDayOfWeek = 2; // 0=Sun, 1=Mon, 2=Tue...

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kalender & Penjadwalan Akademik
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jadwal ujian daring, batas pengumpulan tugas, dan agenda semester SMPN 1 Wonosari
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 self-start rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Jadwal / Pengingat</span>
        </button>
      </div>

      {/* Main Grid: Calendar left & Agenda right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Monthly Calendar Grid (7 cols) */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                September 2026
              </h3>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 text-[11px] font-semibold">
              {(['semua', 'ujian', 'tugas', 'akademik'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Weekday headers */}
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty_${idx}`} className="h-20 rounded-xl bg-slate-50/50 dark:bg-slate-800/20" />;
              }

              const formattedDate = `2026-09-${dayNum.toString().padStart(2, '0')}`;
              const dayEvents = calendarEvents.filter((e) => e.date === formattedDate);
              const isToday = dayNum === 27;

              return (
                <div
                  key={dayNum}
                  className={`flex h-20 flex-col rounded-xl border p-1.5 transition-all text-xs ${
                    isToday
                      ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 dark:bg-blue-950/30'
                      : 'border-slate-100 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Event indicators on the day */}
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        title={ev.title}
                        className={`truncate rounded px-1 py-0.5 text-[9px] font-semibold ${
                          ev.type === 'ujian'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                            : ev.type === 'tugas'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400">+{dayEvents.length - 2} lagi</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Agenda List (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Agenda & Tenggat Mendatang
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notifikasi otomatis pengingat tugas dan jadwal ujian
            </p>

            <div className="mt-4 space-y-3">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          evt.type === 'ujian'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                            : evt.type === 'tugas'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {evt.type}
                      </span>
                      <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {evt.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    {evt.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-2 dark:border-slate-800">
                    <span>Tanggal: {evt.date}</span>
                    {evt.subject && <span className="font-semibold text-blue-600">{evt.subject}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Agenda Akademik Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Judul Acara / Pengingat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengumpulan Portofolio IPA"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="ujian">Ujian</option>
                    <option value="tugas">Tugas</option>
                    <option value="akademik">Akademik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={newEventSubject}
                    onChange={(e) => setNewEventSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Catatan detail mengenai agenda ini..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
