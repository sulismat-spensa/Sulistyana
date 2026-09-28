import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import { TrendingUp, Award, CheckCircle2, SlidersHorizontal, BarChart3, HelpCircle } from 'lucide-react';

interface GradeDataPoint {
  period: string;
  shortLabel: string;
  semester: 1 | 2;
  avgScore: number;
  matematika: number;
  ipa: number;
  bahasaIndo: number;
  bahasaInggris: number;
  kkm: number;
  milestone: string;
}

const HISTORICAL_GRADES: GradeDataPoint[] = [
  {
    period: 'Juli 2024',
    shortLabel: 'Jul (Awal)',
    semester: 1,
    avgScore: 78.5,
    matematika: 76,
    ipa: 77,
    bahasaIndo: 82,
    bahasaInggris: 79,
    kkm: 75,
    milestone: 'Asesmen Diagnostik Awal Tahun',
  },
  {
    period: 'Agustus 2024',
    shortLabel: 'Agt (UH 1)',
    semester: 1,
    avgScore: 81.2,
    matematika: 80,
    ipa: 79,
    bahasaIndo: 85,
    bahasaInggris: 81,
    kkm: 75,
    milestone: 'Ulangan Harian 1 & Praktikum',
  },
  {
    period: 'September 2024',
    shortLabel: 'Sep (UH 2)',
    semester: 1,
    avgScore: 83.0,
    matematika: 82,
    ipa: 81,
    bahasaIndo: 88,
    bahasaInggris: 81,
    kkm: 75,
    milestone: 'Ulangan Harian 2 & Tugas Mandiri',
  },
  {
    period: 'Oktober 2024',
    shortLabel: 'Okt (PTS 1)',
    semester: 1,
    avgScore: 84.8,
    matematika: 85,
    ipa: 83,
    bahasaIndo: 89,
    bahasaInggris: 82,
    kkm: 75,
    milestone: 'Penilaian Tengah Semester (PTS) Ganjil',
  },
  {
    period: 'November 2024',
    shortLabel: 'Nov (UH 3)',
    semester: 1,
    avgScore: 86.5,
    matematika: 87,
    ipa: 84,
    bahasaIndo: 90,
    bahasaInggris: 85,
    kkm: 75,
    milestone: 'Ulangan Harian 3 & Projek P5',
  },
  {
    period: 'Desember 2024',
    shortLabel: 'Des (PAS 1)',
    semester: 1,
    avgScore: 88.0,
    matematika: 88,
    ipa: 85,
    bahasaIndo: 91,
    bahasaInggris: 88,
    kkm: 75,
    milestone: 'Penilaian Akhir Semester (PAS) Ganjil',
  },
  {
    period: 'Januari 2025',
    shortLabel: 'Jan (UH 4)',
    semester: 2,
    avgScore: 87.2,
    matematika: 86,
    ipa: 85,
    bahasaIndo: 90,
    bahasaInggris: 88,
    kkm: 75,
    milestone: 'Awal Semester Genap & UH 4',
  },
  {
    period: 'Februari 2025',
    shortLabel: 'Feb (PTS 2)',
    semester: 2,
    avgScore: 89.5,
    matematika: 90,
    ipa: 87,
    bahasaIndo: 92,
    bahasaInggris: 89,
    kkm: 75,
    milestone: 'Penilaian Tengah Semester (PTS) Genap',
  },
  {
    period: 'Maret 2025 (Kini)',
    shortLabel: 'Mar (Kini)',
    semester: 2,
    avgScore: 91.0,
    matematika: 92,
    ipa: 89,
    bahasaIndo: 93,
    bahasaInggris: 90,
    kkm: 75,
    milestone: 'Evaluasi Portofolio & Ujian Mandiri',
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartMode: 'avg' | 'subjects';
}

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload, label, chartMode }) => {
  if (active && payload && payload.length) {
    const data: GradeDataPoint = payload[0].payload;
    const isAboveKkm = data.avgScore >= data.kkm;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 min-w-[220px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{data.period}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{data.milestone}</p>
          </div>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
              isAboveKkm
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
            }`}
          >
            {isAboveKkm ? 'Tuntas KKM' : 'Perlu Remedial'}
          </span>
        </div>

        {chartMode === 'avg' ? (
          <div className="mt-2.5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">Nilai Rata-rata:</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {data.avgScore.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Ambang Batas KKM:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{data.kkm}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Selisih Keunggulan:</span>
              <span>+{(data.avgScore - data.kkm).toFixed(1)} poin</span>
            </div>
          </div>
        ) : (
          <div className="mt-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Matematika:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{data.matematika}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                IPA Terpadu:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{data.ipa}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Bahasa Indonesia:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{data.bahasaIndo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Bahasa Inggris:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{data.bahasaInggris}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const StudentGradeTrendChart: React.FC = () => {
  const [semesterFilter, setSemesterFilter] = useState<'all' | 'sem1' | 'sem2'>('all');
  const [chartMode, setChartMode] = useState<'avg' | 'subjects'>('avg');
  const [showKkmLine, setShowKkmLine] = useState<boolean>(true);

  const filteredData = HISTORICAL_GRADES.filter((d) => {
    if (semesterFilter === 'sem1') return d.semester === 1;
    if (semesterFilter === 'sem2') return d.semester === 2;
    return true;
  });

  const latestScore = filteredData[filteredData.length - 1]?.avgScore || 91.0;
  const initialScore = filteredData[0]?.avgScore || 78.5;
  const scoreDiff = Number((latestScore - initialScore).toFixed(1));
  const maxScore = Math.max(...filteredData.map((d) => d.avgScore));

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Grafik Perkembangan Nilai Rata-rata dari Waktu ke Waktu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualisasi berkala tren nilai asesmen mandiri, UH, PTS, dan PAS Tahun Ajaran 2024/2025
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setChartMode('avg')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                chartMode === 'avg'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Rata-rata Total
            </button>
            <button
              onClick={() => setChartMode('subjects')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                chartMode === 'subjects'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Per Mata Pelajaran
            </button>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setSemesterFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                semesterFilter === 'all'
                  ? 'bg-white text-blue-700 font-bold shadow-xs dark:bg-slate-700 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSemesterFilter('sem1')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                semesterFilter === 'sem1'
                  ? 'bg-white text-blue-700 font-bold shadow-xs dark:bg-slate-700 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Sem 1 (Ganjil)
            </button>
            <button
              onClick={() => setSemesterFilter('sem2')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                semesterFilter === 'sem2'
                  ? 'bg-white text-blue-700 font-bold shadow-xs dark:bg-slate-700 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Sem 2 (Genap)
            </button>
          </div>

          {/* KKM Toggle */}
          <button
            onClick={() => setShowKkmLine(!showKkmLine)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              showKkmLine
                ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
            title="Tampilkan garis batas KKM (75)"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>KKM (75)</span>
          </button>
        </div>
      </div>

      {/* Highlights Metrics Ribbon */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/50">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Nilai Terakhir
          </span>
          <p className="mt-1 text-xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
            {latestScore.toFixed(1)}
          </p>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Sangat Baik (A)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/50">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Peningkatan Tren
          </span>
          <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{scoreDiff > 0 ? scoreDiff : 0} Poin
          </p>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Konsisten meningkat
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/50">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Skor Tertinggi
          </span>
          <p className="mt-1 text-xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
            {maxScore.toFixed(1)}
          </p>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Maret 2025
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-800/50">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Ketuntasan KKM
          </span>
          <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            100%
          </p>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Bebas Remedial
          </span>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="mt-6 h-[290px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'avg' ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[65, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent chartMode={chartMode} />} />

              {showKkmLine && (
                <ReferenceLine
                  y={75}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: 'Batas KKM (75)',
                    position: 'insideTopRight',
                    fill: '#d97706',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="avgScore"
                name="Rata-rata Nilai"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreAreaGradient)"
                activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[65, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent chartMode={chartMode} />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />

              {showKkmLine && (
                <ReferenceLine
                  y={75}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              )}

              <Line
                type="monotone"
                dataKey="matematika"
                name="Matematika"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ipa"
                name="IPA Terpadu"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bahasaIndo"
                name="B. Indonesia"
                stroke="#ea580c"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bahasaInggris"
                name="B. Inggris"
                stroke="#9333ea"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-3 dark:border-slate-800">
        <span>Sumber Data: Buku Induk Penilaian Akademik SMPN 1 Wonosari</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          Target Semester Genap: Pertahankan Rata-rata Di Atas 90.0
        </span>
      </div>
    </div>
  );
};
