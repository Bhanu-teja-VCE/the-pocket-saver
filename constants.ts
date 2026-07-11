import { BlockType, ScheduleBlock, Task } from './types';

// --- LIFE PROTOCOLS (Fixed wrappers around college) ---

const MORNING_ROUTINE: ScheduleBlock[] = [
  { id: 'm1', name: 'Morning Protocol', startTime: '06:00', endTime: '07:30', type: BlockType.HABIT, requiredHabits: ['Hydrate', 'Exercise', 'Breakfast'] },
  { id: 'm2', name: 'Commute / Prep', startTime: '07:30', endTime: '09:10', type: BlockType.FLEX },
];

const EVENING_ROUTINE: ScheduleBlock[] = [
  { id: 'e1', name: 'Commute / Decompress', startTime: '16:20', endTime: '17:30', type: BlockType.FLEX },
  { id: 'e2', name: 'Deep Work: Assignments', startTime: '17:30', endTime: '19:00', type: BlockType.DEEP_WORK },
  { id: 'e3', name: 'Dinner Break', startTime: '19:00', endTime: '20:00', type: BlockType.BREAK, requiredHabits: ['Socialize', 'No Screens'] },
  { id: 'e4', name: 'Evening Sprint', startTime: '20:00', endTime: '22:00', type: BlockType.DEEP_WORK },
  { id: 'e5', name: 'Shutdown Protocol', startTime: '22:00', endTime: '23:00', type: BlockType.HABIT, requiredHabits: ['Plan Tomorrow', 'Reading'] },
  { id: 'e6', name: 'Sleep', startTime: '23:00', endTime: '06:00', type: BlockType.SLEEP },
];

const LUNCH: ScheduleBlock = { id: 'lunch', name: 'Lunch Break', startTime: '11:50', endTime: '12:40', type: BlockType.BREAK };
const SHORT_BREAK: ScheduleBlock = { id: 'brk', name: 'Refresh Break', startTime: '14:30', endTime: '14:40', type: BlockType.BREAK };

// --- ACADEMIC BLOCKS (Mon-Sat) ---

