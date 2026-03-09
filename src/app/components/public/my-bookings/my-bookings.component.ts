import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  
  // Filter and search
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedMonth: string = 'all';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  
  // UI states
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  cancelInProgress: string | null = null;
  
  // Statistics
  totalSpent: number = 0;
  totalBookings: number = 0;
  activeBookings: number = 0;
  cancelledBookings: number = 0;
  
  // Months for filter
  months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.bookings = response.data || [];
          this.calculateStatistics();
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  calculateStatistics() {
    this.totalBookings = this.bookings.length;
    this.totalSpent = this.bookings.reduce((sum, b) => sum + b.totalAmount + b.taxAmount, 0);
    this.activeBookings = this.bookings.filter(b => b.status === 'confirmed').length;
    this.cancelledBookings = this.bookings.filter(b => b.status === 'cancelled').length;
  }

  applyFilters() {
    let filtered = [...this.bookings];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.bookingId.toLowerCase().includes(term) ||
        booking.busDetails.busName.toLowerCase().includes(term) ||
        booking.routeDetails.origin.toLowerCase().includes(term) ||
        booking.routeDetails.destination.toLowerCase().includes(term) ||
        booking.seats.some(seat => 
          seat.passengerName.toLowerCase().includes(term)
        )
      );
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === this.selectedStatus);
    }

    // Filter by month
    if (this.selectedMonth !== 'all') {
      const month = parseInt(this.selectedMonth);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.journeyDate);
        return bookingDate.getMonth() === month;
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => 
      new Date(b.journeyDate).getTime() - new Date(a.journeyDate).getTime()
    );

    this.filteredBookings = filtered;
    this.totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedMonth = 'all';
    this.applyFilters();
  }

  getPaginatedBookings(): Booking[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBookings.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewBooking(bookingId: string) {
    this.router.navigate(['/booking', bookingId]);
  }

  cancelBooking(booking: Booking) {
    if (booking.status !== 'confirmed') {
      alert('This booking cannot be cancelled');
      return;
    }

    const journeyDate = new Date(booking.journeyDate);
    const now = new Date();
    const hoursUntilDeparture = (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 4) {
      alert('Cannot cancel booking less than 4 hours before departure');
      return;
    }

    if (confirm(`Are you sure you want to cancel booking ${booking.bookingId}?`)) {
      this.cancelInProgress = booking._id;
      
      this.bookingService.cancelBooking(booking._id, 'Cancelled by user').subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = `Booking cancelled successfully. Refund: ₹${response.data.refundAmount}`;
            this.loadBookings();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.cancelInProgress = null;
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          this.errorMessage = error.error?.message || 'Failed to cancel booking';
          this.cancelInProgress = null;
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'confirmed': return '✅';
      case 'cancelled': return '❌';
      case 'completed': return '🎫';
      case 'pending': return '⏳';
      default: return '📅';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  getTotalPassengers(booking: Booking): number {
    return booking.seats.length;
  }

  canCancel(booking: Booking): boolean {
    if (booking.status !== 'confirmed') return false;
    
    const journeyDate = new Date(booking.journeyDate);
    const now = new Date();
    const hoursUntilDeparture = (journeyDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilDeparture > 4;
  }
}