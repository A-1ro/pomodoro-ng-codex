import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const noOp = createAction('[Pomodoro] No-Op');

export const addTask = createAction('[Pomodoro] Add Task', props<{ name: string }>());

export const loadTasks = createAction('[Pomodoro] Load Tasks');
export const loadTasksSuccess = createAction('[Pomodoro] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Pomodoro] Load Tasks Failure', props<{ error: string }>());

export const createTask = createAction('[Pomodoro] Create Task', props<{ task: Task }>());
export const createTaskSuccess = createAction('[Pomodoro] Create Task Success', props<{ task: Task }>());
export const createTaskFailure = createAction('[Pomodoro] Create Task Failure', props<{ error: string }>());

export const updateTask = createAction('[Pomodoro] Update Task', props<{ task: Task }>());
export const updateTaskSuccess = createAction('[Pomodoro] Update Task Success', props<{ task: Task }>());
export const updateTaskFailure = createAction('[Pomodoro] Update Task Failure', props<{ error: string }>());

export const startTask = createAction('[Pomodoro] Start Task', props<{ taskId: string }>());

export const pauseTask = createAction('[Pomodoro] Pause Task');

export const completeTask = createAction('[Pomodoro] Complete Task', props<{ taskId: string }>());

export const tick = createAction('[Pomodoro] Tick');
