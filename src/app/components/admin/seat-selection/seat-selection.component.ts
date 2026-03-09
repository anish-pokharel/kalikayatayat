import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BusService, Bus, BoardingPoint } from '../../../services/bus.service';
import { BookingService, Passenger, BookingRequest } from '../../../services/booking.service';
import { AuthService, User } from '../../../services/auth.service';

interface Seat {
  id: number;
  number: string;
  row: number;
  column: 'A' | 'B' | 'C' | 'D';
  price: number;
  status: 'available' | 'booked' | 'selected' | 'ladies';
  isLadies?: boolean;
  tempSelected?: boolean;
}

interface PassengerDetail {
  seatNumber: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;
  email?: string;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  busId: string = '';
  busDetails: Bus | null = null;
  currentUser: User | null = null;
  
  // Seats
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  tempSelectedSeats: Seat[] = [];
  
  // Boarding points
  boardingPoints: BoardingPoint[] = [];
  selectedBoardingPoint: BoardingPoint | null = null;
  
  maxSeats: number = 6;
  isMultiSelectMode: boolean = false;
  
  passengers: PassengerDetail[] = [];
  
  bookingSummary = {
    baseFare: 0,
    tax: 0,
    total: 0
  };
  
  showPassengerModal: boolean = false;
  showLimitWarning: boolean = false;
  showMultiSelectConfirm: boolean = false;
  
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  // Seat layout configuration
  seatsPerRow: number = 4;
  totalRows: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    this.route.params.subscribe(params => {
      this.busId = params['id'];
      this.loadBusDetails();
      this.loadBoardingPoints();
    });

