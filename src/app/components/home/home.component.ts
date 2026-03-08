// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent {
//   currentYear = new Date().getFullYear();
  
//   testimonials = [
//     { name: 'Rahul Sharma', text: 'Excellent service! Booked Delhi-Mumbai trip and it was very comfortable.', rating: 5, image: '👨' },
//     { name: 'Priya Patel', text: 'Great experience. Easy booking and on-time departure.', rating: 5, image: '👩' },
//     { name: 'Amit Kumar', text: 'Best bus booking platform. Great discounts and offers.', rating: 5, image: '👨' }
//   ];

//   features = [
//     { icon: '🚌', title: '50+ Bus Operators', desc: 'Multiple bus partners' },
//     { icon: '📍', title: '500+ Routes', desc: 'Covering all major cities' },
//     { icon: '💺', title: 'Comfortable Seats', desc: 'Luxury and standard options' },
//     { icon: '🔒', title: 'Secure Payment', desc: 'Safe & encrypted transactions' },
//     { icon: '🎫', title: 'Easy Cancellation', desc: 'Instant refunds' },
//     { icon: '⭐', title: '24/7 Support', desc: 'We\'re here to help' }
//   ];

//   destinations = [
//     { name: 'Delhi', image: '🏛️', routes: 45 },
//     { name: 'Mumbai', image: '🏙️', routes: 38 },
//     { name: 'Bangalore', image: '🏢', routes: 32 },
//     { name: 'Chennai', image: '🌊', routes: 28 },
//     { name: 'Kolkata', image: '🏘️', routes: 25 },
//     { name: 'Jaipur', image: '🏰', routes: 20 }
//   ];
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  
  // User related properties
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  showUserMenu: boolean = false;
  isLoading: boolean = true;
  
  // Logout notification
  logoutMessage: string = '';
  showLogoutNotification: boolean = false;
  logoutSuccess: boolean = true;
  
  // Logout confirmation modal
  showLogoutModal: boolean = false;
  
  private subscriptions: Subscription = new Subscription();
  
  testimonials = [
    { name: 'Rahul Sharma', text: 'Excellent service! Booked Delhi-Mumbai trip and it was very comfortable.', rating: 5, image: '👨' },
    { name: 'Priya Patel', text: 'Great experience. Easy booking and on-time departure.', rating: 5, image: '👩' },
    { name: 'Amit Kumar', text: 'Best bus booking platform. Great discounts and offers.', rating: 5, image: '👨' }
  ];

  features = [
    { icon: '🚌', title: '50+ Bus Operators', desc: 'Multiple bus partners' },
    { icon: '📍', title: '500+ Routes', desc: 'Covering all major cities' },
    { icon: '💺', title: 'Comfortable Seats', desc: 'Luxury and standard options' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Safe & encrypted transactions' },
    { icon: '🎫', title: 'Easy Cancellation', desc: 'Instant refunds' },
    { icon: '⭐', title: '24/7 Support', desc: 'We\'re here to help' }
  ];

  destinations = [
    { name: 'Delhi', image: '🏛️', routes: 45 },
    { name: 'Mumbai', image: '🏙️', routes: 38 },
    { name: 'Bangalore', image: '🏢', routes: 32 },
    { name: 'Chennai', image: '🌊', routes: 28 },
    { name: 'Kolkata', image: '🏘️', routes: 25 },
    { name: 'Jaipur', image: '🏰', routes: 20 }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    
    // Subscribe to user changes
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isLoading = false;
    });
    this.subscriptions.add(userSub);
    
    // Subscribe to logout messages
    const logoutSub = this.authService.logoutMessage$.subscribe(message => {
      if (message) {
        this.showLogoutNotification = true;
        this.logoutMessage = message;
        this.logoutSuccess = message.includes('success');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
          this.hideLogoutNotification();
        }, 5000);
      }
    });
    this.subscriptions.add(logoutSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkAuthStatus(): void {
    if (this.authService.getToken()) {
      this.authService.refreshUserData();
    }
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  // Open logout confirmation modal
  openLogoutConfirmation(): void {
    this.showUserMenu = false; // Close dropdown
    this.showLogoutModal = true;
  }

  // Cancel logout
  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  // Confirm logout
  confirmLogout(): void {
    this.isLoading = true;
    this.showLogoutModal = false;
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      this.authService.logout(true, '✅ Logged out successfully!');
      this.isLoading = false;
    }, 500);
  }

  // Hide logout notification
  hideLogoutNotification(): void {
    this.showLogoutNotification = false;
    this.logoutMessage = '';
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.showUserMenu = false;
  }

  navigateToDashboard(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
    this.showUserMenu = false;
  }

  navigateToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
    this.showUserMenu = false;
  }

  getInitials(): string {
    if (!this.currentUser) return '';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }
}