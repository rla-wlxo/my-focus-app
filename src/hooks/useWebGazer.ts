import { useState, useEffect, useCallback } from 'react';

export function useWebGazer() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const initWebGazer = useCallback(() => {
    //webgazer 초기화 해서 시선 데이터 받아오기 시작
    const wg = (window as any).webgazer;
    if (!wg) return;

    wg.setGazeListener((data: any) => {
      if (data) setCoordinates({ x: Math.floor(data.x), y: Math.floor(data.y) });
    }).begin();

    wg.showVideoPreview(true).showPredictionPoints(false);

    setTimeout(() => {
      const video = document.getElementById('webgazerVideoFeed');
      if (video) {
        Object.assign(video.style, {
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: '640px',
          borderRadius: '20px', zIndex: '5',
        });
      }
      setIsLoaded(true);
    }, 1000);
  }, []);

  //컴포넌트 언마운트 시 웹게이저 정리
  useEffect(() => {
    return () => {
      const wg = (window as any).webgazer;
      if (wg) { wg.pause(); wg.end(); }
    };
  }, []);

  return { coordinates, isLoaded, initWebGazer };
}