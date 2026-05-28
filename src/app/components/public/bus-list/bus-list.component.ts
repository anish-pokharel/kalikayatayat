// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { BusService, Bus, SearchCriteria, ApiResponse, SearchResponse } from '../../../services/bus.service';

// @Component({
//   selector: 'app-bus-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './bus-list.component.html',
//   styleUrls: ['./bus-list.component.css']
// })
// export class BusListComponent implements OnInit {
//   buses: Bus[] = [];
//   filteredBuses: Bus[] = [];
//   popularRoutes: string[] = [];
//   operators: string[] = [];
  
//   showFilters: boolean = false;
  
//   searchCriteria: SearchCriteria = {
//     from: '',
//     to: '',
//     date: new Date().toISOString().split('T')[0],
//     passengers: 1
//   };
  
//   filters: {
//     busType: string;
//     priceRange: string;
//     departureTime: string;
//     operator: string;
//     amenities: string[];
//   } = {
//     busType: 'all',
//     priceRange: 'all',
//     departureTime: 'all',
//     operator: 'all',
//     amenities: []
//   };
  
//   sortBy: string = 'departure';
  
//   showSearchResults: boolean = false;
//   loading: boolean = false;
//   errorMessage: string = '';
//   searchMessage: string = '';

//   constructor(
//     public busService: BusService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit() {
//     this.loadPopularRoutes();
//     this.loadOperators();
    
//     // Check for query params from home page
//     const urlParams = new URLSearchParams(window.location.search);
//     const to = urlParams.get('to');
//     const from = urlParams.get('from');
//     const date = urlParams.get('date');
//     const passengers = urlParams.get('passengers');
    
//     if (from) this.searchCriteria.from = from;
//     if (to) this.searchCriteria.to = to;
//     if (date) this.searchCriteria.date = date;
//     if (passengers) this.searchCriteria.passengers = parseInt(passengers);
    
//     // Auto-search if we have both locations
//     if (this.searchCriteria.from && this.searchCriteria.to) {
//       this.searchBuses();
//     }
//   }

//   loadPopularRoutes(): void {
//     this.busService.getPopularRoutes().subscribe({
//       next: (response: ApiResponse<string[]>) => {
//         if (response.success && response.data) {
//           this.popularRoutes = response.data;
//         }
//       },
//       error: (error: any) => {
//         console.error('Error loading popular routes:', error);
//         // Fallback popular routes
//         this.popularRoutes = ['Mumbai-Pune', 'Delhi-Jaipur', 'Bangalore-Chennai'];
//       }
//     });
//   }

//   loadOperators(): void {
//     this.busService.getOperators().subscribe({
//       next: (response: ApiResponse<string[]>) => {
//         if (response.success && response.data) {
//           this.operators = response.data;
//         }
//       },
//       error: (error: any) => {
//         console.error('Error loading operators:', error);
//       }
//     });
//   }

//   searchBuses(): void {
//     if (!this.searchCriteria.from || !this.searchCriteria.to) {
//       this.errorMessage = 'Please enter both origin and destination';
//       setTimeout(() => this.errorMessage = '', 3000);
//       return;
//     }

//     this.loading = true;
//     this.errorMessage = '';
//     this.searchMessage = '';
//     this.showSearchResults = true;

//     this.busService.searchBuses(this.searchCriteria).subscribe({
//       next: (response: SearchResponse) => {
//         if (response.success) {
//           this.buses = response.data || [];
//           this.filteredBuses = [...this.buses];
          
//           if (this.buses.length === 0) {
//             this.searchMessage = `No buses found from ${this.searchCriteria.from} to ${this.searchCriteria.to} on ${this.searchCriteria.date}`;
//           } else {
//             this.searchMessage = `Found ${response.count} buses from ${this.searchCriteria.from} to ${this.searchCriteria.to}`;
//           }
          
//           this.applyFilters();
//         }
//         this.loading = false;
//       },
//       error: (error: any) => {
//         console.error('Error searching buses:', error);
//         this.errorMessage = 'Failed to search buses. Please try again.';
//         this.loading = false;
//       }
//     });
//   }

//   applyFilters(): void {
//     this.filteredBuses = this.buses.filter(bus => {
//       // Filter by bus type
//       if (this.filters.busType !== 'all' && bus.busType !== this.filters.busType) {
//         return false;
//       }
      
//       // Filter by price range
//       if (this.filters.priceRange !== 'all') {
//         const [min, max] = this.filters.priceRange.split('-').map(Number);
//         const price = bus.fare || bus.price || 0;
//         if (max) {
//           if (price < min || price > max) return false;
//         } else {
//           if (price < min) return false;
//         }
//       }
      
