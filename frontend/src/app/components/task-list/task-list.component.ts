import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatChipsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() tasks: Task[] | null = [];
  @Input() activeTaskId: string | null = null;
  @Input() isRunning = false;

  @Output() start = new EventEmitter<string>();
  @Output() pause = new EventEmitter<void>();
  @Output() complete = new EventEmitter<string>();

  statusLabel(status: Task['status']): string {
    switch (status) {
      case 'pending':
        return '未着手';
      case 'in-progress':
        return '進行中';
      case 'paused':
        return '一時停止';
      case 'completed':
        return '完了';
      default:
        return status;
    }
  }

  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  }
}
