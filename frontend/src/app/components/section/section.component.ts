import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">

      <!-- Section Form -->
      <div class="p-6 bg-white shadow-md rounded-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">🏫 Section Form</h2>
        <form (ngSubmit)="submitForm()" class="space-y-4">
          
          <!-- Select Course -->
          <div>
            <label class="block font-semibold text-gray-700">📖 Course:</label>
            <select [(ngModel)]="section.course_id" name="course_id" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option *ngFor="let c of courses" [value]="c.course_id">
                {{ c.course_id }} - {{ c.title }}
              </option>
            </select>
          </div>

          <!-- Section ID, Semester, Year -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-gray-700">🔢 Section ID:</label>
              <input type="text" [(ngModel)]="section.sec_id" name="sec_id" required
                class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block font-semibold text-gray-700">📆 Semester:</label>
              <input type="text" [(ngModel)]="section.semester" name="semester" required
                class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
          </div>

          <div>
            <label class="block font-semibold text-gray-700">📅 Year:</label>
            <input type="number" [(ngModel)]="section.year" name="year" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>

          <!-- Select Classroom -->
          <div>
            <label class="block font-semibold text-gray-700">🏢 Classroom:</label>
            <select [(ngModel)]="selectedClassroom" name="classroom" (change)="onClassroomChange($event)" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select Classroom</option>
              <option *ngFor="let room of classrooms" [value]="room.building + ',' + room.room_number">
                {{ room.building }} - {{ room.room_number }}
              </option>
            </select>
          </div>

          <!-- Select Time Slot -->
          <div>
            <label class="block font-semibold text-gray-700">⏰ Time Slot:</label>
            <select [(ngModel)]="section.time_slot_id" name="time_slot_id" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select Time Slot</option>
              <option *ngFor="let t of timeSlots" [value]="t.time_slot_id">
                {{ t.time_slot_id }}: {{ t.day }} {{ t.start_time }}-{{ t.end_time }}
              </option>
            </select>
          </div>

          <button type="submit"
            class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition">
            ➕ Add Section
          </button>
        </form>
      </div>

      <!-- Section List -->
      <div class="p-6 bg-white shadow-md rounded-xl mt-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">📋 Section List</h2>
        <div class="border rounded-lg p-4 bg-indigo-50 max-h-[300px] overflow-y-auto">
          <div class="grid grid-cols-3 gap-4 font-bold bg-indigo-200 p-2 rounded">
            <div>📖 Course</div>
            <div>🔢 Section</div>
            <div>📆 Semester</div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-2">
            <div *ngFor="let s of sections" class="border-b p-2 text-gray-900">
              {{ s.course_id }}
            </div>
            <div *ngFor="let s of sections" class="border-b p-2 text-gray-900">
              {{ s.sec_id }}
            </div>
            <div *ngFor="let s of sections" class="border-b p-2 text-gray-900">
              {{ s.semester }}
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class SectionComponent {
  section = { course_id: '', sec_id: '', semester: '', year: null, building: '', room_number: '', time_slot_id: '' };
  sections: any[] = [];
  courses: any[] = [];
  classrooms: any[] = [];
  timeSlots: any[] = [];
  selectedClassroom: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSections();
    this.getCourses();
    this.getClassrooms();
    this.getTimeSlots();
  }

  getSections() {
    this.http.get<any[]>('http://localhost:5000/sections')
      .subscribe(data => this.sections = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses')
      .subscribe(data => this.courses = data);
  }

  getClassrooms() {
    this.http.get<any[]>('http://localhost:5000/classrooms')
      .subscribe(data => this.classrooms = data);
  }

  getTimeSlots() {
    this.http.get<any[]>('http://localhost:5000/time-slots')
      .subscribe(data => this.timeSlots = data);
  }

  onClassroomChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [building, room_number] = value.split(',');
      this.section.building = building;
      this.section.room_number = room_number;
    }
  }

  submitForm() {
    this.http.post('http://localhost:5000/sections', this.section)
      .subscribe(response => {
        console.log('Section added:', response);
        this.getSections();
        this.section = { course_id: '', sec_id: '', semester: '', year: null, building: '', room_number: '', time_slot_id: '' };
        this.selectedClassroom = '';
      });
  }
}
