import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouteService, Route, Stop } from '../../../services/route.service';

@Component({
  selector: 'app-route-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './route-plan.component.html',
  styleUrls: ['./route-plan.component.css']
})
export class RoutePlanComponent implements OnInit {
  routes: Route[] = [];
  filteredRoutes: Route[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showStopsModal: boolean = false;
  showDeleteModal: boolean = false;
  showAddStopModal: boolean = false;
  
  selectedRoute: Route | null = null;
  routeStops: Stop[] = [];
  currentStop: Stop = {
    name: '',
    arrivalTime: '',
    departureTime: '',
    fare: 0
  };
  editingStopIndex: number = -1;
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Time validation
  timePattern = '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$';

  newRoute: any = {
    routeName: '',
    origin: '',
    destination: '',
    distance: 0,
    duration: '',
    stops: [],
    status: 'active',
    busesAssigned: 0
  };

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.routeService.getRoutes(this.selectedStatus, this.searchTerm).subscribe({
      next: (response) => {
        if (response.success) {
          this.routes = response.data.map((route: any, index: number) => ({
            ...route,
            displayId: index + 1
          }));
          this.filteredRoutes = [...this.routes];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.errorMessage = 'Failed to load routes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  filterRoutes() {
    this.filteredRoutes = this.routes.filter(route => {
      const matchesSearch = this.searchTerm === '' || 
        route.routeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        route.origin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || route.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.loadRoutes();
  }

  onStatusFilter() {
    this.loadRoutes();
  }

  openAddModal() {
    this.newRoute = {
      routeName: '',
      origin: '',
      destination: '',
      distance: 0,
      duration: '',
      stops: [],
      status: 'active',
      busesAssigned: 0
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveRoute() {
    if (!this.validateRouteForm(this.newRoute)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.routeService.createRoute(this.newRoute).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Route created successfully!';
          this.loadRoutes();
          this.closeAddModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating route:', error);
        this.errorMessage = error.error?.message || 'Failed to create route';
        this.isLoading = false;
      }
    });
  }

  openEditModal(route: Route) {
    if (route._id) {
      this.isLoading = true;
      this.routeService.getRouteById(route._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.selectedRoute = response.data;
            this.showEditModal = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching route details:', error);
          this.errorMessage = 'Failed to load route details';
          this.isLoading = false;
        }
      });
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRoute = null;
  }

  updateRoute() {
    if (!this.selectedRoute || !this.selectedRoute._id) return;
    
    if (!this.validateRouteForm(this.selectedRoute)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.routeService.updateRoute(this.selectedRoute._id, this.selectedRoute).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Route updated successfully!';
          this.loadRoutes();
          this.closeEditModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating route:', error);
        this.errorMessage = error.error?.message || 'Failed to update route';
        this.isLoading = false;
      }
    });
  }

  // STOPS MANAGEMENT (BOARDING POINTS)
  openStopsModal(route: Route) {
    this.selectedRoute = route;
    if (route._id) {
      this.isLoading = true;
      this.routeService.getRouteStops(route._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.routeStops = response.data.stops || [];
            this.showStopsModal = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading stops:', error);
          this.errorMessage = 'Failed to load route stops';
          this.isLoading = false;
        }
      });
    }
  }

  closeStopsModal() {
    this.showStopsModal = false;
    this.selectedRoute = null;
    this.routeStops = [];
  }

  openAddStopModal() {
    this.currentStop = {
      name: '',
      arrivalTime: '',
      departureTime: '',
      fare: 0
    };
    this.editingStopIndex = -1;
    this.showAddStopModal = true;
  }

  openEditStopModal(stop: Stop, index: number) {
    this.currentStop = { ...stop };
    this.editingStopIndex = index;
    this.showAddStopModal = true;
  }

  closeAddStopModal() {
    this.showAddStopModal = false;
    this.currentStop = {
      name: '',
      arrivalTime: '',
      departureTime: '',
      fare: 0
    };
    this.editingStopIndex = -1;
  }

  saveStop() {
    if (!this.validateStop(this.currentStop)) {
      return;
    }

    // Sort stops by arrival time
    if (this.editingStopIndex >= 0) {
      // Update existing stop
      this.routeStops[this.editingStopIndex] = { ...this.currentStop };
    } else {
      // Add new stop
      this.routeStops.push({ ...this.currentStop });
    }
    
    // Sort stops by arrival time
    this.routeStops.sort((a, b) => {
      return this.timeToMinutes(a.arrivalTime) - this.timeToMinutes(b.arrivalTime);
    });
    
    this.closeAddStopModal();
  }

  removeStop(index: number) {
    this.routeStops.splice(index, 1);
  }

  saveStops() {
    if (!this.selectedRoute || !this.selectedRoute._id) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.routeService.updateRouteStops(this.selectedRoute._id, this.routeStops).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Stops updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving stops:', error);
        this.errorMessage = error.error?.message || 'Failed to save stops';
        this.isLoading = false;
      }
    });
  }

  // Helper method to convert time string to minutes for sorting
  timeToMinutes(time: string): number {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
  }

  openDeleteModal(route: Route) {
    this.selectedRoute = route;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedRoute = null;
  }

  confirmDelete() {
    if (this.selectedRoute && this.selectedRoute._id) {
      this.isLoading = true;
      this.errorMessage = '';

      this.routeService.deleteRoute(this.selectedRoute._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Route deleted successfully!';
            this.loadRoutes();
            this.closeDeleteModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting route:', error);
          this.errorMessage = error.error?.message || 'Failed to delete route';
          this.isLoading = false;
        }
      });
    }
  }

  toggleStatus(route: Route) {
    if (route._id) {
      this.routeService.toggleRouteStatus(route._id).subscribe({
        next: (response) => {
          if (response.success) {
            route.status = route.status === 'active' ? 'inactive' : 'active';
            this.successMessage = `Route ${route.status === 'active' ? 'activated' : 'deactivated'} successfully!`;
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          console.error('Error toggling status:', error);
          this.errorMessage = error.error?.message || 'Failed to toggle status';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  private validateRouteForm(route: any): boolean {
    if (!route.routeName || !route.origin || !route.destination || !route.distance || !route.duration) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }
    if (route.distance <= 0) {
      this.errorMessage = 'Distance must be greater than 0';
      return false;
    }
    return true;
  }

  private validateStop(stop: Stop): boolean {
    if (!stop.name || !stop.arrivalTime || !stop.departureTime) {
      this.errorMessage = 'Please fill in all stop fields';
      return false;
    }
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(stop.arrivalTime) || !timeRegex.test(stop.departureTime)) {
      this.errorMessage = 'Please enter valid time in HH:MM format (e.g., 09:30)';
      return false;
    }
    
    if (stop.fare < 0) {
      this.errorMessage = 'Fare cannot be negative';
      return false;
    }
    return true;
  }
  calculateStopDuration(arrival: string, departure: string): string {
  if (!arrival || !departure) return '';
  
  const [arrHours, arrMins] = arrival.split(':').map(Number);
  const [depHours, depMins] = departure.split(':').map(Number);
  
  let totalMins = (depHours * 60 + depMins) - (arrHours * 60 + arrMins);
  
  if (totalMins < 0) totalMins += 24 * 60; // Handle next day
  
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  
  return `${hours}h ${mins}m`;
}
}