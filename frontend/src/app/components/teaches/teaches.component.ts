import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teaches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
      
      <!-- Teaches Form -->
      <div class="p-6 bg-white shadow-md rounded-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">👨‍🏫 Teaches Form</h2>
        <form (ngSubmit)="submitForm()" class="space-y-4">

          <!-- Select Instructor -->
          <div>
            <label class="block font-semibold text-gray-700">🧑‍🏫 Instructor:</label>
            <select [(ngModel)]="teaches.ID" name="ID" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="">Select Instructor</option>
              <option *ngFor="let i of instructors" [value]="i.ID">
                {{ i.name }} (ID: {{ i.ID }})
              </option>
            </select>
          </div>

          <!-- Select Section -->
          <div>
            <label class="block font-semibold text-gray-700">📚 Section:</label>
            <select [(ngModel)]="selectedSection" name="section" (change)="onSectionChange($event)" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="">Select Section</option>
              <option *ngFor="let s of sections" [value]="s.course_id + ',' + s.sec_id + ',' + s.semester + ',' + s.year">
                {{ getCourseTitle(s.course_id) }} - Sec: {{ s.sec_id }} ({{ s.semester }} {{ s.year }})
              </option>
            </select>
          </div>

          <button type="submit"
            class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
            ➕ Add Teaches Record
          </button>
        </form>
      </div>

      <!-- Teaches List (Now Below the Form) -->
      <div class="p-6 mt-6 bg-white shadow-md rounded-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">📋 Teaches List</h2>

        <div class="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
          
          <!-- Table Header -->
          <div class="grid grid-cols-5 font-bold bg-blue-200 p-2 rounded">
            <div>🆔 ID</div>
            <div>👨‍🏫 Instructor</div>
            <div>📖 Course</div>
            <div>🎓 Section</div>
            <div>❌ Action</div>
          </div>

          <!-- Table Content -->
          <div *ngFor="let t of teachesList" class="grid grid-cols-5 border-b p-2 text-gray-900 items-center">
            <div>{{ t.ID }}</div>
            <div>{{ getInstructorName(t.ID) }}</div>
            <div>{{ getCourseTitle(t.course_id) }}</div>
            <div>Sec: {{ t.sec_id }} ({{ t.semester }} {{ t.year }})</div>
           
          </div>

        </div>
      </div>

    </div>
  `,
})

export class TeachesComponent {
  teaches = { ID: '', course_id: '', sec_id: '', semester: '', year: 0 };
  teachesList: any[] = [];
  instructors: any[] = [];
  sections: any[] = [];
  courses: any[] = []; // Store courses separately
  selectedSection: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTeaches();
    this.getInstructors();
    this.getSections();
    this.getCourses(); // Fetch course data
  }

  getTeaches() {
    this.http.get<any[]>('http://localhost:5000/teaches')
      .subscribe(data => this.teachesList = data);
  }

  getInstructors() {
    this.http.get<any[]>('http://localhost:5000/instructors')
      .subscribe(data => this.instructors = data);
  }

  getSections() {
    this.http.get<any[]>('http://localhost:5000/sections')
      .subscribe(data => this.sections = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses') // Fetch courses separately
      .subscribe(data => this.courses = data);
  }

  onSectionChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [course_id, sec_id, semester, year] = value.split(',');
      this.teaches.course_id = course_id;
      this.teaches.sec_id = sec_id;
      this.teaches.semester = semester;
      this.teaches.year = +year;
    }
  }

  submitForm() {
    if (!this.teaches.ID || !this.teaches.course_id) {
      alert("Please select both an instructor and a section.");
      return;
    }

    this.http.post('http://localhost:5000/teaches', this.teaches)
      .subscribe(response => {
        console.log('Teaches record added:', response);
        this.getTeaches();
        this.teaches = { ID: '', course_id: '', sec_id: '', semester: '', year: 0 };
        this.selectedSection = '';
      });
  }

  // ✅ Get course title from course_id
  getCourseTitle(course_id: string): string {
    const course = this.courses.find(c => c.course_id === course_id);
    return course ? course.title : "Unknown Course";
  }

  // ✅ Get instructor name from ID
  getInstructorName(ID: string): string {
    const instructor = this.instructors.find(i => i.ID === ID);
    return instructor ? instructor.name : "Unknown Instructor";
  }
}
