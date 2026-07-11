import React from 'react';
import { useSystem } from '../context/SystemContext';
import { BlockType } from '../types';
import { Brain, Coffee, Zap, Moon, BookOpen } from 'lucide-react';

export const BlockStatus: React.FC = () => {
  const { currentBlock, nextBlock } = useSystem();

  if (!currentBlock) return <div className="text-gray-500">SYSTEM IDLE</div>;

  const getIcon = (type: BlockType) => {
    switch (type) {
      case BlockType.DEEP_WORK: return <Brain className="w-8 h-8 text-nexus-red animate-pulse" />;
      case BlockType.BREAK: return <Coffee className="w-8 h-8 text-nexus-yellow" />;
      case BlockType.HABIT: return <Zap className="w-8 h-8 text-nexus-green" />;
      case BlockType.SLEEP: return <Moon className="w-8 h-8 text-indigo-500" />;
      case BlockType.CLASS: return <BookOpen className="w-8 h-8 text-blue-500" />;
      default: return <Brain className="w-8 h-8 text-gray-500" />;
    }
  };

  const getBorderColor = (type: BlockType) => {
    switch (type) {
      case BlockType.DEEP_WORK: return 'border-nexus-red bg-nexus-red/10';
      case BlockType.BREAK: return 'border-nexus-yellow bg-nexus-yellow/10';
      case BlockType.HABIT: return 'border-nexus-green bg-nexus-green/10';
      default: return 'border-nexus-800 bg-nexus-800/50';
    }
  };

  return (
    <div className={`w-full p-6 border-l-4 ${getBorderColor(currentBlock.type)} rounded-r-lg mb-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-400 tracking-[0.2em] uppercase">Current Protocol</span>
        {getIcon(currentBlock.type)}
      </div>
      <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-1">
        {currentBlock.name}
      </h2>
      <div className="flex justify-between items-end">
        <span className="font-mono text-nexus-blue">{currentBlock.startTime} — {currentBlock.endTime}</span>
        <div className="text-right">
           <span className="text-xs text-gray-500 block uppercase">Next Up</span>
           <span className="text-sm text-gray-300">{nextBlock?.name}</span>
        </div>
      </div>
      
      {currentBlock.requiredHabits && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-gray-500 uppercase mb-2 block">Required Check-ins</span>
          <div className="flex gap-2 flex-wrap">
            {currentBlock.requiredHabits.map(h => (
              <span key={h} className="px-2 py-1 bg-white/5 border border-white/10 text-xs rounded text-gray-300 font-mono">
                [ ] {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};