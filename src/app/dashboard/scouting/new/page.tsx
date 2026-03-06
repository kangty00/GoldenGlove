'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Target, 
  Zap, 
  Activity, 
  BarChart3,
  Calendar,
  Users,
  Plus
} from 'lucide-react';

interface GameRecord {
  id: string;
  date: string;
  opponent: string;
  ab: number; // At Bats
  h: number;  // Hits
  d2: number; // 2B
  d3: number; // 3B
  hr: number; // HR
  rbi: number;
  r: number;   // Runs
  bb: number;  // Walks
  so: number;  // Strikeouts
  sb: number;  // Stolen Bases
}

const INITIAL_RECORDS: GameRecord[] = [
  { id: '1', date: '2024-03-01', opponent: '서울고', ab: 4, h: 2, d2: 1, d3: 0, hr: 0, rbi: 1, r: 1, bb: 0, so: 1, sb: 1 },
  { id: '2', date: '2024-03-03', opponent: '경기고', ab: 3, h: 1, d2: 0, d3: 0, hr: 1, rbi: 2, r: 1, bb: 1, so: 0, sb: 0 },
];

export default function BatterStatsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<GameRecord[]>(INITIAL_RECORDS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState<Omit<GameRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    ab: 0, h: 0, d2: 0, d3: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0
  });

  const stats = useMemo(() => {
    const total = records.reduce((acc, curr) => ({
      ab: acc.ab + curr.ab,
      h: acc.h + curr.h,
      d2: acc.d2 + curr.d2,
      d3: acc.d3 + curr.d3,
      hr: acc.hr + curr.hr,
      bb: acc.bb + curr.bb,
      rbi: acc.rbi + curr.rbi,
      r: acc.r + curr.r,
    }), { ab: 0, h: 0, d2: 0, d3: 0, hr: 0, bb: 0, rbi: 0, r: 0 });

    if (total.ab === 0) return { avg: '.000', obp: '.000', slg: '.000', ops: '.000' };

    const avg = total.h / total.ab;
    const obp = (total.h + total.bb) / (total.ab + total.bb);
    
    // Total Bases = (H - 2B - 3B - HR) + 2*2B + 3*3B + 4*HR
    const singles = total.h - total.d2 - total.d3 - total.hr;
    const tb = singles + (2 * total.d2) + (3 * total.d3) + (4 * total.hr);
    const slg = tb / total.ab;
    const ops = obp + slg;

    return {
      avg: avg.toFixed(3).replace(/^0/, ''),
      obp: obp.toFixed(3).replace(/^0/, ''),
      slg: slg.toFixed(3).replace(/^0/, ''),
      ops: ops.toFixed(3).replace(/^0/, '')
    };
  }, [records]);

  const handleAddGame = () => {
    if (!newGame.opponent || newGame.ab === 0) {
      alert('상대팀과 타수를 입력해주세요.');
      return;
    }
    setRecords(prev => [...prev, { ...newGame, id: Date.now().toString() }]);
    setShowAddForm(false);
    setNewGame({
      date: new Date().toISOString().split('T')[0],
      opponent: '',
      ab: 0, h: 0, d2: 0, d3: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative">
      <header className="flex items-center justify-between mb-8 relative z-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> 기록 (SEASON STATS)
        </h2>
        <div className="w-11"></div>
      </header>

      {/* 1. Stats Dashboard */}
      <section className="bg-navy-deep rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-[0.3em] text-white/40 mb-6 uppercase">Cumulative Performance</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/50 tracking-wider">AVG</span>
              <p className="text-4xl font-black italic tracking-tighter text-amber-400">{stats.avg}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/50 tracking-wider">OBP</span>
              <p className="text-4xl font-black italic tracking-tighter">{stats.obp}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/50 tracking-wider">SLG</span>
              <p className="text-4xl font-black italic tracking-tighter">{stats.slg}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/50 tracking-wider">OPS</span>
              <p className="text-4xl font-black italic tracking-tighter text-blue-400">{stats.ops}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Record List */}
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            경기 기록 리스트 (SEASON LOG)
          </h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-navy-deep text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest active:scale-95 transition-all shadow-lg shadow-navy-deep/20"
          >
            <Plus className="w-3 h-3" /> ADD GAME
          </button>
        </div>

        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Date</label>
                <input 
                  type="date"
                  value={newGame.date}
                  onChange={(e) => setNewGame({...newGame, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-navy-deep outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Opponent</label>
                <input 
                  placeholder="상대 팀..."
                  value={newGame.opponent}
                  onChange={(e) => setNewGame({...newGame, opponent: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-navy-deep outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'AB', key: 'ab' },
                { label: 'H', key: 'h' },
                { label: '2B', key: 'd2' },
                { label: '3B', key: 'd3' },
                { label: 'HR', key: 'hr' },
                { label: 'RBI', key: 'rbi' },
                { label: 'R', key: 'r' },
                { label: 'BB', key: 'bb' },
                { label: 'SO', key: 'so' },
                { label: 'SB', key: 'sb' }
              ].map(field => (
                <div key={field.key} className="space-y-1 text-center">
                  <label className="text-[8px] font-black text-slate-400 tracking-widest">{field.label}</label>
                  <input 
                    type="number"
                    value={(newGame as any)[field.key]}
                    onChange={(e) => setNewGame({...newGame, [field.key]: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-center text-xs font-black text-navy-deep outline-none"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddGame}
              className="w-full h-14 bg-navy-deep text-white rounded-2xl font-black text-[11px] tracking-[0.2em] shadow-xl shadow-navy-deep/10"
            >
              경기 기록 추가 (SAVE GAME)
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          {records.map(game => (
            <div key={game.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:border-navy-deep/20 transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-navy-deep transition-colors group-hover:border-navy-deep">
                  <span className="text-[8px] font-black text-slate-400 group-hover:text-white/50">{game.date.split('-')[1]}</span>
                  <span className="text-lg font-black text-navy-deep group-hover:text-white leading-none">{game.date.split('-')[2]}</span>
                </div>
                <div>
                  <h4 className="text-base font-black text-navy-deep italic">{game.opponent} 전</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400">{game.ab}타수 {game.h}안타 {game.hr > 0 && `(${game.hr}홈런)`}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 tracking-widest">GAME AVG</p>
                    <p className="text-xl font-black text-navy-deep italic tracking-tighter">{(game.h / game.ab).toFixed(3).replace(/^0/, '')}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
