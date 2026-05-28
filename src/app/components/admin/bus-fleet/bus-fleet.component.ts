import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BusService, Bus, Route, FareInfo, ApiResponse } from '../../../services/bus.service';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-bus-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bus-fleet.component.html',
  styleUrls: ['./bus-fleet.component.css']
})
export class BusFleetComponent implements OnInit, OnDestroy {
  buses: Bus[] = [];
  filteredBuses: Bus[] = [];
  routes: Route[] = [];
  
  searchTerm: string = '';
  selectedRoute: string = 'all';
  selectedBusType: string = 'all';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showDetailsModal: boolean = false;
  
  selectedBus: any = null;
  
  isLoading: boolean = false;
  isCalculatingFare: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  modalErrorMessage: string = '';
  
  currentFareInfo: FareInfo | null = null;
  
  validationErrors: any = {
    busNumber: '',
    busName: '',
    busType: '',
    routeId: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    totalSeats: '',
    fare: '',
    departureTime: '',
    departureDate: ''
  };
  
  newBus: any = {
    busNumber: '',
    busName: '',
    busType: 'AC Sleeper',
    routeId: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    totalSeats: 40,
    seatLayout: '2x2',
    amenities: [],
    fare: 0,
    departureTime: '08:00',
    departureDate: new Date().toISOString().split('T')[0],
    status: 'active'
  };

  busTypes: string[] = [
    'AC Sleeper',
    'AC Seater',
    'Non-AC Sleeper',
    'Non-AC Seater',
    'Luxury',
    'Volvo'
  ];

  seatLayouts: string[] = ['2x2', '2x1', '1x2', '2x3'];

  amenityOptions: string[] = [
    'AC', 'WiFi', 'Charging Point', 'Water Bottle', 
    'Blanket', 'Snacks', 'Movie', 'GPS', 'Reading Light'
  ];

  statusOptions: string[] = ['active', 'inactive', 'maintenance'];

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription = new Subscription();
  today: any;

  constructor(private busService: BusService) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadRoutes();
    this.loadBuses();
    
