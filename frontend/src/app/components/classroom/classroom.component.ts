import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
    
    <!-- Classroom Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Classroom Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">Building:</label>
          <input type="text" [(ngModel)]="classroom.building" name="building" required
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Room Number:</label>
          <input type="text" [(ngModel)]="classroom.room_number" name="room_number" required
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Capacity:</label>
          <input type="number" [(ngModel)]="classroom.capacity" name="capacity"
            class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none">
        </div>
        <button type="submit"
          class="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition">
          Add Classroom
        </button>
      </form>
    </div>

    <!-- Classroom List -->
    <div class="p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Classroom List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let c of classrooms" class="p-4 bg-teal-50 border border-teal-300 rounded-lg shadow-md">
          <div class="font-semibold text-gray-900">🏢 Building: <span class="text-teal-700">{{ c.building }}</span></div>
          <div class="text-gray-700">📍 Room: <span class="font-medium">{{ c.room_number }}</span></div>
          <div class="text-gray-600">👥 Capacity: <span class="font-medium">{{ c.capacity }}</span></div>
        </div>
      </div>
    </div>

  </div>
  `,
})

export class ClassroomComponent {
  classroom = { building: '', room_number: '', capacity: null };
  classrooms: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getClassrooms();
  }

  getClassrooms() {
    this.http.get<any[]>('http://localhost:5000/classrooms')
      .subscribe(data => this.classrooms = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/classrooms', this.classroom)
      .subscribe(response => {
        console.log('Classroom added:', response);
        this.getClassrooms();
        this.classroom = { building: '', room_number: '', capacity: null };
      });
  }
}
