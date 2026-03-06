'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Sparkles, 
  Activity,
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
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative font-sans antialiased break-keep">
        <header className="flex items-center justify-between mb-8 relative z-10">
            <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> 개인 훈련 (TRAINING)
            </h2>
            <div className="w-10"></div>
        </header>

        <main className="space-y-6 relative z-10 max-w-lg mx-auto">
            {/* 1. Physical Tracking: Weight & Sleep */}
            <div className="grid grid-cols-2 gap-4">
                <section className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-deep group-hover:bg-navy-deep group-hover:text-white transition-all">
                        <Scale className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                        className="bg-transparent text-3xl font-black italic text-navy-deep outline-none w-20 text-right"
                      />
                      <span className="text-xs font-bold text-slate-300 italic">kg</span>
                    </div>
                </section>
                <section className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm relative overflow-hidden text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-deep group-hover:bg-navy-deep group-hover:text-white transition-all">
                        <Moon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sleep</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <input 
                        type="number" 
                        value={formData.sleep_hours}
                        onChange={(e) => setFormData({...formData, sleep_hours: parseInt(e.target.value)})}
                        className="bg-transparent text-3xl font-black italic text-navy-deep outline-none w-12 text-right"
                      />
                      <span className="text-xs font-bold text-slate-300 italic">hrs</span>
                    </div>
                </section>
            </div>

            {/* 2. Daily Routine Checklist */}
            <section className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Activity className="w-5 h-5 text-navy-accent" /> 데일리 루틴 (ROUTINES)
                  </label>
                  <span className="text-[10px] font-black text-white bg-navy-deep px-4 py-1.5 rounded-full shadow-lg shadow-navy-deep/10 lowercase tracking-widest">{formData.routines.length} / {ROUTINES.length} DONE</span>
                </div>
                <div className="space-y-4">
                    {ROUTINES.map(item => {
                        const isDone = formData.routines.includes(item);
                        return (
                          <button
                              key={item}
                              onClick={() => toggleRoutine(item)}
                              className={`w-full flex items-center justify-between p-7 rounded-[2rem] border transition-all duration-500 group ${
                                  isDone 
                                      ? 'bg-navy-deep border-navy-deep shadow-xl translate-x-1' 
                                      : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200'
                              }`}
                          >
                              <span className={`text-sm font-bold ${isDone ? 'text-white' : 'text-navy-deep'}`}>{item}</span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-white shadow-2xl scale-110' : 'bg-white border border-slate-100'}`}>
                                {isDone ? <CheckCircle2 className="w-5 h-5 text-navy-deep" /> : <Plus className="w-4 h-4 text-slate-200" />}
                              </div>
                          </button>
                        );
                    })}
                </div>
            </section>

            {/* 3. Training Feedback */}
            <section className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500/50" /> 훈련 피드백 (FEEDBACK)
                </label>
                <textarea 
                    className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-navy-deep text-sm font-medium outline-none focus:ring-4 focus:ring-navy-deep/5 transition-all resize-none placeholder:text-slate-300"
                    placeholder="오늘 훈련에서의 핵심적인 배움이나 보안할 점에 대해서 자유롭게 기록하세요..."
                />
            </section>
        </main>

        <div className="fixed bottom-10 left-6 right-6 z-50 flex justify-center">
            <button 
                onClick={handleSave}
                className="w-full max-w-md h-20 rounded-[2rem] bg-navy-deep text-white font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-navy-deep/30 active:scale-95 transition-all"
            >
                <Save className="w-6 h-6" /> 기록 완료 (SAVE TRAINING)
            </button>
        </div>
    </div>
  );
}