//       // Filter by departure time
//       if (this.filters.departureTime !== 'all' && bus.departureTime) {
//         const hour = parseInt(bus.departureTime.split(':')[0]);
//         if (this.filters.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
//         if (this.filters.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
//         if (this.filters.departureTime === 'evening' && (hour < 18 || hour >= 24)) return false;
//         if (this.filters.departureTime === 'night' && (hour >= 0 && hour < 6)) return false;
//       }
      
//       // Filter by operator
//       if (this.filters.operator !== 'all') {
//         const busOperator = bus.operator || '';
//         if (busOperator !== this.filters.operator) return false;
//       }
      
//       // Filter by amenities
//       if (this.filters.amenities && this.filters.amenities.length > 0) {
//         if (!bus.amenities || bus.amenities.length === 0) return false;
//         const hasAllAmenities = this.filters.amenities.every((amenity: string) => 
//           bus.amenities?.includes(amenity)
//         );
//         if (!hasAllAmenities) return false;
//       }
      
//       return true;
//     });
    
//     this.sortBuses();
//   }

//   sortBuses(): void {
//     switch(this.sortBy) {
//       case 'price':
//         this.filteredBuses.sort((a, b) => (a.fare || a.price || 0) - (b.fare || b.price || 0));
//         break;
//       case 'price-desc':
//         this.filteredBuses.sort((a, b) => (b.fare || b.price || 0) - (a.fare || a.price || 0));
//         break;
//       case 'departure':
//         this.filteredBuses.sort((a, b) => {
//           if (!a.departureTime) return 1;
//           if (!b.departureTime) return -1;
//           return a.departureTime.localeCompare(b.departureTime);
//         });
//         break;
//       case 'rating':
//         this.filteredBuses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         break;
//       case 'seats':
//         this.filteredBuses.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0));
//         break;
//     }
//   }

//   resetFilters(): void {
//     this.filters = {
//       busType: 'all',
//       priceRange: 'all',
//       departureTime: 'all',
//       operator: 'all',
//       amenities: []
//     };
//     this.sortBy = 'departure';
//     this.filteredBuses = [...this.buses];
//   }

//   filterByAmenity(amenity: string, event: any): void {
//     if (!this.filters.amenities) {
//       this.filters.amenities = [];
//     }
    
//     if (event.target.checked) {
//       this.filters.amenities.push(amenity);
//     } else {
//       this.filters.amenities = this.filters.amenities.filter((a: string) => a !== amenity);
//     }
    
//     this.applyFilters();
//   }

//   selectBus(bus: Bus): void {
//     if (bus._id) {
//       // Get the search criteria from the component
//       const fromLocation = this.searchCriteria.from;
//       const toLocation = this.searchCriteria.to;
//       const journeyDate = this.searchCriteria.date;
//       const numberOfPassengers = this.searchCriteria.passengers;
      
//       console.log('Navigating to seat selection with:', {
//         busId: bus._id,
//         from: fromLocation,
//         to: toLocation,
//         date: journeyDate,
//         passengers: numberOfPassengers,
//         fare: this.getPrice(bus),
//         busNumber: bus.busNumber,
//         busType: bus.busType,
//         departureTime: bus.departureTime,
//         arrivalTime: bus.arrivalTime
//       });
      
//       // Navigate to seat selection with all required query parameters
//       this.router.navigate(['/seat-selection', bus._id], {
//         queryParams: { 
//           from: fromLocation,
//           to: toLocation,
//           date: journeyDate,
//           passengers: numberOfPassengers,
//           fare: this.getPrice(bus),
//           busNumber: bus.busNumber,
//           busType: bus.busType,
//           busName: bus.busName || bus.operator,
//           departureTime: bus.departureTime,
//           arrivalTime: bus.arrivalTime,
//           duration: bus.duration,
//           totalSeats: bus.totalSeats,
//           availableSeats: bus.availableSeats
//         }
//       });
//     } else {
//       console.error('Bus ID is missing');
//       this.errorMessage = 'Invalid bus selection. Please try again.';
//       setTimeout(() => this.errorMessage = '', 3000);
//     }
//   }

//   getBusTypeIcon(type: string | undefined): string {
//     const icons: {[key: string]: string} = {
//       'AC Sleeper': '🛏️',
//       'AC Seater': '💺',
//       'Non-AC Sleeper': '🛏️',
//       'Non-AC Seater': '💺',
//       'Luxury': '⭐',
//       'Volvo': '🚌'
//     };
//     return icons[type || ''] || '🚌';
//   }

