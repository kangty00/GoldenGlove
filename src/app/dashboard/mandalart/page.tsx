'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  LayoutGrid,
  Zap,
  Star,
  User,
  Heart,
  Sparkles,
  RefreshCw,
  Target
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: '체력/피지컬', icon: Zap },
  { id: 2, name: '타격/커스텀', icon: Target },
  { id: 3, name: '파워/스피드', icon: Zap },
  { id: 4, name: '수비/스킬', icon: Star },
  { id: 5, name: '멘탈/회복', icon: Heart },
  { id: 6, name: '인간성/태도', icon: User },
  { id: 7, name: '운/태도', icon: Star },
  { id: 8, name: '분석/전략', icon: Target },
];

const MENTAL_RECOMMENDATIONS = [
  "경기 전 15초 시각화 명상",
  "타석 전 심호흡 루틴",
  "결과보다 스윙 과정에 집중",
  "실패 후 3초 내 털어내기",
  "매일 잠들기 전 성공 장면 상상",
  "동료의 실책에 격려 한마디",
  "심판 판정에 흔들리지 않기",
  "나만의 긍정 확언(Affirmation)",
  "투수의 리듬을 역으로 이용하기",
  "안타 후 겸손함 유지하기",
  "삼진 후 배트 던지지 않기",
  "경기 전 장비 깨끗이 닦기",
  "하루 10분 야구 일지 쓰기",
  "타석에서 껌 씹으며 긴장 풀기",
  "투수와 눈싸움에서 이기기"
];

const INITIAL_GOALS: Record<string, string> = {
  '5-1': '시각화 명상',
  '5-2': '심호흡 루틴',
  '2-1': '타격 폼 교정',
  '6-1': '인사 잘하기'
};

