// src/app/result/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  
  // URL에서 데이터 추출
  const avgBpm = searchParams.get('avgBpm');
  const focusRatio = searchParams.get('focusRatio');
  const time = searchParams.get('time');

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-12">학습 분석 리포트</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-center">
          <p className="text-slate-400 mb-2">총 학습 시간</p>
          <p className="text-4xl font-mono font-bold">{time}초</p>
        </div>
        
        <div className="bg-slate-800 p-8 rounded-3xl border border-pink-500/30 text-center">
          <p className="text-slate-400 mb-2">평균 심박수</p>
          <p className="text-4xl font-mono font-bold text-pink-500">{avgBpm} BPM</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-blue-500/30 text-center">
          <p className="text-slate-400 mb-2">집중도 점수</p>
          <p className="text-4xl font-mono font-bold text-blue-400">{focusRatio}%</p>
        </div>
      </div>

      <button 
        onClick={() => window.location.href = '/'}
        className="mt-16 text-slate-400 hover:text-white underline"
      >
        메인으로 돌아가기
      </button>
    </main>
  );
}