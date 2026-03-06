'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  BarChart3,
  Plus, 
  Zap, 
  Target, 
  Trophy,
  Pencil,
  Trash2,
  AlertCircle,
  X
} from 'lucide-react';

interface BatterRecord {
  id: string;
  date: string;
  opponent: string;
  gameName: string; // Competition / Tournament Name
  ab: number;   // At Bats
  h: number;    // Total Hits
  d2: number;   // 2B
  d3: number;   // 3B
  hr: number;   // HR
  rbi: number;
  r: number;    // Runs
  bb: number;   // Walks
  hbp: number;  // Hit By Pitch
  so: number;   // Strikeouts
  sf: number;   // Sacrifice Fly
  sb: number;   // Stolen Bases
}

const INITIAL_RECORDS: BatterRecord[] = [
  { id: '1', date: '2024-03-01', opponent: '서울고', gameName: '황금사자기', ab: 4, h: 2, d2: 1, d3: 0, hr: 0, rbi: 1, r: 1, bb: 0, hbp: 0, so: 1, sf: 0, sb: 1 },
  { id: '2', date: '2024-03-03', opponent: '경기고', gameName: '황금사자기', ab: 3, h: 1, d2: 0, d3: 0, hr: 1, rbi: 2, r: 1, bb: 1, hbp: 1, so: 0, sf: 0, sb: 0 },
  { id: '3', date: '2024-03-05', opponent: '충암고', gameName: '연습경기', ab: 4, h: 1, d2: 0, d3: 1, hr: 0, rbi: 0, r: 1, bb: 0, hbp: 0, so: 1, sf: 1, sb: 0 },
];

