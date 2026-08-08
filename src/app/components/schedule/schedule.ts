import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScheduleRow {
  day: string;
  subject: string;
  subjectName?: string;
  room: string;
  time: string;
  startTime?: string;
  endTime?: string;
  teacher: string;
  teacherName?: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  schedules: ScheduleRow[] = [
    { day: 'Monday', subject: 'Mathematics', room: '101', time: '08:00 - 09:00', teacher: 'Ms. Harper' },
    { day: 'Monday', subject: 'English', room: '102', time: '09:10 - 10:10', teacher: 'Mr. Ward' },
    { day: 'Tuesday', subject: 'Science', room: '201', time: '08:00 - 09:00', teacher: 'Dr. Chen' },
    { day: 'Wednesday', subject: 'History', room: '103', time: '10:20 - 11:20', teacher: 'Mrs. James' },
    { day: 'Thursday', subject: 'Physical Ed.', room: 'Gym', time: '11:30 - 12:30', teacher: 'Coach Lee' },
    { day: 'Friday', subject: 'Art', room: '204', time: '13:00 - 14:00', teacher: 'Ms. Ortiz' },
  ];
  loading = false;

  getScheduleForDay(day: string) {
    return this.schedules.filter((item) => item.day === day);
  }
}