    this.route.queryParams.subscribe(params => {
      if (params['passengers']) {
        this.maxSeats = parseInt(params['passengers']);
      }
    });
  }

  loadBusDetails() {
    this.isLoading = true;
    this.busService.getBusById(this.busId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.busDetails = response.data;
          this.generateSeats();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bus details:', error);
        this.errorMessage = 'Failed to load bus details';
        this.isLoading = false;
      }
    });
  }

  loadBoardingPoints() {
    this.busService.getBoardingPoints(this.busId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.boardingPoints = response.data;
          if (this.boardingPoints.length > 0) {
            this.selectedBoardingPoint = this.boardingPoints[0];
          }
        }
      },
      error: (error) => {
        console.error('Error loading boarding points:', error);
      }
    });
  }

  generateSeats() {
    if (!this.busDetails) return;

    const totalSeats = this.busDetails.totalSeats || 40;
    const basePrice = this.busDetails.fare || 1200;
    
    this.totalRows = Math.ceil(totalSeats / this.seatsPerRow);
    this.seats = [];

    for (let i = 1; i <= totalSeats; i++) {
      const row = Math.ceil(i / this.seatsPerRow);
      const columnIndex = (i - 1) % this.seatsPerRow;
      const column = this.getColumnLetter(columnIndex);
      
      // Determine if it's a ladies seat (e.g., every 5th seat)
      const isLadies = i % 5 === 0;
      
      // Randomly mark some seats as booked for demo
      const isBooked = Math.random() < 0.2;
      
      this.seats.push({
        id: i,
        number: `${row}${column}`,
        row: row,
        column: column,
        price: basePrice,
        status: isBooked ? 'booked' : (isLadies ? 'ladies' : 'available'),
        isLadies: isLadies,
        tempSelected: false
      });
    }
  }

  getColumnLetter(index: number): 'A' | 'B' | 'C' | 'D' {
    const columns: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    return columns[index];
  }

  getSeatsByRow(row: number): Seat[] {
    return this.seats.filter(seat => seat.row === row);
  }

  getRowNumbers(): number[] {
    return Array.from({ length: this.totalRows }, (_, i) => i + 1);
  }

  toggleSeat(seat: Seat) {
    if (seat.status === 'booked') return;

    if (seat.status === 'ladies' && this.currentUser?.gender !== 'female') {
      this.errorMessage = 'Ladies seats can only be booked by female passengers';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (this.isMultiSelectMode) {
      if (seat.tempSelected) {
        seat.tempSelected = false;
        this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
      } else {
        const totalAfterAdd = this.selectedSeats.length + this.tempSelectedSeats.length + 1;
        if (totalAfterAdd > this.maxSeats) {
          this.showLimitWarning = true;
          setTimeout(() => this.showLimitWarning = false, 3000);
          return;
        }
        seat.tempSelected = true;
        this.tempSelectedSeats.push(seat);
      }
    } else {
      if (this.selectedSeats.length >= this.maxSeats) {
        this.showLimitWarning = true;
        setTimeout(() => this.showLimitWarning = false, 3000);
        return;
      }

      if (seat.status === 'selected') {
        this.removeSelectedSeat(seat);
      } else {
        seat.status = 'selected';
        this.selectedSeats.push(seat);
        this.calculateTotal();
      }
    }
  }

  toggleMultiSelectMode() {
    this.isMultiSelectMode = !this.isMultiSelectMode;
    if (!this.isMultiSelectMode) {
      this.clearTempSelection();
    }
  }

  clearTempSelection() {
    this.tempSelectedSeats.forEach(seat => seat.tempSelected = false);
    this.tempSelectedSeats = [];
  }

  confirmMultiSelection() {
    if (this.tempSelectedSeats.length === 0) return;

    // Check ladies seats
    const hasInvalidLadies = this.tempSelectedSeats.some(s => 
      s.isLadies && this.currentUser?.gender !== 'female'
    );

    if (hasInvalidLadies) {
      this.errorMessage = 'Ladies seats can only be booked by female passengers';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.tempSelectedSeats.forEach(seat => {
      seat.status = 'selected';
      seat.tempSelected = false;
    });

    this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
    this.tempSelectedSeats = [];
    this.calculateTotal();
    this.isMultiSelectMode = false;
  }

  cancelMultiSelection() {
    this.clearTempSelection();
    this.showMultiSelectConfirm = false;
  }

  removeSelectedSeat(seat: Seat) {
    seat.status = 'available';
    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    this.calculateTotal();
  }

  calculateTotal() {
    const baseFare = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const tax = baseFare * 0.18;
    this.bookingSummary = {
      baseFare: baseFare,
      tax: tax,
      total: baseFare + tax
    };
  }

  proceedToBooking() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (!this.selectedBoardingPoint) {
      alert('Please select a boarding point');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      localStorage.setItem('pendingBooking', JSON.stringify({
        busId: this.busId,
        seats: this.selectedSeats.map(s => ({
          seatNumber: s.number,
          name: '',
          age: null,
          gender: 'male',
          phone: '',
          email: ''
        })),
        boardingPoint: this.selectedBoardingPoint,
        totalAmount: this.bookingSummary.total,
        taxAmount: this.bookingSummary.tax,
        journeyDate: this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0]
      }));
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    this.preparePassengers();
    this.showPassengerModal = true;
  }

  preparePassengers() {
    this.passengers = this.selectedSeats.map(seat => ({
      seatNumber: seat.number,
      name: this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : '',
      age: null,
      gender: this.currentUser?.gender || 'male',
      phone: this.currentUser?.phone || '',
      email: this.currentUser?.email || ''
    }));
  }

  confirmAllPassengers() {
    const isValid = this.passengers.every(p => 
      p.name && p.name.trim() !== '' && 
      p.age && p.age > 0 && p.age < 120 && 
      p.phone && p.phone.length === 10
    );

    if (!isValid) {
      alert('Please fill all passenger details correctly');
      return;
    }

    this.createBooking();
  }

createBooking() {
  this.isLoading = true;

  // Validate ages
  const hasValidAges = this.passengers.every(p => p.age !== null && p.age > 0);
  if (!hasValidAges) {
    this.isLoading = false;
    alert('Please enter valid age for all passengers');
    return;
  }

  // Validate boarding point
  if (!this.selectedBoardingPoint) {
    this.isLoading = false;
    alert('Please select a boarding point');
    return;
  }

  // Create booking data with proper typing
  const bookingData: any = {
    busId: this.busId,
    seats: this.passengers.map(p => ({
      seatNumber: p.seatNumber,
      passengerName: p.name,
      passengerAge: Number(p.age), // Convert to number explicitly
      passengerGender: p.gender,
      passengerPhone: p.phone,
      passengerEmail: p.email || undefined
    })),
    boardingPoint: this.selectedBoardingPoint,
    totalAmount: Number(this.bookingSummary.total),
    taxAmount: Number(this.bookingSummary.tax),
    journeyDate: this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0],
    paymentMethod: 'card'
  };

  this.bookingService.createBooking(bookingData).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      if (response.success) {
        this.successMessage = `Booking successful! ID: ${response.data.bookingId}`;
        setTimeout(() => {
          this.router.navigate(['/booking', response.data.booking._id]);
        }, 2000);
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Booking failed';
    }
  });
}
  getSeatStatusClass(seat: Seat): string {
    if (seat.tempSelected) return 'seat-temp-selected';
    if (seat.status === 'selected') return 'seat-selected';
    if (seat.status === 'ladies') return 'seat-ladies';
    if (seat.status === 'booked') return 'seat-booked';
    return 'seat-available';
  }

  getAvailableSeatsCount(): number {
    return this.seats.filter(s => s.status === 'available' || s.status === 'ladies').length;
  }

  getBookedSeatsCount(): number {
    return this.seats.filter(s => s.status === 'booked').length;
  }

  getLadiesSeatsCount(): number {
    return this.seats.filter(s => s.status === 'ladies').length;
  }

  getSelectedSeatsCount(): number {
    return this.selectedSeats.length;
  }

  getTempSelectedCount(): number {
    return this.tempSelectedSeats.length;
  }

  getRemainingSeatsCount(): number {
    return this.maxSeats - (this.selectedSeats.length + this.tempSelectedSeats.length);
  }

  goBack() {
    this.router.navigate(['/buses']);
  }

  updatePassenger(index: number, field: string, value: any) {
    if (this.passengers[index]) {
      (this.passengers[index] as any)[field] = value;
    }
  }
getSafeBusDetails() {
  return this.busDetails || {};
}
  areAllPassengersValid(): boolean {
    return this.passengers.every(p => 
      p.name && p.name.trim() !== '' && 
      p.age !== null && p.age > 0 && p.age < 120 && 
      p.phone && p.phone.length === 10
    );
  }
}