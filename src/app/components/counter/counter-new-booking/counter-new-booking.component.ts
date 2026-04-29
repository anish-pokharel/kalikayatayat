import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

interface Bus {
  _id: string;
  busName: string;
  busNumber: string;
  totalSeats: number;
  busType: string;
  amenities: string[];
}

interface Route {
  _id: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  distance: number;
}

interface BusSchedule {
  _id: string;
  bus: Bus;
  route: Route;
  availableSeats: number;
  travelDate: string;
}

interface Seat {
  seatNumber: string;
  isAvailable: boolean;
  isLocked: boolean;
  seatType: string;
  price: number;
  gender?: string;
  passengerName?: string;
}

interface Passenger {
  name: string;
  seatNumber: string;
}

interface BookedSeat {
  seatNumber: string;
  passengerName: string;
  passengerPhone: string;
  bookingId: string;
  status: string;
}

@Component({
  selector: 'app-counter-new-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './counter-new-booking.component.html',
  styleUrls: ['./counter-new-booking.component.css']
})
export class CounterNewBookingComponent implements OnInit {
  isLoading = false;
  step = 1; // 1: Search, 2: Select Seats, 3: Passenger Details, 4: Payment
  
  // Search Data
  searchData = {
    source: '',
    destination: '',
    travelDate: ''
  };
  
  minDate: string = '';
  availableBuses: BusSchedule[] = [];
  selectedBus: BusSchedule | null = null;
  
  // Seat Selection
  seatRows: Seat[][] = [];
  selectedSeats: Seat[] = [];
  totalAmount: number = 0;
  
  // Passenger Details - Simplified (only names)
  passengers: Passenger[] = [];
  
  // Payment
  paymentMethod: string = 'cash';
  customerEmail: string = '';
  customerPhone: string = '';
  
