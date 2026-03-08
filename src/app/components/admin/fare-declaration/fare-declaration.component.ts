import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FareService, Fare, Route } from '../../../services/fare.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fare-declaration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fare-declaration.component.html',
  styleUrls: ['./fare-declaration.component.css']
})
export class FareDeclarationComponent implements OnInit, OnDestroy {
  fares: Fare[] = [];
  filteredFares: Fare[] = [];
  routes: Route[] = [];
  
  searchTerm: string = '';
  selectedRoute: string = 'all';
  selectedBusType: string = 'all';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  
  selectedFare: any = null;
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  today: string = new Date().toISOString().split('T')[0];
  
  newFare: any = {
    routeId: '',
    busType: 'AC Sleeper',
    baseFare: 0,
    effectiveFrom: '',
    effectiveTo: '',
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

  private subscriptions: Subscription = new Subscription();

  constructor(private fareService: FareService) {}

  ngOnInit(): void {
    this.loadRoutes();
    this.loadFares();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Load routes from your existing /routes endpoint
  loadRoutes(): void {
    const sub = this.fareService.getRoutes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter only active routes for dropdown
          this.routes = response.data.filter(route => route.status === 'active');
          console.log('Routes loaded:', this.routes);
        }
      },
      error: (error) => {
        console.error('Error loading routes:', error);
        this.errorMessage = 'Failed to load routes';
      }
    });
    this.subscriptions.add(sub);
  }

  loadFares(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.fareService.getFares(
      this.selectedRoute,
      this.selectedBusType,
      this.selectedStatus,
      this.searchTerm
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.fares = response.data;
          this.filteredFares = [...this.fares];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading fares:', error);
        this.errorMessage = 'Failed to load fares';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  onSearch(): void {
    this.loadFares();
  }

  onFilterChange(): void {
    this.loadFares();
  }

  // Get route name by ID
  getRouteName(routeId: string): string {
    const route = this.routes.find(r => r._id === routeId);
    return route ? route.routeName : 'Unknown';
  }

  // Get route details by ID
  getRouteDetails(routeId: string): { origin: string; destination: string } {
    const route = this.routes.find(r => r._id === routeId);
    return {
      origin: route?.origin || '',
      destination: route?.destination || ''
    };
  }

  openAddModal(): void {
    this.newFare = {
      routeId: '',
      busType: 'AC Sleeper',
      baseFare: 0,
      effectiveFrom: '',
      effectiveTo: '',
      status: 'active'
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveFare(): void {
    if (!this.validateFare(this.newFare)) return;

    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.fareService.createFare(this.newFare).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Fare created successfully!';
          this.loadFares();
          this.closeAddModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating fare:', error);
        this.errorMessage = error.error?.message || 'Failed to create fare';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  openEditModal(fare: any): void {
    if (fare._id) {
      this.isLoading = true;
      const sub = this.fareService.getFareById(fare._id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.selectedFare = response.data;
            this.showEditModal = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching fare:', error);
          this.errorMessage = 'Failed to load fare details';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedFare = null;
  }

  updateFare(): void {
    if (!this.selectedFare || !this.selectedFare._id) return;
    if (!this.validateFare(this.selectedFare)) return;

    this.isLoading = true;
    this.errorMessage = '';

    const sub = this.fareService.updateFare(this.selectedFare._id, this.selectedFare).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Fare updated successfully!';
          this.loadFares();
          this.closeEditModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating fare:', error);
        this.errorMessage = error.error?.message || 'Failed to update fare';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  openDeleteModal(fare: any): void {
    this.selectedFare = fare;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedFare = null;
  }

  confirmDelete(): void {
    if (this.selectedFare && this.selectedFare._id) {
      this.isLoading = true;
      this.errorMessage = '';

      const sub = this.fareService.deleteFare(this.selectedFare._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Fare deleted successfully!';
            this.loadFares();
            this.closeDeleteModal();
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting fare:', error);
          this.errorMessage = error.error?.message || 'Failed to delete fare';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  toggleStatus(fare: any): void {
    if (fare._id) {
      this.isLoading = true;
      const sub = this.fareService.toggleFareStatus(fare._id).subscribe({
        next: (response) => {
          if (response.success) {
            fare.status = fare.status === 'active' ? 'inactive' : 'active';
            this.successMessage = `Fare ${fare.status === 'active' ? 'activated' : 'deactivated'}!`;
            setTimeout(() => this.successMessage = '', 3000);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error toggling status:', error);
          this.errorMessage = error.error?.message || 'Failed to toggle status';
          this.isLoading = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  getActiveFaresCount(): number {
    return this.filteredFares.filter(f => f.status === 'active').length;
  }

  getInactiveFaresCount(): number {
    return this.filteredFares.filter(f => f.status === 'inactive').length;
  }

  private validateFare(fare: any): boolean {
    if (!fare.routeId) {
      this.errorMessage = 'Please select a route';
      return false;
    }
    if (!fare.busType) {
      this.errorMessage = 'Please select a bus type';
      return false;
    }
    if (!fare.baseFare || fare.baseFare <= 0) {
      this.errorMessage = 'Base fare must be greater than 0';
      return false;
    }
    if (!fare.effectiveFrom || !fare.effectiveTo) {
      this.errorMessage = 'Please select effective dates';
      return false;
    }
    if (new Date(fare.effectiveFrom) >= new Date(fare.effectiveTo)) {
      this.errorMessage = 'Effective to date must be after effective from date';
      return false;
    }
    return true;
  }
}