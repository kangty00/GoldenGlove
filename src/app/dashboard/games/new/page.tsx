'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Trophy, 
  Users, 
  Target,
  Zap,
  Info
} from 'lucide-react';
import { calculateAVG, calculateOPS, calculateRF } from '@/lib/stats';
import { supabase } from '@/lib/supabase';

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

export default function NewGamePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    game_type: 'official',
    opponent: '',
    venue: '',
    positions: [] as string[],
    // Batting
    at_bats: 0,
    hits: 0,
    doubles: 0,
    triples: 0,
    home_runs: 0,
    walks: 0,
    hbp: 0,
    sac_fly: 0,
    stolen_bases: 0,
    // Fielding
    putouts: 0,
    assists: 0,
    errors: 0,
    innings_played: 9,
    // Advanced
    exit_velocity: '',
    launch_angle: '',
    bat_speed: '',
    throwing_velocity: '',
  });

  const liveStats = useMemo(() => {
    const avg = calculateAVG(formData.hits, formData.at_bats);
    const ops = calculateOPS({
      at_bats: formData.at_bats,
      hits: formData.hits,
      doubles: formData.doubles,
      triples: formData.triples,
      home_runs: formData.home_runs,
      walks: formData.walks,
      hbp: formData.hbp,
      sac_fly: formData.sac_fly,
    });
    const rf = calculateRF({
      putouts: formData.putouts,
      assists: formData.assists,
      innings_played: formData.innings_played
    });
    return { avg, ops, rf };
  }, [formData]);

  const togglePosition = (pos: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(pos) 
        ? prev.positions.filter(p => p !== pos) 
        : [...prev.positions, pos]
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
        // 1. 경기 정보 저장
        const { data: game, error: gameError } = await supabase
            .from('games')
            .insert([{
                date: formData.date,
                game_type: formData.game_type,
                opponent: formData.opponent,
                venue: formData.venue,
                positions: formData.positions
            }])
            .select()
            .single();

        if (gameError) throw gameError;

        // 2. 종속 데이터 저장 (Batting, Fielding 등) - 실제 환경에서는 Promise.all 사용
        // 현재는 로직 흐름만 구현
        alert('경기 기록이 성공적으로 저장되었습니다!');
        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        alert('저장에 실패했습니다. 테이블 구성을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-midnight p-6 pb-40 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-grass-green opacity-[0.05] blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <button onClick={() => router.back()} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black italic text-white tracking-[0.2em] uppercase">경기 기록 (PERFORMANCE)</h2>
        <div className="w-10"></div>
      </div>

      {/* Live Stats Preview Bar: Premium Glass */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-5 mb-10 flex justify-between items-center shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-diamond-gold/5 via-transparent to-transparent opacity-50" />
        <div className="text-center relative z-10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">타율 (AVG)</p>
            <p className="text-xl font-black italic text-diamond-gold">{liveStats.avg}</p>
        </div>
        <div className="h-10 w-px bg-white/5 relative z-10"></div>
        <div className="text-center relative z-10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">OPS (OPS)</p>
            <p className="text-xl font-black italic text-white">{liveStats.ops}</p>
        </div>
        <div className="h-10 w-px bg-white/5 relative z-10"></div>
        <div className="text-center relative z-10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">수비 (RF)</p>
            <p className="text-xl font-black italic text-white">{liveStats.rf}</p>
        </div>
      </div>

      {/* Form Steps */}
      <div className="relative z-10 h-[450px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-diamond-gold/60" /> 기본 경기 정보 (BASE INFO)
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                      <input 
                          type="date" 
                          value={formData.date}
                          onChange={(e) => updateField('date', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black italic outline-none focus:border-diamond-gold/50 transition-all text-sm"
                      />
                      <div className="relative">
                        <select 
                            value={formData.game_type}
                            onChange={(e) => updateField('game_type', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black italic outline-none appearance-none cursor-pointer pr-10 text-sm"
                        >
                            <option value="practice" className="bg-midnight">연습경기 (Practice)</option>
                            <option value="official" className="bg-midnight">공식경기 (Official)</option>
                            <option value="tournament" className="bg-midnight">전국대회 (Tournament)</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 rotate-90 pointer-events-none" />
                      </div>
                  </div>
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-diamond-gold/60" /> 상대팀 (OPPONENT)
                  </label>
                  <input 
                      placeholder="상상대 팀명을 입력하세요..." 
                      value={formData.opponent}
                      onChange={(e) => updateField('opponent', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black italic outline-none focus:bg-white/[0.08] transition-all text-sm"
                  />
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">출장 포지션 (POSITIONS)</label>
                  <div className="grid grid-cols-5 gap-2">
                      {POSITIONS.map(pos => (
                          <button
                              key={pos}
                              onClick={() => togglePosition(pos)}
                              className={`h-12 rounded-xl font-black italic text-xs transition-all duration-300 border flex items-center justify-center ${
                                  formData.positions.includes(pos)
                                      ? 'bg-diamond-gold text-black border-diamond-gold shadow-lg shadow-diamond-gold/20 scale-105'
                                      : 'bg-white/5 text-white/20 border-white/10'
                              }`}
                          >
                              {pos}
                          </button>
                      ))}
                  </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {[
                      { label: '타석 (AB)', key: 'at_bats' },
                      { label: '안타 (H)', key: 'hits' },
                      { label: '2루타 (2B)', key: 'doubles' },
                      { label: '3루타 (3B)', key: 'triples' },
                      { label: '홈런 (HR)', key: 'home_runs' },
                      { label: '볼넷 (BB)', key: 'walks' },
                      { label: '사구 (HBP)', key: 'hbp' },
                      { label: '희비 (SF)', key: 'sac_fly' }
                  ].map((item) => (
                      <div key={item.key} className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-3">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.label}</label>
                          <div className="flex items-center gap-4">
                              <button 
                                  onClick={() => updateField(item.key, Math.max(0, (formData as any)[item.key] - 1))}
                                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                              >-</button>
                              <span className="text-2xl font-black italic text-white w-8 text-center">{(formData as any)[item.key]}</span>
                              <button 
                                  onClick={() => updateField(item.key, (formData as any)[item.key] + 1)}
                                  className="w-10 h-10 rounded-full bg-diamond-gold/10 border border-diamond-gold/50 flex items-center justify-center text-diamond-gold shadow-lg active:scale-90 transition-all"
                              >+</button>
                          </div>
                      </div>
                  ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                  <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-diamond-gold/10 blur-[40px] pointer-events-none" />
                      <h3 className="text-xs font-black italic text-white/80 uppercase tracking-[0.2em] flex items-center gap-3 relative z-10">
                          <Zap className="w-5 h-5 text-diamond-gold" /> 트래킹 데이터 (ADVANCED)
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6 relative z-10">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/30 tracking-widest">타구속도 (EXIT VELO, MPH)</label>
                              <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="00.0"
                                    value={formData.exit_velocity}
                                    onChange={(e) => updateField('exit_velocity', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black italic text-2xl outline-none focus:bg-white/10 transition-all"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-diamond-gold/20 font-black italic underline">MPH</div>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/30 tracking-widest">발사각 (LAUNCH ANGLE, °)</label>
                              <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="00.0"
                                    value={formData.launch_angle}
                                    onChange={(e) => updateField('launch_angle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black italic text-2xl outline-none focus:bg-white/10 transition-all"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-diamond-gold/20 font-black italic underline">DEG</div>
                              </div>
                          </div>
                      </div>

                      <div className="pt-2 relative z-10">
                          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 text-[10px] font-bold text-white/40 italic">
                            <Info className="w-4 h-4 text-diamond-gold/40" />
                            <span>입력된 속도는 선수의 월간 베스트 기록으로 자동 선정됩니다.</span>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: '보살 (A)', key: 'assists' },
                        { label: '자살 (PO)', key: 'putouts' },
                        { label: '실책 (E)', key: 'errors', danger: true }
                      ].map(fld => (
                        <div key={fld.key} className="space-y-2">
                            <label className="text-[9px] font-black text-white/30 uppercase text-center block tracking-widest">{fld.label}</label>
                            <input 
                                type="number" 
                                value={(formData as any)[fld.key]} 
                                onChange={(e) => updateField(fld.key, parseInt(e.target.value) || 0)} 
                                className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-black italic text-xl ${fld.danger && formData.errors > 0 ? 'border-red-500/50 text-red-500' : ''}`} 
                            />
                        </div>
                      ))}
                  </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons: Fixed Bottom */}
      <div className="fixed bottom-10 left-6 right-6 flex gap-4 z-50">
        {step > 1 && (
            <button 
                onClick={() => setStep(prev => prev - 1)}
                className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white flex items-center justify-center active:scale-95 transition-all shadow-2xl"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
        )}
        
        {step < 3 ? (
            <button 
                onClick={() => setStep(prev => prev + 1)}
                className="flex-1 h-16 rounded-[1.5rem] bg-diamond-gold text-black font-black uppercase italic flex items-center justify-center gap-2 shadow-2xl shadow-diamond-gold/20 active:scale-[0.98] transition-all tracking-tighter"
            >
                다음 단계 (NEXT) <ChevronRight className="w-5 h-5" />
            </button>
        ) : (
            <button 
                onClick={handleSave}
                className="flex-1 h-16 rounded-[1.5rem] bg-white text-black font-black uppercase italic flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-all tracking-tighter"
            >
                <Save className="w-5 h-5 text-diamond-gold" /> 기록 완료 (SAVE)
            </button>
        )}
      </div>
    </div>
  );
}
