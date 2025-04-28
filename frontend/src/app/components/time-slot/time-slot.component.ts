import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
      
      <!-- Time Slot Form -->
      <div class="p-6 bg-white shadow-md rounded-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">⏳ Time Slot Form</h2>
        <form (ngSubmit)="submitForm()" class="space-y-4">
          
          <!-- Time Slot ID -->
          <div>
            <label class="block font-semibold text-gray-700">🆔 Time Slot ID:</label>
            <input type="text" [(ngModel)]="timeSlot.time_slot_id" name="time_slot_id" required
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
          </div>

          <!-- Day Selection -->
          <div>
            <label class="block font-semibold text-gray-700">📅 Day:</label>
            <select [(ngModel)]="timeSlot.day" name="day" required
              class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="" disabled selected>Select a day</option>
              <option *ngFor="let d of days" [value]="d">{{ d }}</option>
            </select>
          </div>

          <!-- Start Time & End Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-gray-700">⏰ Start Time:</label>
              <input type="time" [(ngModel)]="timeSlot.start_time" name="start_time" required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
            </div>
            <div>
              <label class="block font-semibold text-gray-700">⏳ End Time:</label>
              <input type="time" [(ngModel)]="timeSlot.end_time" name="end_time" required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
            </div>
          </div>

          <button type="submit"
            class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
            ➕ Add Time Slot
          </button>
        </form>
      </div>

      <!-- Time Slot List (Now Below the Form) -->
      <div class="p-6 mt-6 bg-white shadow-md rounded-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">📋 Time Slot List</h2>

        <div class="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
          
          <!-- Table Header -->
          <div class="grid grid-cols-5 font-bold bg-blue-200 p-2 rounded">
            <div>🆔 ID</div>
            <div>📅 Day</div>
            <div>⏰ Start Time</div>
            <div>⏳ End Time</div>
            <div>❌ Action</div>
          </div>

          <!-- Table Content -->
          <div *ngFor="let t of timeSlots" class="grid grid-cols-5 border-b p-2 text-gray-900 items-center">
            <div>{{ t.time_slot_id }}</div>
            <div>{{ t.day }}</div>
            <div>{{ t.start_time }}</div>
            <div>{{ t.end_time }}</div>
            <div>
              <button (click)="deleteTimeSlot(t.time_slot_id)"
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                ✖
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
})

export class TimeSlotComponent {
  timeSlot = { time_slot_id: '', day: '', start_time: '', end_time: '' };
  timeSlots: any[] = [];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTimeSlots();
  }

  getTimeSlots() {
    this.http.get<any[]>('http://localhost:5000/time-slots').subscribe({
      next: (data) => (this.timeSlots = data),
      error: (err) => console.error('Error fetching time slots:', err),
    });
  }

  submitForm() {
    this.http.post('http://localhost:5000/time-slots', this.timeSlot).subscribe({
      next: (response) => {
        console.log('Time Slot added:', response);
        this.getTimeSlots();
        this.resetForm();
      },
      error: (err) => console.error('Error adding time slot:', err),
    });
  }

  deleteTimeSlot(id: string) {
    this.http.delete(`http://localhost:5000/time-slots/${id}`).subscribe({
      next: () => {
        this.getTimeSlots();
      },
      error: (err) => console.error('Error deleting time slot:', err),
    });
  }

  resetForm() {
    this.timeSlot = { time_slot_id: '', day: '', start_time: '', end_time: '' };
  }
}
