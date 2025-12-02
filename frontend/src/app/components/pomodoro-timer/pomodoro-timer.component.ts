import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatChipsModule],
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.scss'],
})
export class PomodoroTimerComponent {
  @Input() task: Task | null = null;
  @Input() isRunning = false;
  @Input() progress = 0;
  @Input() remainingSeconds = 0;

  @Output() pauseRequested = new EventEmitter<void>();
  @Output() resumeRequested = new EventEmitter<void>();
  @Output() completeRequested = new EventEmitter<void>();

  get phaseLabel(): string {
    const phase = this.task?.timer.phase ?? 'focus';
    if (phase === 'focus') {
      return '集中';
    }
    return phase === 'long-break' ? 'ロングブレイク' : 'ブレイク';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  }
}
