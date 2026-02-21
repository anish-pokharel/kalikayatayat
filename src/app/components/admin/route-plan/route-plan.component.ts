import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Route {
  id: number;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  stops: number;
  status: 'active' | 'inactive';
  busesAssigned: number;
}

interface Stop {
  id: number;
  name: string;
  arrivalTime: string;
  departureTime: string;
  fare: number;
}

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
  
  selectedRoute: Route | null = null;
  routeStops: Stop[] = [];
  
  newRoute: Omit<Route, 'id'> = {
    routeName: '',
    origin: '',
    destination: '',
    distance: 0,
    duration: '',
    stops: 0,
    status: 'active',
    busesAssigned: 0
  };

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    // Sample data - In real app, this would come from a service
    this.routes = [
      {
        id: 1,
        routeName: 'Delhi-Mumbai Express',
        origin: 'Delhi',
        destination: 'Mumbai',
        distance: 1400,
        duration: '24 hrs',
        stops: 5,
        status: 'active',
        busesAssigned: 8
      },
      {
        id: 2,
        routeName: 'Bangalore-Chennai',
        origin: 'Bangalore',
        destination: 'Chennai',
        distance: 350,
        duration: '7 hrs',
        stops: 3,
        status: 'active',
        busesAssigned: 12
      },
      {
        id: 3,
        routeName: 'Mumbai-Pune',
        origin: 'Mumbai',
        destination: 'Pune',
        distance: 150,
        duration: '3.5 hrs',
        stops: 2,
        status: 'active',
        busesAssigned: 15
      },
      {
        id: 4,
        routeName: 'Delhi-Agra',
        origin: 'Delhi',
        destination: 'Agra',
        distance: 230,
        duration: '4 hrs',
        stops: 2,
        status: 'inactive',
        busesAssigned: 0
      },
      {
        id: 5,
        routeName: 'Kolkata-Delhi',
        origin: 'Kolkata',
        destination: 'Delhi',
        distance: 1500,
        duration: '28 hrs',
        stops: 8,
        status: 'active',
        busesAssigned: 5
      }
    ];
    this.filterRoutes();
  }

  filterRoutes() {
    this.filteredRoutes = this.routes.filter(route => {
      const matchesSearch = 
        route.routeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        route.origin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || route.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.filterRoutes();
  }

  onStatusFilter() {
    this.filterRoutes();
  }

  openAddModal() {
    this.newRoute = {
      routeName: '',
      origin: '',
      destination: '',
      distance: 0,
      duration: '',
      stops: 0,
      status: 'active',
      busesAssigned: 0
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  // FIXED: No more duplicate id issue
  saveRoute() {
    // In real app, this would call a service
    const newId = this.routes.length + 1;
    const route: Route = {
      id: newId,
      routeName: this.newRoute.routeName,
      origin: this.newRoute.origin,
      destination: this.newRoute.destination,
      distance: this.newRoute.distance,
      duration: this.newRoute.duration,
      stops: this.newRoute.stops,
      status: this.newRoute.status,
      busesAssigned: this.newRoute.busesAssigned
    };
    this.routes.push(route);
    this.filterRoutes();
    this.closeAddModal();
  }

  openEditModal(route: Route) {
    this.selectedRoute = { ...route };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRoute = null;
  }

  updateRoute() {
    if (this.selectedRoute) {
      const index = this.routes.findIndex(r => r.id === this.selectedRoute!.id);
      if (index !== -1) {
        this.routes[index] = this.selectedRoute;
        this.filterRoutes();
      }
      this.closeEditModal();
    }
  }

  openStopsModal(route: Route) {
    this.selectedRoute = route;
    this.loadStops(route.id);
    this.showStopsModal = true;
  }

  closeStopsModal() {
    this.showStopsModal = false;
    this.selectedRoute = null;
    this.routeStops = [];
  }

  loadStops(routeId: number) {
    // Sample stops data - In real app, this would come from a service based on routeId
    if (routeId === 1) {
      this.routeStops = [
        {
          id: 1,
          name: 'Delhi ISBT',
          arrivalTime: '06:00 AM',
          departureTime: '06:30 AM',
          fare: 0
        },
        {
          id: 2,
          name: 'Gurugram',
          arrivalTime: '07:15 AM',
          departureTime: '07:30 AM',
          fare: 150
        },
        {
          id: 3,
          name: 'Jaipur',
          arrivalTime: '11:30 AM',
          departureTime: '12:00 PM',
          fare: 450
        },
        {
          id: 4,
          name: 'Ajmer',
          arrivalTime: '02:45 PM',
          departureTime: '03:00 PM',
          fare: 650
        },
        {
          id: 5,
          name: 'Mumbai Central',
          arrivalTime: '06:00 AM',
          departureTime: '06:30 AM',
          fare: 1400
        }
      ];
    } else {
      this.routeStops = [
        {
          id: 1,
          name: 'Origin Stop',
          arrivalTime: '08:00 AM',
          departureTime: '08:30 AM',
          fare: 0
        },
        {
          id: 2,
          name: 'Destination Stop',
          arrivalTime: '08:00 PM',
          departureTime: '08:30 PM',
          fare: 500
        }
      ];
    }
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
    if (this.selectedRoute) {
      this.routes = this.routes.filter(r => r.id !== this.selectedRoute!.id);
      this.filterRoutes();
      this.closeDeleteModal();
    }
  }

  toggleStatus(route: Route) {
    route.status = route.status === 'active' ? 'inactive' : 'active';
    // In real app, this would call a service
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}