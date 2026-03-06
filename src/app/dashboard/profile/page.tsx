'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  User, 
  Zap, 
  Star, 
  Dna,
  Save,
  Pencil,
  Plus,
  TrendingUp,
  Scale,
  Maximize2,
  X
} from 'lucide-react';

interface PhysicalRecord {
  date: string;
  height: number;
  weight: number;
  class: string;
}

interface PlayerProfile {
  name: string;
  team: string;
  position: string;
  number: string;
  history: PhysicalRecord[];
}

const INITIAL_PROFILE: PlayerProfile = {
  name: "강우진",
  team: "경기상업고등학교",
  position: "내야수 (유격수/3루수)",
  number: "No.24",
  history: [
    { date: '2026-03-01', height: 170, weight: 72, class: '1학년 (Elite)' }
  ]
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gildenglove_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    }
    return INITIAL_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSpec, setNewSpec] = useState<PhysicalRecord>({
    date: new Date().toISOString().split('T')[0],
    height: 170,
    weight: 72,
    class: '1학년 (Elite)'
  });

  useEffect(() => {
    localStorage.setItem('gildenglove_profile', JSON.stringify(profile));
  }, [profile]);

  const latestSpec = profile.history[0] || { height: 0, weight: 0, class: 'N/A' };

  const handleAddSpec = () => {
    const updatedHistory = [newSpec, ...profile.history];
    setProfile(prev => ({ ...prev, history: updatedHistory }));
    setIsEditing(false);
    alert('신체 스펙이 성공적으로 업데이트되었습니다!');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative font-sans antialiased break-keep">
      <header className="flex items-center justify-between mb-10 relative z-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-[#001A3D] tracking-[0.3em] uppercase flex items-center gap-2">
          <User className="w-4 h-4 text-[#002B66]" /> 선수 프로필 (PROFILE)
        </h2>
        <div className="w-11"></div>
      </header>

      {/* 1. Hero Profile Card */}
      <section className="bg-[#001A3D] rounded-[3.5rem] p-12 mb-10 shadow-2xl relative overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Player background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001A3D] via-[#001A3D]/20 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 rounded-[3rem] border-4 border-white/10 overflow-hidden shadow-2xl relative">
             <img src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div className="text-center md:text-left space-y-3">
             <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
               <span className="bg-[#002B66] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest leading-none">ELITE PROSPECT</span>
               <span className="bg-white/10 backdrop-blur-md text-white/60 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/5 leading-none">GRADE A+</span>
             </div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none flex items-center justify-center md:justify-start flex-wrap gap-2">
               {profile.name} <span className="text-[#002B66] font-serif tracking-normal bg-white/90 px-3 py-1 rounded-xl text-2xl sm:text-3xl md:text-4xl not-italic">{profile.number}</span>
             </h1>
             <p className="text-base sm:text-lg font-bold text-white/60 tracking-tight italic">{profile.team} | {profile.position}</p>
          </div>
        </div>
      </section>

      {/* 2. Specs Management & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Physical Metrics Display */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8 relative group">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#001A3D] shadow-sm">
                    <Dna className="w-6 h-6" />
                 </div>
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">PHYSICAL SPECS</h3>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#001A3D] hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
             <div className="space-y-1 text-left">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Height / Weight</p>
                <p className="text-3xl font-black text-[#001A3D] italic tracking-tighter">{latestSpec.height}cm / {latestSpec.weight}kg</p>
             </div>
             <div className="space-y-1 text-left">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Player Class</p>
                <p className="text-2xl font-black text-[#001A3D] italic tracking-tighter">{latestSpec.class}</p>
             </div>
           </div>

           <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 italic">Last Updated: {latestSpec.date}</span>
              <div className="flex items-center gap-1.5 text-emerald-500">
                 <TrendingUp className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase">Growing Phase</span>
              </div>
           </div>
        </div>

        {/* Edit Modal / Form overlay */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-white rounded-[3rem] p-10 border-2 border-[#001A3D]/10 shadow-2xl space-y-8"
            >
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic text-[#001A3D]">스펙 업데이트 (UPDATE)</h3>
                  <button onClick={() => setIsEditing(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Height (cm)</label>
                        <input 
                          type="number" 
                          value={newSpec.height}
                          onChange={(e) => setNewSpec({...newSpec, height: parseInt(e.target.value)})}
                          className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xl font-black text-[#001A3D] outline-none focus:ring-4 focus:ring-[#001A3D]/5"
                        />
                     </div>
                     <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={newSpec.weight}
                          onChange={(e) => setNewSpec({...newSpec, weight: parseInt(e.target.value)})}
                          className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xl font-black text-[#001A3D] outline-none focus:ring-4 focus:ring-[#001A3D]/5"
                        />
                     </div>
                  </div>
                  <div className="space-y-2 text-left">
                     <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Player Class</label>
                     <input 
                       value={newSpec.class}
                       onChange={(e) => setNewSpec({...newSpec, class: e.target.value})}
                       className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-center text-lg font-black text-[#001A3D] outline-none focus:ring-4 focus:ring-[#001A3D]/5"
                     />
                  </div>
                  <button 
                    onClick={handleAddSpec}
                    className="w-full h-20 bg-[#001A3D] text-white rounded-[1.5rem] font-black text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-black/30"
                  >
                    <Save className="w-5 h-5" /> 누적 기록 저장 (UPDATE HISTORY)
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Growth History List */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-6 overflow-hidden flex flex-col">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> 성장 히스토리 (HISTORY)
           </h3>
           <div className="space-y-4 max-h-[220px] overflow-y-auto no-scrollbar pr-2">
              {profile.history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400">{h.date}</p>
                      <p className="text-sm font-black text-[#001A3D] italic">{h.class}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-[#001A3D] italic">{h.height}cm / {h.weight}kg</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* 3. Sub Information Banners */}
      <div className="mt-8 space-y-6 relative z-10">
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/10">
                  <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">CURRENT FOCUS</h3>
            </div>
            <p className="text-lg font-black text-[#001A3D] leading-relaxed italic break-keep tracking-tight text-left">
              " 2026 시즌 진입을 위한 벌크업 및 유격수 수비 범위 확대 훈련 집중기 "
            </p>
         </div>

         <div className="p-10 bg-[#001A3D] rounded-[3rem] text-center shadow-xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">PRO SCOUT OPINION</p>
               <h4 className="text-2xl font-black text-white italic tracking-tighter leading-tight uppercase underline decoration-[#002B66] underline-offset-8">
                 " 고교 최대급 하드웨어 성장판 보유, 유연성과 강한 어깨 겸비 "
               </h4>
            </div>
         </div>
      </div>

    </div>
  );
}
