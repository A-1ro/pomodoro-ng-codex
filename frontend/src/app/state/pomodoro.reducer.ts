import { createReducer, on } from '@ngrx/store';
import { Task, TimerInfo, TaskStatus, PomodoroPhase } from '../models/task.model';
import * as PomodoroActions from './pomodoro.actions';

const FOCUS_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;
const LONG_BREAK_INTERVAL = 4;

export interface PomodoroState {
  tasks: Task[];
  activeTaskId: string | null;
  isRunning: boolean;
}

export const initialState: PomodoroState = {
  tasks: [],
  activeTaskId: null,
  isRunning: false,
};

const createTimer = (): TimerInfo => ({
  phase: 'focus',
  cycle: 1,
  elapsedSeconds: 0,
  durationSeconds: FOCUS_SECONDS,
});

const randomId = () => `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const createTask = (name: string): Task => ({
  id: randomId(),
  name,
  status: 'pending',
  timer: createTimer(),
});

const phaseDuration = (phase: PomodoroPhase, cycle: number) => {
  switch (phase) {
    case 'focus':
      return FOCUS_SECONDS;
    case 'long-break':
      return LONG_BREAK_SECONDS;
    case 'short-break':
    default:
      return SHORT_BREAK_SECONDS;
  }
};

const nextPhase = (timer: TimerInfo): TimerInfo => {
  if (timer.phase === 'focus') {
    const useLongBreak = timer.cycle % LONG_BREAK_INTERVAL === 0;
    const phase: PomodoroPhase = useLongBreak ? 'long-break' : 'short-break';
    return {
      phase,
      cycle: timer.cycle,
      elapsedSeconds: 0,
      durationSeconds: phaseDuration(phase, timer.cycle),
    };
  }

  const nextCycle = timer.cycle + 1;
  return {
    phase: 'focus',
    cycle: nextCycle,
    elapsedSeconds: 0,
    durationSeconds: phaseDuration('focus', nextCycle),
  };
};

const progressTimer = (timer: TimerInfo): TimerInfo => {
  const elapsedSeconds = timer.elapsedSeconds + 1;

  if (elapsedSeconds < timer.durationSeconds) {
    return { ...timer, elapsedSeconds };
  }

  return nextPhase(timer);
};

const updateStatuses = (tasks: Task[], activeTaskId: string | null): Task[] =>
  tasks.map((task) => {
    if (task.id === activeTaskId) {
      return task;
    }

    if (task.status === 'in-progress') {
      return { ...task, status: 'paused' as TaskStatus };
    }

    return task;
  });

export const pomodoroReducer = createReducer(
  initialState,
  on(PomodoroActions.loadTasksSuccess, (state, { tasks }): PomodoroState => ({
    ...state,
    tasks,
  })),
  on(PomodoroActions.createTaskSuccess, (state, { task }): PomodoroState => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(PomodoroActions.updateTaskSuccess, (state, { task }): PomodoroState => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(PomodoroActions.addTask, (state, { name }): PomodoroState => {
    const trimmed = name.trim();
    if (!trimmed) {
      return state;
    }

    return {
      ...state,
      tasks: [...state.tasks, createTask(trimmed)],
    };
  }),
  on(PomodoroActions.startTask, (state, { taskId }): PomodoroState => {
    const tasks: Task[] = updateStatuses(state.tasks, taskId).map((task): Task => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        status: 'in-progress' as TaskStatus,
        timer: task.timer ?? createTimer(),
      };
    });

    return {
      ...state,
      tasks,
      activeTaskId: taskId,
      isRunning: true,
    };
  }),
  on(PomodoroActions.pauseTask, (state): PomodoroState => {
    if (!state.activeTaskId) {
      return { ...state, isRunning: false };
    }

    const tasks = state.tasks.map((task) =>
      task.id === state.activeTaskId ? { ...task, status: 'paused' as TaskStatus } : task
    );

    return {
      ...state,
      tasks,
      isRunning: false,
    };
  }),
  on(PomodoroActions.completeTask, (state, { taskId }): PomodoroState => {
    const tasks = state.tasks.map((task) =>
      task.id === taskId ? { ...task, status: 'completed' as TaskStatus } : task
    );

    const isActive = state.activeTaskId === taskId;

    return {
      ...state,
      tasks,
      activeTaskId: isActive ? null : state.activeTaskId,
      isRunning: isActive ? false : state.isRunning,
    };
  }),
  on(PomodoroActions.tick, (state): PomodoroState => {
    if (!state.isRunning || !state.activeTaskId) {
      return state;
    }

    const tasks = state.tasks.map((task) => {
      if (task.id !== state.activeTaskId) {
        return task;
      }

      return { ...task, timer: progressTimer(task.timer) };
    });

    return { ...state, tasks };
  })
);
