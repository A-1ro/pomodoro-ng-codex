import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as PomodoroActions from '../state/pomodoro.actions';

@Injectable({ providedIn: 'root' })
export class PomodoroTimerService implements OnDestroy {
  private ticker?: Subscription;

  constructor(private readonly store: Store) {}

  start(taskId: string): void {
    this.stopTicker();
    this.store.dispatch(PomodoroActions.startTask({ taskId }));
    this.ticker = interval(1000).subscribe(() => this.store.dispatch(PomodoroActions.tick()));
  }

  pause(): void {
    this.stopTicker();
    this.store.dispatch(PomodoroActions.pauseTask());
  }

  complete(taskId: string): void {
    this.stopTicker();
    this.store.dispatch(PomodoroActions.completeTask({ taskId }));
  }

  private stopTicker(): void {
    this.ticker?.unsubscribe();
    this.ticker = undefined;
  }

  ngOnDestroy(): void {
    this.stopTicker();
  }
}
