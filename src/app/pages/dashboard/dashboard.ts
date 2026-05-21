import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tasks: any[] = []; 
  completed = 0; 
  pending = 0;
  isDarkMode = false;

  private apiUrl = 'https://jsonplaceholder.typicode.com/todos'; 
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.fetchTasksFromApi();
  }

  fetchTasksFromApi() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasks = data.map(item => ({
          id: item.id,
          taskName: item.title,
          status: item.completed ? 'Completed' : 'Pending'
        }));

        this.completed = this.tasks.filter(t => t.status === 'Completed').length;
        this.pending = this.tasks.filter(t => t.status === 'Pending').length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API se data laane me dikkat aayi:', err);
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}