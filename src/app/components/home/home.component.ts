import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { BusService, Bus, SearchCriteria } from '../../services/bus.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  today: string = new Date().toISOString().split('T')[0];
  
  // User related properties
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  showUserMenu: boolean = false;
  isLoading: boolean = true;
  searchLoading: boolean = false;
  
  // Logout notification
  logoutMessage: string = '';
  showLogoutNotification: boolean = false;
  logoutSuccess: boolean = true;
  
  // Logout confirmation modal
  showLogoutModal: boolean = false;
  
  // Search criteria
  searchCriteria: SearchCriteria = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  // Quick search results
  quickBuses: Bus[] = [];
  popularRoutes: string[] = [];
  
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
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadPopularRoutes();
    
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

  loadPopularRoutes(): void {
    this.busService.getPopularRoutes().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.popularRoutes = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading popular routes:', error);
      }
    });
  }

  // Search methods
  onFromInput(): void {
    // Optional: Fetch suggestions based on input
  }

  onToInput(): void {
    // Optional: Fetch suggestions based on input
  }

  swapLocations(): void {
    const temp = this.searchCriteria.from;
    this.searchCriteria.from = this.searchCriteria.to;
    this.searchCriteria.to = temp;
  }

  searchBuses(): void {
    if (!this.searchCriteria.from || !this.searchCriteria.to) {
      alert('Please enter both origin and destination');
      return;
    }

    this.searchLoading = true;

    // Navigate to buses page with search criteria
    this.router.navigate(['/buses'], {
      queryParams: {
        from: this.searchCriteria.from,
        to: this.searchCriteria.to,
        date: this.searchCriteria.date,
        passengers: this.searchCriteria.passengers
      }
    });
  }

  // Quick search preview (optional)
  loadQuickSearchResults(): void {
    if (!this.searchCriteria.from || !this.searchCriteria.to) return;
    
    this.busService.searchBuses(this.searchCriteria).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.quickBuses = response.data.slice(0, 5);
        }
      },
      error: (error) => {
        console.error('Error loading quick search:', error);
      }
    });
  }

  selectDestination(destination: any): void {
    this.searchCriteria.to = destination.name;
    if (!this.searchCriteria.from) {
      // Set default from if not set
      this.searchCriteria.from = 'Delhi';
    }
    this.searchBuses();
  }

  viewBusDetails(bus: Bus): void {
    if (bus._id) {
      this.router.navigate(['/seat-selection', bus._id], {
        queryParams: {
          passengers: this.searchCriteria.passengers
        }
      });
    }
  }

  // Bus helper methods
  getPrice(bus: Bus): number {
    return bus.fare || bus.price || 0;
  }

  getAvailableSeats(bus: Bus): number {
    return bus.availableSeats || 0;
  }

  getOperatorName(bus: Bus): string {
    return bus.operator || bus.busName?.split(' ')[0] || 'Travels';
  }

  // User methods
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  openLogoutConfirmation(): void {
    this.showUserMenu = false;
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.isLoading = true;
    this.showLogoutModal = false;
    
    setTimeout(() => {
      this.authService.logout(true, '✅ Logged out successfully!');
      this.isLoading = false;
    }, 500);
  }

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