  // Booking Reference
  bookingReference: string = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.searchData.travelDate = this.minDate;
  }
  
  ngOnInit(): void {
    if (!this.authService.isCounter()) {
      this.router.navigate(['/login']);
    }
  }
  
  searchBuses(): void {
    if (!this.searchData.source || !this.searchData.destination || !this.searchData.travelDate) {
      alert('Please fill all search fields');
      return;
    }
    
    this.isLoading = true;
    
    const params = {
      from: this.searchData.source,
      to: this.searchData.destination,
      date: this.searchData.travelDate,
      passengers: 1
    };
    
    this.http.get(`${environment.apiUrl}/buses/search`, { params })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.availableBuses = response.data.map((bus: any) => ({
              _id: bus._id,
              bus: {
                _id: bus._id,
                busName: bus.busName,
                busNumber: bus.busNumber,
                totalSeats: bus.totalSeats,
                busType: bus.busType,
                amenities: bus.amenities || []
              },
              route: {
                _id: bus.routeId,
                source: bus.origin,
                destination: bus.destination,
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime,
                duration: bus.duration,
                price: bus.fare,
                distance: bus.distance
              },
              availableSeats: bus.availableSeats,
              travelDate: this.searchData.travelDate
            }));
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching buses:', error);
          this.isLoading = false;
          alert('Error searching buses. Please try again.');
        }
      });
  }
  
  selectBus(bus: BusSchedule): void {
    this.selectedBus = bus;
    this.loadSeatLayout();
    this.step = 2;
  }
  
  loadSeatLayout(): void {
    if (!this.selectedBus) return;
    
    this.isLoading = true;
    
    const apiUrl = `${environment.apiUrl}/bookings/seats/available/${this.selectedBus._id}/${this.searchData.travelDate}`;
    
    this.http.get(apiUrl)
      .subscribe({
        next: (response: any) => {
          const bookedSeats = response.data || [];
          this.generateSeatLayout(this.selectedBus!.bus.totalSeats, bookedSeats, this.selectedBus!.route.price);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading seats:', error);
          this.generateSeatLayout(this.selectedBus!.bus.totalSeats, [], this.selectedBus!.route.price);
          this.isLoading = false;
          alert('Error loading seat layout. Showing all seats as available.');
        }
      });
  }
  
  generateSeatLayout(totalSeats: number, bookedSeats: BookedSeat[], basePrice: number): void {
    const seatsPerRow = 4;
    const allSeats: Seat[] = [];
    
    const bookedSeatNumbers = new Set(bookedSeats.map(seat => seat.seatNumber));
    const rows = Math.ceil(totalSeats / seatsPerRow);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
        
        if (allSeats.length >= totalSeats) break;
        
        let price = basePrice;
        let seatType = 'standard';
        
        if (col === 0 || col === 3) {
          seatType = 'window';
          price = price + 50;
        } else if (col === 1 || col === 2) {
          seatType = 'aisle';
          price = price + 30;
        }
        
        if (row < 2) {
          price = price + 100;
        }
        
        if (row > rows - 3) {
          price = price - 50;
        }
        
        const isBooked = bookedSeatNumbers.has(seatNumber);
        
        allSeats.push({
          seatNumber: seatNumber,
          isAvailable: !isBooked,
          isLocked: false,
          seatType: seatType,
          price: Math.round(price)
        });
      }
    }
    
    this.seatRows = [];
    for (let i = 0; i < allSeats.length; i += seatsPerRow) {
      this.seatRows.push(allSeats.slice(i, i + seatsPerRow));
    }
  }
  
  toggleSeat(seat: Seat): void {
    if (!seat.isAvailable) {
      alert('This seat is already booked!');
      return;
    }
    
    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    
    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }
    
    this.calculateTotalAmount();
  }
  
  isSeatSelected(seatNumber: string): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seatNumber);
  }
  
  calculateTotalAmount(): void {
    this.totalAmount = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }
  
  proceedToPassengerDetails(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    // Initialize passenger names only for selected seats
    this.passengers = this.selectedSeats.map(seat => ({
      name: '',
      seatNumber: seat.seatNumber
    }));
    
    this.step = 3;
  }
  
  addPassengerDetails(): void {
    // Validate passenger names
    for (let passenger of this.passengers) {
      if (!passenger.name || passenger.name.trim() === '') {
        alert(`Please enter name for passenger on seat ${passenger.seatNumber}`);
        return;
      }
    }
    
    // Validate contact number
    if (!this.customerPhone || this.customerPhone.trim() === '') {
      alert('Please enter contact number');
      return;
    }
    
    if (this.customerPhone.length < 10) {
      alert('Please enter a valid phone number (minimum 10 digits)');
      return;
    }
    
    this.step = 4;
  }
  
  processPayment(): void {
    if (!this.paymentMethod) {
      alert('Please select payment method');
      return;
    }
    
    this.isLoading = true;
    
    const bookingData = {
      busId: this.selectedBus?.bus._id,
      routeId: this.selectedBus?.route._id,
      journeyDate: this.searchData.travelDate,
      seats: this.selectedSeats.map((seat, index) => ({
        seatNumber: seat.seatNumber,
        passengerName: this.passengers[index]?.name || '',
        passengerAge: 18,
        passengerGender: 'other',
        passengerPhone: this.customerPhone,
        passengerEmail: this.customerEmail || ''
      })),
      totalAmount: this.totalAmount,
      taxAmount: 0,
      paymentMethod: this.paymentMethod,
      paymentDetails: {},
      boardingPoint: this.selectedBus?.route.source || ''
    };
    
    this.http.post(`${environment.apiUrl}/bookings/`, bookingData)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.bookingReference = response.data.bookingId;
          alert('Booking created successfully!');
          this.resetBooking();
          this.router.navigate(['/counter/dashboard']);
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.isLoading = false;
          alert(error.error?.message || 'Error creating booking. Please try again.');
        }
      });
  }
  
  resetBooking(): void {
    this.step = 1;
    this.selectedBus = null;
    this.selectedSeats = [];
    this.passengers = [];
    this.totalAmount = 0;
    this.customerPhone = '';
    this.customerEmail = '';
    this.searchData = {
      source: '',
      destination: '',
      travelDate: this.minDate
    };
    this.availableBuses = [];
  }
  
  goBack(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/counter/dashboard']);
    }
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  getSelectedSeatsString(): string {
    return this.selectedSeats.map(s => s.seatNumber).join(', ');
  }
  
  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}