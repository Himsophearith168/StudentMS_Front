import { Component, OnInit } from '@angular/core';
import { AddDataModal } from '../add-data-modal/add-data-modal';
import { BaseTableComponent, TableColumn } from '../base-table/base-table';
import { Student as StudentRecord, StudentService } from '../../services/student-service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [AddDataModal, BaseTableComponent],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class Student implements OnInit {
  showAdd = false;
  loading = true;
  students: Record<string, unknown>[] = [];

  readonly columns: TableColumn[] = [
    { key: 'studentCode', label: 'Student ID', width: '130px' },
    { key: 'fullName', label: 'Full name' },
    { key: 'gender', label: 'Gender', width: '100px' },
    { key: 'class', label: 'Class' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', width: '105px', align: 'center' },
  ];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents(): Promise<void> {
    this.loading = true;
    try {
      const records = await this.studentService.getStudents();
      this.students = records.map((student) => this.toTableRow(student));
    } finally {
      this.loading = false;
    }
  }

  onOpenAdd() {
    this.showAdd = true;
  }

  onCloseAdd() {
    this.showAdd = false;
  }

  async onSaveItem(payload: StudentRecord) {
    await this.studentService.createStudent(payload);
    this.showAdd = false;
    await this.loadStudents();
  }

  private toTableRow(student: StudentRecord): Record<string, unknown> {
    const classValue = student.className;
    return {
      studentCode: student.studentCode,
      fullName: student.fullName || student.username,
      gender: student.gender,
      class: typeof classValue === 'string' ? classValue : classValue?.className,
      phone: student.phone,
      email: student.email,
      status: student.status || 'Active',
    };
  }
}
