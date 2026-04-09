import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BusService, Route, Stop, Bus, ApiResponse } from '../../../services/bus.service';

@Component({
  selector: 'app-routemanagement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './routemanagement.component.html',
  styleUrls: ['./routemanagement.component.css']
})
export class RoutemanagementComponent implements OnInit {
  routes: Route[] = [];
  filteredRoutes: Route[] = [];
  
  // Buses for the selected route
  routeBuses: Bus[] = [];
  selectedRouteForBuses: Route | null = null;
  
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  // Modal flags
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showStopsModal: boolean = false;
  showAddStopModal: boolean = false;
  showBusesModal: boolean = false;
  
  // Selected route for operations
  selectedRoute: Route | null = null;
  routeStops: Stop[] = [];
  
  // Current stop being edited
  currentStop: Stop = {
    name: '',
    type: 'boarding',
    address: '',
    city: '',
    arrivalTime: '',
    departureTime: '',
    duration: 30,
    fare: 0,
    contact: '',
    landmark: '',
    amenities: [],
    isMealStop: false,
    mealType: null,
    description: '',
    isActive: true,
    order: 0
  };
  
  editingStopIndex: number = -1;
  
  // UI states
  isLoading: boolean = false;
  isLoadingBuses: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // New route object
  newRoute: Partial<Route> = {
    routeName: '',
    routeCode: '',
    origin: '',
    destination: '',
    distance: 0,
    duration: '',
    stops: [],
    status: 'active'
  };

