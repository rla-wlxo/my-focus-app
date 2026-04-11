import { useState, useEffect } from 'react';

export function useRPPG(videoElementId: string, isLoaded: boolean) {
  const [bpm, setBpm] = useState<number>(0);

  useEffect(() => {
    const win = window as any;
    if (!isLoaded || !win.cv || !win.Heartbeat) return;

    let hb: any = null;

    const startEngine = async () => {
      // 1. WebGazer가 비디오 태그를 생성할 때까지 최대 3초간 대기
      let video = document.getElementById(videoElementId);
      let attempts = 0;
      while (!video && attempts < 30) {
        await new Promise(r => setTimeout(r, 100));
        video = document.getElementById(videoElementId);
        attempts++;
      }

      if (!video) {
        console.error("비디오 태그를 찾을 수 없습니다.");
        return;
      }

      try {
        hb = new win.Heartbeat(
          videoElementId,
          'heartbeatCanvas',
          '/haarcascade_frontalface_alt.xml',
          30, 6, 1000 
        );

        // 2. BPM 업데이트 가로채기
        hb.drawBPM = (calculatedBpm: number) => {
          if (calculatedBpm > 40 && calculatedBpm < 180) {
            setBpm(Math.round(calculatedBpm));
          }
        };

        await hb.init();
      } catch (error) {
        console.error("rPPG 실행 실패:", error);
      }
    };

    startEngine();

    return () => { if (hb) hb.stop(); };
  }, [videoElementId, isLoaded]);

  return { bpm };
}