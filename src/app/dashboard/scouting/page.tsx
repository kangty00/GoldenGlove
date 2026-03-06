'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Target, 
  Search, 
  Save, 
  Trash2, 
  Activity, 
  MapPin,
  ClipboardList,
  MessageSquare,
  Zap,
  Users,
  Pencil
} from 'lucide-react';

interface ScoutEntry {
  id: string;
  opponent: string;
  team_notes: string;
  pitcher_name: string;
  pitch_types: string;
  velocity: string;
  put_away_pitch: string;
  strategy: string;
  date: string;
}

const INITIAL_SCOUTING: ScoutEntry[] = [
  {
    id: '1',
    opponent: '서울고',
    team_notes: '적극적인 초구 공략 성향. 좌타자 상대로 시프트를 깊게 가져감.',
    pitcher_name: '김희수 (ACE)',
    pitch_types: '직구, 슬라이더, 스플리터',
    velocity: 'MAX 146 / AVG 142',
    put_away_pitch: '바깥쪽 스플리터',
    strategy: '몸쪽 높은 직구를 보여주고 바깥쪽 낮은 공 유인에 강함. 타석에서 한 발 전진해서 대응할 것.',
    date: '2024.03.07'
  }
];

export default function ScoutingBoardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ScoutEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gildenglove_scouting');
      return saved ? JSON.parse(saved) : INITIAL_SCOUTING;
    }
    return INITIAL_SCOUTING;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newEntry, setNewEntry] = useState<Omit<ScoutEntry, 'id'>>({
    opponent: '',
    team_notes: '',
    pitcher_name: '',
    pitch_types: '',
    velocity: '',
    put_away_pitch: '',
    strategy: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Supabase Fetch & Realtime Subscription
  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('scouting_changes')
      .on('postgres_changes' as any, { event: '*', table: 'scouting' }, (payload: any) => {
        console.log('Realtime update received:', payload);
        fetchEntries(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('scouting')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching scouting:', error);
      // Fallback to localStorage if error or no network
      const saved = localStorage.getItem('gildenglove_scouting');
      if (saved) setEntries(JSON.parse(saved));
    } else if (data) {
      setEntries(data);
      localStorage.setItem('gildenglove_scouting', JSON.stringify(data));
    }
  };

  const handleSave = async () => {
    if (!newEntry.opponent || !newEntry.pitcher_name) {
      alert('상대 팀과 투수 이름은 필수 항목입니다.');
      return;
    }

    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from('scouting')
        .update(newEntry)
        .eq('id', editingId);
      error = updateError;
      setEditingId(null);
    } else {
      const { error: insertError } = await supabase
        .from('scouting')
        .insert([newEntry]);
      error = insertError;
    }

    if (error) {
      console.error('Save error:', error);
      alert('데이터 저장 중 오류가 발생했습니다. (클라우드 연결 확인)');
    } else {
      setShowAddForm(false);
      setNewEntry({
        opponent: '',
        team_notes: '',
        pitcher_name: '',
        pitch_types: '',
        velocity: '',
        put_away_pitch: '',
        strategy: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchEntries(); // UI Refresh
    }
  };

  const handleEdit = (entry: ScoutEntry) => {
    setEditingId(entry.id);
    const { id, ...rest } = entry;
    setNewEntry(rest);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('이 분석 기록을 삭제하시겠습니까?')) {
      const { error } = await supabase
        .from('scouting')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } else {
        fetchEntries();
      }
    }
  };

  const filteredEntries = entries.filter(e => 
    e.opponent.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.pitcher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative font-sans antialiased break-keep">
      <header className="flex items-center justify-between mb-10 relative z-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" /> 전력 분석 (SCOUTING)
        </h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-[#001A3D] text-white px-6 py-4 rounded-2xl text-[11px] font-black tracking-widest flex items-center gap-3 shadow-xl shadow-black/30 ring-4 ring-[#001A3D]/10 active:bg-slate-900 transition-all uppercase"
        >
          <Plus className="w-4 h-4 text-white" /> 전력 분석 등록 (ADD SCOUT)
        </motion.button>
      </header>

      {/* Search Bar */}
      <div className="relative mb-10 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-navy-deep transition-colors" />
        <input 
          placeholder="상대 팀 또는 투수 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-[2rem] py-6 pl-14 pr-6 text-navy-deep font-bold text-sm outline-none shadow-sm focus:ring-4 focus:ring-navy-deep/5 transition-all"
        />
      </div>

      {/* Entry List: Vertical Stack */}
      <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((e) => (
              <motion.div 
                key={e.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-[60px] -translate-y-24 translate-x-24" />
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 relative z-20">
                   <div className="space-y-2 text-left">
                     <div className="flex items-center gap-3">
                       <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-500/10">ANALYZED</span>
                       <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{e.date}</span>
                     </div>
                     <h3 className="text-3xl md:text-4xl font-black text-[#001A3D] italic tracking-tighter uppercase break-all">
                       {e.opponent} <span className="text-slate-200 ml-2">SCOUT</span>
                     </h3>
                   </div>
                   
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(e)}
                        className="w-10 h-10 md:w-auto md:px-5 md:py-3 bg-[#001A3D] text-white rounded-xl md:rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-black/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Pencil className="w-4 h-4" /> <span className="hidden md:inline">수정 (EDIT)</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id)}
                        className="w-10 h-10 md:w-auto md:px-5 md:py-3 bg-rose-500 text-white rounded-xl md:rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">삭제 (DEL)</span>
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                  {/* Team Info */}
                  <div className="space-y-5 text-left">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#001A3D] rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/10">
                           <Users className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">TEAM NOTES</h4>
                     </div>
                     <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 min-h-[120px]">
                        <p className="text-base font-bold text-[#001A3D] leading-relaxed break-keep">{e.team_notes}</p>
                     </div>
                  </div>

                  {/* Pitcher Info */}
                  <div className="space-y-5 text-left">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/10">
                           <Zap className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">PITCHER ANALYSIS</h4>
                     </div>
                     <div className="bg-[#001A3D] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group/card overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop" 
                          className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover/card:scale-110 transition-transform duration-1000" 
                          alt="pitcher bg" 
                        />
                        <div className="relative z-10 space-y-6">
                          <div className="pb-4 border-b border-white/10">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">MAIN PITCHER</p>
                            <p className="text-2xl font-black italic tracking-tight">{e.pitcher_name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-1">
                                <p className="text-white/30 text-[9px] font-black uppercase tracking-tighter">구종</p>
                                <p className="font-bold text-sm tracking-tight">{e.pitch_types}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-white/30 text-[9px] font-black uppercase tracking-tighter">최고구속</p>
                                <p className="font-bold text-sm tracking-tight">{e.velocity}</p>
                             </div>
                             <div className="space-y-1 col-span-2">
                                <p className="text-white/30 text-[9px] font-black uppercase tracking-tighter">결정구</p>
                                <p className="font-black text-base text-amber-400 italic tracking-tight">{e.put_away_pitch}</p>
                             </div>
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Strategy */}
                  <div className="md:col-span-2 space-y-5 text-left">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                           <MessageSquare className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">STRATEGY & HITTING POINT</h4>
                     </div>
                     <div className="bg-emerald-50 rounded-3xl p-10 border border-emerald-100 italic relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl" />
                        <p className="text-lg md:text-xl font-black text-emerald-900 leading-relaxed relative z-10 break-keep">
                          " {e.strategy} "
                        </p>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full py-32 flex flex-col items-center justify-center space-y-6 bg-white rounded-[3.5rem] border border-dashed border-slate-200"
            >
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-200" />
               </div>
               <div className="text-center space-y-1">
                  <p className="text-xl font-black text-[#001A3D] italic uppercase tracking-tighter">No Results Found</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">일치하는 검색 결과가 없습니다</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-navy-deep/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[4rem] p-12 overflow-y-auto max-h-[90vh] shadow-2xl space-y-12 no-scrollbar"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black italic tracking-tighter text-[#001A3D] uppercase break-keep">
                  {editingId ? '전력 분석 수정' : '전력 분석 등록'}
                </h3>
                <p className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">Update Scouting Intelligence</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Analyzed Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none text-[#001A3D]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Opponent Team</label>
                  <input placeholder="상대 팀..." value={newEntry.opponent} onChange={(e) => setNewEntry({...newEntry, opponent: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none text-[#001A3D]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Team Notes</label>
                  <input placeholder="팀 특징 메모..." value={newEntry.team_notes} onChange={(e) => setNewEntry({...newEntry, team_notes: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Pitcher Name</label>
                  <input placeholder="투수 이름..." value={newEntry.pitcher_name} onChange={(e) => setNewEntry({...newEntry, pitcher_name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Pitch Types</label>
                  <input placeholder="구종 (쉼표 구분)..." value={newEntry.pitch_types} onChange={(e) => setNewEntry({...newEntry, pitch_types: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Velocity</label>
                  <input placeholder="구속 정보..." value={newEntry.velocity} onChange={(e) => setNewEntry({...newEntry, velocity: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Put-away Pitch</label>
                  <input placeholder="결정구..." value={newEntry.put_away_pitch} onChange={(e) => setNewEntry({...newEntry, put_away_pitch: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-bold outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-2">Hitting Strategy</label>
                  <textarea placeholder="투수 공략법 및 타격 포인트..." value={newEntry.strategy} onChange={(e) => setNewEntry({...newEntry, strategy: e.target.value})} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl py-6 px-8 font-bold outline-none resize-none" />
                </div>
              </div>

                <button 
                  onClick={handleSave}
                  className="w-full h-20 bg-[#001A3D] text-white rounded-3xl font-black italic tracking-[0.2em] shadow-2xl shadow-black/40 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm mb-4"
                >
                  <Save className="w-6 h-6 text-white" /> 
                  {editingId ? '분석 업데이트 (UPDATE)' : '분석 데이터 저장 (STORE)'}
                </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
