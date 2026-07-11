import React from 'react';
import { useSystem } from '../context/SystemContext';
import { CheckSquare, Square, Target } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { tasks, toggleTask, strategicTask } = useSystem();
  
  // Sort: Strategic task first, then standard priority sort
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.id === strategicTask?.id) return -1;
    if (b.id === strategicTask?.id) return 1;
    // Secondary sort by priority
    const pScore = { 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
    return pScore[b.priority] - pScore[a.priority];
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 flex justify-between">
        <span>Active Directives</span>
        {strategicTask && <span className="text-nexus-green">AI OPTIMIZED</span>}
      </h3>
      
      <div className="space-y-2">
        {sortedTasks.map(task => {
          const isStrategic = task.id === strategicTask?.id && !task.isComplete;
          
          return (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-center p-3 rounded transition-all cursor-pointer border ${
                isStrategic 
                  ? 'bg-nexus-green/5 border-nexus-green/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                  : task.isComplete
                    ? 'bg-nexus-900 border-gray-800 opacity-50'
                    : 'bg-nexus-800/30 border-gray-700 hover:border-gray-500'
              }`}
            >
              {task.isComplete ? (
                <CheckSquare className="w-5 h-5 text-gray-500 mr-3" />
              ) : isStrategic ? (
                <Target className="w-5 h-5 text-nexus-green mr-3 animate-pulse" />
              ) : (
                <Square className={`w-5 h-5 mr-3 ${task.priority === 'HIGH' ? 'text-nexus-red' : 'text-gray-500'}`} />
              )}
              
              <div className="flex-1">
                <div className={`text-sm font-bold ${isStrategic ? 'text-white' : task.isComplete ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {task.title}
                </div>
                
                <div className="flex gap-2 mt-1">
                  {isStrategic && (
                     <span className="text-[10px] bg-nexus-green/20 text-nexus-green px-1 rounded font-mono">
                       STRATEGIC PRIORITY
                     </span>
                  )}
                  {task.priority === 'HIGH' && !isStrategic && (
                    <span className="text-[10px] text-nexus-red font-mono">CRITICAL</span>
                  )}
                  {task.deadline && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      DUE: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};