import React from 'react';
import { useSystem } from '../context/SystemContext';
import { AlertCircle, Activity, ShieldAlert } from 'lucide-react';

export const NudgeOverlay: React.FC = () => {
  const { activeNudge, dismissNudge } = useSystem();

  if (!activeNudge) return null;

  const getIcon = () => {
    switch (activeNudge.type) {
      case 'CRITICAL': return <ShieldAlert className="w-8 h-8 text-nexus-red animate-bounce" />;
      case 'HEALTH': return <Activity className="w-8 h-8 text-nexus-blue animate-pulse" />;
      default: return <AlertCircle className="w-8 h-8 text-nexus-yellow" />;
    }
  };

  const getColors = () => {
    switch (activeNudge.type) {
      case 'CRITICAL': return 'border-nexus-red bg-nexus-red/10';
      case 'HEALTH': return 'border-nexus-blue bg-nexus-blue/10';
      default: return 'border-nexus-yellow bg-nexus-yellow/10';
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className={`pointer-events-auto max-w-lg w-full bg-black border-2 ${getColors()} shadow-2xl rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-top-10 duration-300`}>
        {getIcon()}
        <div className="flex-1">
          <h4 className="text-xs font-mono font-bold tracking-widest uppercase opacity-70 mb-1">
            System Interruption // {activeNudge.type}
          </h4>
          <p className="text-lg font-bold text-white leading-tight">
            {activeNudge.message}
          </p>
        </div>
        <button 
          onClick={dismissNudge}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono px-4 py-2 rounded transition-colors uppercase"
        >
          {activeNudge.actionLabel || "ACKNOWLEDGE"}
        </button>
      </div>
    </div>
  );
};