// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// interface Route {
//   id: number;
//   routeName: string;
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: string;
//   stops: number;
//   status: 'active' | 'inactive';
//   busesAssigned: number;
// }

// interface Stop {
//   id: number;
//   name: string;
//   arrivalTime: string;
//   departureTime: string;
//   fare: number;
// }

// @Component({
//   selector: 'app-route-plan',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './route-plan.component.html',
//   styleUrls: ['./route-plan.component.css']
// })
// export class RoutePlanComponent implements OnInit {
//   routes: Route[] = [];
//   filteredRoutes: Route[] = [];
//   searchTerm: string = '';
//   selectedStatus: string = 'all';
  
//   showAddModal: boolean = false;
//   showEditModal: boolean = false;
//   showStopsModal: boolean = false;
//   showDeleteModal: boolean = false;
  
//   selectedRoute: Route | null = null;
//   routeStops: Stop[] = [];
  
//   newRoute: Omit<Route, 'id'> = {
//     routeName: '',
//     origin: '',
//     destination: '',
//     distance: 0,
//     duration: '',
//     stops: 0,
//     status: 'active',
//     busesAssigned: 0
//   };

//   ngOnInit() {
//     this.loadRoutes();
//   }

//   loadRoutes() {
//     // Sample data - In real app, this would come from a service
//     this.routes = [
//       {
//         id: 1,
//         routeName: 'Delhi-Mumbai Express',
//         origin: 'Delhi',
//         destination: 'Mumbai',
//         distance: 1400,
//         duration: '24 hrs',
//         stops: 5,
//         status: 'active',
//         busesAssigned: 8
//       },
//       {
//         id: 2,
//         routeName: 'Bangalore-Chennai',
//         origin: 'Bangalore',
//         destination: 'Chennai',
//         distance: 350,
//         duration: '7 hrs',
//         stops: 3,
//         status: 'active',
//         busesAssigned: 12
//       },
//       {
//         id: 3,
//         routeName: 'Mumbai-Pune',
//         origin: 'Mumbai',
//         destination: 'Pune',
//         distance: 150,
//         duration: '3.5 hrs',
//         stops: 2,
//         status: 'active',
//         busesAssigned: 15
//       },
//       {
//         id: 4,
//         routeName: 'Delhi-Agra',
//         origin: 'Delhi',
//         destination: 'Agra',
//         distance: 230,
//         duration: '4 hrs',
//         stops: 2,
//         status: 'inactive',
//         busesAssigned: 0
//       },
//       {
//         id: 5,
//         routeName: 'Kolkata-Delhi',
//         origin: 'Kolkata',
//         destination: 'Delhi',
//         distance: 1500,
//         duration: '28 hrs',
//         stops: 8,
//         status: 'active',
//         busesAssigned: 5
//       }
//     ];
//     this.filterRoutes();
//   }

//   filterRoutes() {
//     this.filteredRoutes = this.routes.filter(route => {
//       const matchesSearch = 
//         route.routeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         route.origin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         route.destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      
//       const matchesStatus = this.selectedStatus === 'all' || route.status === this.selectedStatus;
      
//       return matchesSearch && matchesStatus;
//     });
//   }

//   onSearch() {
//     this.filterRoutes();
//   }

//   onStatusFilter() {
//     this.filterRoutes();
//   }

//   openAddModal() {
//     this.newRoute = {
//       routeName: '',
//       origin: '',
//       destination: '',
//       distance: 0,
//       duration: '',
//       stops: 0,
//       status: 'active',
//       busesAssigned: 0
//     };
//     this.showAddModal = true;
//   }

//   closeAddModal() {
//     this.showAddModal = false;
//   }

//   // FIXED: No more duplicate id issue
//   saveRoute() {
//     // In real app, this would call a service
//     const newId = this.routes.length + 1;
//     const route: Route = {
//       id: newId,
//       routeName: this.newRoute.routeName,
//       origin: this.newRoute.origin,
//       destination: this.newRoute.destination,
//       distance: this.newRoute.distance,
//       duration: this.newRoute.duration,
//       stops: this.newRoute.stops,
//       status: this.newRoute.status,
//       busesAssigned: this.newRoute.busesAssigned
//     };
//     this.routes.push(route);
//     this.filterRoutes();
//     this.closeAddModal();
//   }

