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
  status: 'available' | 'booked' | 'selected' | 'ladies' | 'occupied';
  isLadies?: boolean;
  tempSelected?: boolean;
  bookedBy?: string; // To track who booked the seat
  bookingId?: string; // Reference to booking
}

interface PassengerDetail {
  seatNumber: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;
  email?: string;
}

interface RouteStop {
  name: string;
  arrivalTime: string;
  departureTime: string;
  fare: number;
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
  occupiedSeats: Seat[] = []; // Track occupied seats from database
  
  // Boarding points from route stops
  boardingPoints: any[] = [];
  selectedBoardingPoint: any = null;
  
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
  showBookingSuccess: boolean = false;
  
  isLoading: boolean = true;
  isBooking: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  bookingResponse: any = null;

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
      this.loadOccupiedSeats(); // Load already booked seats
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
          // Load boarding points from route AFTER bus details are loaded
          if (this.busDetails && this.busDetails.routeId) {
            this.loadBoardingPointsFromRoute(this.busDetails.routeId);
          } else {
            this.setDefaultBoardingPoints();
          }
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

  // Load already occupied/booked seats from database
  loadOccupiedSeats() {
    this.busService.getBookedSeats(this.busId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.occupiedSeats = response.data.map((seat: any) => ({
            id: this.generateSeatId(seat.seatNumber),
            number: seat.seatNumber,
            status: 'occupied',
            bookedBy: seat.passengerName,
            bookingId: seat.bookingId
          }));
          
          // Update seats if they're already generated
          if (this.seats.length > 0) {
            this.updateSeatsWithOccupied();
          }
        }
      },
      error: (error) => {
        console.error('Error loading occupied seats:', error);
      }
    });
  }

  // Generate a numeric ID from seat number (e.g., "1A" -> 1)
  generateSeatId(seatNumber: string): number {
    const match = seatNumber.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Update seats array with occupied status
  updateSeatsWithOccupied() {
    this.occupiedSeats.forEach(occupied => {
      const seat = this.seats.find(s => s.number === occupied.number);
      if (seat) {
        seat.status = 'occupied';
        seat.bookedBy = occupied.bookedBy;
        seat.bookingId = occupied.bookingId;
      }
    });
  }

  loadBoardingPointsFromRoute(routeId: string) {
    console.log('Loading route stops for route:', routeId);
    
    this.busService.getRouteStops(routeId).subscribe({
      next: (response: any) => {
        console.log('Route stops response:', response);
        
        if (response.success && response.data) {
          // Clear existing boarding points
          this.boardingPoints = [];
          
          // Add origin as first boarding point
          if (this.busDetails && this.busDetails.origin) {
            this.boardingPoints.push({
              id: 'origin',
              name: this.busDetails.origin,
              time: this.busDetails.departureTime || '08:00',
              address: this.busDetails.origin + ' Bus Stand',
              city: this.busDetails.origin,
              fare: 0,
              isActive: true
            });
          }
          
          // Add stops from route
          const stops = response.data.stops || [];
          stops.forEach((stop: any, index: number) => {
            this.boardingPoints.push({
              id: `stop-${index}`,
              name: stop.name,
              time: stop.arrivalTime,
              address: stop.name,
              city: this.busDetails?.origin || '',
              fare: stop.fare || 0,
              isActive: true
            });
          });
          
          // Add destination as last boarding point
          if (this.busDetails && this.busDetails.destination) {
            this.boardingPoints.push({
              id: 'destination',
              name: this.busDetails.destination,
              time: this.busDetails.arrivalTime || '20:00',
              address: this.busDetails.destination + ' Bus Stand',
              city: this.busDetails.destination,
              fare: this.busDetails.fare || 0,
              isActive: true
            });
          }
          
          console.log('Final boarding points:', this.boardingPoints);
          
          // Select first boarding point by default
          if (this.boardingPoints.length > 0) {
            this.selectedBoardingPoint = this.boardingPoints[0];
          }
        } else {
          this.setDefaultBoardingPoints();
        }
      },
      error: (error) => {
        console.error('Error loading route stops:', error);
        this.setDefaultBoardingPoints();
      }
    });
  }

  setDefaultBoardingPoints() {
    console.log('Using default boarding points');
    this.boardingPoints = [
      {
        id: 1,
        name: this.busDetails?.origin || 'Main Bus Stand',
        time: this.busDetails?.departureTime || '08:00',
        address: this.busDetails?.origin || 'City Center',
        city: this.busDetails?.origin || 'City',
        fare: 0,
        isActive: true
      },
      {
        id: 2,
        name: this.busDetails?.destination || 'City Bus Stand',
        time: this.busDetails?.arrivalTime || '20:00',
        address: this.busDetails?.destination || 'City Center',
        city: this.busDetails?.destination || 'City',
        fare: this.busDetails?.fare || 0,
        isActive: true
      }
    ];
    this.selectedBoardingPoint = this.boardingPoints[0];
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
      
      // Initially set as available
      this.seats.push({
        id: i,
        number: `${row}${column}`,
        row: row,
        column: column,
        price: basePrice,
        status: isLadies ? 'ladies' : 'available',
        isLadies: isLadies,
        tempSelected: false
      });
    }
    
    // Update with occupied seats if any
    if (this.occupiedSeats.length > 0) {
      this.updateSeatsWithOccupied();
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
    // Don't allow selection of booked or occupied seats
    if (seat.status === 'booked' || seat.status === 'occupied') return;

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

  // createBooking() {
  //   this.isBooking = true;
  //   this.errorMessage = '';

  //   // Validate ages
  //   const hasValidAges = this.passengers.every(p => p.age !== null && p.age > 0);
  //   if (!hasValidAges) {
  //     this.isBooking = false;
  //     alert('Please enter valid age for all passengers');
  //     return;
  //   }

  //   // Validate boarding point
  //   if (!this.selectedBoardingPoint) {
  //     this.isBooking = false;
  //     alert('Please select a boarding point');
  //     return;
  //   }

  //   // Create booking data with proper typing
  //   const bookingData: any = {
  //     busId: this.busId,
  //     seats: this.passengers.map(p => ({
  //       seatNumber: p.seatNumber,
  //       passengerName: p.name,
  //       passengerAge: Number(p.age),
  //       passengerGender: p.gender,
  //       passengerPhone: p.phone,
  //       passengerEmail: p.email || undefined
  //     })),
  //     boardingPoint: {
  //       name: this.selectedBoardingPoint.name,
  //       time: this.selectedBoardingPoint.time,
  //       address: this.selectedBoardingPoint.address,
  //       fare: this.selectedBoardingPoint.fare
  //     },
  //     totalAmount: Number(this.bookingSummary.total),
  //     taxAmount: Number(this.bookingSummary.tax),
  //     journeyDate: this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0],
  //     paymentMethod: 'card'
  //   };

  //   this.bookingService.createBooking(bookingData).subscribe({
  //     next: (response: any) => {
  //       this.isBooking = false;
  //       if (response.success) {
  //         // Mark selected seats as occupied
  //         this.markSeatsAsOccupied(response.data);
          
  //         this.successMessage = `Booking successful! ID: ${response.data.bookingId}`;
  //         this.showBookingSuccess = true;
  //         this.bookingResponse = response.data;
          
  //         // Close passenger modal
  //         this.showPassengerModal = false;
          
  //         // Clear selections
  //         this.selectedSeats = [];
  //         this.tempSelectedSeats = [];
  //         this.passengers = [];
  //         this.calculateTotal();
          
  //         // Show success message for 3 seconds then navigate
  //         setTimeout(() => {
  //           this.showBookingSuccess = false;
  //           this.router.navigate(['/booking', response.data.booking._id]);
  //         }, 3000);
  //       }
  //     },
  //     error: (error) => {
  //       this.isBooking = false;
  //       console.error('Booking error:', error);
  //       this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
  //     }
  //   });
  // }
createBooking() {
  this.isBooking = true;
  this.errorMessage = '';

  // Validate ages
  const hasValidAges = this.passengers.every(p => p.age !== null && p.age > 0);
  if (!hasValidAges) {
    this.isBooking = false;
    alert('Please enter valid age for all passengers');
    return;
  }

  // Validate boarding point
  if (!this.selectedBoardingPoint) {
    this.isBooking = false;
    alert('Please select a boarding point');
    return;
  }

  // Create booking data matching backend expected structure
  const bookingData = {
    busId: this.busId,
    seats: this.passengers.map(p => ({
      seatNumber: p.seatNumber,
      passengerName: p.name,
      passengerAge: Number(p.age),
      passengerGender: p.gender,
      passengerPhone: p.phone,
      passengerEmail: p.email || undefined
    })),
    totalAmount: Number(this.bookingSummary.total),
    taxAmount: Number(this.bookingSummary.tax),
    journeyDate: this.route.snapshot.queryParams['date'] || new Date().toISOString().split('T')[0],
    paymentMethod: 'card'
    // REMOVED: boardingPoint from here - it should be separate
  };

  console.log('Sending booking data:', bookingData);

  this.bookingService.createBooking(bookingData).subscribe({
    next: (response: any) => {
      this.isBooking = false;
      if (response.success) {
        // Mark selected seats as occupied
        this.markSeatsAsOccupied(response.data);
        
        this.successMessage = `Booking successful! ID: ${response.data.bookingId}`;
        this.showBookingSuccess = true;
        this.bookingResponse = response.data;
        
        // Close passenger modal
        this.showPassengerModal = false;
        
        // Clear selections
        this.selectedSeats = [];
        this.tempSelectedSeats = [];
        this.passengers = [];
        this.calculateTotal();
        
        // Show success message for 3 seconds then navigate
        setTimeout(() => {
          this.showBookingSuccess = false;
          this.router.navigate(['/booking', response.data.booking._id]);
        }, 3000);
      }
    },
    error: (error) => {
      this.isBooking = false;
      console.error('Booking error:', error);
      this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
    }
  });
}

  // Mark seats as occupied after successful booking
  markSeatsAsOccupied(bookingData: any) {
    const bookedSeatNumbers = this.passengers.map(p => p.seatNumber);
    
    this.seats.forEach(seat => {
      if (bookedSeatNumbers.includes(seat.number)) {
        seat.status = 'occupied';
        seat.bookedBy = this.currentUser?.firstName + ' ' + this.currentUser?.lastName;
        seat.bookingId = bookingData.bookingId;
      }
    });
    
    // Also update the selectedSeats and tempSelectedSeats arrays
    this.selectedSeats = [];
    this.tempSelectedSeats = [];
  }

  getSeatStatusClass(seat: Seat): string {
    if (seat.tempSelected) return 'seat-temp-selected';
    if (seat.status === 'selected') return 'seat-selected';
    if (seat.status === 'ladies') return 'seat-ladies';
    if (seat.status === 'booked' || seat.status === 'occupied') return 'seat-occupied';
    return 'seat-available';
  }

  getAvailableSeatsCount(): number {
    return this.seats.filter(s => s.status === 'available' || s.status === 'ladies').length;
  }

  getBookedSeatsCount(): number {
    return this.seats.filter(s => s.status === 'booked' || s.status === 'occupied').length;
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