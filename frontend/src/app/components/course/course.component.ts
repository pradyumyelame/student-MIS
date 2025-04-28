import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Department {
  dept_name: string;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">

    <!-- Course Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">📚 Course Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">Course ID:</label>
          <input type="text" [(ngModel)]="course.course_id" name="course_id" required
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Title:</label>
          <input type="text" [(ngModel)]="course.title" name="title"
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Department:</label>
          <select [(ngModel)]="course.dept_name" name="dept_name" required
            class="w-full p-3 border rounded-lg bg-gray-50 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none">
            <option *ngFor="let dept of departments" [value]="dept.dept_name">{{ dept.dept_name }}</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Credits:</label>
          <input type="number" [(ngModel)]="course.credits" name="credits"
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none">
        </div>
        <button type="submit"
          class="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition">
          ➕ Add Course
        </button>
      </form>
    </div>

    <!-- Course List -->
    <div class="p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">📋 Course List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let c of courses" class="p-4 bg-purple-50 border border-purple-300 rounded-lg shadow-md">
          <div class="font-semibold text-gray-900">📖 {{ c.course_id }} - <span class="text-purple-700">{{ c.title }}</span></div>
          <div class="text-gray-700">🏛️ <span class="font-medium">{{ c.dept_name }}</span></div>
          <div class="text-gray-600">🎓 <span class="font-medium">{{ c.credits }} Credits</span></div>
        </div>
      </div>
    </div>

  </div>
  `,
})

export class CourseComponent {
  course = { course_id: '', title: '', dept_name: '', credits: null };
  courses: any[] = [];
  departments: Department[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCourses();
    this.getDepartments();
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses')
      .subscribe(data => this.courses = data);
  }

  getDepartments() {
    this.http.get<Department[]>('http://localhost:5000/departments')
      .subscribe(data => this.departments = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/courses', this.course)
      .subscribe(response => {
        console.log('Course added:', response);
        this.getCourses();
        this.course = { course_id: '', title: '', dept_name: '', credits: null };
      });
  }
}
