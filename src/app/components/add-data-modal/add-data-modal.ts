import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-data-modal.html',
  styleUrls: ['./add-data-modal.css'],
})
export class AddDataModal {
  @Input() entity = 'Item';
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form = { name: '', code: '' };

  onClose() {
    this.visible = false;
    this.form = { name: '', code: '' };
    this.close.emit();
  }

  onSave() {
    const payload = { ...this.form, entity: this.entity };
    this.save.emit(payload);
    this.onClose();
  }

  // Prevent closing if they click inside the white dialog box
  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}