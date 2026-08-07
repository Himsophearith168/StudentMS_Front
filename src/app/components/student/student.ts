import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddDataModal, ModalField } from '../add-data-modal/add-data-modal';
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
  loading = false;
  students: Record<string, unknown>[] = [];
  showAdd = false;
  modalEntity = 'Student';

  private fieldSchemas: Record<string, ModalField[]> = {
    Student: [
      { key: 'name', label: 'Student Name', type: 'text', placeholder: 'Enter student name', required: true },
      { key: 'code', label: 'Student Code', type: 'text', placeholder: 'Optional student code' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter student email' },
      { key: 'enrolledDate', label: 'Enrollment Date', type: 'date', placeholder: 'Select enrollment date' },
    ],
  };

  studentFields: ModalField[] = this.fieldSchemas['Student'];

  readonly columns: TableColumn[] = [
    { key: 'studentCode', label: 'Student ID', width: '130px' },
    { key: 'fullName', label: 'Full name' },
    { key: 'gender', label: 'Gender', width: '100px' },
    { key: 'class', label: 'Class' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', width: '105px', align: 'center' },
  ];

  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents(): Promise<void> {
    this.loading = true;
    try {
      const records = await this.studentService.getStudents();
      console.log('[Student Component] fetched records:', records);
      const mapped = records.map((student) => this.toTableRow(student));
      console.log('[Student Component] mapped rows:', mapped);
      this.students = mapped;
      this.cdr.detectChanges();
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
