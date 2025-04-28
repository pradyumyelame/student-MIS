import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Advisor Management</h1>
    
    <!-- Advisor Form -->
    <div class="p-6 bg-gray-50 shadow-md rounded-xl border border-gray-300">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Add Advisor</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-medium text-gray-700">Student:</label>
          <select [(ngModel)]="advisor.s_ID" name="s_ID" required
            class="w-full p-3 border border-gray-400 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none">
            <option *ngFor="let s of students" [value]="s.ID">{{ s.name }} (ID: {{ s.ID }})</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-gray-700">Instructor:</label>
          <select [(ngModel)]="advisor.i_ID" name="i_ID" required
            class="w-full p-3 border border-gray-400 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none">
            <option *ngFor="let i of instructors" [value]="i.ID">{{ i.name }} (ID: {{ i.ID }})</option>
          </select>
        </div>
        <button type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
          Add Advisor
        </button>
      </form>
    </div>

    <!-- Advisor List -->
    <div class="mt-8 p-6 bg-gray-100 shadow-md rounded-xl border border-gray-300">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Advisor List</h2>
      <div class="space-y-4">
        <div *ngFor="let a of advisors" class="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
          <div class="font-semibold text-gray-900">Student ID: <span class="text-blue-600">{{ a.s_ID }}</span></div>
          <div class="text-gray-700">Instructor ID: <span class="text-green-600">{{ a.i_ID }}</span></div>
        </div>
      </div>
    </div>
  </div>
  `,
})

export class AdvisorComponent {
  advisor = { s_ID: null, i_ID: null };
  advisors: any[] = [];
  students: any[] = [];
  instructors: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAdvisors();
    this.getStudents();
    this.getInstructors();
  }

  getAdvisors() {
    this.http.get<any[]>('http://localhost:5000/advisors')
      .subscribe(data => this.advisors = data);
  }

  getStudents() {
    this.http.get<any[]>('http://localhost:5000/students')
      .subscribe(data => this.students = data);
  }

  getInstructors() {
    this.http.get<any[]>('http://localhost:5000/instructors')
      .subscribe(data => this.instructors = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/advisors', this.advisor)
      .subscribe(response => {
        console.log('Advisor added:', response);
        this.getAdvisors();
        this.advisor = { s_ID: null, i_ID: null };
      });
  }
}
