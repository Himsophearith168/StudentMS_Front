import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('studentMS');
  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    try {
      return this.router.url.startsWith('/login');
    } catch (e) {
      return false;
    }
  }
}
