'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Youtube, 
  ChevronRight, 
  Plus,
  Dna
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="bg-slate-50 min-h-screen px-4 pb-4 space-y-2.5 font-sans antialiased break-keep">
      
      {/* 1. Profile Identity Header */}
      <div 
        onClick={() => router.push('/dashboard/profile')}
        className="flex items-center justify-between bg-white border border-slate-100 rounded-[1.5rem] px-5 py-3 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="profile" />
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
           </div>
           <div className="flex flex-col text-left">
             <h2 className="text-base font-black text-[#001A3D] tracking-tighter italic leading-none">강우진 선수 <span className="text-slate-200 font-black ml-1 uppercase text-[10px]">No.24</span></h2>
             <p className="text-[7px] font-black text-slate-400 tracking-[0.2em] uppercase mt-0.5">ELITE PERFORMANCE</p>
           </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#001A3D] transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Card 1: Daily Routine */}
        <div 
            onClick={() => router.push('/dashboard/training')}
            className="col-span-12 bg-navy-deep border border-slate-200/5 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between items-start text-left h-[190px] relative overflow-hidden group cursor-pointer"
        >
          <img 
            src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1974&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
            alt="Baseball routine"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <div className="relative z-10 w-full text-left">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-2xl rounded-lg flex items-center justify-center mb-4 border border-white/10">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight uppercase italic">개인 맞춤 훈련</h3>
              <p className="text-[8px] font-bold text-slate-300 tracking-[0.3em] uppercase mt-1">PERSONAL TRAINING</p>
            </div>
            
            <div className="mt-4 space-y-2">
              {[
                  { task: "코어 안정화 (15분)", done: true },
                  { task: "하체 파워 강화 (웨이트)", done: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-left">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${item.done ? 'bg-white border-white' : 'border-white/10'}`}>
                    {item.done && <Plus className="w-2.5 h-2.5 text-navy-deep rotate-45" />}
                  </div>
                  <span className={`text-xs font-bold ${item.done ? 'text-white/40' : 'text-white/90'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2 & 3: Compact Grid */}
        <div className="col-span-12 grid grid-cols-2 gap-3">
          
          {/* Card 2: Scouting Board */}
          <div 
            onClick={() => router.push('/dashboard/scouting')}
            className="bg-navy-deep border border-slate-200/5 rounded-[1.5rem] p-5 shadow-xl h-[125px] relative overflow-hidden group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1516733230559-994f06830723?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
              alt="Scouting board"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
            
            <div className="relative z-10 flex flex-col justify-between items-start text-left h-full">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10 text-white">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight uppercase italic leading-none">전력 분석</h3>
                <p className="text-[7px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">SCOUTING</p>
              </div>
            </div>
          </div>

          {/* Card 3: Reference Videos */}
          <div 
            onClick={() => router.push('/dashboard/videos')}
            className="bg-navy-deep border border-slate-200/5 rounded-[1.5rem] p-5 shadow-xl h-[125px] relative overflow-hidden group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1562077981-4d7eafd44932?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
              alt="References"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
            
            <div className="relative z-10 flex flex-col justify-between items-start text-left h-full">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg text-white">
                <Youtube className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight uppercase italic leading-none">참고 영상</h3>
                <p className="text-[7px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">VIDEOS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Mental/Mandalart (Ultra Compact) */}
        <div 
            onClick={() => router.push('/dashboard/mandalart')}
            className="col-span-12 bg-[#001A3D] border border-white/5 rounded-[1.5rem] p-6 shadow-2xl relative overflow-hidden group cursor-pointer"
        >
          <img 
            src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[2000ms]"
            alt="Mental background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001A3D] via-[#001A3D]/80 to-transparent" />
          
          <div className="relative z-10 flex items-center justify-between text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-2xl rounded-xl flex items-center justify-center border border-white/10 text-white">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tighter uppercase italic leading-none">멘탈 / 만다라트</h3>
                <p className="text-[7px] font-black text-slate-400 tracking-[0.2em] uppercase mt-0.5">PEAK FOCUS</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
