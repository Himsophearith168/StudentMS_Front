import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  host: { class: 'col-12 col-sm-6 col-xl-3' },
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.css'],
})
export class StatCard {
  @Input() title = '';
  @Input() value = '';
  @Input() description = '';
  @Input() badgeText = '';
  @Input() badgeType: 'primary' | 'success' | 'warning' | 'info' | 'secondary' = 'primary';

  get badgeClass(): string {
    return `badge rounded-pill bg-soft text-${this.badgeType} py-2 px-3`;
  }
}
