import React from 'react';
import { useSystem } from '../context/SystemContext';

export const ClockWidget: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => {
  const { currentTime } = useSystem();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <div className={`${size === 'lg' ? 'text-6xl md:text-8xl' : 'text-2xl'} font-bold tracking-tighter text-nexus-blue`}>
        {formatTime(currentTime)}
      </div>
      <div className={`${size === 'lg' ? 'text-xl text-gray-400' : 'text-xs text-gray-500'} uppercase tracking-widest`}>
        {formatDate(currentTime)}
      </div>
    </div>
  );
};