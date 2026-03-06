'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Zap, 
  BarChart3, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TOOLS = [
  { id: 'hitting', name: '타격 (Hitting)', desc: '정확도 및 컨택 능력' },
  { id: 'power', name: '파워 (Power)', desc: '장타력 및 타구 속도' },
  { id: 'running', name: '주력 (Running)', desc: '60야드 대시 및 주루 판단' },
  { id: 'arm', name: '송구 (Arm)', desc: '어깨 강도 및 정확성' },
  { id: 'fielding', name: '수비 (Fielding)', desc: '포구 능력 및 핸들링' },
];

export default function ScoutingGradesPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<Record<string, number>>({
    hitting: 50,
    power: 50,
    running: 50,
    arm: 50,
    fielding: 50
  });

  const updateGrade = (id: string, val: number) => {
    setGrades(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = async () => {
    try {
        const { error } = await supabase.from('scouting_grades').insert([
            { ...grades, date: new Date().toISOString().split('T')[0] }
        ]);
        if (error) throw error;
        alert('MLB 스카우팅 등급이 업데이트되었습니다!');
        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-grass-green p-6 pb-32">
        <header className="flex items-center justify-between mb-8">
            <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10 text-white">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black italic text-white tracking-widest uppercase flex items-center gap-2">
                <Zap className="w-5 h-5 text-diamond-gold" /> 20-80 EVALUATION
            </h2>
            <div className="w-10"></div>
        </header>

        <section className="bg-black/40 border border-white/10 rounded-3xl p-6 mb-8 text-center shadow-xl">
            <h3 className="text-xs font-black italic text-diamond-gold uppercase tracking-[.25em] mb-4">Current Scouting Profile</h3>
            <div className="grid grid-cols-5 gap-2">
                {TOOLS.map(t => (
                    <div key={t.id} className="bg-white/5 rounded-xl p-2 border border-white/10">
                        <p className="text-[8px] font-bold text-white/30 uppercase mb-1">{t.id.slice(0, 3)}</p>
                        <p className="text-lg font-black italic text-chalk-white">{grades[t.id]}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-white/40 italic">
                <Info className="w-3 h-3" /> 50점 = MLB 메이저리그 평균 데이터
            </div>
        </section>

        <main className="space-y-10">
            {TOOLS.map((tool, idx) => (
                <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-4"
                >
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-black text-diamond-gold uppercase tracking-widest leading-none mb-1">Tool {idx + 1}</p>
                            <h4 className="text-lg font-black italic text-chalk-white uppercase">{tool.name}</h4>
                        </div>
                        <div className="text-3xl font-black italic text-white leading-none">
                            {grades[tool.id]}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <input 
                            type="range" min="20" max="80" step="5"
                            value={grades[tool.id]}
                            onChange={(e) => updateGrade(tool.id, parseInt(e.target.value))}
                            className="w-full accent-diamond-gold h-4 rounded-full bg-black/20"
                        />
                        <div className="flex justify-between text-[8px] font-black text-white/40 uppercase px-1">
                            <span>20 (Very Poor)</span>
                            <span>50 (Average)</span>
                            <span>80 (Elite)</span>
                        </div>
                    </div>
                    
                    <p className="text-[10px] text-white/40 italic flex items-center gap-1 bg-white/5 p-2 rounded-lg border border-white/5">
                        <BarChart3 className="w-3 h-3" /> {tool.desc}
                    </p>
                </motion.div>
            ))}
        </main>

        <div className="fixed bottom-32 left-6 right-6">
            <button 
                onClick={handleSave}
                className="w-full h-16 rounded-2xl bg-diamond-gold text-black font-black flex items-center justify-center gap-2 shadow-2xl shadow-diamond-gold/40 active:scale-95 transition-transform"
            >
                <CheckCircle2 className="w-6 h-6" /> 등급 데이터 영구 보존
            </button>
        </div>
    </div>
  );
}
