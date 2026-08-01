// import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { Subscription, forkJoin } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
// import { AuthService } from '../../../services/auth.service';
// import { environment } from '../../../../environments/environment';

// export interface Seat {
//   id: number;
//   number: string;
//   row: number;
//   column: number;
//   status: 'available' | 'booked' | 'selected';
//   price: number;
// }

// export interface PassengerDetail {
//   seatNumber: string;
//   name: string;
//   age: number | null;
//   gender: string;
//   phone: string;
//   email?: string;
// }

// @Component({
//   selector: 'app-seat-selection',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './seat-selection.component.html',
//   styleUrls: ['./seat-selection.component.css']
// })
// export class SeatSelectionComponent implements OnInit, OnDestroy {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private http = inject(HttpClient);
//   private cdr = inject(ChangeDetectorRef);
//   private bookingService = inject(BookingService);
//   private authService = inject(AuthService);

//   busId: string = '';
//   busDetails: any = null;
//   currentUser: any = null;
  
//   journeyDetails = {
//     from: '',
//     to: '',
//     date: new Date().toISOString().split('T')[0],
//     passengers: 1
//   };
  
//   seats: Seat[] = [];
//   selectedSeats: Seat[] = [];
  
//   boardingPoint: string = '';
//   boardingAddress: string = '';
//   boardingTime: string = '';
  
//   maxSeats: number = 6;
  
//   passengers: PassengerDetail[] = [];
  
//   bookingSummary = {
//     baseFare: 0,
//     total: 0
//   };
  
//   showPassengerModal: boolean = false;
//   showPaymentModal: boolean = false;
//   showLimitWarning: boolean = false;
  
//   isLoading: boolean = true;
//   isBooking: boolean = false;
//   isProcessingPayment: boolean = false;
//   errorMessage: string = '';
//   successMessage: string = '';
  
//   selectedPaymentMethod: string = 'cash';
  
//   availablePaymentMethods = [
//     { value: 'khalti', label: 'Khalti Wallet', icon: '💰' },
//     { value: 'esewa', label: 'eSewa', icon: '💳' },
//     { value: 'cash', label: 'Cash at Counter', icon: '💵' }
//   ];

//   rows: number = 10;
//   columns: number = 4;
//   seatPrice: number = 0;

//   private subscriptions: Subscription[] = [];

//   ngOnInit(): void {
//     console.log('🔵 SeatSelectionComponent initialized');
//     this.currentUser = this.authService.getCurrentUser();
    
//     // Subscribe to route params
//     const routeSub = this.route.params.subscribe(params => {
//       this.busId = params['id'];
//       console.log('🆔 Bus ID from route:', this.busId);
//     });
//     this.subscriptions.push(routeSub);
    
//     // Subscribe to query params
//     const querySub = this.route.queryParams.subscribe(params => {
//       console.log('📋 Query params received:', params);
      
//       // Journey details
//       if (params['from']) this.journeyDetails.from = params['from'];
//       if (params['to']) this.journeyDetails.to = params['to'];
//       if (params['date']) this.journeyDetails.date = params['date'];
//       if (params['passengers']) {
//         this.maxSeats = parseInt(params['passengers']);
//         this.journeyDetails.passengers = parseInt(params['passengers']);
//       }
      
//       // Get seat price from API
//       this.seatPrice = parseInt(params['fare']) || 1250;
      
//       // Build bus details
//       this.busDetails = {
//         _id: this.busId,
//         busNumber: params['busNumber'] || 'N/A',
//         busName: params['busName'] || 'Bus',
//         busType: params['busType'] || 'Standard',
//         operator: params['busName'] || 'TravelEase',
//         fare: this.seatPrice,
//         totalSeats: 40,
//         departureTime: params['departureTime'] || '08:00',
//         arrivalTime: params['arrivalTime'] || '17:00',
//         duration: params['duration'] || '9 hours',
//         origin: this.journeyDetails.from,
//         destination: this.journeyDetails.to
//       };
      
