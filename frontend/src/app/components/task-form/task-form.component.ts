import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  @Output() createTask = new EventEmitter<string>();

  taskForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  submit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const name = this.taskForm.get('name')?.value?.trim();
    if (name) {
      this.createTask.emit(name);
      this.taskForm.reset();
    }
  }
}
