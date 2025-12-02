import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PomodoroState } from './pomodoro.reducer';

export const selectPomodoroState = createFeatureSelector<PomodoroState>('pomodoro');

export const selectTasks = createSelector(selectPomodoroState, (state) => state.tasks);

export const selectActiveTaskId = createSelector(selectPomodoroState, (state) => state.activeTaskId);

export const selectIsRunning = createSelector(selectPomodoroState, (state) => state.isRunning);

export const selectActiveTask = createSelector(
  selectTasks,
  selectActiveTaskId,
  (tasks, activeId) => tasks.find((task) => task.id === activeId) ?? null
);

export const selectActiveTimer = createSelector(selectActiveTask, (task) => task?.timer ?? null);

export const selectCurrentPhase = createSelector(selectActiveTimer, (timer) => timer?.phase ?? 'focus');

export const selectCurrentCycle = createSelector(selectActiveTimer, (timer) => timer?.cycle ?? 1);

export const selectElapsedSeconds = createSelector(selectActiveTimer, (timer) => timer?.elapsedSeconds ?? 0);

export const selectDurationSeconds = createSelector(selectActiveTimer, (timer) => timer?.durationSeconds ?? 0);

export const selectRemainingSeconds = createSelector(
  selectDurationSeconds,
  selectElapsedSeconds,
  (duration, elapsed) => Math.max(duration - elapsed, 0)
);

export const selectProgress = createSelector(selectDurationSeconds, selectElapsedSeconds, (duration, elapsed) => {
  if (duration === 0) {
    return 0;
  }

  return Math.min(Math.round((elapsed / duration) * 100), 100);
});
