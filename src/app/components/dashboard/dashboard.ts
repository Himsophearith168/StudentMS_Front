import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../stat-card/stat-card';
import { StudentService } from '../../services/student-service';
import { ClassService } from '../../services/class-service';

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
  imports: [CommonModule, StatCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  stats: StatItem[] = [
    { title: 'Students', value: '0', badgeText: '+0%', badgeType: 'primary', description: 'Total students currently registered.' },
    { title: 'Classes', value: '0', badgeText: 'Stable', badgeType: 'success', description: 'Total classes available this term.' },
    { title: 'Subjects', value: '24', badgeText: 'Updated', badgeType: 'warning', description: 'Available courses this semester.' },
    { title: 'Ask Permission', value: '98%', badgeText: '+2.4%', badgeType: 'info', description: 'Average attendance today.' },
  ];

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private cdr: ChangeDetectorRef
  ) {}

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
  }
}