//   openEditModal(route: Route) {
//     this.selectedRoute = { ...route };
//     this.showEditModal = true;
//   }

//   closeEditModal() {
//     this.showEditModal = false;
//     this.selectedRoute = null;
//   }

//   updateRoute() {
//     if (this.selectedRoute) {
//       const index = this.routes.findIndex(r => r.id === this.selectedRoute!.id);
//       if (index !== -1) {
//         this.routes[index] = this.selectedRoute;
//         this.filterRoutes();
//       }
//       this.closeEditModal();
//     }
//   }

//   openStopsModal(route: Route) {
//     this.selectedRoute = route;
//     this.loadStops(route.id);
//     this.showStopsModal = true;
//   }

//   closeStopsModal() {
//     this.showStopsModal = false;
//     this.selectedRoute = null;
//     this.routeStops = [];
//   }

//   loadStops(routeId: number) {
//     // Sample stops data - In real app, this would come from a service based on routeId
//     if (routeId === 1) {
//       this.routeStops = [
//         {
//           id: 1,
//           name: 'Delhi ISBT',
//           arrivalTime: '06:00 AM',
//           departureTime: '06:30 AM',
//           fare: 0
//         },
//         {
//           id: 2,
//           name: 'Gurugram',
//           arrivalTime: '07:15 AM',
//           departureTime: '07:30 AM',
//           fare: 150
//         },
//         {
//           id: 3,
//           name: 'Jaipur',
//           arrivalTime: '11:30 AM',
//           departureTime: '12:00 PM',
//           fare: 450
//         },
//         {
//           id: 4,
//           name: 'Ajmer',
//           arrivalTime: '02:45 PM',
//           departureTime: '03:00 PM',
//           fare: 650
//         },
//         {
//           id: 5,
//           name: 'Mumbai Central',
//           arrivalTime: '06:00 AM',
//           departureTime: '06:30 AM',
//           fare: 1400
//         }
//       ];
//     } else {
//       this.routeStops = [
//         {
//           id: 1,
//           name: 'Origin Stop',
//           arrivalTime: '08:00 AM',
//           departureTime: '08:30 AM',
//           fare: 0
//         },
//         {
//           id: 2,
//           name: 'Destination Stop',
//           arrivalTime: '08:00 PM',
//           departureTime: '08:30 PM',
//           fare: 500
//         }
//       ];
//     }
//   }

//   openDeleteModal(route: Route) {
//     this.selectedRoute = route;
//     this.showDeleteModal = true;
//   }

//   closeDeleteModal() {
//     this.showDeleteModal = false;
//     this.selectedRoute = null;
//   }

//   confirmDelete() {
//     if (this.selectedRoute) {
//       this.routes = this.routes.filter(r => r.id !== this.selectedRoute!.id);
//       this.filterRoutes();
//       this.closeDeleteModal();
//     }
//   }

//   toggleStatus(route: Route) {
//     route.status = route.status === 'active' ? 'inactive' : 'active';
//     // In real app, this would call a service
//   }

//   getStatusClass(status: string): string {
//     return status === 'active' ? 'status-active' : 'status-inactive';
//   }
// }
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
          // Add temporary sequential ID for display purposes
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
    // Client-side filtering as backup, though backend already filters
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
    this.loadRoutes(); // Reload with search filter from backend
  }

  onStatusFilter() {
    this.loadRoutes(); // Reload with status filter from backend
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

    if (this.editingStopIndex >= 0) {
      // Update existing stop
      this.routeStops[this.editingStopIndex] = { ...this.currentStop };
    } else {
      // Add new stop
      this.routeStops.push({ ...this.currentStop });
    }
    
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
    if (stop.fare < 0) {
      this.errorMessage = 'Fare cannot be negative';
      return false;
    }
    return true;
  }
}