export default function MandalartPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [goals, setGoals] = useState<Record<string, string>>(INITIAL_GOALS);

  // Supabase Sync
  useEffect(() => {
    fetchMandalart();

    const channel = supabase
      .channel('mandalart_changes')
      .on('postgres_changes' as any, { event: '*', table: 'mandalart' }, () => {
        fetchMandalart();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMandalart = async () => {
    const { data, error } = await supabase.from('mandalart').select('*');
    if (error) {
      console.error('Fetch error:', error);
      return;
    }
    
    data?.forEach(row => {
      if (row.id === 'goals') setGoals(row.data);
      if (row.id === 'checks') setChecks(row.data);
    });
  };

  const saveData = async (id: string, data: any) => {
    const { error } = await supabase
      .from('mandalart')
      .upsert({ id, data, updated_at: new Date().toISOString() });
    
    if (error) console.error('Save error:', error);
  };

  const toggleCheck = (categoryId: number, slot: number) => {
    const key = `${categoryId}-${slot}`;
    const newChecks = { ...checks, [key]: !checks[key] };
    setChecks(newChecks);
    saveData('checks', newChecks);
  };

  const recommendGoal = (categoryId: number, slot: number) => {
    const randomIdx = Math.floor(Math.random() * MENTAL_RECOMMENDATIONS.length);
    const key = `${categoryId}-${slot}`;
    const newGoals = { ...goals, [key]: MENTAL_RECOMMENDATIONS[randomIdx] };
    setGoals(newGoals);
    saveData('goals', newGoals);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative">
        <header className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> 멘탈 (MANDALART AI)
            </h2>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                GOAL <span className="text-navy-deep underline">PRO</span> GRADE
            </div>
        </header>

        {/* Center Goal Display */}
        <div className="bg-navy-deep rounded-[2.5rem] p-10 mb-8 text-center shadow-2xl relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=2072&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 group-hover:scale-100 transition-transform duration-1000"
              alt="Mental BG"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-transparent" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">최종 목표 (ULTIMATE GOAL)</p>
              <h3 className="text-2xl font-black text-white tracking-widest leading-tight italic uppercase break-keep">
                KBO 신인 드래프트 1라운드 지명
              </h3>
              <div className="mt-8 flex justify-center">
                <div className="h-1.5 w-12 bg-white/20 rounded-full" />
              </div>
            </div>
        </div>

        {/* Mandalart Section */}
        <div className="relative z-10">
          {!activeCategory ? (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-3 gap-4 aspect-square"
              >
                  {[0, 1, 2, 3].map(i => (
                      <CategoryButton key={i} category={CATEGORIES[i]} onClick={() => setActiveCategory(CATEGORIES[i].id)} />
                  ))}
                  <div className="bg-navy-deep rounded-[2rem] flex items-center justify-center border border-navy-accent shadow-xl shadow-navy-deep/20 group cursor-pointer active:scale-95 transition-all">
                      <Trophy className="w-10 h-10 text-white group-hover:rotate-12 transition-transform" />
                  </div>
                  {[4, 5, 6, 7].map(i => (
                      <CategoryButton key={i} category={CATEGORIES[i]} onClick={() => setActiveCategory(CATEGORIES[i].id)} />
                  ))}
              </motion.div>
          ) : (
              <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
              >
                  <button 
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-2 text-navy-deep text-[10px] font-black uppercase tracking-[0.3em] mb-8 group"
                  >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 전체 매트릭스 (FULL MATRIX)
                  </button>

                  <div className="bg-white border border-slate-200 rounded-[3rem] p-8 mb-8 relative overflow-hidden shadow-sm">
                      <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 rounded-2xl bg-navy-deep flex items-center justify-center text-white shadow-xl">
                              {(() => {
                                  const Icon = CATEGORIES.find(c => c.id === activeCategory)?.icon || LayoutGrid;
                                  return <Icon className="w-7 h-7" />;
                              })()}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">SELECTED CATEGORY</p>
                            <h4 className="text-2xl font-black text-navy-deep uppercase tracking-tighter">
                                {CATEGORIES.find(c => c.id === activeCategory)?.name}
                            </h4>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => {
                          const key = `${activeCategory}-${slot}`;
                          const isChecked = checks[key];
                          const goalValue = goals[key] || `실천 사항 ${slot}`;
                          return (
                              <motion.div
                                  key={slot}
                                  className={`min-h-[140px] rounded-[2rem] p-6 flex flex-col justify-between text-left transition-all duration-500 border relative group overflow-hidden ${
                                      isChecked 
                                          ? 'bg-navy-deep border-navy-deep shadow-xl' 
                                          : 'bg-white border-slate-100 shadow-sm'
                                  }`}
                              >
                                  <div className="flex justify-between items-start relative z-10">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isChecked ? 'text-white/30' : 'text-slate-300'}`}>ITEM {slot}</span>
                                    {!isChecked && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); recommendGoal(activeCategory!, slot); }}
                                        className="h-8 w-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-navy-deep hover:bg-navy-deep hover:text-white transition-all shadow-sm"
                                        title="AI 랜덤 추천"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  <div className="mt-4 relative z-10" onClick={() => toggleCheck(activeCategory!, slot)}>
                                      <p className={`text-sm font-bold leading-snug break-keep ${isChecked ? 'text-white/50 line-through' : 'text-navy-deep'}`}>
                                          {goalValue}
                                      </p>
                                      <div className="mt-3 flex justify-end">
                                        {isChecked ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-slate-200" />}
                                      </div>
                                  </div>
                              </motion.div>
                          );
                      })}
                  </div>
              </motion.div>
          )}
        </div>

        <div className="mt-20 p-10 bg-white border border-slate-200 rounded-[3rem] text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-navy-deep" />
            <Sparkles className="w-8 h-8 text-navy-accent/20 absolute bottom-6 right-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700" />
            <p className="text-[11px] font-bold italic text-slate-400 uppercase tracking-[0.2em] leading-relaxed relative z-10 break-keep">
                "성공이란 사소한 습관의 반복에서 옵니다"<br/>
                <span className="text-navy-deep mt-4 block font-black">- 오타니 쇼헤이 (SHOHEI OHTANI) -</span>
            </p>
        </div>
    </div>
  );
}

function CategoryButton({ category, onClick }: { category: any, onClick: () => void }) {
    const Icon = category.icon;
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="rounded-[2rem] bg-white border border-slate-100 flex flex-col items-center justify-center p-4 text-center group hover:border-navy-deep/20 shadow-sm transition-all"
        >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-navy-deep rounded-xl flex items-center justify-center mb-3 transition-colors">
              <Icon className="w-5 h-5 text-navy-deep group-hover:text-white transition-colors" />
            </div>
            <span className="text-[10px] font-black text-slate-500 group-hover:text-navy-deep uppercase leading-tight line-clamp-2 break-keep">
                {category.name}
            </span>
        </motion.button>
    );
}
