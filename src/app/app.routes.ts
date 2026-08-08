import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Student } from './components/student/student';
import { Score } from './components/score/score';
import { Subject } from './components/subject/subject';
import { Permission } from './components/permission/permission';
import { Attendance } from './components/attendance/attendance';
import { ClassManagement } from './components/class-management/class-management';
import { Schedule } from './components/schedule/schedule';
import { AddScore } from './components/add-score/add-score';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'student', component: Student },
  { path: 'score', component: Score },
  { path: 'score/class/:id', component: AddScore },
  { path: 'subject', component: Subject },
  { path: 'permissions', component: Permission },
  { path: 'attendance', component: Attendance },
  { path: 'classes', component: ClassManagement },
  { path: 'schedule', component: Schedule },
  { path: '**', redirectTo: 'dashboard' },
];