//       this.boardingTime = this.formatTimeDisplay(this.busDetails.departureTime);
      
//       console.log('Bus Details:', this.busDetails);
//       console.log('Seat Price:', this.seatPrice);
      
//       // Generate seats immediately
//       this.generateSeatLayout();
      
//       // Load booked seats if busId is available
//       if (this.busId && this.busId !== '') {
//         this.loadBookedSeats();
//       } else {
//         console.warn('⚠️ Bus ID not available yet');
//         // Set loading false even if no busId
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       }
//     });
//     this.subscriptions.push(querySub);
    
//     // Set a timeout to ensure loading stops even if something fails
//     setTimeout(() => {
//       if (this.isLoading) {
//         console.warn('⚠️ Loading timeout - forcing loading to stop');
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       }
//     }, 5000);
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }

//   generateSeatLayout(): void {
//     console.log('🎫 Generating seat layout...');
//     this.seats = [];
//     let seatId = 1;
    
//     // Generate 10 rows and 4 columns (40 seats)
//     for (let row = 1; row <= this.rows; row++) {
//       for (let col = 1; col <= this.columns; col++) {
//         const seatNumber = `${row}${this.getColumnLetter(col)}`;
        
//         this.seats.push({
//           id: seatId,
//           number: seatNumber,
//           row: row,
//           column: col,
//           status: 'available',
//           price: this.seatPrice
//         });
        
//         seatId++;
//       }
//     }
    
//     console.log(`✅ Generated ${this.seats.length} seats (${this.rows} rows x ${this.columns} columns)`);
//     this.cdr.detectChanges();
//   }

//   getColumnLetter(col: number): string {
//     const letters = ['A', 'B', 'C', 'D'];
//     return letters[col - 1] || String.fromCharCode(64 + col);
//   }

//   loadBookedSeats(): void {
//     if (!this.busId || this.busId === '') {
//       console.error('❌ Cannot load booked seats: busId is empty');
//       this.isLoading = false;
//       this.cdr.detectChanges();
//       return;
//     }
    
//     const travelDate = this.journeyDetails.date;
//     if (!travelDate) {
//       console.error('❌ Cannot load booked seats: travelDate is empty');
//       this.isLoading = false;
//       this.cdr.detectChanges();
//       return;
//     }
    
//     console.log(`📡 Fetching booked seats for bus: ${this.busId} on date: ${travelDate}`);
    
//     this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
//       next: (response: any) => {
//         console.log('✅ Booked seats response:', response);
        
//         if (response && response.success === true && response.data && response.data.length > 0) {
//           this.markBookedSeats(response.data);
//         } else {
//           console.log('No booked seats found');
//         }
        
