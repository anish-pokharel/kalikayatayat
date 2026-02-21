import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface Bus {
  id: number;
  name: string;
  type: 'AC Sleeper' | 'AC Seater' | 'Non-AC Sleeper' | 'Non-AC Seater' | 'Luxury' | 'Volvo';
  operator: string;
  route: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  rating: number;
  amenities: string[];
  status: 'available' | 'full' | 'cancelled';
}

interface SearchCriteria {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

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
  popularRoutes: string[] = ['Delhi-Mumbai', 'Bangalore-Chennai', 'Mumbai-Pune', 'Delhi-Agra', 'Kolkata-Delhi'];
  
  searchCriteria: SearchCriteria = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  filters = {
    busType: 'all',
    priceRange: 'all',
    departureTime: 'all',
    operator: 'all'
  };
  
  sortBy: string = 'departure';
  
  showSearchResults: boolean = false;
  loading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadBuses();
  }

  loadBuses() {
    this.buses = [
      {
        id: 1,
        name: 'VRL Volvo AC Sleeper',
        type: 'AC Sleeper',
        operator: 'VRL Travels',
        route: 'Delhi-Mumbai',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '18:30',
        arrivalTime: '06:30',
        duration: '12h 00m',
        price: 1299,
        availableSeats: 12,
        totalSeats: 36,
        rating: 4.5,
        amenities: ['AC', 'Charging Point', 'Water Bottle', 'Blanket', 'Reading Light'],
        status: 'available'
      },
      {
        id: 2,
        name: 'SRS Luxury AC Seater',
        type: 'AC Seater',
        operator: 'SRS Travels',
        route: 'Delhi-Mumbai',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '20:00',
        arrivalTime: '08:00',
        duration: '12h 00m',
        price: 999,
        availableSeats: 0,
        totalSeats: 40,
        rating: 4.2,
        amenities: ['AC', 'Charging Point', 'Water Bottle', 'TV'],
        status: 'full'
      },
      {
        id: 3,
        name: 'Orange Tours Volvo',
        type: 'Volvo',
        operator: 'Orange Tours',
        route: 'Bangalore-Chennai',
        origin: 'Bangalore',
        destination: 'Chennai',
        departureTime: '22:00',
        arrivalTime: '05:00',
        duration: '7h 00m',
        price: 899,
        availableSeats: 8,
        totalSeats: 32,
        rating: 4.7,
        amenities: ['AC', 'Charging Point', 'Water Bottle', 'Blanket', 'Snacks'],
        status: 'available'
      },
      {
        id: 4,
        name: 'Kallada Non-AC Sleeper',
        type: 'Non-AC Sleeper',
        operator: 'Kallada Travels',
        route: 'Mumbai-Pune',
        origin: 'Mumbai',
        destination: 'Pune',
        departureTime: '23:30',
        arrivalTime: '03:00',
        duration: '3h 30m',
        price: 499,
        availableSeats: 15,
        totalSeats: 40,
        rating: 3.9,
        amenities: ['Charging Point', 'Water Bottle'],
        status: 'available'
      },
      {
        id: 5,
        name: 'City Express AC Sleeper',
        type: 'AC Sleeper',
        operator: 'City Express',
        route: 'Delhi-Agra',
        origin: 'Delhi',
        destination: 'Agra',
        departureTime: '07:00',
        arrivalTime: '11:00',
        duration: '4h 00m',
        price: 799,
        availableSeats: 5,
        totalSeats: 30,
        rating: 4.0,
        amenities: ['AC', 'Charging Point', 'Water Bottle'],
        status: 'available'
      }
    ];
    this.filteredBuses = [...this.buses];
  }

  searchBuses() {
    this.loading = true;
    this.showSearchResults = true;
    
    setTimeout(() => {
      this.filteredBuses = this.buses.filter(bus => {
        const matchesFrom = !this.searchCriteria.from || 
          bus.origin.toLowerCase().includes(this.searchCriteria.from.toLowerCase());
        const matchesTo = !this.searchCriteria.to || 
          bus.destination.toLowerCase().includes(this.searchCriteria.to.toLowerCase());
        return matchesFrom && matchesTo;
      });
      this.loading = false;
    }, 1000);
  }

  applyFilters() {
    this.filteredBuses = this.buses.filter(bus => {
      if (this.filters.busType !== 'all' && bus.type !== this.filters.busType) {
        return false;
      }
      
      if (this.filters.priceRange !== 'all') {
        const [min, max] = this.filters.priceRange.split('-').map(Number);
        if (max) {
          if (bus.price < min || bus.price > max) return false;
        } else {
          if (bus.price < min) return false;
        }
      }
      
      if (this.filters.departureTime !== 'all') {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        if (this.filters.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (this.filters.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (this.filters.departureTime === 'evening' && (hour < 18 || hour >= 24)) return false;
        if (this.filters.departureTime === 'night' && (hour >= 0 && hour < 6)) return false;
      }
      
      if (this.filters.operator !== 'all' && bus.operator !== this.filters.operator) {
        return false;
      }
      
      return true;
    });
    
    this.sortBuses();
  }

  sortBuses() {
    switch(this.sortBy) {
      case 'price':
        this.filteredBuses.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredBuses.sort((a, b) => b.price - a.price);
        break;
      case 'departure':
        this.filteredBuses.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'rating':
        this.filteredBuses.sort((a, b) => b.rating - a.rating);
        break;
      case 'seats':
        this.filteredBuses.sort((a, b) => b.availableSeats - a.availableSeats);
        break;
    }
  }

  resetFilters() {
    this.filters = {
      busType: 'all',
      priceRange: 'all',
      departureTime: 'all',
      operator: 'all'
    };
    this.sortBy = 'departure';
    this.filteredBuses = [...this.buses];
  }

  selectBus(bus: Bus) {
    this.router.navigate(['/seat-selection', bus.id]);
  }

  getBusTypeIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'AC Sleeper': '🛏️',
      'AC Seater': '💺',
      'Non-AC Sleeper': '🛏️',
      'Non-AC Seater': '💺',
      'Luxury': '⭐',
      'Volvo': '🚌'
    };
    return icons[type] || '🚌';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'available': return 'status-available';
      case 'full': return 'status-full';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getAvailableSeatsPercentage(bus: Bus): number {
    return (bus.availableSeats / bus.totalSeats) * 100;
  }
}