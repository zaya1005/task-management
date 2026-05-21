import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<any[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadTasks() {
    if (this.tasksSubject.value.length > 0) return;
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos').subscribe(data => {
      const transformed = data.slice(0, 50).map(t => ({
        id: t.id,
        taskName: t.title,
        description: 'Production Ingested Assignment Task',
        priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        duedate: '2026-05-25',
        status: t.completed ? 'Completed' : 'Pending'
      }));
      this.tasksSubject.next(transformed);
    });
  }

  updateTasks(newList: any[]) { 
    this.tasksSubject.next(newList); 
  }
}