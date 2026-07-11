import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ScheduleBlock, Task, DayLog, SystemState, Nudge, DistractionEvent, BlockType } from '../types';
import { getDailySchedule, INITIAL_TASKS } from '../constants';

interface SystemContextType extends SystemState {
  toggleTask: (id: string) => void;
  markBlockStatus: (blockId: string, success: boolean) => void;
  logDistraction: (reason: DistractionEvent['reason']) => void;
  dismissNudge: () => void;
  recoverDay: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNudge, setActiveNudge] = useState<Nudge | null>(null);
  const [lastNudgeTime, setLastNudgeTime] = useState<number>(0);
  const [distractions, setDistractions] = useState<DistractionEvent[]>([]);

  // Calculate schedule dynamically based on the current day
  const schedule = useMemo(() => {
    return getDailySchedule(currentTime);
  }, [currentTime.getDay()]); // Re-calculates only when the day of week changes

  // 1. Real-time Clock & Nudge Engine
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Nudge Logic Check (Every minute)
      checkNudgeTriggers(now);
    }, 1000 * 60); 

    return () => clearInterval(timer);
  }, [schedule, lastNudgeTime]);

  // Helper to parse "HH:MM" to minutes from midnight
  const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const currentBlock = useMemo(() => {
    return schedule.find(block => {
      const start = getMinutes(block.startTime);
      const end = getMinutes(block.endTime);
      // Handle overnight blocks
      if (end < start) {
        return currentMinutes >= start || currentMinutes < end;
      }
      return currentMinutes >= start && currentMinutes < end;
    }) || null;
  }, [currentMinutes, schedule]);

  const nextBlock = useMemo(() => {
    // Basic sorting to ensure sequence
    const sortedSchedule = [...schedule].sort((a, b) => getMinutes(a.startTime) - getMinutes(b.startTime));
    const currentIndex = sortedSchedule.findIndex(b => b.id === currentBlock?.id);
    
    if (currentIndex === -1) {
        // If no current block (gap), find next upcoming
        return sortedSchedule.find(b => getMinutes(b.startTime) > currentMinutes) || sortedSchedule[0];
    }
    
    return sortedSchedule[(currentIndex + 1) % sortedSchedule.length];
  }, [currentBlock, schedule, currentMinutes]);

  // 2. Intelligent Task Prioritization
  const strategicTask = useMemo(() => {
    const incompleteTasks = tasks.filter(t => !t.isComplete);
    if (incompleteTasks.length === 0) return null;

    return incompleteTasks.reduce((prev, curr) => {
      const getScore = (task: Task) => {
        let score = 0;
        // Base Priority
        if (task.priority === 'HIGH') score += 50;
        if (task.priority === 'NORMAL') score += 20;
        
        // Deadline Urgency
        if (task.deadline) {
            const daysLeft = (new Date(task.deadline).getTime() - currentTime.getTime()) / (1000 * 3600 * 24);
            if (daysLeft < 1) score += 40;
            else if (daysLeft < 3) score += 20;
        }

        // Quick Win Bonus (if short task)
        if (task.estimatedMinutes <= 30) score += 5;

        return score;
      };

      return getScore(curr) > getScore(prev) ? curr : prev;
    });
  }, [tasks, currentTime]);

  const checkNudgeTriggers = (now: Date) => {
    const nowMs = now.getTime();
    if (nowMs - lastNudgeTime < 1000 * 60 * 30) return; // Cooldown 30 mins

    // Rule: Deep Work Protocol
    if (currentBlock?.type === BlockType.DEEP_WORK) {
        // Mocking duration since start of block
        const startMinutes = getMinutes(currentBlock.startTime);
        const duration = currentMinutes - startMinutes;
        
        if (duration > 50) {
            triggerNudge({
                id: Date.now().toString(),
                message: "COGNITIVE LOAD HIGH. EXECUTE OPTICAL RESET (20s).",
                type: 'HEALTH',
                actionLabel: "RESET COMPLETE"
            });
            return;
        }
    }

    // Rule: Hydration Check (Generic)
    if (now.getHours() % 2 === 0 && now.getMinutes() === 0) {
        triggerNudge({
            id: Date.now().toString(),
            message: "HYDRATION CHECK REQUIRED.",
            type: 'HEALTH'
        });
    }
  };

  const triggerNudge = (nudge: Nudge) => {
    setActiveNudge(nudge);
    setLastNudgeTime(Date.now());
  };

  const dismissNudge = () => {
    setActiveNudge(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isComplete: !t.isComplete } : t));
  };

  const markBlockStatus = (blockId: string, success: boolean) => {
    console.log(`Block ${blockId} marked as ${success ? 'SUCCESS' : 'FAIL'}`);
  };

  const logDistraction = (reason: DistractionEvent['reason']) => {
    const newDistraction: DistractionEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        reason
    };
    setDistractions(prev => [...prev, newDistraction]);
    console.log("Distraction Logged:", reason);
  };

  const recoverDay = () => {
    console.log("Recovery Protocol Initiated");
  };

  // Re-compose logs to include current session distractions
  const currentLog: DayLog = {
      date: new Date().toISOString().split('T')[0],
      completedBlocks: [],
      missedBlocks: [],
      distractions: distractions,
      moodScore: 0
  };
  const allLogs = [...logs, currentLog];

  return (
    <SystemContext.Provider value={{
      schedule,
      tasks,
      logs: allLogs,
      currentTime,
      currentBlock,
      nextBlock,
      activeNudge,
      strategicTask,
      toggleTask,
      markBlockStatus,
      logDistraction,
      dismissNudge,
      recoverDay
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};