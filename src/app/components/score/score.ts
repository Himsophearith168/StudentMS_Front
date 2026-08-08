import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClassService, ClassItem } from '../../services/class-service';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score.html',
  styleUrl: './score.css',
})
export class Score implements OnInit {
  classes: ClassItem[] = [];
  loading = true;

  constructor(
    private classService: ClassService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.classes = await this.classService.getClasses();
      this.cdr.detectChanges();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  goToClass(classId: string | number | undefined) {
    if (classId) {
      this.router.navigate(['/score/class', classId]);
    }
  }
}

