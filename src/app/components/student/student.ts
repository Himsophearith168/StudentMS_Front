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
      { key: 'studentCode', label: 'Student ID', type: 'text', placeholder: 'e.g. STU-002', required: true },
      { key: 'username', label: 'Username', type: 'text', placeholder: 'Enter username', required: true },
      { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
      { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter student name', required: true },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        placeholder: 'Select gender',
        options: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' }
        ]
      },
      { key: 'dob', label: 'Date of Birth', type: 'date', placeholder: 'Select date of birth' },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter student email' },
      { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Enter student address' },
      { key: 'classId', label: 'Class ID', type: 'number', placeholder: 'e.g. 1' },
      { key: 'subjectIds', label: 'Subject IDs', type: 'text', placeholder: 'e.g. 1,2,3' },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'Select status',
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Suspended', value: 'Suspended' }
        ]
      }
    ],
  };

  studentFields: ModalField[] = this.fieldSchemas['Student'];
  modalInitial: Record<string, any> | null = null;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalIconClass: 'fa-regular fa-eye' | 'fa-regular fa-pen-to-square' | 'fa-regular fa-square-plus' | 'fa-regular fa-trash-can' = 'fa-regular fa-square-plus';

  readonly columns: TableColumn[] = [
    { key: 'studentCode', label: 'Student ID', width: '130px' },
    { key: 'fullName', label: 'Full name' },
    { key: 'gender', label: 'Gender', width: '100px' },
    { key: 'class', label: 'Class' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', width: '105px', align: 'center' },
  ];

  studentColumns = this.columns;

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
    this.modalEntity = 'Student';
    this.studentFields = this.fieldSchemas['Student'];
    this.modalInitial = null;
    this.modalMode = 'create';
    this.modalIconClass = 'fa-regular fa-square-plus';
    this.showAdd = true;
  }

  onCloseAdd() {
    this.showAdd = false;
    this.modalInitial = null;
  }

  async onSaveItem(payload: StudentRecord) {
    try {
      const isEditMode = this.modalMode === 'edit';
      const normalizedPayload = this.normalizePayload(payload, isEditMode);
      const studentId = normalizedPayload.id;
      console.log('[Student Component] Saving with mode:', this.modalMode, 'ID:', studentId, 'Payload:', normalizedPayload);
      
      const shouldUpdate = isEditMode && studentId !== undefined && studentId !== null;
      console.log('[Student Component] Should update:', shouldUpdate);
      
      if (shouldUpdate) {
        await this.studentService.updateStudent(studentId as string | number, normalizedPayload);
        alert('Student updated successfully');
      } else {
        await this.studentService.createStudent(normalizedPayload);
        alert('Student created successfully');
      }
      this.showAdd = false;
      await this.loadStudents();
    } catch (err) {
      console.error('Failed to save student:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert('Failed to save student: ' + errorMsg);
    }
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
      _raw: student,
    };
  }

  handleView(event: { row: Record<string, unknown>; index: number }) {
    console.log('Viewing row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw;
    this.modalEntity = 'Student';
    this.studentFields = this.fieldSchemas['Student'];
    this.modalInitial = this.buildModalInitial(raw as StudentRecord);
    this.modalMode = 'view';
    this.modalIconClass = 'fa-regular fa-eye';
    this.showAdd = true;
  }

  handleUpdate(event: { row: Record<string, unknown>; index: number }) {
    console.log('Updating row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw || {};
    this.modalEntity = 'Student';
    this.studentFields = this.fieldSchemas['Student'];
    this.modalInitial = this.buildModalInitial(raw as StudentRecord);
    this.modalMode = 'edit';
    this.modalIconClass = 'fa-regular fa-pen-to-square';
    this.showAdd = true;
  }

  async handleDelete(event: { row: Record<string, unknown>; index: number }) {
    console.log('Deleting row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw;
    const id = raw?.id;
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      if (id !== undefined) {
        await this.studentService.deleteStudent(id);
      }
      this.students.splice(event.index, 1);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  }

  private buildModalInitial(student: StudentRecord | null): Record<string, any> | null {
    if (!student) return null;

    const classIdValue = student.classId ?? (typeof student.className === 'object' && student.className !== null ? (student.className as any).id : undefined);
    const subjectIdsValue = Array.isArray(student.subjectIds)
      ? student.subjectIds.join(',')
      : Array.isArray(student.subjects)
        ? student.subjects
            .map((subject: any) => (typeof subject === 'string' ? subject : subject?.id ?? subject?.subjectId))
            .filter(Boolean)
            .join(',')
        : '';

    return {
      ...student,
      classId: classIdValue,
      subjectIds: subjectIdsValue,
    } as Record<string, any>;
  }

  private normalizePayload(payload: StudentRecord, isUpdate: boolean = false): StudentRecord {
    const normalized: Record<string, any> = {};

    // Always include id if present
    if (payload.id !== undefined && payload.id !== null) {
      normalized['id'] = payload.id;
    }

    // Include other expected fields
    const otherFields = ['studentCode', 'username', 'password', 'fullName', 'gender', 'dob', 'phone', 'email', 'address', 'status', 'classId', 'subjectIds'];
    
    otherFields.forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== null && payload[field] !== '') {
        normalized[field] = payload[field];
      }
    });

    // For updates, remove empty password (don't require it)
    if (isUpdate && (!normalized['password'] || normalized['password'] === '')) {
      delete normalized['password'];
    }

    // Normalize classId to number
    if (normalized['classId'] !== undefined) {
      const classIdValue = String(normalized['classId']).trim();
      normalized['classId'] = classIdValue ? Number(classIdValue) : undefined;
      if (normalized['classId'] === undefined) delete normalized['classId'];
    }

    // Normalize subjectIds to array of numbers
    if (typeof normalized['subjectIds'] === 'string') {
      const subjectText = normalized['subjectIds'] as string;
      const subjectValues = subjectText
        .split(',')
        .map((value: string) => value.trim())
        .filter((value: string) => Boolean(value));

      normalized['subjectIds'] = subjectValues.map((value: string) => Number(value));
    } else if (Array.isArray(normalized['subjectIds'])) {
      normalized['subjectIds'] = normalized['subjectIds'].map((value: any) => Number(value));
    } else if (normalized['subjectIds'] !== undefined) {
      delete normalized['subjectIds'];
    }

    return normalized as StudentRecord;
  }
}
