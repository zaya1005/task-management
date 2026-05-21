import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { RouterLink } from '@angular/router';

// 🌟 Angular 21 + PrimeNG v18+ Standalone Native Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select'; 
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, InputTextModule, DialogModule, Select],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  tasks: any[] = [];
  showModal = false;
  isEdit = false;
  editId: any = null;

  isDarkMode = false;
  
  newTask: any = { taskName: '', description: '', priority: 'Medium', duedate: '', status: 'Pending' };
  priorities = [{label:'High', value:'High'}, {label:'Medium', value:'Medium'}, {label:'Low', value:'Low'}];
  statuses = [{label:'Pending', value:'Pending'}, {label:'Completed', value:'Completed'}];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.taskService.loadTasks();
    this.taskService.tasks$.subscribe(data => this.tasks = data);
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
  save() {
    let list = [...this.tasks];
    if(this.isEdit) {
      list = list.map(t => t.id === this.editId ? {...this.newTask, id: this.editId} : t);
    } else {
      list.unshift({...this.newTask, id: Date.now()});
    }
    this.taskService.updateTasks(list);
    this.showModal = false;
    this.newTask = { taskName: '', description: '', priority: 'Medium', duedate: '', status: 'Pending' };
  }

  delete(id: any) {
    if(confirm('Are you sure you want to delete this task?')) {
      this.taskService.updateTasks(this.tasks.filter(t => t.id !== id));
    }
  }

  openEdit(task: any) {
    this.isEdit = true;
    this.editId = task.id;
    this.newTask = {...task};
    this.showModal = true;
  }
}