//   getAmenityIcon(amenity: string): string {
//     const icons: {[key: string]: string} = {
//       'AC': '❄️',
//       'WiFi': '📶',
//       'Charging Point': '🔌',
//       'Snacks': '🍪',
//       'Blanket': '🧣',
//       'Water Bottle': '💧',
//       'Movie': '🎬',
//       'GPS': '📍',
//       'Reading Light': '💡',
//       'Emergency Exit': '🚪',
//       'First Aid': '🏥',
//       'Fire Extinguisher': '🧯'
//     };
//     return icons[amenity] || '✓';
//   }

//   getStarsArray(rating: number | undefined): any[] {
//     return new Array(Math.floor(rating || 0));
//   }

//   getOperatorName(bus: Bus): string {
//     return bus.operator || bus.busName || 'Unknown Operator';
//   }

//   getStatusClass(status: string | undefined): string {
//     switch(status?.toLowerCase()) {
//       case 'active': return 'status-active';
//       case 'inactive': return 'status-inactive';
//       case 'full': return 'status-full';
//       case 'cancelled': return 'status-cancelled';
//       default: return 'status-scheduled';
//     }
//   }

//   getAvailableSeatsPercentage(bus: Bus): number {
//     const available = bus.availableSeats || 0;
//     const total = bus.totalSeats || 1;
//     return (available / total) * 100;
//   }

//   getTotalSeats(bus: Bus): number {
//     return bus.totalSeats || 0;
//   }

//   getAvailableSeats(bus: Bus): number {
//     return bus.availableSeats || 0;
//   }

//   getBookedSeats(bus: Bus): number {
//     return (bus.totalSeats || 0) - (bus.availableSeats || 0);
//   }

//   getPrice(bus: Bus): number {
//     return bus.fare || bus.price || 0;
//   }

//   hasAmenities(bus: Bus): boolean {
//     return !!(bus.amenities && bus.amenities.length > 0);
//   }

