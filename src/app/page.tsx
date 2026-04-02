'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useWebGazer } from '@/hooks/useWebGazer';
import { useRPPG } from '@/hooks/useRPPG'; // 1. 훅 임포트
import LoadingView from '@/components/LoadingView';
import GazeDashboard from '@/components/GazeDashboard';
import GazeDot from '@/components/GazeDot';

export default function EyeTrackingPage() {
  const { coordinates, isLoaded, initWebGazer } = useWebGazer();
  
  // 2. rPPG 훅 호출
  // WebGazer가 만든 비디오 태그 ID인 'webgazerVideoFeed'를 전달합니다.
  const { bpm } = useRPPG('webgazerVideoFeed', isLoaded);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 overflow-hidden">
      {/* 라이브러리 로드 순서 최적화 */}
      <Script 
        src="https://docs.opencv.org/4.5.2/opencv.js" 
        strategy="beforeInteractive" 
      />
      <Script src="/webgazer.js" strategy="lazyOnload" onLoad={initWebGazer} />
      <Script src="/heartbeat.js" strategy="lazyOnload" />

      {!isLoaded && <LoadingView />}
      
      {isLoaded && (
        <>
          {/* 심박수 표시 UI 추가 */}
          <div className="fixed bottom-10 right-10 bg-slate-800/90 p-6 rounded-2xl shadow-2xl border border-pink-500/50 backdrop-blur-md z-30">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-pink-400 mb-2">Heart Rate (rPPG)</h2>
            <p className="text-4xl font-mono font-bold text-pink-500">
              {bpm > 0 ? bpm : '--'} <span className="text-lg text-slate-500">BPM</span>
            </p>
          </div>

          <GazeDashboard x={coordinates.x} y={coordinates.y} />
          <GazeDot x={coordinates.x} y={coordinates.y} />
          
          {coordinates.x === 0 && (
             <div className="fixed top-10 border-2 border-red-500 p-6 rounded-2xl animate-bounce bg-slate-900/80 z-50">
                🎯 화면 끝과 끝을 클릭하며 교정을 시작하세요!
             </div>
          )}
        </>
      )}
    </main>
  );
}