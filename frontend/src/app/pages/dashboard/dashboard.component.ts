import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { Task } from '../../models/task.model';
import { PomodoroTimerService } from '../../services/pomodoro-timer.service';
import * as PomodoroSelectors from '../../state/pomodoro.selectors';
import * as PomodoroActions from '../../state/pomodoro.actions';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { PomodoroTimerComponent } from '../../components/pomodoro-timer/pomodoro-timer.component';

interface DashboardViewModel {
  tasks: Task[];
  activeTask: Task | null;
  isRunning: boolean;
  remainingSeconds: number;
  progress: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TaskFormComponent,
    TaskListComponent,
    PomodoroTimerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  readonly vm$ = combineLatest({
    tasks: this.store.select(PomodoroSelectors.selectTasks),
    activeTask: this.store.select(PomodoroSelectors.selectActiveTask),
    isRunning: this.store.select(PomodoroSelectors.selectIsRunning),
    remainingSeconds: this.store.select(PomodoroSelectors.selectRemainingSeconds),
    progress: this.store.select(PomodoroSelectors.selectProgress),
  }).pipe(map((vm) => vm as DashboardViewModel));

  readonly activeTaskId$ = this.store.select(PomodoroSelectors.selectActiveTaskId);

  constructor(private readonly store: Store, private readonly timer: PomodoroTimerService) {}

  addTask(name: string): void {
    this.store.dispatch(PomodoroActions.addTask({ name }));
  }

  start(taskId: string): void {
    this.timer.start(taskId);
  }

  pause(): void {
    this.timer.pause();
  }

  complete(taskId?: string): void {
    const id = taskId ?? null;
    if (!id) {
      return;
    }
    this.timer.complete(id);
  }

  resume(taskId: string | null): void {
    if (!taskId) {
      return;
    }
    this.timer.start(taskId);
  }
}
