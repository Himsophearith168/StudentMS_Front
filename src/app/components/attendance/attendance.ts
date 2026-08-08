import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AttendanceRow {
  id: string;
  studentName: string;
  name?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Pending';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
})
export class Attendance {
  students: AttendanceRow[] = [
    { id: 'STU-001', studentName: 'Amina Johnson', status: 'Present' },
    { id: 'STU-002', studentName: 'Daniel Kim', status: 'Absent' },
    { id: 'STU-003', studentName: 'Priya Patel', status: 'Late' },
    { id: 'STU-004', studentName: 'Noah Brown', status: 'Pending' },
    { id: 'STU-005', studentName: 'Sophia Nguyen', status: 'Present' },
  ];

  loading = false;
  selectedDate: string = new Date().toISOString().split('T')[0];

  markStatus(student: AttendanceRow, status: 'Present' | 'Absent' | 'Late' | 'Pending') {
    student.status = status;
  }
}


