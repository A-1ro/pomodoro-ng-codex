import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskApiService } from '../services/task-api.service';
import * as PomodoroActions from './pomodoro.actions';
import * as PomodoroSelectors from './pomodoro.selectors';

@Injectable()
export class PomodoroEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.loadTasks),
      switchMap(() =>
        this.taskApiService.getTasks().pipe(
          map((tasks) => PomodoroActions.loadTasksSuccess({ tasks })),
          catchError((error) => of(PomodoroActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.addTask),
      map(({ name }) => {
        const trimmed = name.trim();
        if (!trimmed) {
          return null;
        }
        const task = {
          id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          name: trimmed,
          status: 'pending' as const,
          timer: {
            phase: 'focus' as const,
            cycle: 1,
            elapsedSeconds: 0,
            durationSeconds: 25 * 60,
          },
        };
        return task;
      }),
      switchMap((task) => {
        if (!task) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        return this.taskApiService.createTask(task).pipe(
          map((createdTask) => PomodoroActions.createTaskSuccess({ task: createdTask })),
          catchError((error) => of(PomodoroActions.createTaskFailure({ error: error.message })))
        );
      })
    )
  );

  updateTaskOnStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.startTask),
      withLatestFrom(this.store.select(PomodoroSelectors.selectTasks)),
      switchMap(([{ taskId }, tasks]) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        const updatedTask = {
          ...task,
          status: 'in-progress' as const,
        };
        return this.taskApiService.updateTask(updatedTask).pipe(
          map((updated) => PomodoroActions.updateTaskSuccess({ task: updated })),
          catchError((error) => of(PomodoroActions.updateTaskFailure({ error: error.message })))
        );
      })
    )
  );

  updateTaskOnPause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.pauseTask),
      withLatestFrom(
        this.store.select(PomodoroSelectors.selectActiveTaskId),
        this.store.select(PomodoroSelectors.selectTasks)
      ),
      switchMap(([, activeTaskId, tasks]) => {
        if (!activeTaskId) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        const task = tasks.find((t) => t.id === activeTaskId);
        if (!task) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        const updatedTask = {
          ...task,
          status: 'paused' as const,
        };
        return this.taskApiService.updateTask(updatedTask).pipe(
          map((updated) => PomodoroActions.updateTaskSuccess({ task: updated })),
          catchError((error) => of(PomodoroActions.updateTaskFailure({ error: error.message })))
        );
      })
    )
  );

  updateTaskOnComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.completeTask),
      withLatestFrom(this.store.select(PomodoroSelectors.selectTasks)),
      switchMap(([{ taskId }, tasks]) => {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        const updatedTask = {
          ...task,
          status: 'completed' as const,
        };
        return this.taskApiService.updateTask(updatedTask).pipe(
          map((updated) => PomodoroActions.updateTaskSuccess({ task: updated })),
          catchError((error) => of(PomodoroActions.updateTaskFailure({ error: error.message })))
        );
      })
    )
  );

  updateTaskOnTick$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PomodoroActions.tick),
      withLatestFrom(
        this.store.select(PomodoroSelectors.selectIsRunning),
        this.store.select(PomodoroSelectors.selectActiveTask)
      ),
      switchMap(([, isRunning, activeTask]) => {
        if (!isRunning || !activeTask) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        // Only update every 5 seconds to reduce API calls
        if (activeTask.timer.elapsedSeconds % 5 !== 0) {
          return of({ type: '[Pomodoro] No-Op' });
        }
        return this.taskApiService.updateTask(activeTask).pipe(
          map((updated) => PomodoroActions.updateTaskSuccess({ task: updated })),
          catchError((error) => of(PomodoroActions.updateTaskFailure({ error: error.message })))
        );
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly taskApiService: TaskApiService
  ) {}
}
