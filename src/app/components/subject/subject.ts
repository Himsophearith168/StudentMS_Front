import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, SubjectItem } from '../../services/subject-service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css',
})
export class Subject implements OnInit {
  subjects: SubjectItem[] = [];
  loading = true;

  constructor(private subjectService: SubjectService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.subjects = await this.subjectService.getSubjects();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}


