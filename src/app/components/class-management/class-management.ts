import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalField } from '../add-data-modal/add-data-modal';
import { TableColumn } from '../base-table/base-table';
import { ClassService, ClassItem } from '../../services/class-service';
import { AddDataModal } from '../add-data-modal/add-data-modal';
import { BaseTableComponent } from '../base-table/base-table';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, AddDataModal, BaseTableComponent],
  templateUrl: './class-management.html',
  styleUrls: ['./class-management.css'],
})
export class ClassManagement implements OnInit {
  loading = false;
  classes: Record<string, unknown>[] = [];
  showAdd = false;
  modalEntity = 'Class';

  private fieldSchemas: Record<string, ModalField[]> = {
    Class: [
      { key: 'className', label: 'Class Name', type: 'text', placeholder: 'Enter class name', required: true },
      { key: 'code', label: 'Class Code', type: 'text', placeholder: 'Optional class code' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' },
      { key: 'teacher', label: 'Teacher', type: 'text', placeholder: 'Assigned teacher' },
    ],
  };

  classFields: ModalField[] = this.fieldSchemas['Class'];
  modalInitial: Record<string, any> | null = null;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  modalIconClass: 'fa-regular fa-eye' | 'fa-regular fa-pen-to-square' | 'fa-regular fa-square-plus' | 'fa-regular fa-trash-can' = 'fa-regular fa-square-plus';

  readonly columns: TableColumn[] = [
    { key: 'classCode', label: 'Code', width: '120px' },
    { key: 'className', label: 'Class Name' },
    { key: 'teacher', label: 'Teacher', width: '160px' },
    { key: 'studentCount', label: 'Students', width: '100px', align: 'center' },
    { key: 'status', label: 'Status', width: '105px', align: 'center' },
  ];

  classColumns = this.columns;

  constructor(private classService: ClassService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  async loadClasses(): Promise<void> {
    this.loading = true;
    try {
      const records = await this.classService.getClasses();
      console.log('[Class Component] fetched records:', records);
      const mapped = records.map((c) => this.toTableRow(c));
      console.log('[Class Component] mapped rows:', mapped);
      this.classes = mapped;
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
    }
  }

  onOpenAdd() {
    this.modalInitial = null;
    this.modalMode = 'create';
    this.modalIconClass = 'fa-regular fa-square-plus';
    this.showAdd = true;
  }

  onCloseAdd() {
    this.showAdd = false;
    this.modalInitial = null;
  }

  async onSaveItem(payload: ClassItem) {
    try {
      await this.classService.createClass(payload);
      this.showAdd = false;
      await this.loadClasses();
    } catch (err) {
      console.error('Failed to save class:', err);
    }
  }

  private toTableRow(item: ClassItem): Record<string, unknown> {
    return {
      classCode: item.code || item.id,
      className: item.className || item.name,
      teacher: (item as any).teacherName || (item as any).teacher || '—',
      studentCount: (item as any).studentCount ?? 0,
      status: item.description || 'Active',
      _raw: item,
    };
  }

  handleView(event: { row: Record<string, unknown>; index: number }) {
    console.log('Viewing row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw;
    this.modalInitial = raw as Record<string, any>;
    this.modalMode = 'view';
    this.modalIconClass = 'fa-regular fa-eye';
    this.showAdd = true;
  }

  handleUpdate(event: { row: Record<string, unknown>; index: number }) {
    console.log('Updating row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw || {};
    this.modalEntity = 'Class';
    this.classFields = this.fieldSchemas['Class'];
    // set initial data for modal and open it
    this.modalInitial = raw as Record<string, any>;
    this.modalMode = 'edit';
    this.modalIconClass = 'fa-regular fa-pen-to-square';
    this.showAdd = true;
  }

  async handleDelete(event: { row: Record<string, unknown>; index: number }) {
    console.log('Deleting row:', event.index, 'Data:', event.row);
    const raw = (event.row as any)._raw;
    const id = raw?.id;
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      if (id !== undefined) await this.classService.deleteClass(id);
      this.classes.splice(event.index, 1);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  }
}
