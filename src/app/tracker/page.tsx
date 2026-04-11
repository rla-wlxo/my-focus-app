'use client';

import { useState, useEffect } from 'react';
import { PairingData } from '../../types/tracker';

export default function TrackerPage() {
  const [code, setCode] = useState<string>('');
  const [data, setData] = useState<PairingData | null>(null);

  // 1. 초기 코드 생성
// 1. 초기 코드 생성 전용
useEffect(() => {
    const fetchCode = async () => {
        try {
            const res = await fetch('/api/pair/generate');
            const json = await res.json();
            if (json.pairingCode) {
                setCode(json.pairingCode); // 여기서 code가 설정됩니다.
            }
        } catch (err) {
            console.error("코드 생성 실패:", err);
        }
    };
    fetchCode();
}, []);

// 2. 실시간 상태 폴링 (code가 변할 때만 작동)
useEffect(() => {
    // 🚀 중요: code가 빈 문자열('')이면 서버에 요청하지 않도록 방어막을 칩니다.
    if (!code) return;

    const interval = setInterval(async () => {
        try {
            const res = await fetch(`/api/pair/status?code=${code}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error("데이터 가져오기 실패:", err);
        }
    }, 2000);

    return () => clearInterval(interval);
}, [code]); // code가 생성되는 순간 이 useEffect가 감지해서 돌아갑니다.
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">FocusTracker Dashboard</h1>
      
      {(!data || data.heartRate === 0) ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">아이폰 앱에 아래 코드를 입력하세요</p>
          <span className="text-6xl font-black tracking-widest text-blue-500">{code}</span>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-green-400 mb-2">● 실시간 연결 중</p>
          <div className="flex items-baseline gap-2">
            <span className="text-9xl font-black">{data.heartRate}</span>
            <span className="text-3xl text-gray-500">BPM</span>
          </div>
        </div>
      )}
    </main>
  );
}