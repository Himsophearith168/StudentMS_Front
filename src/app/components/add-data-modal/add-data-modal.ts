import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ModalField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-data-modal.html',
  styleUrls: ['./add-data-modal.css'],
})
export class AddDataModal implements OnChanges {
  @Input() entity = 'Item';
  @Input() visible = false;
  /** Mode: 'create' | 'edit' | 'view' */
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() fields: ModalField[] = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Enter name', required: true },
    { key: 'code', label: 'Code', type: 'text', placeholder: 'Optional code' },
  ];

  @Input() iconClass: string | null = null;
  @Input() iconSrc: string | null = null;
  @Input() iconAlt = '';

  @Input() initialData: Record<string, any> | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: Record<string, any> = {};

  constructor() {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      this.resetForm();
    }

    if (changes['visible'] && changes['visible'].currentValue) {
      this.resetForm();
      if (this.initialData) {
        this.applyInitialData(this.initialData);
      }
    }
    if (changes['initialData'] && this.visible && this.initialData) {
      this.applyInitialData(this.initialData);
    }
  }

  private resetForm() {
    this.form = {};
    this.fields.forEach((field) => {
      this.form[field.key] = '';
    });
  }

  private applyInitialData(data: Record<string, any>) {
    this.fields.forEach((field) => {
      if (data[field.key] !== undefined) this.form[field.key] = data[field.key];
    });
  }

  get isSaveDisabled() {
    return this.fields.some((field) => field.required && !this.form[field.key]?.toString().trim());
  }

  onClose() {
    this.visible = false;
    this.resetForm();
    this.close.emit();
  }

  onSave() {
    const payload = { ...this.form, entity: this.entity };
    this.save.emit(payload);
    this.onClose();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}