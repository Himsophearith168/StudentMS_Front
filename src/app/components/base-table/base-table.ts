import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  /** Object key to render. Nested values are supported, e.g. `class.name`. */
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/** Payload emitted when an action button is clicked */
export interface TableRowAction {
  row: Record<string, unknown>;
  index: number;
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
  
  /** Toggle the actions column */
  @Input() showActions = false;

  /** Emits when the View (Eye) button is clicked */
  @Output() onView = new EventEmitter<TableRowAction>();
  
  /** Emits when the Update (Pencil) button is clicked */
  @Output() onUpdate = new EventEmitter<TableRowAction>();
  
  /** Emits when the Delete (Trash) button is clicked */
  @Output() onDelete = new EventEmitter<TableRowAction>();

  /** Helper to calculate dynamic colspan for Loading/Empty states */
  get totalColumns(): number {
    let count = this.columns.length;
    if (this.showRowNumber) count++;
    if (this.showActions) count++;
    return count;
  }

  valueFor(row: Record<string, unknown>, key: string): string {
    const value = key.split('.').reduce<unknown>((current, part) => {
      return current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined;
    }, row);

    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  }
}