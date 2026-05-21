import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../task.service';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tasks: any[] = []; 
  completed = 0; 
  pending = 0;
  isDarkMode = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.loadTasks();
    this.taskService.tasks$.subscribe(data => {
      this.tasks = data;
      this.completed = data.filter(t => t.status === 'Completed').length;
      this.pending = data.filter(t => t.status === 'Pending').length;
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
