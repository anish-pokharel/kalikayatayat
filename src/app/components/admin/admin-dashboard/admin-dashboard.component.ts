import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userName: string = 'Admin User';
  userEmail: string = '';

  ngOnInit(): void {
    // Get current user info from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = `${currentUser.firstName} ${currentUser.lastName}`;
      this.userEmail = currentUser.email;
    }
  }

  logout() {
    this.authService.logout(); // Use the auth service logout which handles everything
  }
}