//         // IMPORTANT: Stop loading here
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//       error: (error) => {
//         console.error('❌ Error loading booked seats:', error);
//         // Still stop loading even on error
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   markBookedSeats(seatsData: any[]): void {
//     if (!seatsData || seatsData.length === 0) return;
    
//     const bookedSeatNumbers = new Set<string>();
    
//     seatsData.forEach((seat: any) => {
//       const seatNumber = seat.seatNumber || seat.number;
//       if (seatNumber) {
//         bookedSeatNumbers.add(seatNumber.toString());
//         console.log(`Found booked seat: ${seatNumber}`);
//       }
//     });
    
//     let markedCount = 0;
//     this.seats.forEach(seat => {
//       if (bookedSeatNumbers.has(seat.number)) {
//         seat.status = 'booked';
//         markedCount++;
//         console.log(`🔴 Marked seat ${seat.number} as BOOKED`);
//       }
//     });
    
//     console.log(`✅ Marked ${markedCount} seats as booked`);
//     this.cdr.detectChanges();
//   }

//   getSeatsByRow(row: number): Seat[] {
//     return this.seats.filter(seat => seat.row === row);
//   }

//   toggleSeat(seat: Seat): void {
//     if (seat.status === 'booked') {
//       this.errorMessage = `❌ Seat ${seat.number} is already booked`;
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     if (seat.status === 'selected') {
//       this.removeSelectedSeat(seat);
//     } else {
//       if (this.selectedSeats.length >= this.maxSeats) {
//         this.showLimitWarning = true;
//         setTimeout(() => this.showLimitWarning = false, 2000);
//         return;
//       }
      
//       seat.status = 'selected';
//       this.selectedSeats.push(seat);
//       this.calculateTotal();
//     }
//     this.cdr.detectChanges();
//   }

//   removeSelectedSeat(seat: Seat): void {
//     seat.status = 'available';
//     this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
//     this.calculateTotal();
//     this.cdr.detectChanges();
//   }

//   calculateTotal(): void {
//     const baseFare = this.selectedSeats.length * this.seatPrice;
//     this.bookingSummary = {
//       baseFare: baseFare,
//       total: baseFare
//     };
//   }

//   proceedToBooking(): void {
//     if (this.selectedSeats.length === 0) {
//       this.errorMessage = 'Please select at least one seat';
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     if (!this.boardingPoint.trim()) {
//       this.errorMessage = 'Please enter your boarding point';
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     this.preparePassengers();
//     this.showPassengerModal = true;
//     this.cdr.detectChanges();
//   }

//   preparePassengers(): void {
//     const userData = this.authService.getCurrentUser();
//     const defaultName = userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : '';
//     const defaultPhone = userData?.phone || '';
//     const defaultEmail = userData?.email || '';
    
//     this.passengers = this.selectedSeats.map((seat, index) => ({
//       seatNumber: seat.number,
//       name: defaultName || `Passenger ${index + 1}`,
//       age: null,
//       gender: 'male',
//       phone: defaultPhone,
//       email: defaultEmail
//     }));
//   }

//   confirmAllPassengers(): void {
//     const isValid = this.passengers.every(p => 
//       p.name && p.name.trim() !== '' && 
//       p.age !== null && p.age > 0 && p.age < 120 && 
//       p.phone && p.phone.length === 10
//     );
    
//     if (!isValid) {
//       this.errorMessage = 'Please fill all passenger details correctly';
//       this.clearErrorAfter(3);
//       return;
//     }
    
//     this.showPassengerModal = false;
//     this.openPaymentModal();
//     this.cdr.detectChanges();
//   }

//   openPaymentModal(): void {
//     this.showPaymentModal = true;
//     this.selectedPaymentMethod = 'cash';
//     this.cdr.detectChanges();
//   }

//   closePaymentModal(): void {
//     this.showPaymentModal = false;
//     this.isProcessingPayment = false;
//     this.cdr.detectChanges();
//   }

//   processPayment(): void {
//     this.initiateCashPayment();
//   }

//   initiateCashPayment(): void {
//     this.isProcessingPayment = true;
    
//     const bookingData: BookingRequest = {
//       busId: this.busId,
//       seats: this.passengers.map(p => ({
//         seatNumber: p.seatNumber,
//         passengerName: p.name,
//         passengerAge: Number(p.age),
//         passengerGender: p.gender,
//         passengerPhone: p.phone,
//         passengerEmail: p.email || undefined
//       })),
//       totalAmount: Number(this.bookingSummary.total),
//       taxAmount: 0,
//       journeyDate: this.journeyDetails.date,
//       paymentMethod: 'cash'
//     };
    
//     this.bookingService.createBooking(bookingData).subscribe({
//       next: (response: ApiResponse<any>) => {
//         this.isProcessingPayment = false;
//         this.showPaymentModal = false;
        
//         if (response.success) {
//           this.successMessage = 'Booking confirmed! Redirecting...';
//           setTimeout(() => {
//             this.router.navigate(['/booking-confirmation', response.data.bookingId]);
//           }, 1500);
//         } else {
//           this.errorMessage = response.message || 'Booking failed';
//           this.clearErrorAfter(3);
//         }
//         this.cdr.detectChanges();
//       },
//       error: (error) => {
//         this.isProcessingPayment = false;
//         console.error('Booking error:', error);
//         this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
//         this.clearErrorAfter(3);
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   getSeatStatusClass(seat: Seat): string {
//     if (seat.status === 'selected') return 'seat-selected';
//     if (seat.status === 'booked') return 'seat-occupied';
//     return 'seat-available';
//   }

//   getSeatTooltip(seat: Seat): string {
//     if (seat.status === 'booked') return `❌ Seat ${seat.number} - Booked`;
//     if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
//     return `💺 Seat ${seat.number} - Available - ₹${seat.price}`;
//   }

//   formatTimeDisplay(time: string): string {
//     if (!time) return '08:00 AM';
    
//     if (time.includes(':')) {
//       const [hour, minute] = time.split(':');
//       let hourNum = parseInt(hour);
//       const period = hourNum >= 12 ? 'PM' : 'AM';
//       hourNum = hourNum % 12 || 12;
//       return `${hourNum}:${minute} ${period}`;
//     }
//     return time;
//   }

//   getOperatorName(): string {
//     return this.busDetails?.operator || this.busDetails?.busName || 'TravelEase';
//   }

//   getBusName(): string {
//     return this.busDetails?.busName || 'Bus';
//   }

//   getBusNumber(): string {
//     return this.busDetails?.busNumber || 'N/A';
//   }

//   getDepartureTime(): string {
//     return this.formatTimeDisplay(this.busDetails?.departureTime || '08:00');
//   }

//   getArrivalTime(): string {
//     return this.formatTimeDisplay(this.busDetails?.arrivalTime) || '--:--';
//   }

//   getDuration(): string {
//     return this.busDetails?.duration || 'N/A';
//   }

//   getSelectedSeatsList(): string {
//     return this.selectedSeats.map(seat => seat.number).join(', ');
//   }

//   getTotalSeats(): number {
//     return this.selectedSeats.length;
//   }

//   areAllPassengersValid(): boolean {
//     return this.passengers.every(p => 
//       p.name && p.name.trim() !== '' && 
//       p.age !== null && p.age > 0 && p.age < 120 && 
//       p.phone && p.phone.length === 10
//     );
//   }

//   goBack(): void {
//     this.router.navigate(['/bus-list'], {
//       queryParams: {
//         from: this.journeyDetails.from,
//         to: this.journeyDetails.to,
//         date: this.journeyDetails.date,
//         passengers: this.maxSeats
//       }
//     });
//   }

//   clearErrorAfter(seconds: number): void {
//     setTimeout(() => {
//       this.errorMessage = '';
//       this.cdr.detectChanges();
//     }, seconds * 1000);
//   }
// }











import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

// Declare KhaltiCheckout globally
declare const KhaltiCheckout: any;

export interface Seat {
  id: number;
  number: string;
  row: number;
  column: number;
  status: 'available' | 'booked' | 'selected';
  price: number;
}

export interface PassengerDetail {
  seatNumber: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;
  email?: string;
}

export interface KhaltiPaymentPayload {
  token: string;
  amount: string;
  idx: string;
  product_identity: string;
  transaction_id?: string;
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
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  // ============ BUS DATA ============
  busId: string = '';
  busDetails: any = null;
  currentUser: any = null;
  seatPrice: number = 0;
  
  // ============ JOURNEY DETAILS ============
  journeyDetails = {
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  };
  
  // ============ SEAT DATA ============
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  rows: number = 10;
  columns: number = 4;
  maxSeats: number = 6;
  
  // ============ BOARDING DATA ============
  boardingPoint: string = '';
  boardingAddress: string = '';
  boardingTime: string = '';
  
  // ============ PASSENGER DATA ============
  passengers: PassengerDetail[] = [];
  
  // ============ BOOKING SUMMARY ============
  bookingSummary = {
    baseFare: 0,
    total: 0
  };
  
  // ============ UI STATE ============
  showPassengerModal: boolean = false;
  showPaymentModal: boolean = false;
  showLimitWarning: boolean = false;
  isLoading: boolean = true;
  isBooking: boolean = false;
  isProcessingPayment: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // ============ PAYMENT DATA ============
  selectedPaymentMethod: string = 'cash';
  
  availablePaymentMethods = [
    { value: 'khalti', label: 'Khalti Wallet', icon: '💰', description: 'Pay with Khalti Wallet' },
    { value: 'esewa', label: 'eSewa', icon: '💳', description: 'Pay with eSewa' },
    { value: 'cash', label: 'Cash at Counter', icon: '💵', description: 'Pay at the counter' }
  ];

  // ============ KHALTI CONFIGURATION ============
  private khaltiConfig = {
    publicKey: "test_public_key_0275cc5e2bae42fb890536aae01e9e73",
    productIdentity: "",
    productName: "TravelEase Bus Ticket",
    productUrl: window.location.origin, // Use only origin, not full URL
    eventHandler: {
      onSuccess: (payload: any) => {
        console.log('✅ Khalti Payment Success:', payload);
        this.handleKhaltiSuccess(payload);
      },
      onError: (error: any) => {
        console.error('❌ Khalti Payment Error:', error);
        this.handleKhaltiError(error);
      },
      onClose: () => {
        console.log('Khalti widget closed');
        this.isProcessingPayment = false;
        this.cdr.detectChanges();
      }
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
  };

  private subscriptions: Subscription[] = [];

  // ============ LIFECYCLE HOOKS ============
  
  ngOnInit(): void {
    console.log('🔵 SeatSelectionComponent initialized');
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to route params
    const routeSub = this.route.params.subscribe(params => {
      this.busId = params['id'];
      console.log('🆔 Bus ID from route:', this.busId);
    });
    this.subscriptions.push(routeSub);
    
    // Subscribe to query params
    const querySub = this.route.queryParams.subscribe(params => {
      console.log('📋 Query params received:', params);
      
      // Journey details
      if (params['from']) this.journeyDetails.from = params['from'];
      if (params['to']) this.journeyDetails.to = params['to'];
      if (params['date']) this.journeyDetails.date = params['date'];
      if (params['passengers']) {
        this.maxSeats = parseInt(params['passengers']);
        this.journeyDetails.passengers = parseInt(params['passengers']);
      }
      
      // Get seat price from API
      this.seatPrice = parseInt(params['fare']) || 1250;
      
      // Build bus details
      this.busDetails = {
        _id: this.busId,
        busNumber: params['busNumber'] || 'N/A',
        busName: params['busName'] || 'Bus',
        busType: params['busType'] || 'Standard',
        operator: params['busName'] || 'TravelEase',
        fare: this.seatPrice,
        totalSeats: 40,
        departureTime: params['departureTime'] || '08:00',
        arrivalTime: params['arrivalTime'] || '17:00',
        duration: params['duration'] || '9 hours',
        origin: this.journeyDetails.from,
        destination: this.journeyDetails.to
      };
      
      this.boardingTime = this.formatTimeDisplay(this.busDetails.departureTime);
      
      console.log('Bus Details:', this.busDetails);
      console.log('Seat Price:', this.seatPrice);
      
      // Generate seats immediately
      this.generateSeatLayout();
      
      // Load booked seats if busId is available
      if (this.busId && this.busId !== '') {
        this.loadBookedSeats();
      } else {
        console.warn('⚠️ Bus ID not available yet');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    this.subscriptions.push(querySub);
    
    // Set a timeout to ensure loading stops even if something fails
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('⚠️ Loading timeout - forcing loading to stop');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ============ SEAT GENERATION ============
  
  generateSeatLayout(): void {
    console.log('🎫 Generating seat layout...');
    this.seats = [];
    let seatId = 1;
    
    // Generate rows x columns seats
    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.columns; col++) {
        const seatNumber = `${row}${this.getColumnLetter(col)}`;
        
        this.seats.push({
          id: seatId,
          number: seatNumber,
          row: row,
          column: col,
          status: 'available',
          price: this.seatPrice
        });
        
        seatId++;
      }
    }
    
    console.log(`✅ Generated ${this.seats.length} seats (${this.rows} rows x ${this.columns} columns)`);
    this.cdr.detectChanges();
  }

  getColumnLetter(col: number): string {
    const letters = ['A', 'B', 'C', 'D'];
    return letters[col - 1] || String.fromCharCode(64 + col);
  }

  // ============ BOOKED SEATS ============
  
  loadBookedSeats(): void {
    if (!this.busId || this.busId === '') {
      console.error('❌ Cannot load booked seats: busId is empty');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    
    const travelDate = this.journeyDetails.date;
    if (!travelDate) {
      console.error('❌ Cannot load booked seats: travelDate is empty');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    
    console.log(`📡 Fetching booked seats for bus: ${this.busId} on date: ${travelDate}`);
    
    this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
      next: (response: any) => {
        console.log('✅ Booked seats response:', response);
        
        if (response && response.success === true && response.data && response.data.length > 0) {
          this.markBookedSeats(response.data);
        } else {
          console.log('No booked seats found');
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading booked seats:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  markBookedSeats(seatsData: any[]): void {
    if (!seatsData || seatsData.length === 0) return;
    
    const bookedSeatNumbers = new Set<string>();
    
    seatsData.forEach((seat: any) => {
      const seatNumber = seat.seatNumber || seat.number;
      if (seatNumber) {
        bookedSeatNumbers.add(seatNumber.toString());
        console.log(`Found booked seat: ${seatNumber}`);
      }
    });
    
    let markedCount = 0;
    this.seats.forEach(seat => {
      if (bookedSeatNumbers.has(seat.number)) {
        seat.status = 'booked';
        markedCount++;
        console.log(`🔴 Marked seat ${seat.number} as BOOKED`);
      }
    });
    
    console.log(`✅ Marked ${markedCount} seats as booked`);
    this.cdr.detectChanges();
  }

  getSeatsByRow(row: number): Seat[] {
    return this.seats.filter(seat => seat.row === row);
  }

  // ============ SEAT SELECTION ============
  
  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked') {
      this.errorMessage = `❌ Seat ${seat.number} is already booked`;
      this.clearErrorAfter(2);
      return;
    }
    
    if (seat.status === 'selected') {
      this.removeSelectedSeat(seat);
    } else {
      if (this.selectedSeats.length >= this.maxSeats) {
        this.showLimitWarning = true;
        setTimeout(() => this.showLimitWarning = false, 2000);
        return;
      }
      
      seat.status = 'selected';
      this.selectedSeats.push(seat);
      this.calculateTotal();
    }
    this.cdr.detectChanges();
  }

  removeSelectedSeat(seat: Seat): void {
    seat.status = 'available';
    this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  // ============ CALCULATIONS ============
  
  calculateTotal(): void {
    const baseFare = this.selectedSeats.length * this.seatPrice;
    this.bookingSummary = {
      baseFare: baseFare,
      total: baseFare
    };
  }

  // ============ PASSENGER MANAGEMENT ============
  
  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.errorMessage = 'Please select at least one seat';
      this.clearErrorAfter(2);
      return;
    }
    
    if (!this.boardingPoint.trim()) {
      this.errorMessage = 'Please enter your boarding point';
      this.clearErrorAfter(2);
      return;
    }
    
    this.preparePassengers();
    this.showPassengerModal = true;
    this.cdr.detectChanges();
  }

  preparePassengers(): void {
    const userData = this.authService.getCurrentUser();
    const defaultName = userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : '';
    const defaultPhone = userData?.phone || '';
    const defaultEmail = userData?.email || '';
    const defaultGender = userData?.gender || 'male';
    
    this.passengers = this.selectedSeats.map((seat, index) => ({
      seatNumber: seat.number,
      name: defaultName || `Passenger ${index + 1}`,
      age: null,
      gender: defaultGender,
      phone: defaultPhone,
      email: defaultEmail
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

  areAllPassengersValid(): boolean {
    return this.passengers.every(p => 
      p.name && p.name.trim() !== '' && 
      p.age !== null && p.age > 0 && p.age < 120 && 
      p.phone && p.phone.length === 10
    );
  }

  // ============ PAYMENT MODAL ============
  
  openPaymentModal(): void {
    this.showPaymentModal = true;
    this.selectedPaymentMethod = 'cash';
    this.cdr.detectChanges();
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.isProcessingPayment = false;
    this.cdr.detectChanges();
  }

  // ============ KHALTI PAYMENT IMPLEMENTATION ============
  
  processPayment(): void {
    if (this.selectedPaymentMethod === 'khalti') {
      this.initiateKhaltiPayment();
    } else if (this.selectedPaymentMethod === 'esewa') {
      // Add eSewa implementation here
      this.errorMessage = 'eSewa payment coming soon!';
      this.clearErrorAfter(2);
    } else {
      this.initiateCashPayment();
    }
  }

  initiateKhaltiPayment(): void {
    // Check if KhaltiCheckout is available
    if (typeof KhaltiCheckout === 'undefined') {
      console.error('KhaltiCheckout is not loaded');
      this.errorMessage = 'Khalti payment service is not available. Please try again.';
      this.clearErrorAfter(3);
      return;
    }

    this.isProcessingPayment = true;
    const amountInPaise = Math.round(this.bookingSummary.total * 100);
    
    // Generate a unique product identity
    const productIdentity = `TRAVEL_${this.busId}_${Date.now()}`;
    
    // ============ FIX: SHORT URL ============
    // Use only the origin (base URL) to keep it under 200 characters
    // Khalti requires product_url to be less than 200 characters
    const baseUrl = window.location.origin;
    const shortProductUrl = baseUrl; // Just the base URL
    
    // Or use a short path if needed
    // const shortProductUrl = `${baseUrl}/booking`;
    
    console.log('📏 Product URL length:', shortProductUrl.length);
    console.log('🔗 Product URL:', shortProductUrl);
    
    // ============ FIX: SHORT PRODUCT NAME ============
    // Keep product name short (also has 200 char limit)
    const shortProductName = `TravelEase - ${this.selectedSeats.length} Seat(s)`;
    
    console.log('📏 Product Name length:', shortProductName.length);
    console.log('📝 Product Name:', shortProductName);
    
    // Configuration for Khalti
    const config = {
      publicKey: environment.khalti?.publicKey || "test_public_key_0275cc5e2bae42fb890536aae01e9e73",
      productIdentity: productIdentity,
      productName: shortProductName,
      productUrl: shortProductUrl,
      eventHandler: {
        onSuccess: (payload: any) => {
          console.log('✅ Khalti Payment Success:', payload);
          this.handleKhaltiSuccess(payload);
        },
        onError: (error: any) => {
          console.error('❌ Khalti Payment Error:', error);
          this.handleKhaltiError(error);
        },
        onClose: () => {
          console.log('Khalti widget closed');
          this.isProcessingPayment = false;
          this.cdr.detectChanges();
        }
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    try {
      const checkout = new KhaltiCheckout(config);
      checkout.show({ 
        amount: amountInPaise,
        product_identity: productIdentity,
        product_name: shortProductName,
        product_url: shortProductUrl
      });
    } catch (error) {
      console.error('Error initializing Khalti checkout:', error);
      this.isProcessingPayment = false;
      this.errorMessage = 'Failed to initialize Khalti payment. Please try again.';
      this.clearErrorAfter(3);
      this.cdr.detectChanges();
    }
  }

  handleKhaltiSuccess(payload: KhaltiPaymentPayload): void {
    console.log('✅ Khalti payment successful:', payload);
    
    this.isProcessingPayment = false;
    this.showPaymentModal = false;
    
    // Create booking with Khalti payment
    this.createBookingWithPayment('khalti', payload);
  }

  handleKhaltiError(error: any): void {
    console.error('❌ Khalti payment failed:', error);
    this.isProcessingPayment = false;
    
    // Check if user cancelled the payment
    if (error && error.message && error.message.includes('cancel')) {
      this.errorMessage = 'Payment cancelled. You can try again.';
    } else {
      this.errorMessage = 'Payment failed. Please try again or use another payment method.';
    }
    this.clearErrorAfter(4);
    this.cdr.detectChanges();
  }

  // ============ CASH PAYMENT ============
  
  initiateCashPayment(): void {
    this.isProcessingPayment = true;
    this.createBookingWithPayment('cash', null);
  }

  // ============ BOOKING CREATION ============
  
  createBookingWithPayment(paymentMethod: string, paymentPayload: KhaltiPaymentPayload | null): void {
    // Prepare booking data
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
      taxAmount: 0,
      journeyDate: this.journeyDetails.date,
      paymentMethod: paymentMethod,
      boardingPoint: this.boardingPoint,
      boardingAddress: this.boardingAddress
    };

    // Add payment details if Khalti
    if (paymentMethod === 'khalti' && paymentPayload) {
      (bookingData as any).paymentDetails = {
        token: paymentPayload.token,
        amount: paymentPayload.amount,
        idx: paymentPayload.idx,
        product_identity: paymentPayload.product_identity,
        transaction_id: paymentPayload.transaction_id || null
      };
    }

    console.log('📤 Creating booking with data:', bookingData);

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isProcessingPayment = false;
        this.showPaymentModal = false;
        
        console.log('✅ Booking response:', response);
        
        if (response.success) {
          this.successMessage = '✅ Booking confirmed! Redirecting...';
          this.cdr.detectChanges();
          
          setTimeout(() => {
            const bookingId = response.data?.bookingId || response.data?._id || response.data?.id;
            if (bookingId) {
              this.router.navigate(['/booking-confirmation', bookingId]);
            } else {
              this.router.navigate(['/booking-confirmation'], { 
                queryParams: { 
                  bookingId: response.data?.bookingId,
                  status: 'confirmed'
                }
              });
            }
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Booking failed. Please try again.';
          this.clearErrorAfter(3);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isProcessingPayment = false;
        console.error('❌ Booking error:', error);
        this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
        this.clearErrorAfter(3);
        this.cdr.detectChanges();
      }
    });
  }

  // ============ UTILITY METHODS ============

  getSeatStatusClass(seat: Seat): string {
    if (seat.status === 'selected') return 'seat-selected';
    if (seat.status === 'booked') return 'seat-occupied';
    return 'seat-available';
  }

  getSeatTooltip(seat: Seat): string {
    if (seat.status === 'booked') return `❌ Seat ${seat.number} - Booked`;
    if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
    return `💺 Seat ${seat.number} - Available - ₹${seat.price}`;
  }

  formatTimeDisplay(time: string): string {
    if (!time) return '08:00 AM';
    
    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }
    
    if (time.includes(':')) {
      const [hour, minute] = time.split(':');
      let hourNum = parseInt(hour);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      hourNum = hourNum % 12 || 12;
      return `${hourNum}:${minute.padStart(2, '0')} ${period}`;
    }
    return time;
  }

  getOperatorName(): string {
    return this.busDetails?.operator || this.busDetails?.busName || 'TravelEase';
  }

  getBusName(): string {
    return this.busDetails?.busName || 'Bus';
  }

  getBusNumber(): string {
    return this.busDetails?.busNumber || 'N/A';
  }

  getDepartureTime(): string {
    return this.formatTimeDisplay(this.busDetails?.departureTime || '08:00');
  }

  getArrivalTime(): string {
    return this.formatTimeDisplay(this.busDetails?.arrivalTime) || '--:--';
  }

  getDuration(): string {
    return this.busDetails?.duration || 'N/A';
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(seat => seat.number).join(', ');
  }

  getTotalSeats(): number {
    return this.selectedSeats.length;
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