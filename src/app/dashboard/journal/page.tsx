'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, 
  Meh, 
  Frown, 
  ChevronLeft, 
  Save, 
  Sparkles, 
  Activity,
  Calendar,
  Heart,
  Scale,
  Moon,
  Zap,
  CheckCircle2,
  Plus
} from 'lucide-react';

const ROUTINES = [
  '코어 안정화 (15분)',
  '티배팅 100회',
  '하체 회전 유연성 훈련',
  '영상 분석 피드백',
  '100% 전력 질주 5회'
];

export default function TrainingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 84.5,
    sleep_hours: 8,
    routines: [] as string[]
  });

  const toggleRoutine = (routine: string) => {
    setFormData(prev => ({
      ...prev,
      routines: prev.routines.includes(routine)
        ? prev.routines.filter(r => r !== routine)
        : [...prev.routines, routine]
    }));
  };

  const handleSave = () => {
    alert('오늘의 훈련 데이터가 성공적으로 저장되었습니다!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative">
        <header className="flex items-center justify-between mb-8 relative z-10">
            <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> 훈련 & 루틴 (TRAINING)
            </h2>
            <div className="w-10"></div>
        </header>

        <main className="space-y-6 relative z-10">
            {/* 1. Physical Tracking: Weight & Sleep */}
            <div className="grid grid-cols-2 gap-4">
                <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy-deep group-hover:bg-navy-deep group-hover:text-white transition-colors">
                        <Scale className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                        className="bg-transparent text-2xl font-black italic text-navy-deep outline-none w-16 text-right"
                      />
                      <span className="text-xs font-bold text-slate-300">kg</span>
                    </div>
                </section>
                <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy-deep group-hover:bg-navy-deep group-hover:text-white transition-colors">
                        <Moon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sleep</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <input 
                        type="number" 
                        value={formData.sleep_hours}
                        onChange={(e) => setFormData({...formData, sleep_hours: parseInt(e.target.value)})}
                        className="bg-transparent text-2xl font-black italic text-navy-deep outline-none w-10 text-right"
                      />
                      <span className="text-xs font-bold text-slate-300">hrs</span>
                    </div>
                </section>
            </div>

            {/* 2. Daily Routine Checklist */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500/40" /> 데일리 루틴 (ROUTINES)
                  </label>
                  <span className="text-[10px] font-bold text-navy-deep bg-slate-100 px-3 py-1 rounded-full">{formData.routines.length} / {ROUTINES.length}</span>
                </div>
                <div className="space-y-3">
                    {ROUTINES.map(item => {
                        const isDone = formData.routines.includes(item);
                        return (
                          <button
                              key={item}
                              onClick={() => toggleRoutine(item)}
                              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                                  isDone 
                                      ? 'bg-navy-deep border-navy-deep text-white shadow-lg' 
                                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                              }`}
                          >
                              <span className="text-xs font-bold">{item}</span>
                              {isDone ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-slate-200" />}
                          </button>
                        );
                    })}
                </div>
            </section>

            {/* 3. Mental Diary - Sub Section */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500/40" /> 훈련 피드백 (FEEDBACK)
                </label>
                <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-800 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep/5 transition-all resize-none placeholder:text-slate-300"
                    placeholder="오늘 훈련에서의 핵심 배움이나 보안할 점..."
                />
            </section>
        </main>

        <div className="fixed bottom-10 left-6 right-6 z-50">
            <button 
                onClick={handleSave}
                className="w-full h-16 rounded-2xl bg-navy-deep text-white font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-navy-deep/20 active:scale-[0.98] transition-all"
            >
                <Save className="w-5 h-5" /> 기록 완료 (FINISH DAY)
            </button>
        </div>
    </div>
  );
}
