import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { MessageSquare, Send, Users, User, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export const MessagesView: React.FC = () => {
  const { currentUser } = useLMS();

  const [activeChannel, setActiveChannel] = useState<'group' | 'teacher'>('group');
  const [inputText, setInputText] = useState('');

  const [groupMessages, setGroupMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Sulistyana, S.Pd., M.Pd. (Wali Kelas)',
      text: 'Selamat pagi anak-anak Kelas 8B, jangan lupa hari ini ada batas akhir Kuis Bab 3 Matematika pukul 16:00 WIB ya.',
      time: '07:30',
      isSelf: false,
    },
    {
      id: 'm2',
      sender: 'Aisyah Putri',
      text: 'Baik Bu Sulistyana, saya sudah mengerjakan dan mengumpulkan tugas praktikum IPA juga.',
      time: '07:45',
      isSelf: false,
    },
    {
      id: 'm3',
      sender: 'Bima Satria',
      text: 'Bu, apakah untuk nomor 4 rumus keliling persegi panjang perlu dituliskan model aljabarnya dulu?',
      time: '08:15',
      isSelf: false,
    },
    {
      id: 'm4',
      sender: 'Sulistyana, S.Pd., M.Pd. (Wali Kelas)',
      text: 'Betul Bima, tuliskan model matematika 2(p+l) = K terlebih dahulu agar mendapat skor langkah maksimal.',
      time: '08:20',
      isSelf: false,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: currentUser.name,
      text: inputText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setGroupMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pesan & Forum Diskusi Akademik
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Komunikasi terenkripsi antara guru pengampu, wali kelas, dan siswa
        </p>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs md:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        {/* Left: Chat Channels (4 cols) */}
        <div className="border-b border-slate-100 p-4 md:col-span-4 md:border-b-0 md:border-r dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saluran Diskusi
          </h3>

          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => setActiveChannel('group')}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                activeChannel === 'group'
                  ? 'bg-blue-50 text-blue-900 font-bold dark:bg-blue-950/60 dark:text-white'
                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Users className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold">Forum Kelas 8B</p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  Bu Sulistyana: Tuliskan model matematika...
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveChannel('teacher')}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                activeChannel === 'teacher'
                  ? 'bg-blue-50 text-blue-900 font-bold dark:bg-blue-950/60 dark:text-blue-200'
                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold">Konsultasi Wali Kelas</p>
                <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  Pesan langsung ke Sulistyana, S.Pd., M.Pd.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Message Stream (8 cols) */}
        <div className="flex flex-col h-[520px] md:col-span-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeChannel === 'group' ? 'Forum Diskusi Kelas 8B' : 'Konsultasi Privat - Bu Sulistyana, S.Pd., M.Pd.'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                32 Anggota Aktif • Enkripsi End-to-End Aktif
              </p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Aman</span>
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {groupMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                {!msg.isSelf && (
                  <span className="mb-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {msg.sender}
                  </span>
                )}
                <div
                  className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.isSelf
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`mt-1 block text-[10px] text-right ${
                      msg.isSelf ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-100 p-3 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan atau pertanyaan ke forum..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-blue-600 p-2 text-white shadow-xs hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
