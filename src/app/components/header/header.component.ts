import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '..//../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <a routerLink="/">Travel App</a>
        </div>
        
        <div class="nav-menu">
          <a routerLink="/buses" routerLinkActive="active">Search Buses</a>
          
          @if (isAuthenticated) {
            <div class="user-menu">
              @if (isAdmin) {
                <a routerLink="/admin/dashboard" routerLinkActive="active">Admin Panel</a>
              }
              <span class="user-name">Welcome, {{ userFullName }}</span>
              <button class="logout-btn" (click)="logout()">Logout</button>
            </div>
          } @else {
            <div class="auth-menu">
              <a routerLink="/login" routerLinkActive="active">Login</a>
              <a routerLink="/register" routerLinkActive="active">Register</a>
            </div>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .nav-brand a {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-menu {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 0.5rem;
    }
    .nav-menu a:hover, .nav-menu a.active {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .user-menu {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .user-name {
      color: #ffd700;
    }
    .logout-btn {
      background: transparent;
      border: 1px solid white;
      color: white;
      padding: 0.3rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .logout-btn:hover {
      background: white;
      color: #667eea;
    }
    .auth-menu {
      display: flex;
      gap: 1rem;
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated();
  isAdmin = this.authService.isAdmin();
  userFullName = '';

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
      this.userFullName = user ? `${user.firstName} ${user.lastName}` : '';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}