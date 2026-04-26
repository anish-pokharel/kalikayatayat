



import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
import { BusService } from '../../../services/bus.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

export interface Seat {
  id: number;
  number: string;
  row: number;
  column: string;
  price: number;
  status: 'available' | 'booked' | 'selected' | 'ladies' | 'occupied';
  isLadies?: boolean;
  tempSelected?: boolean;
  bookedBy?: string;
  bookingId?: string;
  seatType?: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle';
  passengerName?: string;
  passengerGender?: string;
}

export interface PassengerDetail {
  seatNumber: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;
  email?: string;
  idProof?: string;
  idProofNumber?: string;
}

export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  fare: number;
  distance?: number;
  amenities?: string[];
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private busService = inject(BusService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  busId: string = '';
  busDetails: any = null;
  currentUser: any = null;
  
  journeyDetails = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  tempSelectedSeats: Seat[] = [];
  
  boardingPoints: BoardingPoint[] = [];
  selectedBoardingPoint: BoardingPoint | null = null;
  
  maxSeats: number = 6;
  isMultiSelectMode: boolean = false;
  
  passengers: PassengerDetail[] = [];
  
  bookingSummary = {
    baseFare: 0,
    tax: 0,
    total: 0,
    gst: 0,
    boardingFare: 0
  };
  
  showPassengerModal: boolean = false;
  showPaymentModal: boolean = false;
  showLimitWarning: boolean = false;
  showBookingSuccess: boolean = false;
  
  isLoading: boolean = true;
  isBooking: boolean = false;
  isProcessingPayment: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  paymentError: string = '';
  bookingResponse: any = null;
  
  selectedPaymentMethod: string = 'cash';
  
  availablePaymentMethods = [
    { value: 'khalti', label: 'Khalti Wallet', icon: '💰' },
    { value: 'esewa', label: 'eSewa', icon: '💳' },
    { value: 'cash', label: 'Cash at Counter', icon: '💵' }
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.route.queryParams.subscribe(params => {
      if (params['from']) this.journeyDetails.from = params['from'];
      if (params['to']) this.journeyDetails.to = params['to'];
      if (params['date']) this.journeyDetails.date = params['date'];
      if (params['passengers']) {
        this.maxSeats = parseInt(params['passengers']);
        this.journeyDetails.passengers = parseInt(params['passengers']);
      }
      console.log('📋 Journey Details from query:', this.journeyDetails);
    });

    this.route.params.subscribe(params => {
      this.busId = params['id'];
      console.log('🆔 Bus ID from route:', this.busId);
      this.loadAllData();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async loadAllData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.loadBusDetails();
      await this.loadBookedSeats();
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading data:', error);
      this.errorMessage = 'Failed to load seat data. Using demo data.';
      this.generateDemoSeats();
      this.loadBoardingPoints(); // Make sure boarding points load for demo too
      this.isLoading = false;
    }
    this.cdr.detectChanges();
  }

  loadBusDetails(): Promise<void> {
    return new Promise((resolve) => {
      console.log(`📡 Loading bus details for ID: ${this.busId}`);
      
      this.http.get(`${environment.apiUrl}/buses/${this.busId}`).subscribe({
        next: (response: any) => {
          console.log('✅ Bus details response:', response);
          
          if (response && response.success === true && response.data) {
            this.busDetails = response.data;
            console.log('Bus details loaded:', this.busDetails);
            this.generateSeatsFromBusDetails();
            this.loadBoardingPoints(); // Load boarding points AFTER bus details
            resolve();
          } else if (response && response.data) {
            this.busDetails = response.data;
            this.generateSeatsFromBusDetails();
            this.loadBoardingPoints(); // Load boarding points AFTER bus details
            resolve();
          } else {
            console.warn('No bus details found, using demo data');
            this.generateDemoSeats();
            this.loadBoardingPoints();
            resolve();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error loading bus details:', error);
          this.busService.getBusForSeatSelection(this.busId).subscribe({
            next: (busResponse: any) => {
              if (busResponse && busResponse.data) {
                this.busDetails = busResponse.data;
                this.generateSeatsFromBusDetails();
                this.loadBoardingPoints();
              } else {
                this.generateDemoSeats();
                this.loadBoardingPoints();
              }
              resolve();
            },
            error: () => {
              this.generateDemoSeats();
              this.loadBoardingPoints();
              resolve();
            }
          });
        }
      });
    });
  }

  generateSeatsFromBusDetails(): void {
    const basePrice = this.busDetails?.fare || 800;
    const totalSeats = this.busDetails?.totalSeats || 32;
    const seatsPerRow = 4;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);
    
    this.seats = [];
    let seatId = 1;
    
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 0; col < seatsPerRow; col++) {
        const columnLetter = String.fromCharCode(65 + col);
        const seatNumber = `${row}${columnLetter}`;
        
        if (seatId > totalSeats) break;
        
        let seatType: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle' = 'passenger';
        let price = basePrice;
        let isLadies = false;
        
        if (row === 1 && col === 0) {
          seatType = 'driver';
          price = 0;
        } else {
          if (col === 0 || col === 3) {
            seatType = 'window';
            price = basePrice + 200;
          } else if (col === 1 || col === 2) {
            seatType = 'aisle';
            price = basePrice + 100;
          }
          
          if (row % 2 === 0 && (col === 1 || col === 3)) {
            isLadies = true;
          }
        }
        
        this.seats.push({
          id: seatId,
          number: seatNumber,
          row: row,
          column: columnLetter,
          price: price,
          status: seatType === 'driver' ? 'occupied' : 'available',
          isLadies: isLadies,
          seatType: seatType,
          tempSelected: false,
          bookedBy: undefined,
          bookingId: undefined
        });
        
        seatId++;
      }
    }
    
    console.log(`Generated ${this.seats.length} seats`);
  }

  async loadBookedSeats(): Promise<void> {
    return new Promise((resolve) => {
        const travelDate = this.journeyDetails.date;
        console.log(`📡 FETCHING booked seats for bus: ${this.busId} on date: ${travelDate}`);
        console.log(`📡 Full API URL: ${environment.apiUrl}/bookings/seats/available/${this.busId}/${travelDate}`);
        
        this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
            next: (response: any) => {
                console.log('✅ Booked seats response FULL:', JSON.stringify(response, null, 2));
                
                if (response && response.success === true) {
                    const bookedSeatsData = response.data;
                    console.log(`📊 Found ${bookedSeatsData?.length || 0} booked seats`);
                    
                    if (bookedSeatsData && bookedSeatsData.length > 0) {
                        console.log('Booked seat numbers:', bookedSeatsData.map((s: any) => s.seatNumber));
                        this.markBookedSeats(bookedSeatsData);
                    } else {
                        console.log('No booked seats found');
                    }
                } else {
                    console.warn('API returned unsuccessful response:', response);
                }
                resolve();
            },
            error: (error) => {
                console.error('❌ Error loading booked seats:', error);
                console.error('Error status:', error.status);
                console.error('Error message:', error.message);
                resolve();
            }
        });
    });
}
  markBookedSeats(seatsData: any[]): void {
    console.log('📋 Marking booked seats with data:', seatsData);
    
    if (!seatsData || seatsData.length === 0) {
      console.log('No booked seats to mark');
      return;
    }
    
    const bookedSeatNumbers = new Set<string>();
    
    seatsData.forEach((seat: any) => {
      const seatNumber = seat.seatNumber || seat.number;
      if (seatNumber) {
        bookedSeatNumbers.add(seatNumber.toString());
        console.log(`Found booked seat from API: ${seatNumber}`);
      }
    });
    
    console.log(`🔴 Booked seat numbers to mark:`, Array.from(bookedSeatNumbers));
    
    let markedCount = 0;
    this.seats.forEach(seat => {
      if (seat.seatType === 'driver') return;
      
      if (bookedSeatNumbers.has(seat.number)) {
        seat.status = 'booked';
        const bookingInfo = seatsData.find(b => (b.seatNumber === seat.number));
        if (bookingInfo) {
          seat.bookedBy = bookingInfo.passengerName || 'Another passenger';
          seat.bookingId = bookingInfo.bookingId;
        }
        markedCount++;
        console.log(`🔴 MARKED seat ${seat.number} as BOOKED`);
      } else {
        if (seat.status !== 'selected') {
          seat.status = 'available';
        }
      }
    });
    
    console.log(`✅ Marked ${markedCount} seats as booked`);
    this.cdr.detectChanges();
  }

  generateDemoSeats(): void {
    const basePrice = 800;
    const seatConfig = [
      { row: 1, col: 0, type: 'driver' as const, price: 0, number: 'DR', isLadies: false },
      { row: 1, col: 1, type: 'window' as const, price: basePrice + 200, number: '1A', isLadies: false },
      { row: 1, col: 2, type: 'window' as const, price: basePrice + 200, number: '1B', isLadies: false },
      { row: 1, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '1C', isLadies: false },
      { row: 2, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '2A', isLadies: true },
      { row: 2, col: 1, type: 'middle' as const, price: basePrice, number: '2B', isLadies: false },
      { row: 2, col: 2, type: 'middle' as const, price: basePrice, number: '2C', isLadies: false },
      { row: 2, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '2D', isLadies: false },
      { row: 3, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '3A', isLadies: true },
      { row: 3, col: 1, type: 'middle' as const, price: basePrice, number: '3B', isLadies: false },
      { row: 3, col: 2, type: 'middle' as const, price: basePrice, number: '3C', isLadies: false },
      { row: 3, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '3D', isLadies: false },
      { row: 4, col: 0, type: 'window' as const, price: basePrice + 200, number: '4A', isLadies: false },
      { row: 4, col: 1, type: 'middle' as const, price: basePrice, number: '4B', isLadies: false },
      { row: 4, col: 2, type: 'middle' as const, price: basePrice, number: '4C', isLadies: false },
      { row: 4, col: 3, type: 'window' as const, price: basePrice + 200, number: '4D', isLadies: false }
    ];
    
    this.seats = seatConfig.map((config, index) => ({
      id: index + 1,
      number: config.number,
      row: config.row,
      column: ['A', 'B', 'C', 'D'][config.col],
      price: config.price,
      status: config.type === 'driver' ? 'occupied' : 'available',
      isLadies: config.isLadies,
      seatType: config.type,
      tempSelected: false
    }));
    
    this.busDetails = {
      operator: 'Demo Travels',
      busName: 'HiAce Luxury',
      busNumber: 'DEMO-001',
      fare: 800,
      departureTime: '08:00 AM',
      arrivalTime: '02:30 PM'
    };
  }

  getRowNumbers(): number[] {
    const rows = [...new Set(this.seats.map(seat => seat.row))];
    return rows.sort((a, b) => a - b);
  }

  getSeatsByRow(row: number): Seat[] {
    return this.seats.filter(seat => seat.row === row && seat.seatType !== 'driver');
  }

  getRowLetter(row: number): string {
    return String.fromCharCode(64 + row);
  }

  loadBoardingPoints(): void {
    console.log('📍 Loading boarding points...');
    console.log('Bus details available:', !!this.busDetails);
    
    // Get departure time from bus details or use default
    const departureTime = this.busDetails?.departureTime || '08:00 AM';
    console.log('Departure time:', departureTime);
    
    // Create boarding points array
    const boardingPointsList: BoardingPoint[] = [
      { 
        id: '1', 
        name: 'Main Bus Terminal', 
        address: 'Central Bus Station, City Center', 
        time: departureTime, 
        fare: 0,
        distance: 0,
        amenities: ['Parking', 'Waiting Room', 'Ticket Counter']
      },
      { 
        id: '2', 
        name: 'City Center Mall', 
        address: 'MG Road, Near City Mall', 
        time: this.getAdjustedTime(departureTime, 15), 
        fare: 50,
        distance: 5,
        amenities: ['Shopping', 'Food Court']
      },
      { 
        id: '3', 
        name: 'Airport Junction', 
        address: 'Airport Road, Terminal 1', 
        time: this.getAdjustedTime(departureTime, 30), 
        fare: 100,
        distance: 12,
        amenities: ['Airport Shuttle']
      },
      { 
        id: '4', 
        name: 'Railway Station', 
        address: 'Station Road, East Gate', 
        time: this.getAdjustedTime(departureTime, 45), 
        fare: 80,
        distance: 8,
        amenities: ['Railway Connectivity']
      },
      { 
        id: '5', 
        name: 'Hospital Road', 
        address: 'Medical College Road, Main Gate', 
        time: this.getAdjustedTime(departureTime, 20), 
        fare: 60,
        distance: 6,
        amenities: ['Hospital Nearby']
      }
    ];
    
    this.boardingPoints = boardingPointsList;
    console.log(`✅ Loaded ${this.boardingPoints.length} boarding points:`, this.boardingPoints);
    
    // Set default selection to first boarding point
    if (this.boardingPoints.length > 0 && !this.selectedBoardingPoint) {
      this.selectedBoardingPoint = this.boardingPoints[0];
      console.log('Default boarding point selected:', this.selectedBoardingPoint);
    }
    
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  getAdjustedTime(time: string, minutesToAdd: number): string {
    if (!time) return '08:00 AM';
    
    try {
      // Parse time string (e.g., "08:00 AM" or "14:30")
      let hours = 0, minutes = 0, period = 'AM';
      
      if (time.includes(':')) {
        const parts = time.trim().split(' ');
        const timePart = parts[0];
        period = parts[1] || (parseInt(timePart.split(':')[0]) >= 12 ? 'PM' : 'AM');
        
        const [hourStr, minuteStr] = timePart.split(':');
        hours = parseInt(hourStr);
        minutes = parseInt(minuteStr);
      } else {
        hours = parseInt(time);
        period = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
      }
      
      // Convert to 24-hour format for calculation
      let totalMinutes = 0;
      if (period === 'PM' && hours !== 12) {
        totalMinutes = (hours + 12) * 60 + minutes;
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = 0 * 60 + minutes;
      } else {
        totalMinutes = hours * 60 + minutes;
      }
      
      // Add minutes
      totalMinutes += minutesToAdd;
      
      // Convert back to 12-hour format
      let newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      const newPeriod = newHours >= 12 ? 'PM' : 'AM';
      newHours = newHours % 12;
      newHours = newHours === 0 ? 12 : newHours;
      
      return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
    } catch (error) {
      console.error('Error adjusting time:', error);
      return time;
    }
  }

  toggleSeat(seat: Seat): void {
    if (seat.seatType === 'driver') {
      this.errorMessage = 'Driver seat is not available';
      this.clearErrorAfter(2);
      return;
    }
    
    if (seat.status === 'booked' || seat.status === 'occupied') {
      this.errorMessage = `❌ Seat ${seat.number} is already booked`;
      this.clearErrorAfter(2);
      return;
    }
    
    if (this.isMultiSelectMode) {
      if (seat.tempSelected) {
        seat.tempSelected = false;
        this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
      } else {
        if (this.selectedSeats.length + this.tempSelectedSeats.length + 1 > this.maxSeats) {
          this.showLimitWarning = true;
          setTimeout(() => this.showLimitWarning = false, 2000);
          return;
        }
        seat.tempSelected = true;
        this.tempSelectedSeats.push(seat);
      }
    } else {
      if (this.selectedSeats.length >= this.maxSeats) {
        this.showLimitWarning = true;
        setTimeout(() => this.showLimitWarning = false, 2000);
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
    this.cdr.detectChanges();
  }

  removeSelectedSeat(seat: Seat): void {
    seat.status = 'available';
    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  confirmMultiSelection(): void {
    if (this.tempSelectedSeats.length === 0) return;
    
    this.tempSelectedSeats.forEach(seat => {
      seat.status = 'selected';
      seat.tempSelected = false;
    });
    this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
    this.tempSelectedSeats = [];
    this.calculateTotal();
    this.isMultiSelectMode = false;
    this.cdr.detectChanges();
  }

  cancelMultiSelection(): void {
    this.tempSelectedSeats.forEach(seat => seat.tempSelected = false);
    this.tempSelectedSeats = [];
    this.cdr.detectChanges();
  }

  toggleMultiSelectMode(): void {
    this.isMultiSelectMode = !this.isMultiSelectMode;
    if (!this.isMultiSelectMode) this.cancelMultiSelection();
  }

  calculateTotal(): void {
    const baseFare = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const boardingFare = this.selectedBoardingPoint?.fare || 0;
    const subtotal = baseFare + boardingFare;
    const gst = subtotal * 0.05;
    this.bookingSummary = {
      baseFare: baseFare,
      tax: 0,
      gst: gst,
      total: subtotal + gst,
      boardingFare: boardingFare
    };
  }

  hasBoardingFare(): boolean {
    return (this.selectedBoardingPoint?.fare || 0) > 0;
  }

  getBoardingFare(): number {
    return this.selectedBoardingPoint?.fare || 0;
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.errorMessage = 'Please select at least one seat';
      this.clearErrorAfter(2);
      return;
    }
    
    if (!this.selectedBoardingPoint) {
      this.errorMessage = 'Please select a boarding point';
      this.clearErrorAfter(2);
      return;
    }
    
    this.preparePassengers();
    this.showPassengerModal = true;
    this.cdr.detectChanges();
  }

  preparePassengers(): void {
    const userData = this.authService.getCurrentUser();
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    const email = userData?.email || '';
    const phone = userData?.phone || '';
    const gender = userData?.gender || 'male';
    
    this.passengers = this.selectedSeats.map(seat => ({
      seatNumber: seat.number,
      name: `${firstName} ${lastName}`.trim() || 'Passenger',
      age: null,
      gender: gender,
      phone: phone,
      email: email,
      idProof: '',
      idProofNumber: ''
    }));
  }

  confirmAllPassengers(): void {
    const isValid = this.passengers.every(p => 
      p.name && p.name.trim() !== '' && 
      p.age !== null && p.age > 0 && p.age < 120 && 
      p.phone && p.phone.length === 10
    );
    
    if (!isValid) {
      this.errorMessage = 'Please fill all passenger details correctly';
      this.clearErrorAfter(3);
      return;
    }
    
    this.showPassengerModal = false;
    this.openPaymentModal();
    this.cdr.detectChanges();
  }

  openPaymentModal(): void {
    this.showPaymentModal = true;
    this.selectedPaymentMethod = 'cash';
    this.paymentError = '';
    this.cdr.detectChanges();
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentError = '';
    this.isProcessingPayment = false;
    this.cdr.detectChanges();
  }

  processPayment(): void {
    this.initiateCashPayment();
  }

  initiateCashPayment(): void {
    this.isProcessingPayment = true;
    
    const bookingData: BookingRequest = {
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
      taxAmount: Number(this.bookingSummary.gst),
      journeyDate: this.journeyDetails.date,
      paymentMethod: 'cash'
    };
    
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isProcessingPayment = false;
        this.showPaymentModal = false;
        
        if (response.success) {
          this.successMessage = 'Booking confirmed! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/booking-confirmation', response.data.bookingId]);
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Booking failed';
          this.clearErrorAfter(3);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isProcessingPayment = false;
        console.error('Booking error:', error);
        this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
        this.clearErrorAfter(3);
        this.cdr.detectChanges();
      }
    });
  }

  getSeatStatusClass(seat: Seat): string {
    if (seat.seatType === 'driver') return 'seat-driver';
    if (seat.tempSelected) return 'seat-temp';
    if (seat.status === 'selected') return 'seat-selected';
    if (seat.isLadies && seat.status === 'available') return 'seat-ladies';
    if (seat.status === 'booked' || seat.status === 'occupied') return 'seat-occupied';
    return 'seat-available';
  }

  getSeatTooltip(seat: Seat): string {
    if (seat.status === 'booked' || seat.status === 'occupied') {
      return `❌ Seat ${seat.number} is already booked`;
    }
    if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
    if (seat.isLadies) return `👩 Ladies Seat - ₹${seat.price}`;
    return `💺 Seat ${seat.number} - ₹${seat.price}`;
  }

  getOperatorName(): string {
    return this.busDetails?.operator || this.busDetails?.busName?.split(' ')[0] || 'Demo Travels';
  }

  getBusName(): string {
    return this.busDetails?.busName || 'Demo Bus';
  }

  getBusNumber(): string {
    return this.busDetails?.busNumber || 'DEMO-001';
  }

  getDepartureTime(): string {
    return this.busDetails?.departureTime || '08:00 AM';
  }

  getArrivalTime(): string {
    return this.busDetails?.arrivalTime || '02:30 PM';
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(seat => seat.number).join(', ');
  }

  areAllPassengersValid(): boolean {
    return this.passengers.every(p => 
      p.name && p.name.trim() !== '' && 
      p.age !== null && p.age > 0 && p.age < 120 && 
      p.phone && p.phone.length === 10
    );
  }

  testMarkBookedSeats(): void {
    const testBookedSeats = [
      { seatNumber: '2A', passengerName: 'Test User 1' },
      { seatNumber: '2D', passengerName: 'Test User 2' },
      { seatNumber: '3B', passengerName: 'Test User 3' }
    ];
    this.markBookedSeats(testBookedSeats);
    this.errorMessage = 'Test: Marked seats 2A, 2D, 3B as booked';
    setTimeout(() => this.errorMessage = '', 3000);
  }

  goBack(): void {
    this.router.navigate(['/bus-list'], {
      queryParams: {
        from: this.journeyDetails.from,
        to: this.journeyDetails.to,
        date: this.journeyDetails.date,
        passengers: this.maxSeats
      }
    });
  }

  clearErrorAfter(seconds: number): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, seconds * 1000);
  }
}