import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface TableColumn {
  /** Object key to render. Nested values are supported, e.g. `class.name`. */
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-table.html',
  styleUrls: ['./base-table.css'],
})
export class BaseTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() rows: Record<string, unknown>[] = [];
  @Input() title = '';
  @Input() emptyMessage = 'No records found.';
  @Input() loading = false;
  @Input() showRowNumber = false;

  valueFor(row: Record<string, unknown>, key: string): string {
    const value = key.split('.').reduce<unknown>((current, part) => {
      return current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined;
    }, row);

    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  }
}
