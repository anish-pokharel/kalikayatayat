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
  
  currentFareInfo: FareInfo | null = null;
  
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
    'Blanket', 'Snacks', 'Movie', 'GPS'
  ];

  statusOptions: string[] = ['active', 'inactive', 'maintenance'];

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  constructor(private busService: BusService) {}

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
    const sub = this.busService.getRoutes().subscribe({
      next: (response: ApiResponse<Route[]>) => {
        if (response.success && response.data) {
          this.routes = response.data.filter(route => route.status === 'active');
        }
      },
      error: (error: any) => {
        console.error('Error loading routes:', error);
        this.errorMessage = 'Failed to load routes';
      }
    });
    this.subscriptions.add(sub);
  }

  loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.busService.getBuses(
      this.selectedRoute,
      this.selectedBusType,
      this.selectedStatus,
      this.searchTerm
    ).subscribe({
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
            this.successMessage = `⚠️ No fare declaration found. Calculated fare: ₹${response.data.fare}`;
          }
          
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isCalculatingFare = false;
      },
      error: (error: any) => {
        console.error('Error calculating fare:', error);
        this.errorMessage = 'Failed to calculate fare';
        this.isCalculatingFare = false;
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
      status: 'active'
    };
    this.currentFareInfo = null;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.currentFareInfo = null;
  }

  saveBus(): void {
    if (!this.validateBus(this.newBus)) return;

    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.busService.createBus(this.newBus).subscribe({
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
        this.errorMessage = error.error?.message || 'Failed to create bus';
        this.isLoading = false;
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
            this.selectedBus = response.data;
            this.showEditModal = true;
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching bus:', error);
          this.errorMessage = 'Failed to load bus details';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBus = null;
  }

  updateBus(): void {
    if (!this.selectedBus || !this.selectedBus._id) return;
    if (!this.validateBus(this.selectedBus)) return;

    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.busService.updateBus(this.selectedBus._id, this.selectedBus).subscribe({
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
        this.errorMessage = error.error?.message || 'Failed to update bus';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  openDetailsModal(bus: Bus): void {
    this.selectedBus = bus;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBus = null;
  }

  openDeleteModal(bus: Bus): void {
    this.selectedBus = bus;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedBus = null;
  }

  confirmDelete(): void {
    if (this.selectedBus && this.selectedBus._id) {
      this.isLoading = true;
      this.errorMessage = '';

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
          this.errorMessage = error.error?.message || 'Failed to delete bus';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  // toggleStatus(bus: Bus): void {
  //   if (bus._id) {
  //     this.isLoading = true;
  //     const sub = this.busService.toggleBusStatus(bus._id).subscribe({
  //       next: (response: any) => {
  //         if (response.success) {
  //           bus.status = bus.status === 'active' ? 'inactive' : 'active';
  //           this.successMessage = `Bus ${bus.status === 'active' ? 'activated' : 'deactivated'}!`;
  //           setTimeout(() => this.successMessage = '', 3000);
  //         }
  //         this.isLoading = false;
  //       },
  //       error: (error: any) => {
  //         console.error('Error toggling status:', error);
  //         this.errorMessage = error.error?.message || 'Failed to toggle status';
  //         this.isLoading = false;
  //       }
  //     });
  //     this.subscriptions.add(sub);
  //   }
  // }

 getStatusClass(status: string | undefined): string {
  if (!status) return 'status-unknown';
  
  const statusMap: {[key: string]: string} = {
    'active': 'status-active',
    'inactive': 'status-inactive',
    'maintenance': 'status-maintenance',
    'cancelled': 'status-cancelled',
    'scheduled': 'status-scheduled'
  };
  
  return statusMap[status.toLowerCase()] || 'status-unknown';
}

// Also update toggleStatus to handle undefined
toggleStatus(bus: any): void {
  if (!bus) return;
  // Your existing toggle logic
  console.log('Toggling status for bus:', bus);
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

  private validateBus(bus: any): boolean {
    if (!bus.busNumber?.trim()) {
      this.errorMessage = 'Bus number is required';
      return false;
    }
    if (!bus.busName?.trim()) {
      this.errorMessage = 'Bus name is required';
      return false;
    }
    if (!bus.busType) {
      this.errorMessage = 'Bus type is required';
      return false;
    }
    if (!bus.routeId) {
      this.errorMessage = 'Please select a route';
      return false;
    }
    if (!bus.driverName?.trim()) {
      this.errorMessage = 'Driver name is required';
      return false;
    }
    if (!bus.driverPhone?.trim()) {
      this.errorMessage = 'Driver phone is required';
      return false;
    }
    if (!bus.driverLicense?.trim()) {
      this.errorMessage = 'Driver license is required';
      return false;
    }
    if (!bus.totalSeats || bus.totalSeats < 10 || bus.totalSeats > 60) {
      this.errorMessage = 'Total seats must be between 10 and 60';
      return false;
    }
    if (!bus.fare || bus.fare <= 0) {
      this.errorMessage = 'Fare must be greater than 0';
      return false;
    }
    return true;
  }
}