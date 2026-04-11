'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WebcamView from '@/components/WebcamView';
import GazeDashboard from '@/components/GazeDashboard';
import { useWebGazer } from '@/hooks/useWebGazer';
import { useRPPG } from '@/hooks/useRPPG';

export default function HomePage() {
  const router = useRouter();
  const { coordinates, isLoaded, initWebGazer } = useWebGazer();
  const { bpm } = useRPPG('webgazerVideoFeed', isLoaded);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // webgazer.js와 heartbeat.js 로드
    const script1 = document.createElement('script');
    script1.src = '/webgazer.js';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = '/heartbeat.js';
    script2.async = true;

    script1.onload = () => {
      document.body.appendChild(script2);
      script2.onload = () => {
        setScriptsLoaded(true);
      };
    };

    document.body.appendChild(script1);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    if (scriptsLoaded) {
      initWebGazer();
    }
  }, [scriptsLoaded, initWebGazer]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">집중도 모니터링</h1>
            <p className="text-slate-400">카메라, 심박수, 시선 데이터 실시간 추적</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/tracker')}
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
          >
            ⌚ 애플워치 연동
          </button>
        </div>

        {/* 메인 대시보드 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 왼쪽: 카메라 및 시선 데이터 */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl bg-slate-900/70 p-6 shadow-2xl ring-1 ring-white/5">
              <WebcamView />
              {isLoaded && <GazeDashboard x={coordinates.x} y={coordinates.y} />}
              
              {/* 심박수 표시 */}
              <div className="absolute top-6 right-6 rounded-xl bg-slate-950/90 px-4 py-3 ring-1 ring-slate-600/50">
                <p className="text-xs uppercase tracking-wider text-slate-400">심박수</p>
                <p className="mt-1 text-3xl font-bold text-red-400">{bpm}</p>
                <p className="text-xs text-slate-500">BPM</p>
              </div>

              {/* 캔버스 요소들 */}
              <canvas id="heartbeatCanvas" style={{ display: 'none' }} />
            </div>
          </div>

          {/* 오른쪽: 정보 패널 */}
          <div className="space-y-4">
            {/* 상태 카드 */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900/30 to-slate-900/70 p-4 ring-1 ring-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <p className="text-sm text-slate-400">카메라</p>
                  <p className="font-semibold text-emerald-400">활성</p>
                </div>
              </div>
            </div>

            {/* 시선 추적 상태 */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900/70 p-4 ring-1 ring-blue-500/20">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isLoaded ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}></div>
                <div>
                  <p className="text-sm text-slate-400">시선 추적</p>
                  <p className={`font-semibold ${isLoaded ? 'text-blue-400' : 'text-slate-500'}`}>
                    {isLoaded ? '로드됨' : '로드 중...'}
                  </p>
                </div>
              </div>
            </div>

            {/* 심박수 상태 */}
            <div className="rounded-2xl bg-gradient-to-br from-red-900/30 to-slate-900/70 p-4 ring-1 ring-red-500/20">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${bpm > 0 ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`}></div>
                <div>
                  <p className="text-sm text-slate-400">심박 분석</p>
                  <p className={`font-semibold ${bpm > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                    {bpm > 0 ? '감지됨' : '감지 대기 중'}
                  </p>
                </div>
              </div>
            </div>

            {/* 결과 페이지 버튼 */}
            <button
              type="button"
              onClick={() => router.push('/result')}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-4 py-3 font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              결과 보기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

