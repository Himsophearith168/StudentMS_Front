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
  @Input() fields: ModalField[] = [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Enter name', required: true },
    { key: 'code', label: 'Code', type: 'text', placeholder: 'Optional code' },
  ];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: Record<string, any> = {};

  constructor() {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] || (changes['visible'] && changes['visible'].currentValue)) {
      this.resetForm();
    }
  }

  private resetForm() {
    this.form = {};
    this.fields.forEach((field) => {
      this.form[field.key] = '';
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