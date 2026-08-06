import { Component } from '@angular/core';
import { AddDataModal } from '../add-data-modal/add-data-modal';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [AddDataModal],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class Student {
  showAdd = false;

  onOpenAdd() {
    this.showAdd = true;
  }

  onCloseAdd() {
    this.showAdd = false;
  }

  onSaveItem(payload: any) {
    // TODO: wire to service to persist; for now just log
    console.log('Saved item', payload);
    this.showAdd = false;
  }
}
