'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useWebGazer } from '@/hooks/useWebGazer';
import { useRPPG } from '@/hooks/useRPPG';
import LoadingView from '@/components/LoadingView';
import GazeDashboard from '@/components/GazeDashboard';
import GazeDot from '@/components/GazeDot';

export default function EyeTrackingPage() {
  const router = useRouter();
  const { coordinates, isLoaded, initWebGazer } = useWebGazer();
  
  // 1. 웹캠 심박수 (rPPGBpm으로 이름 고정)
  const { bpm: rPPGBpm } = useRPPG('webgazerVideoFeed', isLoaded);
  // 2. 애플워치 심박수
  const [watchBpm, setWatchBpm] = useState(0);

  const [stats, setStats] = useState<{ time: number; bpm: number; isFocus: boolean }[]>([]);

  // 데이터 수집 로직 (rPPGBpm 변수명 수정)
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      // ❌ 기존 bpm -> ✅ rPPGBpm으로 수정 (Reference Error 해결)
      const isCurrentlyFocused = coordinates.x > 0 && rPPGBpm > 0;

      setStats((prev) => [
        ...prev,
        {
          time: Date.now(),
          bpm: rPPGBpm, // 어떤 데이터를 저장할지 선택 (여기선 웹캠)
          isFocus: isCurrentlyFocused,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, rPPGBpm, coordinates]); // 의존성 배열에 rPPGBpm 추가

  // 애플워치 데이터 Polling
  useEffect(() => {
    const fetchWatchData = async () => {
      try {
        const res = await fetch('/api/heartrate');
        const data = await res.json();
        if (data.bpm > 0) setWatchBpm(data.bpm);
      } catch (e) {
        console.error("워치 데이터 로드 실패", e);
      }
    };

    const interval = setInterval(fetchWatchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    if (stats.length === 0) {
      alert("데이터가 충분히 수집되지 않았습니다.");
      return;
    }

    const validBpms = stats.filter((s) => s.bpm > 0).map((s) => s.bpm);
    const avgBpm = validBpms.length > 0 
      ? Math.round(validBpms.reduce((a, b) => a + b) / validBpms.length) 
      : 0;

    const focusCount = stats.filter((s) => s.isFocus).length;
    const focusRatio = Math.round((focusCount / stats.length) * 100);

    router.push(`/result?avgBpm=${avgBpm}&focusRatio=${focusRatio}&totalTime=${stats.length}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 overflow-hidden">
      <Script src="https://docs.opencv.org/4.5.2/opencv.js" strategy="beforeInteractive" />
      <Script src="/webgazer.js" strategy="lazyOnload" onLoad={initWebGazer} />
      <Script src="/heartbeat.js" strategy="lazyOnload" />

      <canvas id="heartbeatCanvas" width="640" height="480" className="fixed top-0 left-0 pointer-events-none z-10 opacity-0" />

      {!isLoaded && <LoadingView />}
      
      {isLoaded && (
        <>
          {/* UI가 빠져있어서 추가했습니다. */}
          <GazeDashboard x={coordinates.x} y={coordinates.y} />
          <GazeDot x={coordinates.x} y={coordinates.y} />

          <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-30">
            <div className="bg-slate-800/90 p-6 rounded-2xl border border-pink-500/50 backdrop-blur-md shadow-xl">
              <h2 className="text-xs font-semibold text-pink-400 mb-1 uppercase">Webcam (rPPG)</h2>
              <p className="text-4xl font-mono font-bold text-pink-500">
                {rPPGBpm > 0 ? rPPGBpm : '--'} <span className="text-sm text-slate-500">BPM</span>
              </p>
            </div>

            <div className="bg-slate-800/90 p-6 rounded-2xl border border-blue-500/50 backdrop-blur-md shadow-xl">
              <h2 className="text-xs font-semibold text-blue-400 mb-1 uppercase">Apple Watch</h2>
              <p className="text-4xl font-mono font-bold text-blue-500">
                {watchBpm > 0 ? Math.round(watchBpm) : '--'} <span className="text-sm text-slate-500">BPM</span>
              </p>
            </div>
          </div>

          <button 
            onClick={handleComplete}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-full shadow-2xl z-50 transition-all active:scale-95"
          >
            측정 종료 및 결과 보기
          </button>
        </>
      )}
    </main>
  );
}