const MON_SCHEDULE: ScheduleBlock[] = [
  { id: 'mon1', name: 'ODE (Math)', startTime: '09:10', endTime: '10:10', type: BlockType.CLASS },
  { id: 'mon2', name: 'EPS (Physics)', startTime: '10:10', endTime: '11:00', type: BlockType.CLASS },
  { id: 'mon3', name: 'ODE (Math)', startTime: '11:00', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'mon4', name: 'DS (Data Struct)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'mon5', name: 'CON (Comp Org)', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'mon6', name: 'BEE (Electrical)', startTime: '14:40', endTime: '15:30', type: BlockType.CLASS },
  { id: 'mon7', name: 'LSM (Mentoring)', startTime: '15:30', endTime: '16:20', type: BlockType.CLASS },
];

const TUE_SCHEDULE: ScheduleBlock[] = [
  { id: 'tue1', name: 'EWP (Workshop)', startTime: '09:10', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'tue4', name: 'ODE (Math)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'tue5', name: 'EPS (Physics)', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'tue6', name: 'CON (Comp Org)', startTime: '14:40', endTime: '15:30', type: BlockType.CLASS },
  { id: 'tue7', name: 'DS (Data Struct)', startTime: '15:30', endTime: '16:20', type: BlockType.CLASS },
];

const WED_SCHEDULE: ScheduleBlock[] = [
  { id: 'wed1', name: 'BEE LAB / PDD', startTime: '09:10', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'wed4', name: 'EPS (Physics)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'wed5', name: 'BEE (Electrical)', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'wed6', name: 'ODE (Math)', startTime: '14:40', endTime: '15:30', type: BlockType.CLASS },
  { id: 'wed7', name: 'LSM (Mentoring)', startTime: '15:30', endTime: '16:20', type: BlockType.CLASS },
];

const THU_SCHEDULE: ScheduleBlock[] = [
  { id: 'thu1', name: 'DS LAB', startTime: '09:10', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'thu4', name: 'CON (Comp Org)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'thu5', name: 'EPS (Physics)', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'thu6', name: 'CPE (Comp Prog)', startTime: '14:40', endTime: '16:20', type: BlockType.CLASS },
];

const FRI_SCHEDULE: ScheduleBlock[] = [
  { id: 'fri1', name: 'CPE (Comp Prog)', startTime: '09:10', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'fri4', name: 'DS (Data Struct)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'fri5', name: 'BEE LAB / PDD', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'fri6', name: 'BEE LAB / PDD', startTime: '14:40', endTime: '16:20', type: BlockType.CLASS },
];

const SAT_SCHEDULE: ScheduleBlock[] = [
  { id: 'sat1', name: 'DS (Data Struct)', startTime: '09:10', endTime: '10:10', type: BlockType.CLASS },
  { id: 'sat2', name: 'BEE (Electrical)', startTime: '10:10', endTime: '11:00', type: BlockType.CLASS },
  { id: 'sat3', name: 'CON (Comp Org)', startTime: '11:00', endTime: '11:50', type: BlockType.CLASS },
  LUNCH,
  { id: 'sat4', name: 'ODE (Math)', startTime: '12:40', endTime: '13:40', type: BlockType.CLASS },
  { id: 'sat5', name: 'PSL / DS LAB', startTime: '13:40', endTime: '14:30', type: BlockType.CLASS },
  SHORT_BREAK,
  { id: 'sat6', name: 'PSL / DS LAB', startTime: '14:40', endTime: '16:20', type: BlockType.CLASS },
];

const SUN_SCHEDULE: ScheduleBlock[] = [
  { id: 'sun1', name: 'Morning Protocol', startTime: '07:00', endTime: '09:00', type: BlockType.HABIT },
  { id: 'sun2', name: 'Weekly Review', startTime: '09:00', endTime: '11:00', type: BlockType.DEEP_WORK },
  { id: 'sun3', name: 'Leisure / Recovery', startTime: '11:00', endTime: '18:00', type: BlockType.FLEX },
  { id: 'sun4', name: 'Week Planning', startTime: '18:00', endTime: '20:00', type: BlockType.DEEP_WORK },
  { id: 'e6', name: 'Sleep', startTime: '23:00', endTime: '06:00', type: BlockType.SLEEP },
];

// --- EXPORT ---

export const getDailySchedule = (date: Date): ScheduleBlock[] => {
  const day = date.getDay(); // 0 = Sun, 1 = Mon, ...
  
  let academic: ScheduleBlock[] = [];
  
  switch(day) {
    case 1: academic = MON_SCHEDULE; break;
    case 2: academic = TUE_SCHEDULE; break;
    case 3: academic = WED_SCHEDULE; break;
    case 4: academic = THU_SCHEDULE; break;
    case 5: academic = FRI_SCHEDULE; break;
    case 6: academic = SAT_SCHEDULE; break;
    case 0: return SUN_SCHEDULE; // Sunday has custom routine
    default: academic = MON_SCHEDULE;
  }

  // Merge Routine + Academic + Evening
  return [...MORNING_ROUTINE, ...academic, ...EVENING_ROUTINE];
};

export const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Setup Dev Environment for DS Lab', 
    isComplete: false, 
    priority: 'HIGH', 
    estimatedMinutes: 60 
  },
  { 
    id: 't2', 
    title: 'Review ODE Formula Sheet', 
    isComplete: false, 
    priority: 'NORMAL',
    estimatedMinutes: 30
  },
  { 
    id: 't3', 
    title: 'Read CON Unit 1', 
    isComplete: false, 
    priority: 'NORMAL',
    estimatedMinutes: 45
  }
];

export const SYSTEM_INSTRUCTION = `
You are NEXUS, a ruthless, non-emotional productivity supervisor for a Computer Science student.
Your goal is Semester 2 Domination. 
You act with authority. You do not ask "how are you?". You ask "Did you execute?".
You have access to the user's current schedule block, time, and tasks.
If the user is chatting during a DEEP WORK block, scold them briefly and tell them to get back to work.
Keep responses concise, terminal-style, and data-driven.
`;