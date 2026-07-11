export enum BlockType {
  DEEP_WORK = 'DEEP_WORK',
  CLASS = 'CLASS',
  HABIT = 'HABIT',
  BREAK = 'BREAK',
  SLEEP = 'SLEEP',
  FLEX = 'FLEX'
}

export interface ScheduleBlock {
  id: string;
  name: string;
  startTime: string; // "HH:MM" 24h format
  endTime: string;   // "HH:MM" 24h format
  type: BlockType;
  requiredHabits?: string[]; // e.g., ["Water", "No Phone"]
}

export interface DistractionEvent {
  id: string;
  timestamp: Date;
  reason: 'PHONE' | 'SOCIAL' | 'DAYDREAM' | 'FATIGUE' | 'OTHER';
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedBlocks: string[]; // IDs of blocks marked successful
  missedBlocks: string[]; // IDs of blocks marked failed
  distractions: DistractionEvent[];
  moodScore: number; // 1-10
}

export interface Task {
  id: string;
  title: string;
  isComplete: boolean;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  deadline?: string; // ISO Date String
  estimatedMinutes: number;
}

export interface Nudge {
  id: string;
  message: string;
  type: 'CRITICAL' | 'HEALTH' | 'PROTOCOL';
  actionLabel?: string;
}

export interface SystemState {
  schedule: ScheduleBlock[];
  tasks: Task[];
  logs: DayLog[];
  currentTime: Date;
  currentBlock: ScheduleBlock | null;
  nextBlock: ScheduleBlock | null;
  activeNudge: Nudge | null;
  strategicTask: Task | null; // The #1 calculated task
}