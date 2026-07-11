import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSystem } from '../context/SystemContext';
import { BlockStatus } from '../components/BlockStatus';
import { TaskList } from '../components/TaskList';
import { ClockWidget } from '../components/ClockWidget';
import { NudgeOverlay } from '../components/NudgeOverlay';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateSupervisorResponse } from '../services/geminiService';
import { Send, Terminal, Zap, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Dashboard: React.FC = () => {
  const { currentBlock, tasks, currentTime, schedule, strategicTask, logs } = useSystem();
  
  // Calculate Distraction Impact
  const todayDistractions = logs[logs.length - 1]?.distractions.length || 0;
  const focusScore = Math.max(0, 100 - (todayDistractions * 5));

  // Compute Real Analytics Data (Last 7 Days)
  const analyticsData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    
    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      
      let score = 0;
      if (log) {
         const total = log.completedBlocks.length + log.missedBlocks.length;
         if (total > 0) {
           score = Math.round((log.completedBlocks.length / total) * 100);
         }
      }
      
      data.push({
        name: days[d.getDay()],
        score: score,
        fullDate: dateStr
      });
    }
    return data;
  }, [logs]);

  // AI Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'NEXUS SYSTEM ONLINE. AWAITING INPUT.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const context = {
        currentTime,
        currentBlock,
        pendingTasks: tasks.filter(t => !t.isComplete).length,
        distractionsToday: todayDistractions,
        schedule: schedule.slice(0, 5) 
    };

    const response = await generateSupervisorResponse(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response || "ERROR" }]);
    setIsTyping(false);
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return '#374151'; // Gray for empty
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Yellow
    return '#f43f5e'; // Red
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full p-6 relative">
      <NudgeOverlay />
      
      {/* Left Col: Status & Tasks (4 cols) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        <div className="bg-nexus-900 border border-gray-800 p-4 rounded-lg shadow-lg">
          <ClockWidget />
        </div>
        
        <BlockStatus />

        {/* Strategic Focus Box */}
        {strategicTask && !strategicTask.isComplete && (
            <div className="bg-gradient-to-r from-nexus-900 to-black border border-nexus-green/30 p-4 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Zap className="w-16 h-16 text-nexus-green" />
                </div>
                <h4 className="text-xs font-mono text-nexus-green uppercase tracking-widest mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> Strategic Priority
                </h4>
                <div className="text-xl font-bold text-white mb-1">{strategicTask.title}</div>
                <div className="flex gap-4 text-xs font-mono text-gray-400">
                    <span>EST: {strategicTask.estimatedMinutes}m</span>
                    <span>IMPACT SCORE: HIGH</span>
                </div>
            </div>
        )}
        
        <div className="flex-1 bg-nexus-900 border border-gray-800 p-4 rounded-lg overflow-y-auto">
          <TaskList />
        </div>
      </div>

      {/* Middle Col: Analytics & Schedule (5 cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div className="bg-nexus-900 border border-gray-800 p-4 rounded-lg h-64 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Weekly Execution</h3>
            <div className="flex gap-4">
                <div className="text-right">
                    <span className="block text-[10px] text-gray-500 uppercase">Focus Eff.</span>
                    <span className={`block font-mono font-bold ${getScoreColor(focusScore)}`}>{focusScore}%</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-gray-500 uppercase">Distractions</span>
                    <span className="block font-mono font-bold text-nexus-red">{todayDistractions}</span>
                </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                />
                <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                    {analyticsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 bg-nexus-900 border border-gray-800 p-4 rounded-lg overflow-hidden flex flex-col">
           <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Daily Schedule</h3>
           <div className="flex-1 overflow-y-auto pr-2 space-y-1">
             {schedule.map(block => (
               <div key={block.id} className={`flex text-sm p-2 rounded ${currentBlock?.id === block.id ? 'bg-white/5 border-l-2 border-nexus-blue' : ''}`}>
                 <span className="w-16 font-mono text-gray-500 text-xs">{block.startTime}</span>
                 <span className={`${currentBlock?.id === block.id ? 'text-white font-bold' : 'text-gray-400'}`}>{block.name}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Right Col: AI Supervisor (3 cols) */}
      <div className="lg:col-span-3 bg-black border border-gray-800 rounded-lg flex flex-col overflow-hidden shadow-2xl">
        <div className="p-3 border-b border-gray-800 bg-nexus-950 flex items-center">
          <Terminal className="w-4 h-4 text-nexus-green mr-2" />
          <span className="text-xs font-mono text-nexus-green tracking-widest">NEXUS SUPERVISOR</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm" ref={scrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded max-w-[90%] ${
                m.role === 'user' 
                  ? 'bg-nexus-800 text-gray-200 border border-gray-700' 
                  : 'bg-nexus-900/50 text-nexus-green border border-nexus-green/20'
              }`}>
                {m.role === 'assistant' ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="text-xs text-gray-500 animate-pulse">PROCESSING...</div>
          )}
        </div>

        <div className="p-3 border-t border-gray-800 bg-nexus-950">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-nexus-900 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-nexus-blue placeholder-gray-600 font-mono"
              placeholder="Report status..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 bg-nexus-blue/20 border border-nexus-blue/50 rounded text-nexus-blue hover:bg-nexus-blue/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};