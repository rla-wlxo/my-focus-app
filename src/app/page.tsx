'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 페이지 이동을 위한 라우터 추가
import Script from 'next/script';
import { useWebGazer } from '@/hooks/useWebGazer';
import { useRPPG } from '@/hooks/useRPPG';
import LoadingView from '@/components/LoadingView';
import GazeDashboard from '@/components/GazeDashboard';
import GazeDot from '@/components/GazeDot';

export default function EyeTrackingPage() {
  const router = useRouter();
  const { coordinates, isLoaded, initWebGazer } = useWebGazer();
  const { bpm } = useRPPG('webgazerVideoFeed', isLoaded);

  // 1. 통계를 위한 실시간 데이터 저장소
  const [stats, setStats] = useState<{ time: number; bpm: number; isFocus: boolean }[]>([]);

  // 2. 1초마다 현재 상태(심박수, 시선) 스냅샷 저장
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      // 집중 판단 기준: 시선 좌표가 존재하고(0,0 아님) 심박수가 정상 측정될 때
      const isCurrentlyFocused = coordinates.x > 0 && bpm > 0;

      setStats((prev) => [
        ...prev,
        {
          time: Date.now(),
          bpm: bpm,
          isFocus: isCurrentlyFocused,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, bpm, coordinates]);

  // 3. 종료 버튼 클릭 시 통계 계산 및 이동
  const handleComplete = () => {
    if (stats.length === 0) {
      alert("데이터가 충분히 수집되지 않았습니다.");
      return;
    }

    // 평균 심박수 계산 (0 제외)
    const validBpms = stats.filter((s) => s.bpm > 0).map((s) => s.bpm);
    const avgBpm = validBpms.length > 0 
      ? Math.round(validBpms.reduce((a, b) => a + b) / validBpms.length) 
      : 0;

    // 집중도 비율 (%)
    const focusCount = stats.filter((s) => s.isFocus).length;
    const focusRatio = Math.round((focusCount / stats.length) * 100);

    // 결과 페이지로 이동 (URL 파라미터에 데이터 포함)
    router.push(`/result?avgBpm=${avgBpm}&focusRatio=${focusRatio}&totalTime=${stats.length}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 overflow-hidden">
      <Script 
        src="https://docs.opencv.org/4.5.2/opencv.js" 
        strategy="beforeInteractive" 
      />
      <Script src="/webgazer.js" strategy="lazyOnload" onLoad={initWebGazer} />
      <Script src="/heartbeat.js" strategy="lazyOnload" />

      {/* 분석용 캔버스 (rPPG 내부 동작을 위해 필요) */}
      <canvas 
        id="heartbeatCanvas" 
        width="640" 
        height="480" 
        className="fixed top-0 left-0 pointer-events-none z-10 opacity-0" 
      />

      {!isLoaded && <LoadingView />}
      
      {isLoaded && (
        <>
          {/* 실시간 심박수 UI */}
          <div className="fixed bottom-10 right-10 bg-slate-800/90 p-6 rounded-2xl shadow-2xl border border-pink-500/50 backdrop-blur-md z-30">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">Live Heart Rate</h2>
            <p className="text-4xl font-mono font-bold text-pink-500">
              {bpm > 0 ? bpm : '--'} <span className="text-sm text-slate-500 font-sans">BPM</span>
            </p>
          </div>

          {/* 학습 종료 버튼 */}
          <button 
            onClick={handleComplete}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl z-50 transition-all active:scale-95"
          >
            학습 종료 및 통계 보기
          </button>

          <GazeDashboard x={coordinates.x} y={coordinates.y} />
          <GazeDot x={coordinates.x} y={coordinates.y} />
          
          {coordinates.x === 0 && (
             <div className="fixed top-10 border-2 border-red-500 p-6 rounded-2xl animate-bounce bg-slate-900/80 z-50 text-white">
                🎯 사용 전 화면 모퉁이 부분을 클릭 + 시선집중으로 교정을 시작하세요!
             </div>
          )}
        </>
      )}
    </main>
  );
}