  // Dropdown options
  stopTypes: string[] = ['boarding', 'meal', 'rest', 'pickup', 'dropping'];
  mealTypes: string[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  amenityOptions: string[] = ['Restroom', 'Food Court', 'Parking', 'ATM', 'Medical', 'Waiting Room', 'Restaurant'];
  
  // Bus types for filtering
  busTypes: string[] = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Luxury', 'Volvo'];

  constructor(
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  // ==================== ROUTE MANAGEMENT ====================

  loadRoutes(): void {
    this.isLoading = true;
    const filters: any = {};
    
    if (this.selectedStatus !== 'all') filters.status = this.selectedStatus;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.busService.getRoutes(filters).subscribe({
      next: (response: ApiResponse<Route[]>) => {
        if (response.success && response.data) {
          this.routes = response.data;
          this.filteredRoutes = response.data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading routes:', error);
        this.errorMessage = 'Failed to load routes';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.loadRoutes();
  }

  onFilterChange(): void {
    this.loadRoutes();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.loadRoutes();
  }

  openAddModal(): void {
    this.newRoute = {
      routeName: '',
      routeCode: '',
      origin: '',
      destination: '',
      distance: 0,
      duration: '',
      stops: [],
      status: 'active'
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveRoute(): void {
    if (!this.validateRoute()) return;

    this.isLoading = true;
    this.busService.createRoute(this.newRoute).subscribe({
      next: (response: ApiResponse<Route>) => {
        if (response.success) {
          this.successMessage = 'Route created successfully';
          this.loadRoutes();
          this.closeAddModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error creating route:', error);
        this.errorMessage = error.error?.message || 'Failed to create route';
        this.isLoading = false;
      }
    });
  }

  openEditModal(route: Route): void {
    if (route._id) {
      this.isLoading = true;
      this.busService.getRouteById(route._id).subscribe({
        next: (response: ApiResponse<Route>) => {
          if (response.success && response.data) {
            this.selectedRoute = response.data;
            this.showEditModal = true;
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching route:', error);
          this.errorMessage = 'Failed to load route details';
          this.isLoading = false;
        }
      });
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedRoute = null;
  }

  updateRoute(): void {
    if (!this.selectedRoute || !this.selectedRoute._id) return;
    if (!this.validateRoute(this.selectedRoute)) return;

    this.isLoading = true;
    this.busService.updateRoute(this.selectedRoute._id, this.selectedRoute).subscribe({
      next: (response: ApiResponse<Route>) => {
        if (response.success) {
          this.successMessage = 'Route updated successfully';
          this.loadRoutes();
          this.closeEditModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error updating route:', error);
        this.errorMessage = error.error?.message || 'Failed to update route';
        this.isLoading = false;
      }
    });
  }

  openDeleteModal(route: Route): void {
    this.selectedRoute = route;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedRoute = null;
  }

  confirmDelete(): void {
    if (!this.selectedRoute || !this.selectedRoute._id) return;

    this.isLoading = true;
    this.busService.deleteRoute(this.selectedRoute._id).subscribe({
      next: (response: ApiResponse<null>) => {
        if (response.success) {
          this.successMessage = 'Route deleted successfully';
          this.loadRoutes();
          this.closeDeleteModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error deleting route:', error);
        this.errorMessage = error.error?.message || 'Failed to delete route';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  private validateRoute(route?: Partial<Route>): boolean {
    const r = route || this.newRoute;
    
    if (!r.routeName?.trim()) {
      this.errorMessage = 'Route name is required';
      return false;
    }
    if (!r.routeCode?.trim()) {
      this.errorMessage = 'Route code is required';
      return false;
    }
    if (!r.origin?.trim()) {
      this.errorMessage = 'Origin is required';
      return false;
    }
    if (!r.destination?.trim()) {
      this.errorMessage = 'Destination is required';
      return false;
    }
    if (!r.distance || r.distance <= 0) {
      this.errorMessage = 'Distance must be greater than 0';
      return false;
    }
    if (!r.duration?.trim()) {
      this.errorMessage = 'Duration is required';
      return false;
    }
    return true;
  }

  // ==================== BUS MANAGEMENT FOR ROUTE ====================

  viewRouteBuses(route: Route): void {
    this.selectedRouteForBuses = route;
    this.isLoadingBuses = true;
    this.showBusesModal = true;
    
    // Fetch buses for this route
    const filters = { routeId: route._id };
    this.busService.getBuses(filters).subscribe({
      next: (response: ApiResponse<Bus[]>) => {
        if (response.success && response.data) {
          this.routeBuses = response.data;
        }
        this.isLoadingBuses = false;
      },
      error: (error: any) => {
        console.error('Error loading route buses:', error);
        this.errorMessage = 'Failed to load buses for this route';
        this.isLoadingBuses = false;
      }
    });
  }

  closeBusesModal(): void {
    this.showBusesModal = false;
    this.selectedRouteForBuses = null;
    this.routeBuses = [];
  }

  viewBusDetails(bus: Bus): void {
    // Navigate to bus details or open modal
    this.router.navigate(['/admin/bus-fleet', bus._id]);
  }

  editBus(bus: Bus): void {
    this.router.navigate(['/admin/bus-fleet/edit', bus._id]);
  }

  getBusStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  }

  // ==================== STOP MANAGEMENT ====================

  openStopsModal(route: Route): void {
    this.selectedRoute = route;
    if (route._id) {
      this.isLoading = true;
      this.busService.getRouteStops(route._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.routeStops = response.data.stops || [];
            // Sort by order
            this.routeStops.sort((a, b) => a.order - b.order);
            this.showStopsModal = true;
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading stops:', error);
          this.errorMessage = 'Failed to load stops';
          this.isLoading = false;
        }
      });
    }
  }

  closeStopsModal(): void {
    this.showStopsModal = false;
    this.routeStops = [];
  }

  openAddStopModal(): void {
    this.currentStop = {
      name: '',
      type: 'boarding',
      address: '',
      city: '',
      arrivalTime: '',
      departureTime: '',
      duration: 30,
      fare: 0,
      contact: '',
      landmark: '',
      amenities: [],
      isMealStop: false,
      mealType: null,
      description: '',
      isActive: true,
      order: this.routeStops.length
    };
    this.editingStopIndex = -1;
    this.showAddStopModal = true;
  }

  openEditStopModal(stop: Stop, index: number): void {
    this.currentStop = { ...stop };
    this.editingStopIndex = index;
    this.showAddStopModal = true;
  }

  closeAddStopModal(): void {
    this.showAddStopModal = false;
    this.currentStop = {
      name: '',
      type: 'boarding',
      address: '',
      city: '',
      arrivalTime: '',
      departureTime: '',
      duration: 30,
      fare: 0,
      contact: '',
      landmark: '',
      amenities: [],
      isMealStop: false,
      mealType: null,
      description: '',
      isActive: true,
      order: 0
    };
    this.editingStopIndex = -1;
  }

  toggleAmenity(amenity: string): void {
    const index = this.currentStop.amenities?.indexOf(amenity) ?? -1;
    if (index > -1) {
      this.currentStop.amenities?.splice(index, 1);
    } else {
      if (!this.currentStop.amenities) {
        this.currentStop.amenities = [];
      }
      this.currentStop.amenities.push(amenity);
    }
  }

  onStopTypeChange(): void {
    if (this.currentStop.type === 'meal') {
      this.currentStop.isMealStop = true;
    } else {
      this.currentStop.isMealStop = false;
      this.currentStop.mealType = null;
    }
  }

  onMealStopChange(): void {
    if (this.currentStop.isMealStop) {
      this.currentStop.type = 'meal';
    } else {
      this.currentStop.mealType = null;
    }
  }

  saveStop(): void {
    if (!this.validateStop()) return;

    if (this.currentStop.arrivalTime && this.currentStop.departureTime && !this.currentStop.duration) {
      this.currentStop.duration = this.calculateDuration(
        this.currentStop.arrivalTime,
        this.currentStop.departureTime
      );
    }

    if (this.currentStop.type === 'meal') {
      this.currentStop.isMealStop = true;
      if (!this.currentStop.mealType) {
        this.currentStop.mealType = 'breakfast';
      }
    }

    if (this.editingStopIndex >= 0) {
      this.routeStops[this.editingStopIndex] = { ...this.currentStop };
    } else {
      this.routeStops.push({ ...this.currentStop });
    }

    this.routeStops.sort((a, b) => a.order - b.order);
    this.closeAddStopModal();
  }

  removeStop(index: number): void {
    if (confirm('Are you sure you want to remove this stop?')) {
      this.routeStops.splice(index, 1);
      this.routeStops.forEach((stop, idx) => {
        stop.order = idx;
      });
    }
  }

  moveStopUp(index: number): void {
    if (index > 0) {
      const temp = this.routeStops[index];
      this.routeStops[index] = this.routeStops[index - 1];
      this.routeStops[index - 1] = temp;
      
      this.routeStops.forEach((stop, idx) => {
        stop.order = idx;
      });
    }
  }

  moveStopDown(index: number): void {
    if (index < this.routeStops.length - 1) {
      const temp = this.routeStops[index];
      this.routeStops[index] = this.routeStops[index + 1];
      this.routeStops[index + 1] = temp;
      
      this.routeStops.forEach((stop, idx) => {
        stop.order = idx;
      });
    }
  }

  saveStops(): void {
    if (!this.selectedRoute || !this.selectedRoute._id) return;

    this.isLoading = true;
    this.busService.updateRouteStops(this.selectedRoute._id, this.routeStops).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Stops saved successfully';
          this.closeStopsModal();
          this.loadRoutes();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error saving stops:', error);
        this.errorMessage = error.error?.message || 'Failed to save stops';
        this.isLoading = false;
      }
    });
  }

  getStopTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'boarding': 'Boarding Point',
      'meal': 'Meal Stop',
      'rest': 'Rest Stop',
      'pickup': 'Pickup Point',
      'dropping': 'Dropping Point'
    };
    return labels[type] || type;
  }

  private validateStop(): boolean {
    if (!this.currentStop.name?.trim()) {
      this.errorMessage = 'Stop name is required';
      return false;
    }
    if (!this.currentStop.address?.trim()) {
      this.errorMessage = 'Address is required';
      return false;
    }
    if (!this.currentStop.city?.trim()) {
      this.errorMessage = 'City is required';
      return false;
    }
    if (!this.currentStop.arrivalTime) {
      this.errorMessage = 'Arrival time is required';
      return false;
    }
    if (!this.currentStop.departureTime) {
      this.errorMessage = 'Departure time is required';
      return false;
    }
    if (this.currentStop.fare < 0) {
      this.errorMessage = 'Fare cannot be negative';
      return false;
    }
    if (this.currentStop.type === 'meal' && !this.currentStop.mealType) {
      this.errorMessage = 'Meal type is required for meal stops';
      return false;
    }
    return true;
  }

  private calculateDuration(arrival: string, departure: string): number {
    const [arrHours, arrMins] = arrival.split(':').map(Number);
    const [depHours, depMins] = departure.split(':').map(Number);
    
    let totalMins = (depHours * 60 + depMins) - (arrHours * 60 + arrMins);
    if (totalMins < 0) totalMins += 24 * 60;
    
    return totalMins;
  }
}