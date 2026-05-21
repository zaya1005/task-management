import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// 🌟 Angular 21 + PrimeNG v18+ Standalone Native Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    DialogModule, 
    HttpClientModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  tasks: any[] = [];
  showModal = false;
  isEdit = false;
  editId: any = null;
  isDarkMode = false;
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos'; 
  
  newTask: any = { taskName: '', description: '', priority: 'Medium', duedate: '', status: 'Pending' };
  priorities = [
    { label: 'High', value: 'High' }, 
    { label: 'Medium', value: 'Medium' }, 
    { label: 'Low', value: 'Low' }
  ];
  statuses = [
    { label: 'Pending', value: 'Pending' }, 
    { label: 'Completed', value: 'Completed' }
  ];

  constructor(
    private taskService: TaskService, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.fetchTasksFromApi();
  }

  fetchTasksFromApi() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const priorityOptions = ['High', 'Medium', 'Low'];

        this.tasks = data.map(item => {
          const randomPriority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];

          return {
            id: item.id,
            taskName: item.title,
            priority: item.priority || randomPriority, 
            status: item.completed ? 'Completed' : 'Pending',
            description: item.description || 'Production Ingested Assignment Task',
            duedate: item.duedate || '2026-05-25'
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API se data load karne me error aaya:', err);
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  save() {
    let list = [...this.tasks];
    if(this.isEdit) {
      list = list.map(t => t.id === this.editId ? { ...this.newTask, id: this.editId } : t);
    } else {
      list.unshift({ ...this.newTask, id: Date.now() });
    }
    
    this.tasks = list; 
    this.taskService.updateTasks(list);
    this.showModal = false;
    
    this.newTask = { taskName: '', description: '', priority: 'Medium', duedate: '', status: 'Pending' };
    this.cdr.detectChanges();
  }

  delete(id: any) {
    if(confirm('Are you sure you want to delete this task?')) {
      const updatedList = this.tasks.filter(t => t.id !== id);
      this.tasks = updatedList; 
      this.taskService.updateTasks(updatedList);
      this.cdr.detectChanges();
    }
  }

  openEdit(task: any) {
    this.isEdit = true;
    this.editId = task.id;
    this.newTask = { ...task };
    this.showModal = true;
  }
}