import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BusService, Bus, SearchCriteria, ApiResponse, SearchResponse } from '../../../services/bus.service';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
  buses: Bus[] = [];
  filteredBuses: Bus[] = [];
  popularRoutes: string[] = [];
  operators: string[] = [];
  
  date: Date = new Date();
  passengers: number = 1;
  
  searchCriteria: SearchCriteria = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  filters: {
    busType: string;
    priceRange: string;
    departureTime: string;
    operator: string;
    amenities: string[];
  } = {
    busType: 'all',
    priceRange: 'all',
    departureTime: 'all',
    operator: 'all',
    amenities: []
  };
  
  sortBy: string = 'departure';
  
  showSearchResults: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  searchMessage: string = '';

  constructor(
    private busService: BusService,
    private router: Router
  ) {
    this.date = new Date(this.searchCriteria.date);
    this.passengers = this.searchCriteria.passengers;
  }

  ngOnInit() {
    this.loadPopularRoutes();
    this.loadOperators();
    
    // Check for query params from home page
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    const from = urlParams.get('from');
    const date = urlParams.get('date');
    
    if (from) this.searchCriteria.from = from;
    if (to) this.searchCriteria.to = to;
    if (date) this.searchCriteria.date = date;
    
    if (from || to) {
      this.searchBuses();
    }
  }

  loadPopularRoutes(): void {
    this.busService.getPopularRoutes().subscribe({
      next: (response: ApiResponse<string[]>) => {
        if (response.success && response.data) {
          this.popularRoutes = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading popular routes:', error);
      }
    });
  }

  loadOperators(): void {
    this.busService.getOperators().subscribe({
      next: (response: ApiResponse<string[]>) => {
        if (response.success && response.data) {
          this.operators = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading operators:', error);
      }
    });
  }

  searchBuses(): void {
    if (!this.searchCriteria.from || !this.searchCriteria.to) {
      this.errorMessage = 'Please enter both origin and destination';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.searchMessage = '';
    this.showSearchResults = true;

    // Update component properties
    this.date = new Date(this.searchCriteria.date);
    this.passengers = this.searchCriteria.passengers;

    this.busService.searchBuses(this.searchCriteria).subscribe({
      next: (response: SearchResponse) => {
        if (response.success) {
          this.buses = response.data || [];
          this.filteredBuses = [...this.buses];
          
          if (this.buses.length === 0) {
            this.searchMessage = `No buses found from ${response.from} to ${response.to}`;
          } else {
            this.searchMessage = `Found ${response.count} buses from ${response.from} to ${response.to}`;
          }
          
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error searching buses:', error);
        this.errorMessage = 'Failed to search buses. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredBuses = this.buses.filter(bus => {
      // Filter by bus type
      if (this.filters.busType !== 'all' && bus.busType !== this.filters.busType) {
        return false;
      }
      
      // Filter by price range
      if (this.filters.priceRange !== 'all') {
        const [min, max] = this.filters.priceRange.split('-').map(Number);
        const price = bus.fare || bus.price || 0;
        if (max) {
          if (price < min || price > max) return false;
        } else {
          if (price < min) return false;
        }
      }
      
      // Filter by departure time
      if (this.filters.departureTime !== 'all' && bus.departureTime) {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        if (this.filters.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (this.filters.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (this.filters.departureTime === 'evening' && (hour < 18 || hour >= 24)) return false;
        if (this.filters.departureTime === 'night' && (hour >= 0 && hour < 6)) return false;
      }
      
      // Filter by operator
      if (this.filters.operator !== 'all') {
        const busOperator = bus.operator || (bus.busName ? bus.busName.split(' ')[0] : '');
        if (busOperator !== this.filters.operator) return false;
      }
      
      // Filter by amenities
      if (this.filters.amenities && this.filters.amenities.length > 0) {
        if (!bus.amenities || bus.amenities.length === 0) return false;
        const hasAllAmenities = this.filters.amenities.every((amenity: string) => 
          bus.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    });
    
    this.sortBuses();
  }

  sortBuses(): void {
    switch(this.sortBy) {
      case 'price':
        this.filteredBuses.sort((a, b) => (a.fare || a.price || 0) - (b.fare || b.price || 0));
        break;
      case 'price-desc':
        this.filteredBuses.sort((a, b) => (b.fare || b.price || 0) - (a.fare || a.price || 0));
        break;
      case 'departure':
        this.filteredBuses.sort((a, b) => {
          if (!a.departureTime) return 1;
          if (!b.departureTime) return -1;
          return a.departureTime.localeCompare(b.departureTime);
        });
        break;
      case 'rating':
        this.filteredBuses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'seats':
        this.filteredBuses.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0));
        break;
    }
  }

  resetFilters(): void {
    this.filters = {
      busType: 'all',
      priceRange: 'all',
      departureTime: 'all',
      operator: 'all',
      amenities: []
    };
    this.sortBy = 'departure';
    this.filteredBuses = [...this.buses];
  }

  filterByAmenity(amenity: string, event: any): void {
    if (!this.filters.amenities) {
      this.filters.amenities = [];
    }
    
    if (event.target.checked) {
      this.filters.amenities.push(amenity);
    } else {
      this.filters.amenities = this.filters.amenities.filter((a: string) => a !== amenity);
    }
    
    this.applyFilters();
  }

  selectBus(bus: Bus): void {
    if (bus._id) {
      this.router.navigate(['/seat-selection', bus._id], {
        queryParams: { passengers: this.searchCriteria.passengers }
      });
    }
  }

  getBusTypeIcon(type: string | undefined): string {
    const icons: {[key: string]: string} = {
      'AC Sleeper': '🛏️',
      'AC Seater': '💺',
      'Non-AC Sleeper': '🛏️',
      'Non-AC Seater': '💺',
      'Luxury': '⭐',
      'Volvo': '🚌'
    };
    return icons[type || ''] || '🚌';
  }

  getAmenityIcon(amenity: string): string {
    const icons: {[key: string]: string} = {
      'AC': '❄️',
      'WiFi': '📶',
      'Charging Point': '🔌',
      'Snacks': '🍪',
      'Blanket': '🧣',
      'Water Bottle': '💧',
      'Movie': '🎬'
    };
    return icons[amenity] || '✓';
  }

  getStarsArray(rating: number | undefined): any[] {
    return new Array(Math.floor(rating || 0));
  }

  getOperatorName(bus: Bus): string {
    return bus.operator || (bus.busName ? bus.busName.split(' ')[0] : 'Travels');
  }

  getStatusClass(status: string | undefined): string {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'full': return 'status-full';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-scheduled';
    }
  }

  getAvailableSeatsPercentage(bus: Bus): number {
    const available = bus.availableSeats || 0;
    const total = bus.totalSeats || 1;
    return (available / total) * 100;
  }

  getTotalSeats(bus: Bus): number {
    return bus.totalSeats || 0;
  }

  getAvailableSeats(bus: Bus): number {
    return bus.availableSeats || 0;
  }

  getBookedSeats(bus: Bus): number {
    return (bus.totalSeats || 0) - (bus.availableSeats || 0);
  }

  getPrice(bus: Bus): number {
    return bus.fare || bus.price || 0;
  }

  hasAmenities(bus: Bus): boolean {
    return !!(bus.amenities && bus.amenities.length > 0);
  }

  swapLocations(): void {
    const temp = this.searchCriteria.from;
    this.searchCriteria.from = this.searchCriteria.to;
    this.searchCriteria.to = temp;
  }
}