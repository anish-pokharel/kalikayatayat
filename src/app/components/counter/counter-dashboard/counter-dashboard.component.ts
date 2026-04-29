import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-counter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './counter-dashboard.component.html',
  styleUrl: './counter-dashboard.component.css'
})
export class CounterDashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoading = true;
  
  // Statistics data
  todayBookings: number = 0;
  todayRevenue: number = 0;
  availableBuses: number = 0;
  totalCustomers: number = 0;
  pendingBookings: number = 0;
  
  // Recent bookings
  recentBookings: any[] = [];
  
  // Upcoming buses
  upcomingBuses: any[] = [];
  
  // Quick actions
  searchQuery: string = '';
  searchResults: any[] = [];
  
  private subscriptions: Subscription = new Subscription();
// currentDate: string | number | Date | undefined;
  currentDate: Date = new Date();


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
    // Check if user is counter, if not redirect
    if (!this.authService.isCounter()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API calls - Replace with actual API calls
    setTimeout(() => {
      // Load today's bookings
      this.todayBookings = 24;
      
      // Load today's revenue
      this.todayRevenue = 78500;
      
      // Load available buses
      this.availableBuses = 12;
      
      // Load total customers
      this.totalCustomers = 1542;
      
      // Load pending bookings
      this.pendingBookings = 8;
      
      // Load recent bookings
      this.recentBookings = [
        {
          id: 'BK1001',
          bookingNumber: 'B202401200001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          busName: 'Express Bus',
          busNumber: 'BA 1234',
          source: 'Kathmandu',
          destination: 'Pokhara',
          departureTime: '08:00 AM',
          seats: 2,
          totalAmount: 2400,
          bookingDate: '2024-01-20',
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          id: 'BK1002',
          bookingNumber: 'B202401200002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          busName: 'City Deluxe',
          busNumber: 'BA 5678',
          source: 'Kathmandu',
          destination: 'Chitwan',
          departureTime: '09:30 AM',
          seats: 3,
          totalAmount: 3600,
          bookingDate: '2024-01-20',
          status: 'pending',
          paymentStatus: 'pending'
        },
        {
          id: 'BK1003',
          bookingNumber: 'B202401190015',
          customerName: 'Bob Johnson',
          customerEmail: 'bob@example.com',
          busName: 'Night Express',
          busNumber: 'BA 9012',
          source: 'Pokhara',
          destination: 'Kathmandu',
          departureTime: '10:00 PM',
          seats: 1,
          totalAmount: 1200,
          bookingDate: '2024-01-19',
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          id: 'BK1004',
          bookingNumber: 'B202401190016',
          customerName: 'Alice Brown',
          customerEmail: 'alice@example.com',
          busName: 'Super Deluxe',
          busNumber: 'BA 3456',
          source: 'Butwal',
          destination: 'Kathmandu',
          departureTime: '07:00 AM',
          seats: 4,
          totalAmount: 4800,
          bookingDate: '2024-01-19',
          status: 'cancelled',
          paymentStatus: 'refunded'
        }
      ];
      
      // Load upcoming buses
      this.upcomingBuses = [
        {
          id: 'BUS001',
          busName: 'Express Bus',
          busNumber: 'BA 1234',
          source: 'Kathmandu',
          destination: 'Pokhara',
          departureTime: '08:00 AM',
          availableSeats: 15,
          totalSeats: 40,
          fare: 1200
        },
        {
          id: 'BUS002',
          busName: 'City Deluxe',
          busNumber: 'BA 5678',
          source: 'Kathmandu',
          destination: 'Chitwan',
          departureTime: '09:30 AM',
          availableSeats: 8,
          totalSeats: 35,
          fare: 1200
        },
        {
          id: 'BUS003',
          busName: 'Mountain Express',
          busNumber: 'BA 7890',
          source: 'Kathmandu',
          destination: 'Lumbini',
          departureTime: '11:00 AM',
          availableSeats: 22,
          totalSeats: 45,
          fare: 1500
        }
      ];
      
      this.isLoading = false;
    }, 1000);
  }

  searchCustomer(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    
    // Simulate API search - Replace with actual API call
    this.isLoading = true;
    setTimeout(() => {
      this.searchResults = [
        {
          id: 'CUST001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9800000001',
          totalBookings: 5
        },
        {
          id: 'CUST002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '9800000002',
          totalBookings: 3
        }
      ].filter(customer => 
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.isLoading = false;
    }, 500);
  }

  viewBooking(bookingId: string): void {
    console.log('View booking:', bookingId);
    // Navigate to booking details
    this.router.navigate(['/counter/booking', bookingId]);
  }

  editBooking(bookingId: string): void {
    console.log('Edit booking:', bookingId);
    // Navigate to edit booking
    this.router.navigate(['/counter/booking/edit', bookingId]);
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      console.log('Cancel booking:', bookingId);
      // Call API to cancel booking
      // Refresh data after cancellation
    }
  }

  viewCustomer(customerId: string): void {
    console.log('View customer:', customerId);
    this.router.navigate(['/counter/customer', customerId]);
  }

  createNewBooking(): void {
    this.router.navigate(['/counter/new-booking']);
  }

  viewBusSchedule(busId: string): void {
    console.log('View bus schedule:', busId);
    this.router.navigate(['/counter/bus-schedule', busId]);
  }

  generateReport(): void {
    console.log('Generate report');
    this.router.navigate(['/counter/reports']);
  }

  logout(): void {
    this.authService.logout(true, 'Logged out successfully');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'refunded':
        return 'payment-refunded';
      default:
        return '';
    }
  }
}