    const searchSub = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadBuses();
    });
    this.subscriptions.add(searchSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadRoutes(): void {
    const sub = this.busService.getActiveRoutes().subscribe({
      next: (response: ApiResponse<Route[]>) => {
        if (response.success && response.data) {
          this.routes = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading routes:', error);
        this.errorMessage = 'Failed to load routes';
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const filters: any = {};
    
    if (this.selectedRoute !== 'all') filters.routeId = this.selectedRoute;
    if (this.selectedBusType !== 'all') filters.busType = this.selectedBusType;
    if (this.selectedStatus !== 'all') filters.status = this.selectedStatus;
    if (this.searchTerm) filters.search = this.searchTerm;
    
    const sub = this.busService.getBuses(filters).subscribe({
      next: (response: ApiResponse<Bus[]>) => {
        if (response.success && response.data) {
          this.buses = response.data;
          this.filteredBuses = [...this.buses];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading buses:', error);
        this.errorMessage = 'Failed to load buses';
        this.isLoading = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.loadBuses();
  }

  onRouteOrTypeChange(): void {
    if (this.newBus.routeId && this.newBus.busType) {
      this.calculateFareFromDeclaration(this.newBus.routeId, this.newBus.busType);
    }
  }

  calculateFareFromDeclaration(routeId: string, busType: string): void {
    this.isCalculatingFare = true;
    this.currentFareInfo = null;
    
    const sub = this.busService.getBusFare(routeId, busType).subscribe({
      next: (response: ApiResponse<FareInfo>) => {
        if (response.success && response.data) {
          this.currentFareInfo = response.data;
          this.newBus.fare = response.data.fare;
          
          if (response.data.source === 'fare_declaration') {
            this.successMessage = `✅ Fare loaded from Fare Declaration: ₹${response.data.fare}`;
          } else {
            this.modalErrorMessage = `⚠️ No fare declaration found! Calculated fare: ₹${response.data.fare}. Please create fare in Fare Declaration.`;
          }
          
          setTimeout(() => {
            this.successMessage = '';
            this.modalErrorMessage = '';
          }, 5000);
        }
        this.isCalculatingFare = false;
      },
      error: (error: any) => {
        console.error('Error calculating fare:', error);
        this.modalErrorMessage = 'Failed to calculate fare';
        this.isCalculatingFare = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  toggleAmenity(amenity: string): void {
    const index = this.newBus.amenities.indexOf(amenity);
    if (index > -1) {
      this.newBus.amenities.splice(index, 1);
    } else {
      this.newBus.amenities.push(amenity);
    }
  }

  openAddModal(): void {
    this.newBus = {
      busNumber: '',
      busName: '',
      busType: 'AC Sleeper',
      routeId: '',
      driverName: '',
      driverPhone: '',
      driverLicense: '',
      totalSeats: 40,
      seatLayout: '2x2',
      amenities: [],
      fare: 0,
      departureTime: '08:00',
      departureDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    this.currentFareInfo = null;
    this.modalErrorMessage = '';
    this.clearValidationErrors();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.currentFareInfo = null;
    this.modalErrorMessage = '';
    this.clearValidationErrors();
  }

  clearValidationErrors(): void {
    this.validationErrors = {
      busNumber: '',
      busName: '',
      busType: '',
      routeId: '',
      driverName: '',
      driverPhone: '',
      driverLicense: '',
      totalSeats: '',
      fare: '',
      departureTime: '',
      departureDate: ''
    };
  }

  saveBus(): void {
    if (!this.validateBusWithErrors()) return;

    this.isLoading = true;
    this.modalErrorMessage = '';

    const busData = {
      busNumber: this.newBus.busNumber,
      busName: this.newBus.busName,
      busType: this.newBus.busType,
      routeId: this.newBus.routeId,
      driverName: this.newBus.driverName,
      driverPhone: this.newBus.driverPhone,
      driverLicense: this.newBus.driverLicense,
      totalSeats: this.newBus.totalSeats,
      seatLayout: this.newBus.seatLayout,
      amenities: this.newBus.amenities,
      fare: this.newBus.fare,
      departureTime: this.newBus.departureTime,
      departureDate: this.newBus.departureDate,
      status: this.newBus.status
    };

    const sub = this.busService.createBus(busData).subscribe({
      next: (response: ApiResponse<Bus>) => {
        if (response.success) {
          this.successMessage = 'Bus created successfully!';
          this.loadBuses();
          this.closeAddModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error creating bus:', error);
        this.modalErrorMessage = error.error?.message || 'Failed to create bus';
        this.isLoading = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  openEditModal(bus: Bus): void {
    if (bus._id) {
      this.isLoading = true;
      const sub = this.busService.getBusById(bus._id).subscribe({
        next: (response: ApiResponse<Bus>) => {
          if (response.success && response.data) {
            this.selectedBus = { ...response.data };
            // Format date for input
            if (this.selectedBus.departureDate) {
              this.selectedBus.departureDate = new Date(this.selectedBus.departureDate).toISOString().split('T')[0];
            }
            this.modalErrorMessage = '';
            this.showEditModal = true;
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching bus:', error);
          this.errorMessage = 'Failed to load bus details';
          this.isLoading = false;
          this.clearMessagesAfterTimeout();
        }
      });
      this.subscriptions.add(sub);
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBus = null;
    this.modalErrorMessage = '';
  }

  updateBus(): void {
    if (!this.selectedBus || !this.selectedBus._id) {
      this.modalErrorMessage = 'Bus information is missing';
      return;
    }
    
    if (!this.validateEditBus()) return;

    this.isLoading = true;
    this.modalErrorMessage = '';

    const updateData = {
      busNumber: this.selectedBus.busNumber,
      busName: this.selectedBus.busName,
      driverName: this.selectedBus.driverName,
      driverPhone: this.selectedBus.driverPhone,
      driverLicense: this.selectedBus.driverLicense,
      totalSeats: this.selectedBus.totalSeats,
      seatLayout: this.selectedBus.seatLayout,
      departureTime: this.selectedBus.departureTime,
      departureDate: this.selectedBus.departureDate,
      status: this.selectedBus.status
    };

    const sub = this.busService.updateBus(this.selectedBus._id, updateData).subscribe({
      next: (response: ApiResponse<Bus>) => {
        if (response.success) {
          this.successMessage = 'Bus updated successfully!';
          this.loadBuses();
          this.closeEditModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error updating bus:', error);
        this.modalErrorMessage = error.error?.message || 'Failed to update bus';
        this.isLoading = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  openDetailsModal(bus: Bus): void {
    this.selectedBus = { ...bus };
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBus = null;
  }

  openDeleteModal(bus: Bus): void {
    this.selectedBus = { ...bus };
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedBus = null;
    this.modalErrorMessage = '';
  }

  confirmDelete(): void {
    if (!this.selectedBus || !this.selectedBus._id) {
      this.modalErrorMessage = 'Bus information is missing';
      return;
    }

    this.isLoading = true;
    this.modalErrorMessage = '';

    const sub = this.busService.deleteBus(this.selectedBus._id).subscribe({
      next: (response: ApiResponse<null>) => {
        if (response.success) {
          this.successMessage = 'Bus deleted successfully!';
          this.loadBuses();
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error deleting bus:', error);
        this.modalErrorMessage = error.error?.message || 'Failed to delete bus. Please check if bus has any bookings.';
        this.isLoading = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  toggleStatus(bus: Bus): void {
    if (!bus._id) return;
    
    this.isLoading = true;
    const sub = this.busService.toggleBusStatus(bus._id).subscribe({
      next: (response: any) => {
        if (response.success) {
          bus.status = bus.status === 'active' ? 'inactive' : 'active';
          this.successMessage = `Bus ${bus.status === 'active' ? 'activated' : 'deactivated'} successfully!`;
          this.loadBuses(); // Reload to get fresh data
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error toggling status:', error);
        this.errorMessage = error.error?.message || 'Failed to toggle status';
        this.isLoading = false;
        this.clearMessagesAfterTimeout();
      }
    });
    this.subscriptions.add(sub);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  }

  getRouteName(routeId: string): string {
    const route = this.routes.find(r => r._id === routeId);
    return route ? `${route.routeName} (${route.origin} → ${route.destination})` : 'Unknown';
  }

  getActiveBusesCount(): number {
    return this.filteredBuses.filter(b => b.status === 'active').length;
  }

  getInactiveBusesCount(): number {
    return this.filteredBuses.filter(b => b.status === 'inactive').length;
  }

  getMaintenanceBusesCount(): number {
    return this.filteredBuses.filter(b => b.status === 'maintenance').length;
  }

  private validateBusWithErrors(bus: any = this.newBus): boolean {
    let isValid = true;
    this.clearValidationErrors();

    if (!bus.busNumber?.trim()) {
      this.validationErrors.busNumber = 'Bus number is required';
      isValid = false;
    } else if (bus.busNumber.length < 3) {
      this.validationErrors.busNumber = 'Bus number must be at least 3 characters';
      isValid = false;
    }
    
    if (!bus.busName?.trim()) {
      this.validationErrors.busName = 'Bus name is required';
      isValid = false;
    }
    
    if (!bus.busType) {
      this.validationErrors.busType = 'Bus type is required';
      isValid = false;
    }
    
    if (!bus.routeId) {
      this.validationErrors.routeId = 'Please select a route';
      isValid = false;
    }
    
    if (!bus.driverName?.trim()) {
      this.validationErrors.driverName = 'Driver name is required';
      isValid = false;
    }
    
    if (!bus.driverPhone?.trim()) {
      this.validationErrors.driverPhone = 'Driver phone is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(bus.driverPhone)) {
      this.validationErrors.driverPhone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    
    if (!bus.driverLicense?.trim()) {
      this.validationErrors.driverLicense = 'Driver license is required';
      isValid = false;
    }
    
    if (!bus.totalSeats || bus.totalSeats < 10 || bus.totalSeats > 60) {
      this.validationErrors.totalSeats = 'Total seats must be between 10 and 60';
      isValid = false;
    }
    
    if (!bus.fare || bus.fare <= 0) {
      this.validationErrors.fare = 'Fare must be greater than 0';
      isValid = false;
    }
    
    if (!bus.departureTime) {
      this.validationErrors.departureTime = 'Departure time is required';
      isValid = false;
    }
    
    if (!bus.departureDate) {
      this.validationErrors.departureDate = 'Departure date is required';
      isValid = false;
    }

    if (!isValid) {
      setTimeout(() => {
        const firstError = document.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return isValid;
  }

  private validateEditBus(): boolean {
    if (!this.selectedBus.busNumber?.trim()) {
      this.modalErrorMessage = 'Bus number is required';
      return false;
    }
    if (!this.selectedBus.busName?.trim()) {
      this.modalErrorMessage = 'Bus name is required';
      return false;
    }
    if (!this.selectedBus.driverName?.trim()) {
      this.modalErrorMessage = 'Driver name is required';
      return false;
    }
    if (!this.selectedBus.driverPhone?.trim()) {
      this.modalErrorMessage = 'Driver phone is required';
      return false;
    }
    if (!this.selectedBus.driverLicense?.trim()) {
      this.modalErrorMessage = 'Driver license is required';
      return false;
    }
    if (!this.selectedBus.totalSeats || this.selectedBus.totalSeats < 10 || this.selectedBus.totalSeats > 60) {
      this.modalErrorMessage = 'Total seats must be between 10 and 60';
      return false;
    }
    if (!this.selectedBus.departureTime) {
      this.modalErrorMessage = 'Departure time is required';
      return false;
    }
    if (!this.selectedBus.departureDate) {
      this.modalErrorMessage = 'Departure date is required';
      return false;
    }
    return true;
  }

  private clearMessagesAfterTimeout(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.modalErrorMessage = '';
      this.successMessage = '';
    }, 5000);
  }
}