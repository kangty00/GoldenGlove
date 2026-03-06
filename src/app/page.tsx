'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ShieldCheck, CircleDot, Eraser } from 'lucide-react';

export default function PinLockPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();
  const CORRECT_PIN = process.env.NEXT_PUBLIC_6DIGIT_PIN || '369874';

  const handleInput = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === CORRECT_PIN) {
        // 인증 성공 시 세션 저장 (Client-side)
        sessionStorage.setItem('locked_verified', 'true');
        
        // 서버사이드 미들웨어 보안을 위한 쿠키 발급 (24시간 유지)
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = `goldenglove_auth=true; expires=${expiryDate.toUTCString()}; path=/;`;
        
        router.push('/dashboard');
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin, router, CORRECT_PIN]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6 overflow-hidden">
      
      {/* 1. Logo Section: Modern Professional */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-2xl bg-navy-deep flex items-center justify-center shadow-2xl shadow-navy-deep/20 group">
            <CircleDot className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white text-navy-deep text-[10px] font-black px-3 py-1 rounded-full border border-navy-deep/20 shadow-sm uppercase tracking-tighter italic">
            ELITE 24
          </div>
        </div>
        <h1 className="text-3xl font-black text-navy-deep tracking-tighter lowercase mb-2">
          gilden<span className="text-navy-accent font-light italic">glove</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-navy-accent/40" /> SECURE ACCESS
        </p>
      </motion.div>

      {/* 2. PIN Indicators: Clean Grey */}
      <div className="flex gap-5 mb-14 relative z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
              pin.length > i 
                ? 'bg-navy-deep border-navy-deep scale-125 shadow-xl' 
                : 'bg-white border-slate-200'
            } ${error ? 'border-red-500 bg-red-500' : ''}`}
          >
            {pin.length > i && (
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* 3. Keypad: Clean Slate Cards */}
      <div className="grid grid-cols-3 gap-6 max-w-[300px] w-full relative z-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleInput(num.toString())}
            className="h-16 rounded-2xl bg-slate-50 border border-slate-200 text-navy-deep text-2xl font-black flex items-center justify-center hover:bg-slate-100 active:bg-navy-deep active:text-white transition-all duration-200"
          >
            {num}
          </motion.button>
        ))}
        <div className="flex items-center justify-center opacity-10">
            <LayoutGrid className="w-6 h-6 text-navy-deep" />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleInput('0')}
          className="h-16 rounded-2xl bg-slate-50 border border-slate-200 text-navy-deep text-2xl font-black flex items-center justify-center hover:bg-slate-100 active:bg-navy-deep active:text-white transition-all"
        >
          0
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          className="h-16 rounded-2xl bg-slate-100 border border-slate-200 text-navy-deep flex items-center justify-center hover:bg-slate-200 active:bg-red-50 group"
        >
          <Eraser className="w-7 h-7 text-navy-deep/40 group-active:text-red-500 transition-colors" />
        </motion.button>
      </div>

      {/* 4. Footer: Minimal Branding */}
      <div className="mt-16 text-slate-300 text-[10px] uppercase font-bold tracking-[0.5em] text-center relative z-10">
        FOR THE ELITE MINDSET<br/>
        <span className="text-navy-deep/10 mt-2 block tracking-[0.2em]">KANG WOO JIN PROJECT</span>
      </div>
    </div>
  );
}
