import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Student } from './student';
import { Student as StudentRecord, StudentService } from '../../services/student-service';

describe('Student', () => {
  let component: Student;
  let fixture: ComponentFixture<Student>;
  let studentService: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    studentService = jasmine.createSpyObj('StudentService', ['getStudents', 'createStudent', 'updateStudent', 'deleteStudent']);
    studentService.getStudents.and.resolveTo([]);
    studentService.createStudent.and.resolveTo({} as StudentRecord);
    studentService.updateStudent.and.resolveTo({} as StudentRecord);
    studentService.deleteStudent.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [Student],
      providers: [{ provide: StudentService, useValue: studentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Student);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update an existing student when edit mode is active', async () => {
    component.modalMode = 'edit';
    const payload = { id: 7, studentCode: 'STU_007', fullName: 'Jane Doe' } as StudentRecord;

    await component.onSaveItem(payload);

    expect(studentService.updateStudent).toHaveBeenCalledWith(7, jasmine.objectContaining({ id: 7, studentCode: 'STU_007', fullName: 'Jane Doe' }));
    expect(studentService.createStudent).not.toHaveBeenCalled();
  });

  it('should normalize class and subject data before saving', async () => {
    component.modalMode = 'create';
    const payload = {
      studentCode: 'STU_008',
      fullName: 'Lisa Brown',
      className: 'Grade 10A',
      subjects: 'Math, English',
    } as StudentRecord;

    await component.onSaveItem(payload);

    const savedPayload = studentService.createStudent.calls.most().args[0];
    expect(savedPayload.className).toEqual({ className: 'Grade 10A' });
    expect(savedPayload.subjects).toEqual([{ subjectName: 'Math' }, { subjectName: 'English' }]);
  });
});
