import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService, Customer, CustomerStats } from '../../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  customerStats: CustomerStats = {
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    blockedCustomers: 0,
    totalRevenue: 0,
    averageSpending: 0,
    growthData: [],
    bookingTrend: []
  };
  
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedGender: string = 'all';
  selectedCity: string = 'all';
  dateRange = {
    from: '',
    to: ''
  };
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  showBookingHistoryModal: boolean = false;
  showExportModal: boolean = false;
  
  selectedCustomer: Customer | null = null;
  cities: string[] = [];
  customerBookings: any[] = [];
  
  // Loading states
  isLoading: boolean = false;
  isStatsLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;
  
  // Chart data
  customerGrowthData: any[] = [];
  bookingTrendData: any[] = [];
  
  newCustomer: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    idProofType: 'aadhar',
    idProofNumber: '',
    status: 'active',
    preferences: {
      busType: [],
      seatPreference: 'any',
      mealPreference: []
    }
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadCustomerStats();
    this.loadCities();
  }

  loadCustomers() {
    this.isLoading = true;
    const filters = {
      status: this.selectedStatus,
      gender: this.selectedGender,
      city: this.selectedCity,
      search: this.searchTerm,
      fromDate: this.dateRange.from,
      toDate: this.dateRange.to,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.customerService.getCustomers(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data.map(customer => ({
            ...customer,
            name: `${customer.firstName} ${customer.lastName}`
          }));
          this.filteredCustomers = this.customers;
          this.totalItems = response.count || this.customers.length;
          this.calculatePagination();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Failed to load customers';
        this.isLoading = false;
      }
    });
  }

  loadCustomerStats() {
    this.isStatsLoading = true;
    this.customerService.getCustomerStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.customerStats = response.data;
          this.customerGrowthData = response.data.growthData;
          this.bookingTrendData = response.data.bookingTrend;
        }
        this.isStatsLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isStatsLoading = false;
      }
    });
  }

  loadCities() {
    this.customerService.getCities().subscribe({
      next: (response) => {
        if (response.success) {
          this.cities = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  filterCustomers() {
    // Client-side filtering as backup, though backend already filters
    this.filteredCustomers = this.customers.filter(customer => {
      const customerName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const matchesSearch = this.searchTerm === '' || 
        customerName.includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm) ||
        customer.customerId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || customer.status === this.selectedStatus;
      const matchesGender = this.selectedGender === 'all' || customer.gender === this.selectedGender;
      const matchesCity = this.selectedCity === 'all' || customer.city === this.selectedCity;
      
      const matchesDateRange = (!this.dateRange.from || new Date(customer.registeredOn) >= new Date(this.dateRange.from)) &&
                               (!this.dateRange.to || new Date(customer.registeredOn) <= new Date(this.dateRange.to));
      
      return matchesSearch && matchesStatus && matchesGender && matchesCity && matchesDateRange;
    });
    
    this.totalItems = this.filteredCustomers.length;
    this.calculatePagination();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadCustomers(); // Reload from backend with search
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadCustomers(); // Reload from backend with filters
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedGender = 'all';
    this.selectedCity = 'all';
    this.dateRange = { from: '', to: '' };
    this.currentPage = 1;
    this.loadCustomers();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPaginatedCustomers(): Customer[] {
    // Backend handles pagination, so this just returns the current page data
    return this.filteredCustomers;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCustomers(); // Reload from backend with new page
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAddModal() {
    this.newCustomer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      city: '',
      state: '',
      pincode: '',
      idProofType: 'aadhar',
      idProofNumber: '',
      status: 'active',
      preferences: {
        busType: [],
        seatPreference: 'any',
        mealPreference: []
      }
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveCustomer() {
    this.isLoading = true;
    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Customer created successfully';
          this.loadCustomers();
          this.loadCustomerStats();
          this.loadCities();
          this.closeAddModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating customer:', error);
        this.errorMessage = error.error?.message || 'Failed to create customer';
        this.isLoading = false;
      }
    });
  }

  openViewModal(customer: Customer) {
    this.customerService.getCustomerById(customer._id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedCustomer = {
            ...response.data,
            name: `${response.data.firstName} ${response.data.lastName}`
          };
          this.showViewModal = true;
        }
      },
      error: (error) => {
        console.error('Error loading customer details:', error);
        this.errorMessage = 'Failed to load customer details';
      }
    });
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedCustomer = null;
  }

  openEditModal(customer: Customer) {
    this.customerService.getCustomerById(customer._id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedCustomer = response.data;
          this.showEditModal = true;
        }
      },
      error: (error) => {
        console.error('Error loading customer details:', error);
        this.errorMessage = 'Failed to load customer details';
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedCustomer = null;
  }

  updateCustomer() {
    if (this.selectedCustomer && this.selectedCustomer._id) {
      this.isLoading = true;
      this.customerService.updateCustomer(this.selectedCustomer._id, this.selectedCustomer).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Customer updated successfully';
            this.loadCustomers();
            this.loadCustomerStats();
            this.closeEditModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.errorMessage = error.error?.message || 'Failed to update customer';
          this.isLoading = false;
        }
      });
    }
  }

  openDeleteModal(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedCustomer = null;
  }

  confirmDelete() {
    if (this.selectedCustomer && this.selectedCustomer._id) {
      this.isLoading = true;
      this.customerService.deleteCustomer(this.selectedCustomer._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Customer deleted successfully';
            this.loadCustomers();
            this.loadCustomerStats();
            this.loadCities();
            this.closeDeleteModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.errorMessage = error.error?.message || 'Failed to delete customer';
          this.isLoading = false;
        }
      });
    }
  }

  openBookingHistory(customer: Customer) {
    this.selectedCustomer = customer;
    if (customer._id) {
      this.customerService.getCustomerBookings(customer._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.customerBookings = response.data;
            this.showBookingHistoryModal = true;
          }
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.errorMessage = 'Failed to load booking history';
        }
      });
    }
  }

  closeBookingHistory() {
    this.showBookingHistoryModal = false;
    this.selectedCustomer = null;
    this.customerBookings = [];
  }

  openExportModal() {
    this.showExportModal = true;
  }

  closeExportModal() {
    this.showExportModal = false;
  }

  exportData(format: 'pdf' | 'excel' | 'csv') {
    const filters = {
      status: this.selectedStatus,
      gender: this.selectedGender,
      city: this.selectedCity,
      search: this.searchTerm
    };

    this.customerService.exportCustomers(format, filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `customers.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.closeExportModal();
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        this.errorMessage = 'Failed to export data';
      }
    });
  }

  sendEmail(customer: Customer) {
    if (customer._id) {
      // You can open a modal to compose email here
      const emailData = {
        subject: 'Special Offer from TravelEase',
        message: 'Check out our latest offers!'
      };
      this.customerService.sendEmail(customer._id, emailData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Email sent successfully';
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.errorMessage = 'Failed to send email';
        }
      });
    }
  }

  sendSMS(customer: Customer) {
    if (customer._id) {
      const smsData = {
        message: 'Thank you for choosing TravelEase!'
      };
      this.customerService.sendSMS(customer._id, smsData).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'SMS sent successfully';
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          console.error('Error sending SMS:', error);
          this.errorMessage = 'Failed to send SMS';
        }
      });
    }
  }

  toggleStatus(customer: Customer) {
    if (customer._id) {
      this.customerService.toggleCustomerStatus(customer._id).subscribe({
        next: (response) => {
          if (response.success) {
            customer.status = customer.status === 'active' ? 'inactive' : 'active';
            this.successMessage = `Customer ${customer.status === 'active' ? 'activated' : 'deactivated'}`;
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          console.error('Error toggling status:', error);
          this.errorMessage = 'Failed to toggle status';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'blocked': return 'status-blocked';
      default: return '';
    }
  }

  getGenderIcon(gender: string): string {
    switch(gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  }

  getIdProofLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'aadhar': 'Aadhar Card',
      'pan': 'PAN Card',
      'passport': 'Passport',
      'driving': 'Driving License',
      'voter': 'Voter ID'
    };
    return labels[type] || type;
  }

  getTotalActiveCustomers(): number {
    return this.customerStats.activeCustomers;
  }

  getTotalInactiveCustomers(): number {
    return this.customerStats.inactiveCustomers;
  }

  getTotalBlockedCustomers(): number {
    return this.customerStats.blockedCustomers;
  }

  getTotalRevenue(): number {
    return this.customerStats.totalRevenue;
  }

  getAverageSpending(): number {
    return this.customerStats.averageSpending;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}