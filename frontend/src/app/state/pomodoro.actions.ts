import { createAction, props } from '@ngrx/store';

export const addTask = createAction('[Pomodoro] Add Task', props<{ name: string }>());

export const startTask = createAction('[Pomodoro] Start Task', props<{ taskId: string }>());

export const pauseTask = createAction('[Pomodoro] Pause Task');

export const completeTask = createAction('[Pomodoro] Complete Task', props<{ taskId: string }>());

export const tick = createAction('[Pomodoro] Tick');
