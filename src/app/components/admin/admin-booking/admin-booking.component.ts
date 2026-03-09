import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { BusService, Bus } from '../../../services/bus.service';

@Component({
  selector: 'app-admin-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.css']
})
export class AdminBookingComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  buses: Bus[] = [];
  
  // Filters
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedBus: string = 'all';
  selectedPaymentStatus: string = 'all';
  dateRange = {
    from: '',
    to: ''
  };
  
  // Statistics
  statistics = {
    totalBookings: 0,
    totalRevenue: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    averageBookingValue: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0
  };
  
  // Chart data
  bookingTrend: any[] = [];
  revenueChart: any[] = [];
  
  // UI States
  isLoading: boolean = false;
  isStatsLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Selected booking for details
  selectedBooking: Booking | null = null;
  showDetailsModal: boolean = false;
  showUpdateStatusModal: boolean = false;
  newStatus: string = '';
  statusUpdateReason: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  // Date range options
  dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];
  selectedDateRange: string = 'thisMonth';

  // Status options
  statusOptions = [
    { value: 'confirmed', label: 'Confirmed', color: '#27ae60' },
    { value: 'pending', label: 'Pending', color: '#f39c12' },
    { value: 'completed', label: 'Completed', color: '#3498db' },
    { value: 'cancelled', label: 'Cancelled', color: '#e74c3c' }
  ];

  // Payment status options
  paymentStatusOptions = [
    { value: 'paid', label: 'Paid', color: '#27ae60' },
    { value: 'pending', label: 'Pending', color: '#f39c12' },
    { value: 'refunded', label: 'Refunded', color: '#e74c3c' }
  ];

  constructor(
    private bookingService: BookingService,
    private busService: BusService
  ) {}

  ngOnInit() {
    this.loadBuses();
    this.loadBookings();
    this.loadStatistics();
    this.setDateRange();
  }

  loadBuses(): void {
    this.busService.getBuses().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.buses = response.data;
        }
      },
      error: (error: any) => console.error('Error loading buses:', error)
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    
    const filters: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    if (this.selectedStatus !== 'all') filters.status = this.selectedStatus;
    if (this.selectedBus !== 'all') filters.busId = this.selectedBus;
    if (this.selectedPaymentStatus !== 'all') filters.paymentStatus = this.selectedPaymentStatus;
    if (this.dateRange.from) filters.fromDate = this.dateRange.from;
    if (this.dateRange.to) filters.toDate = this.dateRange.to;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.bookingService.getAllBookings(filters).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.bookings = response.data || [];
          this.filteredBookings = response.data || [];
          this.totalItems = response.count || response.data?.length || 0;
          this.statistics = response.statistics || this.statistics;
          this.calculatePagination();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoading = false;
      }
    });
  }

  loadStatistics(): void {
    this.isStatsLoading = true;
    this.bookingService.getBookingStatistics(this.selectedDateRange).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.statistics = response.data?.statistics || this.statistics;
          this.bookingTrend = response.data?.trend || [];
          this.revenueChart = response.data?.revenue || [];
        }
        this.isStatsLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading statistics:', error);
        this.isStatsLoading = false;
      }
    });
  }

  setDateRange(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    switch(this.selectedDateRange) {
      case 'today':
        this.dateRange.from = this.formatDateToString(today);
        this.dateRange.to = this.formatDateToString(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        this.dateRange.from = this.formatDateToString(yesterday);
        this.dateRange.to = this.formatDateToString(yesterday);
        break;
      case 'thisWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        this.dateRange.from = this.formatDateToString(weekStart);
        this.dateRange.to = this.formatDateToString(today);
        break;
      case 'thisMonth':
        const monthStart = new Date(year, month, 1);
        this.dateRange.from = this.formatDateToString(monthStart);
        this.dateRange.to = this.formatDateToString(today);
        break;
      case 'lastMonth':
        const lastMonthStart = new Date(year, month - 1, 1);
        const lastMonthEnd = new Date(year, month, 0);
        this.dateRange.from = this.formatDateToString(lastMonthStart);
        this.dateRange.to = this.formatDateToString(lastMonthEnd);
        break;
      case 'last3Months':
        const threeMonthsAgo = new Date(year, month - 3, 1);
        this.dateRange.from = this.formatDateToString(threeMonthsAgo);
        this.dateRange.to = this.formatDateToString(today);
        break;
      case 'custom':
        // Keep user selected dates
        break;
    }
  }

  // RENAMED to avoid duplicate with the other formatDate
  formatDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  onDateRangeChange(): void {
    this.setDateRange();
    this.loadBookings();
    this.loadStatistics();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedBus = 'all';
    this.selectedPaymentStatus = 'all';
    this.selectedDateRange = 'thisMonth';
    this.setDateRange();
    this.currentPage = 1;
    this.loadBookings();
    this.loadStatistics();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewBookingDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
  }

  openUpdateStatusModal(booking: Booking): void {
    this.selectedBooking = booking;
    this.newStatus = booking.status;
    this.statusUpdateReason = '';
    this.showUpdateStatusModal = true;
  }

  closeUpdateStatusModal(): void {
    this.showUpdateStatusModal = false;
    this.selectedBooking = null;
    this.newStatus = '';
    this.statusUpdateReason = '';
  }

  updateBookingStatus(): void {
    if (!this.selectedBooking || !this.newStatus) return;

    this.bookingService.updateBookingStatus(this.selectedBooking._id, this.newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = `Booking status updated to ${this.newStatus}`;
          this.loadBookings();
          this.loadStatistics();
          this.closeUpdateStatusModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
        this.errorMessage = error.error?.message || 'Failed to update status';
      }
    });
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

  getPaymentStatusClass(status: string): string {
    switch(status) {
      case 'paid': return 'payment-paid';
      case 'pending': return 'payment-pending';
      case 'refunded': return 'payment-refunded';
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

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  // RENAMED to avoid duplicate - this is for displaying dates
  formatDisplayDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatJourneyDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTotalPassengers(booking: Booking): number {
    return booking.seats.length;
  }

  getTotalAmount(booking: Booking): number {
    return booking.totalAmount + booking.taxAmount;
  }

  getBusName(busId: string): string {
    const bus = this.buses.find(b => b._id === busId);
    return bus ? `${bus.busName} (${bus.busNumber})` : 'Unknown Bus';
  }

  exportToExcel(): void {
    alert('Export to Excel functionality coming soon!');
  }

  exportToPDF(): void {
    alert('Export to PDF functionality coming soon!');
  }

  printReport(): void {
    window.print();
  }
}