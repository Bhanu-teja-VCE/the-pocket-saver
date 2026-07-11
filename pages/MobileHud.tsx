import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { ClockWidget } from '../components/ClockWidget';
import { BlockType } from '../types';
import { Check, X, AlertTriangle, Smartphone, Brain, Coffee, Zap } from 'lucide-react';
import { NudgeOverlay } from '../components/NudgeOverlay';

export const MobileHud: React.FC = () => {
  const { currentBlock, nextBlock, logDistraction, markBlockStatus } = useSystem();
  const [showDistractionMenu, setShowDistractionMenu] = useState(false);
  
  const getStatusColor = () => {
    switch(currentBlock?.type) {
      case BlockType.DEEP_WORK: return 'text-nexus-red';
      case BlockType.BREAK: return 'text-nexus-green';
      default: return 'text-nexus-blue';
    }
  };

  const handleDistractionClick = () => {
    setShowDistractionMenu(true);
  };

  const submitDistraction = (reason: 'PHONE' | 'SOCIAL' | 'DAYDREAM' | 'FATIGUE') => {
    logDistraction(reason);
    setShowDistractionMenu(false);
  };

  return (
    <div className="h-full flex flex-col p-4 relative overflow-hidden bg-black">
      <NudgeOverlay />
      
      {/* Background Ambience */}
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-${currentBlock?.type === BlockType.DEEP_WORK ? 'nexus-red' : 'nexus-blue'} to-transparent opacity-50`} />

      {/* Distraction Modal Overlay */}
      {showDistractionMenu && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
           <h2 className="text-nexus-red font-mono font-bold text-xl mb-6 uppercase tracking-widest">Identify Interruption</h2>
           <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
             <button onClick={() => submitDistraction('PHONE')} className="p-6 bg-gray-900 border border-gray-800 rounded flex flex-col items-center hover:bg-nexus-red/20 hover:border-nexus-red">
               <Smartphone className="mb-2 text-gray-400" /> <span className="text-xs font-mono uppercase">Device</span>
             </button>
             <button onClick={() => submitDistraction('SOCIAL')} className="p-6 bg-gray-900 border border-gray-800 rounded flex flex-col items-center hover:bg-nexus-red/20 hover:border-nexus-red">
               <Zap className="mb-2 text-gray-400" /> <span className="text-xs font-mono uppercase">Social</span>
             </button>
             <button onClick={() => submitDistraction('DAYDREAM')} className="p-6 bg-gray-900 border border-gray-800 rounded flex flex-col items-center hover:bg-nexus-red/20 hover:border-nexus-red">
               <Brain className="mb-2 text-gray-400" /> <span className="text-xs font-mono uppercase">Drift</span>
             </button>
             <button onClick={() => submitDistraction('FATIGUE')} className="p-6 bg-gray-900 border border-gray-800 rounded flex flex-col items-center hover:bg-nexus-red/20 hover:border-nexus-red">
               <Coffee className="mb-2 text-gray-400" /> <span className="text-xs font-mono uppercase">Fatigue</span>
             </button>
           </div>
           <button onClick={() => setShowDistractionMenu(false)} className="mt-8 text-gray-500 underline text-sm">Cancel</button>
        </div>
      )}

      <div className="mt-8 mb-8">
        <ClockWidget size="lg" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div>
          <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Currently Executing</span>
          <h1 className={`text-4xl font-black uppercase leading-tight mt-2 ${getStatusColor()}`}>
            {currentBlock?.name || "FREE TIME"}
          </h1>
        </div>

        {currentBlock?.type === BlockType.DEEP_WORK && (
          <div className="animate-pulse px-4 py-1 border border-nexus-red text-nexus-red font-mono text-xs rounded-full">
            NO DISTRACTIONS ALLOWED
          </div>
        )}

        <div className="w-full max-w-xs bg-nexus-900/50 p-4 rounded-lg border border-gray-800">
           <span className="text-xs text-gray-500 block mb-1">UP NEXT</span>
           <span className="text-lg font-bold text-gray-300">{nextBlock?.name}</span>
           <span className="text-sm font-mono text-gray-500 block">{nextBlock?.startTime}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
        <button 
          onClick={() => markBlockStatus(currentBlock?.id || '0', true)}
          className="h-24 bg-nexus-green/10 border border-nexus-green/30 rounded-lg flex flex-col items-center justify-center active:bg-nexus-green/30 transition-colors"
        >
          <Check className="w-8 h-8 text-nexus-green mb-2" />
          <span className="text-xs font-bold text-nexus-green uppercase">On Track</span>
        </button>
        <button 
           onClick={handleDistractionClick}
           className="h-24 bg-nexus-red/10 border border-nexus-red/30 rounded-lg flex flex-col items-center justify-center active:bg-nexus-red/30 transition-colors"
        >
          <AlertTriangle className="w-8 h-8 text-nexus-red mb-2" />
          <span className="text-xs font-bold text-nexus-red uppercase">Distracted</span>
        </button>
      </div>
    </div>
  );
};