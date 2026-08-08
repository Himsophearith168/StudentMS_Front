import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionService, PermissionItem } from '../../services/permission-service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class Permission implements OnInit {
  permissions: PermissionItem[] = [];
  loading = true;

  constructor(private permissionService: PermissionService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.permissions = await this.permissionService.getPermissions();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  getStatusClass(status: string) {
    if (!status) return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
    const s = status.toUpperCase();
    if (s === 'APPROVED') return 'bg-success bg-opacity-10 text-success border border-success';
    if (s === 'PENDING') return 'bg-warning bg-opacity-10 text-warning border border-warning';
    if (s === 'REJECTED') return 'bg-danger bg-opacity-10 text-danger border border-danger';
    return 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
  }
}


