// components/GazeDashboard.tsx
import React from 'react';

// Props 타입 정의
interface GazeDashboardProps {
  x: number;
  y: number;
}

const GazeDashboard: React.FC<GazeDashboardProps> = ({ x, y }) => {
  return (
    <div className="fixed bottom-10 left-10 bg-slate-800/90 p-6 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md z-20">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Real-time Gaze</h2>
      
      <div className="flex gap-6">
        {/* X 좌표 */}
        <p className="text-4xl font-mono font-bold text-green-400">
          <span className="text-slate-500 text-lg mr-1">X</span> {x}
        </p>
        
        {/* Y 좌표 */}
        <p className="text-4xl font-mono font-bold text-green-400">
          <span className="text-slate-500 text-lg mr-1">Y</span> {y}
        </p>
      </div>
    </div>
  );
};

export default GazeDashboard;