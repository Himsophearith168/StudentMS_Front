import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../stat-card/stat-card';
import { StudentService } from '../../services/student-service';
import { ClassService } from '../../services/class-service';
import { SubjectService } from '../../services/subject-service';
import { PermissionService } from '../../services/permission-service';
import { AddDataModal, ModalField } from '../add-data-modal/add-data-modal';

type BadgeType = 'primary' | 'success' | 'warning' | 'info' | 'secondary';

interface StatItem {
  title: string;
  value: string;
  badgeText: string;
  badgeType: BadgeType;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCard,AddDataModal],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  stats: StatItem[] = [
    { title: 'Students', value: '0', badgeText: '+0%', badgeType: 'primary', description: 'Total students currently registered.' },
    { title: 'Classes', value: '0', badgeText: 'Stable', badgeType: 'success', description: 'Total classes available this term.' },
    { title: 'Subjects', value: '24', badgeText: 'Updated', badgeType: 'warning', description: 'Available courses this semester.' },
    { title: 'Ask Permission', value: '98%', badgeText: '+2.4%', badgeType: 'info', description: 'Average permission requests today.' },
  ];

  async ngOnInit() {
    try {
      const students = await this.studentService.getStudents();
      console.log('Dashboard loaded students:', students);
      const studentCount = Array.isArray(students) ? students.length : 0;
      this.stats = [
        { ...this.stats[0], value: `${studentCount}` },
        ...this.stats.slice(1),
      ];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load student count:', error);
    }

    try {
      const classes = await this.classService.getClasses();
      console.log('Dashboard loaded classes:', classes);
      const classCount = Array.isArray(classes) ? classes.length : 0;
      this.stats = [
        this.stats[0],
        { ...this.stats[1], value: `${classCount}` },
        ...this.stats.slice(2),
      ];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load class count:', error);
    }

    try {
      const subjects = await this.subjectService.getSubjects();
      console.log('Dashboard loaded subjects:', subjects);
      const subjectCount = Array.isArray(subjects) ? subjects.length : 0;
      this.stats = [
        this.stats[0],
        this.stats[1],
        { ...this.stats[2], value: `${subjectCount}` },
        ...this.stats.slice(3),
      ];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load subject count:', error);
    }

    try {
      const permissions = await this.permissionService.getPermissions();
      console.log('Dashboard loaded permissions:', permissions);
      const permissionCount = Array.isArray(permissions) ? permissions.length : 0;
      this.stats = [
        this.stats[0],
        this.stats[1],
        this.stats[2],
        { ...this.stats[3], value: `${permissionCount}` },
      ];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to load permission count:', error);
    }
  }

  showAddDataModal = false;
  modalEntity = 'Student';
  modalFields: ModalField[] = [];

  private fieldSchemas: Record<string, ModalField[]> = {
    Student: [
      { key: 'studentCode', label: 'Student ID', type: 'text', placeholder: 'e.g. STU-001', required: true },
      { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter student name', required: true },
      { key: 'gender', label: 'Gender', type: 'select', placeholder: 'Select gender', options: [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }] },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter student email' },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number' },
      { key: 'dob', label: 'Date of Birth', type: 'date' },
    ],
    Subject: [
      { key: 'name', label: 'Subject Name', type: 'text', placeholder: 'Enter subject name', required: true },
      { key: 'code', label: 'Subject Code', type: 'text', placeholder: 'Optional subject code' },
      { key: 'category', label: 'Category', type: 'select', placeholder: 'Choose category', options: [
        { value: 'science', label: 'Science' },
        { value: 'math', label: 'Math' },
        { value: 'language', label: 'Language' },
      ] },
    ],
    Class: [
      { key: 'name', label: 'Class Name', type: 'text', placeholder: 'Enter class name', required: true },
      { key: 'code', label: 'Class Code', type: 'text', placeholder: 'Optional class code' },
      { key: 'room', label: 'Room', type: 'text', placeholder: 'Enter room number' },
      { key: 'startDate', label: 'Start Date', type: 'date', placeholder: 'Select start date' },
    ],
  };

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private subjectService: SubjectService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef
  ) {
    this.setModalFields('Student');
  }

  setModalFields(entity: string) {
    this.modalEntity = entity;
    this.modalFields = this.fieldSchemas[entity] || this.fieldSchemas['Student'];
  }

  openAddDataModal(entity: string) {
    this.setModalFields(entity);
    this.showAddDataModal = true;
  }

  onCloseAddDataModal() {
    this.showAddDataModal = false;
  }

  async onSaveAddData(payload: any) {
    const { entity, ...data } = payload;
    if (entity === 'Student') {
      await this.studentService.createStudent(data);
      const students = await this.studentService.getStudents();
      this.stats = [{ ...this.stats[0], value: `${students.length}` }, ...this.stats.slice(1)];
      this.cdr.detectChanges();
    }
    this.showAddDataModal = false;
  }

}

