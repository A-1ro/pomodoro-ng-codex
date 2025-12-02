export type TaskStatus = 'pending' | 'in-progress' | 'paused' | 'completed';
export type PomodoroPhase = 'focus' | 'short-break' | 'long-break';

export interface TimerInfo {
  phase: PomodoroPhase;
  cycle: number;
  elapsedSeconds: number;
  durationSeconds: number;
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  timer: TimerInfo;
}