export default function BatterRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<BatterRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gildenglove_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    }
    return INITIAL_RECORDS;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<BatterRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    gameName: '',
    ab: 0, h: 0, d2: 0, d3: 0, hr: 0, rbi: 0, r: 0, bb: 0, hbp: 0, so: 0, sf: 0, sb: 0
  });

  // Persistent Storage
  useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gildenglove_records', JSON.stringify(records));
    }
  });

  const handleSave = () => {
    if (formData.ab < formData.h) {
      alert('⚠️ 입력 오류: 타수(AB)는 총 안타수보다 적을 수 없습니다.');
      return;
    }
    if (!formData.opponent) {
      alert('⚠️ 상대 팀 이름을 입력해주세요.');
      return;
    }

    let updatedRecords;
    if (editingId) {
      updatedRecords = records.map(r => r.id === editingId ? { ...formData, id: editingId } : r);
      setEditingId(null);
    } else {
      updatedRecords = [{ ...formData, id: Date.now().toString() }, ...records];
    }

    setRecords(updatedRecords);
    localStorage.setItem('gildenglove_records', JSON.stringify(updatedRecords));
    
    setShowAddForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      opponent: '',
      gameName: '',
      ab: 0, h: 0, d2: 0, d3: 0, hr: 0, rbi: 0, r: 0, bb: 0, hbp: 0, so: 0, sf: 0, sb: 0
    });
    alert('기록이 성공적으로 저장되었습니다!');
  };

  const stats = useMemo(() => {
    const total = records.reduce((acc, curr) => ({
      ab: acc.ab + curr.ab,
      h: acc.h + curr.h,
      d2: acc.d2 + curr.d2,
      d3: acc.d3 + curr.d3,
      hr: acc.hr + curr.hr,
      bb: acc.bb + curr.bb,
      hbp: acc.hbp + curr.hbp,
      sf: acc.sf + curr.sf,
      rbi: acc.rbi + curr.rbi,
      r: acc.r + curr.r,
      so: acc.so + curr.so,
      sb: acc.sb + curr.sb
    }), { ab: 0, h: 0, d2: 0, d3: 0, hr: 0, bb: 0, hbp: 0, sf: 0, rbi: 0, r: 0, so: 0, sb: 0 });

    if (total.ab === 0) return { avg: '.000', obp: '.000', slg: '.000', ops: '.000', woba: '.000', total };

    const avg = total.h / total.ab;
    const obp = (total.h + total.bb + total.hbp) / (total.ab + total.bb + total.hbp + total.sf || 1);
    
    const h1b = total.h - total.d2 - total.d3 - total.hr;
    const tb = h1b + (2 * total.d2) + (3 * total.d3) + (4 * total.hr);
    const slg = tb / total.ab;
    const ops = obp + slg;

    const woba = (
      (0.69 * total.bb) + 
      (0.72 * total.hbp) + 
      (0.88 * h1b) + 
      (1.25 * total.d2) + 
      (1.58 * total.d3) + 
      (2.05 * total.hr)
    ) / (total.ab + total.bb + total.hbp + total.sf || 1);

    return {
      avg: avg.toFixed(3).replace(/^0/, ''),
      obp: obp.toFixed(3).replace(/^0/, ''),
      slg: slg.toFixed(3).replace(/^0/, ''),
      ops: ops.toFixed(3).replace(/^0/, ''),
      woba: woba.toFixed(3).replace(/^0/, ''),
      total
    };
  }, [records]);

  const handleEdit = (record: BatterRecord) => {
    setEditingId(record.id);
    const { id, ...data } = record;
    setFormData(data);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      const updatedRecords = records.filter(r => r.id !== id);
      setRecords(updatedRecords);
      localStorage.setItem('gildenglove_records', JSON.stringify(updatedRecords));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative font-sans antialiased break-keep">
      <header className="flex items-center justify-between mb-8 relative z-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-navy-accent" /> 기록 데이터 센터 (RECORDS)
        </h2>
        <div className="w-11"></div>
      </header>

      {/* 1. Dashboard: Sabermetrics Overlay */}
      <section className="bg-navy-deep rounded-[3.5rem] p-10 mb-10 shadow-2xl relative overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Stat"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10 text-left">
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Advanced Performance</p>
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase font-serif">KANG WOO JIN <span className="text-navy-accent ml-2">.wOBA {stats.woba}</span></h3>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
               <Zap className="w-7 h-7 text-amber-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'AVG', value: stats.avg, color: 'text-white' },
              { label: 'OBP', value: stats.obp, color: 'text-white/80' },
              { label: 'SLG', value: stats.slg, color: 'text-white/80' },
              { label: 'OPS', value: stats.ops, color: 'text-navy-accent font-black' }
            ].map(s => (
              <div key={s.label} className="space-y-1 text-left">
                <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{s.label}</span>
                <p className={`text-4xl font-black italic tracking-tighter ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Spray Chart (Visual Analytics) */}
      <section className="bg-white border border-slate-100 rounded-[3rem] p-10 mb-10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Target className="w-5 h-5 text-navy-deep/20" /> 타구 방향 분석 (SPRAY CHART)
           </h3>
           <span className="text-[9px] font-bold text-navy-deep bg-slate-50 px-3 py-1.5 rounded-lg">LAST SEASON</span>
        </div>
        
        <div className="relative aspect-video w-full flex items-center justify-center bg-slate-50 rounded-[2rem] border border-slate-100 mb-4 overflow-hidden">
           <svg viewBox="0 0 200 200" className="w-full max-w-[400px] h-auto drop-shadow-2xl">
              <circle cx="100" cy="180" r="160" className="fill-emerald-500/10" />
              <path d="M100 180 L20 100 Q100 20 180 100 Z" className="fill-amber-900/10" />
              <line x1="100" y1="180" x2="20" y2="100" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="100" y1="180" x2="180" y2="100" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="97" y="177" width="6" height="6" fill="#fff" transform="rotate(45 100 180)" />
              {/* Spray Dots Legend Meanings: */}
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="60" cy="80" r="4" className="fill-rose-500" /> {/* Pull: 당겨치기 (Red) */}
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="140" cy="70" r="4" className="fill-[#001A3D]" /> {/* Opposite: 밀어치기 (Navy/Black) */}
              <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} cx="100" cy="50" r="4" className="fill-emerald-500" /> {/* Center: 중견수 방향 (Green) */}
           </svg>
           
           {/* Color Legend for User */}
           <div className="absolute bottom-4 left-6 flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[8px] font-bold text-slate-400">당겨치기 (PULL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-bold text-slate-400">센터 (CENTER)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#001A3D]" />
                <span className="text-[8px] font-bold text-slate-400">밀어치기 (OPP)</span>
              </div>
           </div>
        </div>
      </section>

      {/* 3. CRUD Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
           경기별 퍼포먼스 로그
        </h3>
        {!showAddForm && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                date: new Date().toISOString().split('T')[0],
                opponent: '',
                gameName: '',
                ab: 0, h: 0, d2: 0, d3: 0, hr: 0, rbi: 0, r: 0, bb: 0, hbp: 0, so: 0, sf: 0, sb: 0
              });
              setShowAddForm(true);
            }}
            className="bg-[#001A3D] text-white px-8 py-5 rounded-full text-[12px] font-black tracking-widest flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/30 ring-4 ring-[#001A3D]/20"
          >
            <Plus className="w-5 h-5 text-white" /> 기록 추가 (ADD RECORD)
          </button>
        )}
      </div>

      {/* 4. Input Form (Focused Card) */}
      <AnimatePresence>
        {showAddForm && (
          <motion.section 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white border-2 border-navy-deep/10 rounded-[3.5rem] p-10 mb-12 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-10">
               <div className="text-left">
                  <h3 className="text-3xl font-black italic tracking-tighter text-navy-deep uppercase">
                    {editingId ? '기록 수정 (EDIT)' : '기록 등록 (CREATE)'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">BATTER PERFORMANCE DATA ENTRY</p>
               </div>
               <button 
                onClick={() => { setShowAddForm(false); setEditingId(null); }}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="space-y-3 text-left mb-10">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">대회 / 경기 명칭 (COMPETITION NAME)</label>
               <input 
                 placeholder="예: 황금사자기, 주말리그, 연습경기..." 
                 value={formData.gameName} 
                 onChange={(e) => setFormData({...formData, gameName: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-6 font-bold text-navy-deep outline-none focus:ring-4 focus:ring-navy-deep/5 transition-all"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
               <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">상대 팀 이름 (OPPONENT)</label>
                  <input 
                    placeholder="예: 서울고, 경기고..." 
                    value={formData.opponent} 
                    onChange={(e) => setFormData({...formData, opponent: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-6 font-bold text-navy-deep outline-none focus:ring-4 focus:ring-navy-deep/5 transition-all"
                  />
               </div>
               <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">경기 날짜 (DATE)</label>
                  <input 
                    type="date"
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-6 font-bold text-navy-deep outline-none focus:ring-4 focus:ring-navy-deep/5 transition-all"
                  />
               </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5 mb-10">
               {[
                 { label: '타수 (AB)', key: 'ab' },
                 { label: '안타 (H)', key: 'h' },
                 { label: '2루타 (2B)', key: 'd2' },
                 { label: '3루타 (3B)', key: 'd3' },
                 { label: '홈런 (HR)', key: 'hr' },
                 { label: '타점 (RBI)', key: 'rbi' },
                 { label: '득점 (R)', key: 'r' },
                 { label: '볼넷 (BB)', key: 'bb' },
                 { label: '사구 (HBP)', key: 'hbp' },
                 { label: '삼진 (SO)', key: 'so' },
                 { label: '희비 (SF)', key: 'sf' },
                 { label: '도루 (SB)', key: 'sb' }
               ].map(field => (
                 <div key={field.key} className="space-y-2 text-center">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                    <input 
                      type="number" 
                      value={(formData as any)[field.key]} 
                      onChange={(e) => setFormData({...formData, [field.key]: parseInt(e.target.value) || 0})}
                      className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl text-center text-lg font-black text-navy-deep focus:bg-white focus:border-navy-deep/20 transition-all outline-none"
                    />
                 </div>
               ))}
            </div>

            <button 
              onClick={handleSave}
              className="w-full h-24 bg-[#001A3D] text-white rounded-[2.5rem] font-black text-sm tracking-[0.4em] shadow-2xl shadow-black/40 flex items-center justify-center gap-5 transition-all hover:bg-slate-900 uppercase italic mb-4"
            >
              <Save className="w-7 h-7 text-white" /> 
              {editingId ? '기록 업데이트 완료 (UPDATE)' : '기록 등록 완료 (CREATE)'}
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Enhanced Records Feed */}
      <div className="space-y-6">
        {records.map(record => (
          <div key={record.id} className="bg-white border border-slate-50 rounded-[3rem] p-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm group hover:border-navy-deep/20 transition-all transition-duration-500">
            <div className="flex items-center gap-8 mb-6 md:mb-0 text-left">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-navy-deep transition-all duration-500">
                <span className="text-[9px] font-black text-slate-400 group-hover:text-white/40 uppercase leading-none">{record.date.split('-')[1]}월</span>
                <span className="text-2xl font-black text-navy-deep group-hover:text-white leading-none mt-1">{record.date.split('-')[2]}</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-navy-accent bg-navy-deep/5 px-2 py-0.5 rounded uppercase leading-none">{record.gameName || '일반경기'}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase italic">OFFICIAL LOG</span>
                   </div>
                   <h4 className="text-2xl font-black text-navy-deep italic tracking-tighter uppercase leading-tight">{record.opponent} 전</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    {record.ab} AB / {record.h} H / {record.hr > 0 && `${record.hr} HR`} / {record.rbi} RBI
                  </span>
                  <div className="w-px h-3 bg-slate-200" />
                  <span className="text-[11px] font-black text-navy-deep italic uppercase">
                    AVG {(record.h / record.ab || 0).toFixed(3).replace(/^0/, '')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-10">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleEdit(record)}
                    className="w-14 h-14 bg-slate-100 text-navy-deep hover:bg-navy-deep hover:text-white rounded-[1.2rem] transition-all flex items-center justify-center shadow-md border border-slate-200"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="w-14 h-14 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.2rem] transition-all flex items-center justify-center shadow-md border border-rose-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
               <div className="w-px h-12 bg-slate-100 hidden md:block" />
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase mb-1 leading-none italic">OPS OPS</p>
                  <p className="text-4xl font-black text-navy-accent tracking-tighter italic leading-none">
                    {(() => {
                        const obp = (record.h + record.bb + record.hbp) / (record.ab + record.bb + record.hbp + record.sf || 1);
                        const slg = (record.h - record.d2 - record.d3 - record.hr + 2*record.d2 + 3*record.d3 + 4*record.hr) / record.ab;
                        return (obp + slg).toFixed(3).replace(/^0/, '');
                    })()}
                  </p>
               </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