//   swapLocations(): void {
//     const temp = this.searchCriteria.from;
//     this.searchCriteria.from = this.searchCriteria.to;
//     this.searchCriteria.to = temp;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  busTypes: string[] = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Luxury', 'Volvo'];
  
  showFilters: boolean = false;
  
  searchCriteria: SearchCriteria = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  minDate: string = new Date().toISOString().split('T')[0];
  
  filters: {
    busType: string;
    priceRange: string;
    departureTime: string;
    operator: string;
    seatLayouts: string[];
  } = {
    busType: 'all',
    priceRange: 'all',
    departureTime: 'all',
    operator: 'all',
    seatLayouts: []
  };
  
  sortBy: string = 'departure';
  
  showSearchResults: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  searchMessage: string = '';

  constructor(
    public busService: BusService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadPopularRoutes();
    this.loadOperators();
    
    // Check for query params from home page
    this.route.queryParams.subscribe(params => {
      if (params['from']) this.searchCriteria.from = params['from'];
      if (params['to']) this.searchCriteria.to = params['to'];
      if (params['date']) this.searchCriteria.date = params['date'];
      if (params['passengers']) this.searchCriteria.passengers = parseInt(params['passengers']);
      
      // Auto-search if we have both locations
      if (this.searchCriteria.from && this.searchCriteria.to) {
        setTimeout(() => this.searchBuses(), 100);
      }
    });
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
        this.popularRoutes = ['Mumbai-Pune', 'Delhi-Jaipur', 'Bangalore-Chennai', 'Lamjung-Pokhara', 'Kathmandu-Pokhara'];
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
        // Extract operators from buses if API fails
        if (this.buses.length > 0) {
          // FIXED: Filter out undefined values and ensure type safety
          const uniqueOps: string[] = this.buses
            .map(b => b.operator)
            .filter((op): op is string => !!op);
          this.operators = [...new Set(uniqueOps)];
        }
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

    this.busService.searchBuses(this.searchCriteria).subscribe({
      next: (response: SearchResponse) => {
        if (response.success) {
          this.buses = response.data || [];
          this.filteredBuses = [...this.buses];
          
          // FIXED: Extract unique operators from search results with proper type filtering
          if (this.buses.length > 0) {
            const uniqueOps: string[] = this.buses
              .map(b => b.operator)
              .filter((op): op is string => !!op);
            this.operators = [...new Set(uniqueOps)];
          }
          
          if (this.buses.length === 0) {
            this.searchMessage = `No buses found from ${this.searchCriteria.from} to ${this.searchCriteria.to} on ${this.searchCriteria.date}`;
          } else {
            this.searchMessage = `Found ${response.count} buses from ${this.searchCriteria.from} to ${this.searchCriteria.to}`;
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
        const price = bus.fare || 0;
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
      if (this.filters.operator !== 'all' && bus.operator !== this.filters.operator) {
        return false;
      }
      
      // Filter by seat layout
      if (this.filters.seatLayouts && this.filters.seatLayouts.length > 0) {
        if (!bus.seatLayout) return false;
        if (!this.filters.seatLayouts.includes(bus.seatLayout)) return false;
      }
      
      return true;
    });
    
    this.sortBuses();
  }

  sortBuses(): void {
    switch(this.sortBy) {
      case 'price':
        this.filteredBuses.sort((a, b) => (a.fare || 0) - (b.fare || 0));
        break;
      case 'price-desc':
        this.filteredBuses.sort((a, b) => (b.fare || 0) - (a.fare || 0));
        break;
      case 'departure':
        this.filteredBuses.sort((a, b) => {
          if (!a.departureTime) return 1;
          if (!b.departureTime) return -1;
          return a.departureTime.localeCompare(b.departureTime);
        });
        break;
      case 'rating':
        this.filteredBuses.sort((a, b) => {
          const ratingA = this.getRatingValue(a.rating);
          const ratingB = this.getRatingValue(b.rating);
          return ratingB - ratingA;
        });
        break;
      case 'seats':
        this.filteredBuses.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0));
        break;
      case 'duration':
        this.filteredBuses.sort((a, b) => {
          const durationA = a.duration ? parseInt(a.duration) || 0 : 0;
          const durationB = b.duration ? parseInt(b.duration) || 0 : 0;
          return durationA - durationB;
        });
        break;
    }
  }

  resetFilters(): void {
    this.filters = {
      busType: 'all',
      priceRange: 'all',
      departureTime: 'all',
      operator: 'all',
      seatLayouts: []
    };
    this.sortBy = 'departure';
    this.applyFilters();
  }

  isAnyFilterActive(): boolean {
    return this.filters.busType !== 'all' ||
           this.filters.priceRange !== 'all' ||
           this.filters.departureTime !== 'all' ||
           this.filters.operator !== 'all' ||
           this.filters.seatLayouts.length > 0;
  }

  filterBySeatLayout(layout: string, event: any): void {
    if (!this.filters.seatLayouts) {
      this.filters.seatLayouts = [];
    }
    
    if (event.target.checked) {
      this.filters.seatLayouts.push(layout);
    } else {
      this.filters.seatLayouts = this.filters.seatLayouts.filter((l: string) => l !== layout);
    }
    
    this.applyFilters();
  }

  selectBus(bus: Bus): void {
    if (bus._id) {
      this.router.navigate(['/seat-selection', bus._id], {
        queryParams: { 
          from: this.searchCriteria.from,
          to: this.searchCriteria.to,
          date: this.searchCriteria.date,
          passengers: this.searchCriteria.passengers,
          fare: bus.fare,
          busNumber: bus.busNumber,
          busType: bus.busType,
          busName: bus.busName || bus.operator,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          duration: bus.duration,
          totalSeats: bus.totalSeats,
          availableSeats: bus.availableSeats,
          seatLayout: bus.seatLayout
        }
      });
    } else {
      console.error('Bus ID is missing');
      this.errorMessage = 'Invalid bus selection. Please try again.';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  getAmenityIcon(amenity: string): string {
    const icons: {[key: string]: string} = {
      'AC': '❄️',
      'WiFi': '📶',
      'Charging Point': '🔌',
      'Snacks': '🍪',
      'Blanket': '🧣',
      'Water Bottle': '💧',
      'Movie': '🎬',
      'GPS': '📍',
      'Reading Light': '💡',
      'Emergency Exit': '🚪',
      'First Aid': '🏥',
      'Fire Extinguisher': '🧯'
    };
    return icons[amenity] || '✓';
  }

  getStarsArray(rating: string | number | undefined): any[] {
    const numRating = this.getRatingValue(rating);
    return new Array(Math.floor(numRating));
  }

  // FIXED: Properly handle rating values
  getRatingValue(rating: string | number | undefined): number {
    if (!rating) return 0;
    if (typeof rating === 'string') {
      return parseFloat(rating) || 0;
    }
    return rating;
  }

  getFormattedRating(rating: string | number | undefined): string {
    if (!rating) return 'N/A';
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return numRating.toFixed(1);
  }

  getAvailableSeatsPercentage(bus: Bus): number {
    const available = bus.availableSeats || 0;
    const total = bus.totalSeats || 1;
    return (available / total) * 100;
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

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  swapLocations(): void {
    const temp = this.searchCriteria.from;
    this.searchCriteria.from = this.searchCriteria.to;
    this.searchCriteria.to = temp;
  }

}