'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Youtube, 
  Play, 
  Save, 
  X, 
  Trash2,
  ExternalLink,
  Search,
  MessageSquare
} from 'lucide-react';

interface VideoFeed {
  id: string;
  url: string;
  title: string;
  memo: string;
  thumbnail: string;
  date: string;
}

const INITIAL_FEED: VideoFeed[] = [
  {
    id: '1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: '메이저리그 타격 폼 분석: 인사이드 아웃',
    memo: '임팩트 시 손목 회전과 힙 턴의 조화를 참고할 것. 특히 왼쪽 다리 벽 만드는 동작이 인상적임.',
    thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2070&auto=format&fit=crop',
    date: '2024.03.07'
  },
  {
    id: '2',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: '고교 야구 결승전 하이라이트',
    memo: '상대 투수의 슬라이더 궤적 분석 필요. 바깥쪽 떨어지는 공에 대처하는 법 연습하자.',
    thumbnail: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1974&auto=format&fit=crop',
    date: '2024.03.05'
  }
];

export default function ReferenceVideosPage() {
  const router = useRouter();
  const [feed, setFeed] = useState<VideoFeed[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gildenglove_videos');
      return saved ? JSON.parse(saved) : INITIAL_FEED;
    }
    return INITIAL_FEED;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ url: '', title: '', memo: '' });

  // Persistence
  useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gildenglove_videos', JSON.stringify(feed));
    }
  });

  const handleAdd = () => {
    if (!newVideo.url || !newVideo.title) return;
    
    // Quick Thumbnail Logic
    const videoId = newVideo.url.split('v=')[1]?.split('&')[0] || newVideo.url.split('/').pop();
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const entry: VideoFeed = {
      id: Date.now().toString(),
      url: newVideo.url,
      title: newVideo.title,
      memo: newVideo.memo,
      thumbnail,
      date: new Date().toLocaleDateString('ko-KR').slice(0, -1)
    };

    const updatedFeed = [entry, ...feed];
    setFeed(updatedFeed);
    localStorage.setItem('gildenglove_videos', JSON.stringify(updatedFeed));
    
    setShowAddModal(false);
    setNewVideo({ url: '', title: '', memo: '' });
    alert('참고 영상이 성공적으로 저장되었습니다!');
  };

  const handleDelete = (id: string) => {
    if (confirm('이 영상을 삭제하시겠습니까?')) {
      const updatedFeed = feed.filter(v => v.id !== id);
      setFeed(updatedFeed);
      localStorage.setItem('gildenglove_videos', JSON.stringify(updatedFeed));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-40 overflow-x-hidden relative font-sans antialiased break-keep">
      <header className="flex items-center justify-between mb-10 relative z-10">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-navy-deep tracking-[0.3em] uppercase flex items-center gap-2">
          <Youtube className="w-4 h-4 text-rose-500" /> 참고 영상 (REFERENCES)
        </h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-[#001A3D] text-white px-6 py-3.5 rounded-2xl text-[11px] font-black tracking-widest flex items-center gap-2.5 shadow-xl shadow-black/20 ring-4 ring-[#001A3D]/10 active:bg-slate-900 transition-all uppercase"
        >
          <Plus className="w-4 h-4 text-white" /> 영상 등록 (ADD VIDEO)
        </motion.button>
      </header>

      {/* Video Feed List */}
      <div className="space-y-12 relative z-10 max-w-2xl mx-auto">
        {feed.map((v) => (
          <motion.article 
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 group"
          >
            {/* Visual Header */}
            <div className="aspect-video relative overflow-hidden">
               <img 
                src={v.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt={v.title}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop';
                }}
               />
               <div className="absolute inset-0 bg-navy-deep/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <a 
                    href={v.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-16 h-16 rounded-full bg-white text-navy-deep flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                   >
                     <Play className="w-8 h-8 fill-navy-deep ml-1" />
                   </a>
               </div>
               <div className="absolute top-6 left-6">
                   <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black text-navy-deep uppercase tracking-widest border border-slate-100 shadow-sm">
                       {v.date}
                   </span>
               </div>
               <button 
                onClick={() => handleDelete(v.id)}
                className="absolute top-6 right-6 w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>

            {/* Content Body */}
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-navy-deep tracking-tighter italic leading-tight group-hover:text-navy-accent transition-colors">
                   {v.title}
                 </h3>
                 <div className="flex items-center gap-2 text-slate-300">
                   <ExternalLink className="w-3 h-3" />
                   <span className="text-[10px] font-bold tracking-tight line-clamp-1">{v.url}</span>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative group/memo overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-navy-deep/[0.02] rounded-full blur-[30px]" />
                 <div className="flex items-start gap-4 relative z-10">
                   <MessageSquare className="w-5 h-5 text-navy-deep/20 mt-1 shrink-0" />
                   <p className="text-sm font-medium text-slate-600 leading-relaxed break-keep">
                     {v.memo}
                   </p>
                 </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-navy-deep/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-1">
                <h3 className="text-3xl font-black italic tracking-tighter text-[#001A3D] uppercase break-keep">영상 등록</h3>
                <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">Add New Training Reference</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Title</label>
                  <input 
                    placeholder="영상 제목을 입력하세요..."
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-[#001A3D] font-bold outline-none focus:ring-2 focus:ring-[#001A3D]/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">YouTube URL</label>
                  <input 
                    placeholder="https://youtube.com/..."
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-[#001A3D] font-bold outline-none focus:ring-2 focus:ring-[#001A3D]/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase ml-1">Memo</label>
                  <textarea 
                    placeholder="영상에서 배울 점이나 메모를 적어보세요..."
                    value={newVideo.memo}
                    onChange={(e) => setNewVideo({...newVideo, memo: e.target.value})}
                    className="w-full h-28 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-[#001A3D] font-bold outline-none focus:ring-2 focus:ring-[#001A3D]/5 transition-all resize-none"
                  />
                </div>
                <button 
                  onClick={handleAdd}
                  className="w-full h-16 bg-[#001A3D] text-white rounded-2xl font-black italic tracking-wider flex items-center justify-center gap-3 shadow-2xl shadow-black/40 active:scale-95 transition-all uppercase mb-2"
                >
                  <Save className="w-5 h-5 text-white" /> 레퍼런스 저장 (SAVE REFERENCE)
                </button>
              </div>
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
