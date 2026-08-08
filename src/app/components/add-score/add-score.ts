import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from '../../services/student-service';
import { ClassService, ClassItem } from '../../services/class-service';

type ScoreStudent = Student & {
  scoreKey: string;
  displayName: string;
};

@Component({
  selector: 'app-add-score',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './add-score.html',
  styleUrl: './add-score.css',
})
export class AddScore implements OnInit {
  classId: string | null = null;
  classDetail: ClassItem | null = null;
  students: ScoreStudent[] = [];
  subjects: any[] = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    { id: 4, name: 'English' }
  ];
  selectedSubjectId: number | null = null;
  
  loading = true;

  // Holds scores input by the teacher. Keyed by stable score key.
  scores: { [scoreKey: string]: number | null } = {};

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private classService: ClassService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId) {
      try {
        this.classDetail = await this.classService.getClassById(this.classId);
        const allStudents = await this.studentService.getStudents();

        this.students = allStudents.map((student, index) => {
          const idKey = student.id ?? student.studentCode ?? `student-${index}`;
          const scoreKey = String(idKey);
          const displayName = student.fullName || student.username || (student as any).name || 'Unnamed Student';
          return {
            ...student,
            scoreKey,
            displayName,
          } as ScoreStudent;
        });

        this.students.forEach((student) => {
          this.scores[student.scoreKey] = null;
        });

      } catch (e) {
        console.error(e);
      }
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  saveScores() {
    console.log('Saving scores for subject:', this.selectedSubjectId, this.scores);
    alert('Scores saved successfully!');
  }
}

