'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Youtube, 
  PenTool, 
  Menu, 
  Home,
  ChevronRight,
  CircleDot,
  BarChart3
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isVerified = sessionStorage.getItem('locked_verified');
    if (!isVerified) {
      router.push('/');
    } else {
      setVerified(true);
    }
  }, [router]);

  const navItems = [
    { icon: Home, label: '홈', path: '/dashboard' },
    { icon: PenTool, label: '훈련', path: '/dashboard/training' },
    { icon: BarChart3, label: '기록', path: '/dashboard/records' },
    { icon: Target, label: '분석', path: '/dashboard/scouting' },
    { icon: Youtube, label: '참고', path: '/dashboard/videos' },
    { icon: Trophy, label: '멘탈', path: '/dashboard/mandalart' },
  ];

  if (!verified) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden antialiased">
      {/* Fixed Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-6 h-14 py-2 flex items-center justify-between">
          <div 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#001A3D] flex items-center justify-center shadow-lg shadow-black/10">
              <CircleDot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-tighter text-[#001A3D] uppercase italic leading-none">
                GoldenGlove
              </span>
              <span className="text-[7px] font-black text-rose-500 tracking-[0.2em] uppercase leading-none mt-1">KWJ PERFORMANCE</span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#001A3D] border border-slate-100 active:scale-95 transition-all shadow-sm"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.5px]" />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Backdrop for closing on click outside */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                  >
                  <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Player Info</p>
                      <p className="text-xs font-bold text-[#001A3D]">강우진 선수 (NO.24)</p>
                  </div>
                  
                  <div className="py-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button 
                          key={item.path}
                          onClick={() => {
                            router.push(item.path);
                            setMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-[11px] font-bold rounded-xl flex items-center gap-2.5 transition-colors ${
                            pathname === item.path ? 'bg-slate-50 text-[#001A3D]' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${pathname === item.path ? 'text-[#001A3D]' : 'text-slate-300'}`} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 pt-1 border-t border-slate-50">
                    <button 
                      onClick={() => {
                        sessionStorage.removeItem('locked_verified');
                        router.push('/');
                      }}
                      className="w-full text-left px-3 py-3 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" /> 로그아웃 (Logout)
                    </button>
                  </div>
                </motion.div>
              </>
            )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 pb-2 relative bg-slate-50">
        <div className="relative z-10 w-full max-w-md mx-auto">
            {children}
            
            {/* Footer with Copyright Notice */}
            <footer className="mt-4 pb-20 px-6 text-center border-t border-slate-200/50 pt-4">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[8px] font-black text-[#001A3D] tracking-[0.2em] uppercase opacity-40">
                        GoldenGlove Performance
                    </p>
                    <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-slate-400">
                            © 2026 GoldenGlove. Developed by <span className="text-navy-deep font-black">강우진/Family</span>.
                        </p>
                        <p className="text-[7px] font-medium text-slate-300 leading-relaxed max-w-[280px] mx-auto italic">
                            All Data Encrypted & Protected
                        </p>
                    </div>
                </div>
            </footer>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 pb-1 shadow-[0_-1px_15px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-500 w-full ${
                  isActive 
                    ? 'text-[#001A3D]' 
                    : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                <div className="relative">
                  <Icon className={`${isActive ? 'w-6 h-6 stroke-[2.2px]' : 'w-5 h-5 stroke-[1.8px]'} transition-all`} />
                  {isActive && (
                    <motion.div 
                        layoutId="nav-dot"
                        className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" 
                    />
                  )}
                </div>
                <span className={`text-xs font-medium tracking-tight ${isActive ? 'opacity-100 font-bold text-[#001A3D]' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
