

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

interface Bus {
  _id: string;
  busNumber: string;
  busName: string;
  busType: string;
  totalSeats: number;
  seatLayout: string;
  amenities: string[];
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  status: string;
  instituteName?: string;
  instituteId?: string;
  ownerId?: string;
  registeredBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;        // ← Your backend returns "count", not "pagination"
  errors?: any[];
}

@Component({
  selector: 'app-add-bus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.css']
})
export class AddBusComponent implements OnInit {
  Math = Math;
  
  // Bus form properties
  busForm!: FormGroup;
  submitting = false;
  currentUser: any = {};
  
  // Bus list properties
  buses: Bus[] = [];
  filteredBuses: Bus[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Search and filter
  searchTerm = '';
  selectedStatus = 'all';
  selectedBusType = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Modal
  showDeleteModal = false;
  selectedBus: Bus | null = null;
  
  // Statistics
  totalBuses = 0;
  activeBuses = 0;
  maintenanceBuses = 0;
  totalSeatsCount = 0;
  
  statusColors: { [key: string]: string } = {
    active: 'status-active',
    inactive: 'status-inactive',
    maintenance: 'status-maintenance'
  };
  
  busTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Sleeper', label: 'Sleeper' },
    { value: 'AC', label: 'AC' },
    { value: 'Non-AC', label: 'Non-AC' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Mini', label: 'Mini' },
    { value: 'Deluxe', label: 'Deluxe' }
  ];

  busTypeOptionsForForm = [
    { value: '', label: 'Select Bus Type' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Sleeper', label: 'Sleeper' },
    { value: 'AC', label: 'AC' },
    { value: 'Non-AC', label: 'Non-AC' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Mini', label: 'Mini' },
    { value: 'Deluxe', label: 'Deluxe' }
  ];

  seatLayoutOptions = [
    { value: '2x2', label: '2x2 (Standard - 4 seats per row)' },
    { value: '2x1', label: '2x1 (Luxury - 3 seats per row)' },
    { value: '3x2', label: '3x2 (Standard - 5 seats per row)' },
    { value: '2x3', label: '2x3 (Standard - 5 seats per row)' },
    { value: '1x1', label: '1x1 (Premium - 2 seats per row)' }
  ];

  amenitiesList = [
    { value: 'AC', label: 'AC', icon: '❄️', selected: false },
    { value: 'WiFi', label: 'WiFi', icon: '📶', selected: false },
    { value: 'Charging Ports', label: 'Charging Ports', icon: '🔌', selected: false },
    { value: 'TV', label: 'TV', icon: '📺', selected: false },
    { value: 'Reclining Seats', label: 'Reclining Seats', icon: '💺', selected: false },
    { value: 'Bathroom', label: 'Bathroom', icon: '🚻', selected: false },
    { value: 'Sleeper', label: 'Sleeper', icon: '🛏️', selected: false },
    { value: 'Snacks', label: 'Snacks', icon: '🍪', selected: false },
    { value: 'Water', label: 'Water', icon: '💧', selected: false },
    { value: 'Blanket', label: 'Blanket', icon: '🧣', selected: false }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchBuses();
  }

  // Helper method to build API URL
  private getApiUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return `${environment.apiUrl}${cleanEndpoint}`;
  }

  // ==================== FORM INITIALIZATION ====================
  initForm(): void {
    this.busForm = this.fb.group({
      busNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\s\-]+$/i)]],
      busName: ['', [Validators.required, Validators.minLength(2)]],
      busType: ['', Validators.required],
      totalSeats: [40, [Validators.required, Validators.min(10), Validators.max(60)]],
      seatLayout: ['2x2', Validators.required],
      driverName: ['', Validators.required],
      driverPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      driverLicense: ['', Validators.required],
      status: ['active'],
      instituteName: [''],
      instituteId: ['']
    });
  }

  // ==================== BUS MANAGEMENT ====================
 fetchBuses(): void {
  this.loading = true;
  this.errorMessage = '';
  
  let params = new HttpParams();
  
  if (this.selectedStatus && this.selectedStatus !== 'all') {
    params = params.set('status', this.selectedStatus);
  }
  if (this.selectedBusType && this.selectedBusType !== 'all') {
    params = params.set('busType', this.selectedBusType);
  }
  if (this.searchTerm) {
    params = params.set('search', this.searchTerm);
  }

  console.log('📡 Fetching buses with params:', params.toString());

  // ✅ Fixed: Added closing parenthesis before .subscribe()
  this.http.get<ApiResponse<Bus[]>>(this.getApiUrl('/getNewBuses'), { params })
    .subscribe({
      next: (res) => {
        console.log('✅ Fetched buses response:', res);
        
        if (res.success && res.data) {
          this.buses = res.data;
          this.totalItems = res.count || this.buses.length;
          
          this.updateStatistics();
          this.applyFilters();
          
          console.log(`✅ Loaded ${this.buses.length} buses`);
        } else {
          this.errorMessage = res.message || 'Failed to fetch buses';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching buses:', err);
        this.errorMessage = err.error?.message || 'Server error. Please try again.';
        this.loading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
}

  updateStatistics(): void {
    this.totalBuses = this.buses.length;
    this.activeBuses = this.buses.filter(b => b.status === 'active').length;
    this.maintenanceBuses = this.buses.filter(b => b.status === 'maintenance').length;
    this.totalSeatsCount = this.buses.reduce((sum, bus) => sum + (bus.totalSeats || 0), 0);
  }

  // ==================== FILTERS & SEARCH ====================
  applyFilters(): void {
    let filtered = [...this.buses];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(bus => 
        bus.busNumber?.toLowerCase().includes(term) ||
        bus.busName?.toLowerCase().includes(term) ||
        bus.driverName?.toLowerCase().includes(term) ||
        bus.busType?.toLowerCase().includes(term)
      );
    }
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(bus => bus.status === this.selectedStatus);
    }
    
    if (this.selectedBusType !== 'all') {
      filtered = filtered.filter(bus => bus.busType === this.selectedBusType);
    }
    
    this.filteredBuses = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    // For real-time search, fetch from server
    this.fetchBuses();
  }

  onStatusChange(): void {
    this.fetchBuses();
  }

  onBusTypeChange(): void {
    this.fetchBuses();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedBusType = 'all';
    this.fetchBuses();
  }

  // ==================== PAGINATION ====================
  getPaginatedBuses(): Bus[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBuses.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  }

  // ==================== AMENITIES ====================
  toggleAmenity(index: number): void {
    this.amenitiesList[index].selected = !this.amenitiesList[index].selected;
  }

  getSelectedAmenities(): string[] {
    return this.amenitiesList.filter(a => a.selected).map(a => a.value);
  }

  // ==================== FORM SUBMISSION ====================
  onSubmit(): void {
    if (this.busForm.invalid) {
      this.busForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.busForm.value;
    const selectedAmenities = this.getSelectedAmenities();
    
    const payload = {
      busNumber: formValue.busNumber.toUpperCase().trim(),
      busName: formValue.busName.trim(),
      busType: formValue.busType,
      totalSeats: formValue.totalSeats,
      seatLayout: formValue.seatLayout,
      amenities: selectedAmenities,
      driverName: formValue.driverName.trim(),
      driverPhone: formValue.driverPhone.trim(),
      driverLicense: formValue.driverLicense.trim(),
      status: formValue.status || 'active',
      instituteName: formValue.instituteName || '',
      instituteId: formValue.instituteId || ''
    };

    console.log('📤 Sending payload:', payload);

    this.http.post<ApiResponse<Bus>>(this.getApiUrl('/addNewBuses'), payload).subscribe({
      next: (res) => {
        console.log('✅ Response:', res);
        
        if (res.success) {
          this.successMessage = res.message || 'Bus added successfully!';
          this.resetForm();
          this.fetchBuses(); // Refresh the list
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = res.message || 'Failed to add bus';
        }
        this.submitting = false;
      },
      error: (err) => {
        console.error('❌ Add bus error:', err);
        
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check if the server is running.';
        } else if (err.status === 404) {
          this.errorMessage = 'API endpoint not found. Please check the URL.';
        } else {
          this.errorMessage = 'Server error. Please try again.';
        }
        
        this.submitting = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  resetForm(): void {
    this.busForm.reset({
      totalSeats: 40,
      seatLayout: '2x2',
      status: 'active'
    });
    this.amenitiesList.forEach(amenity => amenity.selected = false);
  }

  cancel(): void {
    this.resetForm();
    this.router.navigate(['/dashboard']);
  }

  addNewBus(): void {
    document.querySelector('.form-wrapper')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  // ==================== BUS ACTIONS ====================
  editBus(bus: Bus): void {
    this.router.navigate(['/admin/buses/edit', bus._id]);
  }

  viewBusDetails(bus: Bus): void {
    this.router.navigate(['/admin/buses/view', bus._id]);
  }

  confirmDelete(bus: Bus): void {
    this.selectedBus = bus;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedBus = null;
  }

  deleteBus(): void {
    if (!this.selectedBus?._id) {
      this.errorMessage = 'No bus selected for deletion';
      return;
    }
    
    this.loading = true;
    const busId = this.selectedBus._id;

    this.http.delete<ApiResponse>(this.getApiUrl(`/addNewBuses/${busId}`)).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = res.message || 'Bus deleted successfully!';
          this.showDeleteModal = false;
          this.selectedBus = null;
          this.fetchBuses();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = res.message || 'Failed to delete bus';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting bus:', err);
        this.errorMessage = err.error?.message || 'Server error. Please try again.';
        this.showDeleteModal = false;
        this.selectedBus = null;
        this.loading = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  toggleBusStatus(bus: Bus): void {
    if (!bus._id) {
      this.errorMessage = 'Invalid bus ID';
      return;
    }
    
    this.loading = true;

    this.http.patch<ApiResponse<{ status: string }>>(
      this.getApiUrl(`/addNewBuses/${bus._id}/status`), 
      {}
    ).subscribe({
      next: (res) => {
        if (res.success) {
          const newStatus = res.data?.status || 'active';
          this.successMessage = `Bus status updated to ${newStatus}!`;
          this.fetchBuses();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = res.message || 'Failed to update bus status';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error toggling bus status:', err);
        this.errorMessage = err.error?.message || 'Server error. Please try again.';
        this.loading = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  // ==================== UTILITY METHODS ====================
  getStatusClass(status: string): string {
    return this.statusColors[status] || 'status-inactive';
  }
}
