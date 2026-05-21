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
  
  // 🔗 Live Dummy API URL
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
    // 🌟 SSR safe block: Yeh sirf browser par chalega, Node server par nahi!
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
        // 🎲 Priorities ki list random generation ke liye
        const priorityOptions = ['High', 'Medium', 'Low'];

        this.tasks = data.map(item => {
          // Har task ke liye ek random index select hoga (0, 1, ya 2)
          const randomPriority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];

          return {
            id: item.id,
            taskName: item.title,
            // Agar API me priority hai toh wo, nahi toh hamari random priority set hogi
            priority: item.priority || randomPriority, 
            status: item.completed ? 'Completed' : 'Pending',
            description: item.description || 'Production Ingested Assignment Task',
            duedate: item.duedate || '2026-05-25'
          };
        });
        
        // Data aane ke baad UI ko refresh karne ke liye trigger
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
    
    // Form ko wapas reset karna default values par
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