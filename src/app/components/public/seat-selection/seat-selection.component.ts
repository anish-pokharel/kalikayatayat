// // // import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import { FormsModule } from '@angular/forms';
// // // import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// // // import { Subscription, firstValueFrom } from 'rxjs';
// // // import { HttpClient } from '@angular/common/http';
// // // import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
// // // import { BusService } from '../../../services/bus.service';
// // // import { AuthService } from '../../../services/auth.service';
// // // import { environment } from '../../../../environments/environment';

// // // export interface Seat {
// // //   id: number;
// // //   number: string;
// // //   row: number;
// // //   column: string;
// // //   price: number;
// // //   status: 'available' | 'booked' | 'selected' | 'ladies' | 'occupied';
// // //   isLadies?: boolean;
// // //   tempSelected?: boolean;
// // //   bookedBy?: string;
// // //   bookingId?: string;
// // //   seatType?: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle';
// // //   passengerName?: string;
// // //   passengerGender?: string;
// // // }

// // // export interface PassengerDetail {
// // //   seatNumber: string;
// // //   name: string;
// // //   age: number | null;
// // //   gender: string;
// // //   phone: string;
// // //   email?: string;
// // //   idProof?: string;
// // //   idProofNumber?: string;
// // // }

// // // export interface BoardingPoint {
// // //   id: string;
// // //   name: string;
// // //   address: string;
// // //   time: string;
// // //   fare: number;
// // //   distance?: number;
// // //   amenities?: string[];
// // // }

// // // @Component({
// // //   selector: 'app-seat-selection',
// // //   standalone: true,
// // //   imports: [CommonModule, FormsModule, RouterModule],
// // //   templateUrl: './seat-selection.component.html',
// // //   styleUrls: ['./seat-selection.component.css']
// // // })
// // // export class SeatSelectionComponent implements OnInit, OnDestroy {
// // //   private route = inject(ActivatedRoute);
// // //   private router = inject(Router);
// // //   private http = inject(HttpClient);
// // //   private cdr = inject(ChangeDetectorRef);
// // //   private busService = inject(BusService);
// // //   private bookingService = inject(BookingService);
// // //   private authService = inject(AuthService);

// // //   busId: string = '';
// // //   busDetails: any = null;
// // //   currentUser: any = null;
  
// // //   journeyDetails = {
// // //     from: '',
// // //     to: '',
// // //     date: new Date().toISOString().split('T')[0],
// // //     passengers: 1
// // //   };
  
// // //   seats: Seat[] = [];
// // //   selectedSeats: Seat[] = [];
// // //   tempSelectedSeats: Seat[] = [];
  
// // //   boardingPoints: BoardingPoint[] = [];
// // //   selectedBoardingPoint: BoardingPoint | null = null;
  
// // //   maxSeats: number = 6;
// // //   isMultiSelectMode: boolean = false;
  
// // //   passengers: PassengerDetail[] = [];
  
// // //   bookingSummary = {
// // //     baseFare: 0,
// // //     tax: 0,
// // //     total: 0,
// // //     gst: 0,
// // //     boardingFare: 0
// // //   };
  
// // //   showPassengerModal: boolean = false;
// // //   showPaymentModal: boolean = false;
// // //   showLimitWarning: boolean = false;
// // //   showBookingSuccess: boolean = false;
  
// // //   isLoading: boolean = true;
// // //   isBooking: boolean = false;
// // //   isProcessingPayment: boolean = false;
// // //   errorMessage: string = '';
// // //   successMessage: string = '';
// // //   paymentError: string = '';
// // //   bookingResponse: any = null;
  
// // //   selectedPaymentMethod: string = 'khalti';
  
// // //   availablePaymentMethods = [
// // //     { value: 'khalti', label: 'Khalti Wallet', icon: '💰' },
// // //     { value: 'esewa', label: 'eSewa', icon: '💳' },
// // //     { value: 'cash', label: 'Cash at Counter', icon: '💵' }
// // //   ];

// // //   khaltiConfig = {
// // //     publicKey: environment.khalti?.publicKey || 'test_public_key_0275cc5e2bae42fb890536aae01e9e73',
// // //     secretKey: environment.khalti?.secretKey || 'test_secret_key_68791341fdd94846a146f0457ff7b455',
// // //     returnUrl: environment.khalti?.returnUrl || `${window.location.origin}/payment-callback`,
// // //     websiteUrl: window.location.origin
// // //   };

// // //   khaltiPidx: string = '';
// // //   private subscriptions: Subscription[] = [];

// // //   ngOnInit(): void {
// // //     this.currentUser = this.authService.getCurrentUser();
    
// // //     this.route.queryParams.subscribe(params => {
// // //       if (params['from']) this.journeyDetails.from = params['from'];
// // //       if (params['to']) this.journeyDetails.to = params['to'];
// // //       if (params['date']) this.journeyDetails.date = params['date'];
// // //       if (params['passengers']) {
// // //         this.maxSeats = parseInt(params['passengers']);
// // //         this.journeyDetails.passengers = parseInt(params['passengers']);
// // //       }
// // //     });

// // //     this.route.params.subscribe(params => {
// // //       this.busId = params['id'];
// // //       this.loadAllData();
// // //     });

// // //     this.checkPaymentCallback();
// // //   }

// // //   ngOnDestroy(): void {
// // //     this.subscriptions.forEach(sub => sub.unsubscribe());
// // //   }

// // //   async loadAllData(): Promise<void> {
// // //     this.isLoading = true;
// // //     try {
// // //       // Load bus details and booked seats in parallel
// // //       await Promise.all([
// // //         this.loadBusDetailsAsync(),
// // //         this.loadBookedSeatsAsync()
// // //       ]);
// // //       this.isLoading = false;
// // //     } catch (error) {
// // //       console.error('Error loading data:', error);
// // //       this.errorMessage = 'Failed to load seat data. Please refresh.';
// // //       this.isLoading = false;
// // //     }
// // //     this.cdr.detectChanges();
// // //   }

// // //   async loadBusDetailsAsync(): Promise<void> {
// // //     return new Promise((resolve, reject) => {
// // //       this.busService.getBusById(this.busId).subscribe({
// // //         next: (response: any) => {
// // //           if (response.success && response.data) {
// // //             this.busDetails = response.data;
// // //             this.generateSeats();
// // //             this.loadBoardingPoints();
// // //             resolve();
// // //           } else {
// // //             this.generateDemoSeats();
// // //             this.loadBoardingPoints();
// // //             resolve();
// // //           }
// // //           this.cdr.detectChanges();
// // //         },
// // //         error: (error) => {
// // //           console.error('Error loading bus details:', error);
// // //           this.generateDemoSeats();
// // //           this.loadBoardingPoints();
// // //           resolve();
// // //         }
// // //       });
// // //     });
// // //   }

// // //   // async loadBookedSeatsAsync(): Promise<void> {
// // //   //   return new Promise((resolve) => {
// // //   //     const travelDate = this.journeyDetails.date;
// // //   //     this.busService.getBookedSeats(this.busId, travelDate).subscribe({
// // //   //       next: (response: any) => {
// // //   //         if (response.success && response.data) {
// // //   //           console.log('Booked seats from server:', response.data);
// // //   //           this.markBookedSeats(response.data);
// // //   //         }
// // //   //         resolve();
// // //   //       },
// // //   //       error: (error) => {
// // //   //         console.error('Error loading booked seats:', error);
// // //   //         resolve();
// // //   //       }
// // //   //     });
// // //   //   });
// // //   // }

// // //   // markBookedSeats(bookedSeatsData: any[]): void {
// // //   //   if (!bookedSeatsData || bookedSeatsData.length === 0) return;
    
// // //   //   // Create a Set of booked seat numbers for quick lookup
// // //   //   const bookedSeatNumbers = new Set<string>();
// // //   //   bookedSeatsData.forEach((seat: any) => {
// // //   //     const seatNumber = seat.seatNumber || seat.number;
// // //   //     if (seatNumber) {
// // //   //       bookedSeatNumbers.add(seatNumber);
// // //   //     }
// // //   //   });
    
// // //   //   console.log('Booked seat numbers:', Array.from(bookedSeatNumbers));
    
// // //   //   // Update seat status
// // //   //   this.seats.forEach(seat => {
// // //   //     if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
// // //   //       seat.status = 'booked';
// // //   //       seat.bookedBy = seat.passengerName || 'Another passenger';
// // //   //       console.log(`Marking seat ${seat.number} as BOOKED`);
// // //   //     }
// // //   //   });
    
// // //   //   this.cdr.detectChanges();
// // //   // }

// // //   generateSeats(): void {
// // //     const basePrice = this.busDetails?.fare || 800;
    
// // //     const seatConfig = [
// // //       { row: 1, col: 1, type: 'driver' as const, price: 0, number: 'DR', isLadies: false },
// // //       { row: 1, col: 2, type: 'window' as const, price: basePrice + 200, number: '1A', isLadies: false },
// // //       { row: 1, col: 3, type: 'window' as const, price: basePrice + 200, number: '1B', isLadies: false },
// // //       { row: 1, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '1C', isLadies: false },
// // //       { row: 2, col: 1, type: 'aisle' as const, price: basePrice + 100, number: '2A', isLadies: true },
// // //       { row: 2, col: 2, type: 'middle' as const, price: basePrice, number: '2B', isLadies: false },
// // //       { row: 2, col: 3, type: 'middle' as const, price: basePrice, number: '2C', isLadies: false },
// // //       { row: 2, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '2D', isLadies: false },
// // //       { row: 3, col: 1, type: 'aisle' as const, price: basePrice + 100, number: '3A', isLadies: true },
// // //       { row: 3, col: 2, type: 'middle' as const, price: basePrice, number: '3B', isLadies: false },
// // //       { row: 3, col: 3, type: 'middle' as const, price: basePrice, number: '3C', isLadies: false },
// // //       { row: 3, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '3D', isLadies: false },
// // //       { row: 4, col: 1, type: 'window' as const, price: basePrice + 200, number: '4A', isLadies: false },
// // //       { row: 4, col: 2, type: 'middle' as const, price: basePrice, number: '4B', isLadies: false },
// // //       { row: 4, col: 3, type: 'middle' as const, price: basePrice, number: '4C', isLadies: false },
// // //       { row: 4, col: 4, type: 'window' as const, price: basePrice + 200, number: '4D', isLadies: false }
// // //     ];
    
// // //     this.seats = seatConfig.map((config, index) => ({
// // //       id: index + 1,
// // //       number: config.number,
// // //       row: config.row,
// // //       column: this.getColumnLetter(config.col),
// // //       price: config.price,
// // //       status: config.type === 'driver' ? 'occupied' : 'available',
// // //       isLadies: config.isLadies,
// // //       seatType: config.type,
// // //       tempSelected: false
// // //     }));
    
// // //     console.log('Generated seats:', this.seats.map(s => ({ number: s.number, status: s.status })));
// // //   }

// // //   generateDemoSeats(): void {
// // //     const basePrice = 800;
    
// // //     const seatConfig = [
// // //       { row: 1, col: 1, type: 'driver' as const, price: 0, number: 'DR', isLadies: false },
// // //       { row: 1, col: 2, type: 'window' as const, price: basePrice + 200, number: '1A', isLadies: false },
// // //       { row: 1, col: 3, type: 'window' as const, price: basePrice + 200, number: '1B', isLadies: false },
// // //       { row: 1, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '1C', isLadies: false },
// // //       { row: 2, col: 1, type: 'aisle' as const, price: basePrice + 100, number: '2A', isLadies: true },
// // //       { row: 2, col: 2, type: 'middle' as const, price: basePrice, number: '2B', isLadies: false },
// // //       { row: 2, col: 3, type: 'middle' as const, price: basePrice, number: '2C', isLadies: false },
// // //       { row: 2, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '2D', isLadies: false },
// // //       { row: 3, col: 1, type: 'aisle' as const, price: basePrice + 100, number: '3A', isLadies: true },
// // //       { row: 3, col: 2, type: 'middle' as const, price: basePrice, number: '3B', isLadies: false },
// // //       { row: 3, col: 3, type: 'middle' as const, price: basePrice, number: '3C', isLadies: false },
// // //       { row: 3, col: 4, type: 'aisle' as const, price: basePrice + 100, number: '3D', isLadies: false },
// // //       { row: 4, col: 1, type: 'window' as const, price: basePrice + 200, number: '4A', isLadies: false },
// // //       { row: 4, col: 2, type: 'middle' as const, price: basePrice, number: '4B', isLadies: false },
// // //       { row: 4, col: 3, type: 'middle' as const, price: basePrice, number: '4C', isLadies: false },
// // //       { row: 4, col: 4, type: 'window' as const, price: basePrice + 200, number: '4D', isLadies: false }
// // //     ];
    
// // //     this.seats = seatConfig.map((config, index) => ({
// // //       id: index + 1,
// // //       number: config.number,
// // //       row: config.row,
// // //       column: this.getColumnLetter(config.col),
// // //       price: config.price,
// // //       status: config.type === 'driver' ? 'occupied' : 'available',
// // //       isLadies: config.isLadies,
// // //       seatType: config.type,
// // //       tempSelected: false
// // //     }));
    
// // //     this.busDetails = {
// // //       operator: 'Demo Travels',
// // //       busName: 'HiAce Luxury',
// // //       fare: 800,
// // //       departureTime: '08:00 AM',
// // //       arrivalTime: '02:30 PM'
// // //     };
// // //   }

// // //   getColumnLetter(col: number): string {
// // //     return ['A', 'B', 'C', 'D'][col - 1];
// // //   }

// // //   getRowLetter(row: number): string {
// // //     return ['A', 'B', 'C', 'D'][row - 1] || '';
// // //   }

// // //   getRowNumbers(): number[] {
// // //     return [1, 2, 3, 4];
// // //   }

// // //   getSeatsByRow(row: number): Seat[] {
// // //     return this.seats.filter(seat => seat.row === row && seat.seatType !== 'driver');
// // //   }

// // //   loadBoardingPoints(): void {
// // //     this.boardingPoints = [
// // //       { id: '1', name: 'Main Bus Stand', address: 'Station Road, City Center', time: this.busDetails?.departureTime || '08:00 AM', fare: 0 },
// // //       { id: '2', name: 'City Mall', address: 'MG Road, Near City Mall', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 15), fare: 50 },
// // //       { id: '3', name: 'Railway Station', address: 'Railway Station Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 30), fare: 75 },
// // //       { id: '4', name: 'Airport Junction', address: 'Airport Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 45), fare: 100 }
// // //     ];
// // //   }

// // //   getAdjustedTime(time: string, minutesToAdd: number): string {
// // //     if (!time) return '08:00 AM';
    
// // //     const [timeStr, period] = time.split(' ');
// // //     let [hourStr, minuteStr] = timeStr.split(':');
// // //     let hour = parseInt(hourStr);
// // //     let minute = parseInt(minuteStr);
    
// // //     if (period === 'PM' && hour !== 12) hour += 12;
// // //     if (period === 'AM' && hour === 12) hour = 0;
    
// // //     minute += minutesToAdd;
// // //     if (minute >= 60) {
// // //       hour += Math.floor(minute / 60);
// // //       minute = minute % 60;
// // //     }
    
// // //     const newPeriod = hour >= 12 ? 'PM' : 'AM';
// // //     hour = hour % 12;
// // //     hour = hour === 0 ? 12 : hour;
    
// // //     return `${hour}:${minute.toString().padStart(2, '0')} ${newPeriod}`;
// // //   }

// // //   toggleSeat(seat: Seat): void {
// // //     // Log for debugging
// // //     console.log(`Toggling seat ${seat.number}, current status: ${seat.status}`);
    
// // //     // Driver seat check
// // //     if (seat.seatType === 'driver') {
// // //       this.errorMessage = 'Driver seat is not available for booking';
// // //       this.clearErrorAfter(2);
// // //       return;
// // //     }
    
// // //     // CRITICAL: Check if seat is already booked
// // //     if (seat.status === 'booked' || seat.status === 'occupied') {
// // //       this.errorMessage = `❌ Seat ${seat.number} is already booked. Please select a different seat.`;
// // //       this.clearErrorAfter(3);
// // //       return;
// // //     }
    
// // //     // Ladies seat validation
// // //     if (seat.isLadies && this.currentUser?.gender !== 'female') {
// // //       this.errorMessage = '👩 Ladies seats can only be booked by female passengers';
// // //       this.clearErrorAfter(3);
// // //       return;
// // //     }
    
// // //     // Multi-select mode
// // //     if (this.isMultiSelectMode) {
// // //       if (seat.tempSelected) {
// // //         seat.tempSelected = false;
// // //         this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
// // //       } else {
// // //         const totalAfterAdd = this.selectedSeats.length + this.tempSelectedSeats.length + 1;
// // //         if (totalAfterAdd > this.maxSeats) {
// // //           this.showLimitWarning = true;
// // //           setTimeout(() => this.showLimitWarning = false, 3000);
// // //           return;
// // //         }
// // //         seat.tempSelected = true;
// // //         this.tempSelectedSeats.push(seat);
// // //       }
// // //     } else {
// // //       // Single select mode
// // //       if (this.selectedSeats.length >= this.maxSeats) {
// // //         this.showLimitWarning = true;
// // //         setTimeout(() => this.showLimitWarning = false, 3000);
// // //         return;
// // //       }
      
// // //       if (seat.status === 'selected') {
// // //         this.removeSelectedSeat(seat);
// // //       } else {
// // //         seat.status = 'selected';
// // //         this.selectedSeats.push(seat);
// // //         this.calculateTotal();
// // //       }
// // //     }
// // //     this.cdr.detectChanges();
// // //   }

// // //   removeSelectedSeat(seat: Seat): void {
// // //     seat.status = 'available';
// // //     this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
// // //     this.calculateTotal();
// // //     this.cdr.detectChanges();
// // //   }

// // //   confirmMultiSelection(): void {
// // //     if (this.tempSelectedSeats.length === 0) return;
    
// // //     // Check for any booked seats in temp selection
// // //     const hasBookedSeat = this.tempSelectedSeats.some(s => s.status === 'booked' || s.status === 'occupied');
// // //     if (hasBookedSeat) {
// // //       this.errorMessage = 'Some selected seats are no longer available. Please refresh.';
// // //       this.cancelMultiSelection();
// // //       this.clearErrorAfter(3);
// // //       return;
// // //     }
    
// // //     const hasInvalidLadies = this.tempSelectedSeats.some(s => s.isLadies && this.currentUser?.gender !== 'female');
// // //     if (hasInvalidLadies) {
// // //       this.errorMessage = 'Ladies seats can only be booked by female passengers';
// // //       this.clearErrorAfter(3);
// // //       return;
// // //     }
    
// // //     this.tempSelectedSeats.forEach(seat => {
// // //       seat.status = 'selected';
// // //       seat.tempSelected = false;
// // //     });
// // //     this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
// // //     this.tempSelectedSeats = [];
// // //     this.calculateTotal();
// // //     this.isMultiSelectMode = false;
// // //     this.cdr.detectChanges();
// // //   }

// // //   cancelMultiSelection(): void {
// // //     this.tempSelectedSeats.forEach(seat => seat.tempSelected = false);
// // //     this.tempSelectedSeats = [];
// // //     this.cdr.detectChanges();
// // //   }

// // //   toggleMultiSelectMode(): void {
// // //     this.isMultiSelectMode = !this.isMultiSelectMode;
// // //     if (!this.isMultiSelectMode) this.cancelMultiSelection();
// // //   }

// // //   calculateTotal(): void {
// // //     const baseFare = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
// // //     const boardingFare = this.selectedBoardingPoint?.fare || 0;
// // //     const subtotal = baseFare + boardingFare;
// // //     const gst = subtotal * 0.05;
// // //     this.bookingSummary = {
// // //       baseFare: baseFare,
// // //       tax: 0,
// // //       gst: gst,
// // //       total: subtotal + gst,
// // //       boardingFare: boardingFare
// // //     };
// // //   }

// // //   hasBoardingFare(): boolean {
// // //     return (this.selectedBoardingPoint?.fare || 0) > 0;
// // //   }

// // //   getBoardingFare(): number {
// // //     return this.selectedBoardingPoint?.fare || 0;
// // //   }

// // //   proceedToBooking(): void {
// // //     if (this.selectedSeats.length === 0) {
// // //       this.errorMessage = 'Please select at least one seat';
// // //       this.clearErrorAfter(2);
// // //       return;
// // //     }
    
// // //     // Final check for booked seats before proceeding
// // //     const nowBookedSeats = this.selectedSeats.filter(seat => seat.status === 'booked' || seat.status === 'occupied');
// // //     if (nowBookedSeats.length > 0) {
// // //       this.errorMessage = `Seat(s) ${nowBookedSeats.map(s => s.number).join(', ')} are no longer available. Please refresh.`;
// // //       nowBookedSeats.forEach(seat => this.removeSelectedSeat(seat));
// // //       this.clearErrorAfter(4);
// // //       return;
// // //     }
    
// // //     if (!this.selectedBoardingPoint) {
// // //       this.errorMessage = 'Please select a boarding point';
// // //       this.clearErrorAfter(2);
// // //       return;
// // //     }
    
// // //     this.preparePassengers();
// // //     this.showPassengerModal = true;
// // //     this.cdr.detectChanges();
// // //   }

// // //   preparePassengers(): void {
// // //     let userData = this.authService.getCurrentUser();
// // //     let firstName = '';
// // //     let lastName = '';
// // //     let email = '';
// // //     let phone = '';
// // //     let gender = 'male';
    
// // //     if (userData) {
// // //       firstName = userData.firstName || '';
// // //       lastName = userData.lastName || '';
// // //       email = userData.email || '';
// // //       phone = userData.phone || '';
// // //       gender = userData.gender || 'male';
// // //     }
    
// // //     this.passengers = this.selectedSeats.map(seat => ({
// // //       seatNumber: seat.number,
// // //       name: `${firstName} ${lastName}`.trim(),
// // //       age: null,
// // //       gender: gender,
// // //       phone: phone,
// // //       email: email,
// // //       idProof: '',
// // //       idProofNumber: ''
// // //     }));
// // //   }

// // //   confirmAllPassengers(): void {
// // //     const isValid = this.passengers.every(p => 
// // //       p.name && p.name.trim() !== '' && 
// // //       p.age !== null && p.age > 0 && p.age < 120 && 
// // //       p.phone && p.phone.length === 10
// // //     );
    
// // //     if (!isValid) {
// // //       this.errorMessage = 'Please fill all passenger details correctly';
// // //       this.clearErrorAfter(3);
// // //       return;
// // //     }
    
// // //     this.showPassengerModal = false;
// // //     this.openPaymentModal();
// // //     this.cdr.detectChanges();
// // //   }

// // //   openPaymentModal(): void {
// // //     this.showPaymentModal = true;
// // //     this.selectedPaymentMethod = 'khalti';
// // //     this.paymentError = '';
// // //     this.cdr.detectChanges();
// // //   }

// // //   closePaymentModal(): void {
// // //     this.showPaymentModal = false;
// // //     this.paymentError = '';
// // //     this.isProcessingPayment = false;
// // //     this.cdr.detectChanges();
// // //   }

// // //   processPayment(): void {
// // //     if (this.selectedPaymentMethod === 'khalti') {
// // //       this.initiateKhaltiPayment();
// // //     } else if (this.selectedPaymentMethod === 'esewa') {
// // //       this.initiateEsewaPayment();
// // //     } else {
// // //       this.initiateCashPayment();
// // //     }
// // //   }

// // //   initiateKhaltiPayment(): void {
// // //     this.isProcessingPayment = true;
// // //     this.paymentError = '';
    
// // //     const purchaseOrderId = `PO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// // //     const amountInPaisa = Math.round(this.bookingSummary.total * 100);
    
// // //     const firstPassenger = this.passengers[0];
// // //     const customerInfo = {
// // //       name: firstPassenger.name,
// // //       email: firstPassenger.email || this.currentUser?.email || 'customer@example.com',
// // //       phone: firstPassenger.phone || this.currentUser?.phone || '9800000000'
// // //     };
    
// // //     const bookingData = {
// // //       busId: this.busId,
// // //       seats: this.passengers.map(p => ({
// // //         seatNumber: p.seatNumber,
// // //         passengerName: p.name,
// // //         passengerAge: Number(p.age),
// // //         passengerGender: p.gender,
// // //         passengerPhone: p.phone,
// // //         passengerEmail: p.email || undefined
// // //       })),
// // //       passengers: this.passengers,
// // //       totalAmount: this.bookingSummary.total,
// // //       taxAmount: this.bookingSummary.gst,
// // //       journeyDate: this.journeyDetails.date,
// // //       boardingPoint: this.selectedBoardingPoint
// // //     };
    
// // //     const paymentData = {
// // //       return_url: `${window.location.origin}/payment-callback`,
// // //       website_url: window.location.origin,
// // //       amount: amountInPaisa,
// // //       purchase_order_id: purchaseOrderId,
// // //       purchase_order_name: `${this.getOperatorName()} - ${this.journeyDetails.from} to ${this.journeyDetails.to}`,
// // //       customer_info: customerInfo,
// // //       bookingData: bookingData
// // //     };
    
// // //     this.http.post(`${environment.apiUrl}/payments/khalti/initiate`, paymentData)
// // //       .subscribe({
// // //         next: (response: any) => {
// // //           if (response.success && response.data) {
// // //             localStorage.setItem('temp_booking', JSON.stringify(bookingData));
// // //             localStorage.setItem('khalti_pidx', response.data.pidx);
// // //             window.location.href = response.data.payment_url;
// // //           } else {
// // //             this.paymentError = response.message || 'Failed to initiate payment';
// // //             this.isProcessingPayment = false;
// // //             this.cdr.detectChanges();
// // //           }
// // //         },
// // //         error: (error) => {
// // //           console.error('Khalti initiation error:', error);
// // //           this.paymentError = error.error?.message || 'Failed to connect to payment gateway';
// // //           this.isProcessingPayment = false;
// // //           this.cdr.detectChanges();
// // //         }
// // //       });
// // //   }

// // //   initiateEsewaPayment(): void {
// // //     this.isProcessingPayment = true;
// // //     this.paymentError = '';
    
// // //     const amountInRupees = this.bookingSummary.total;
// // //     const purchaseOrderId = `PO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
// // //     const bookingData = {
// // //       busId: this.busId,
// // //       passengers: this.passengers,
// // //       totalAmount: this.bookingSummary.total,
// // //       taxAmount: this.bookingSummary.gst,
// // //       journeyDate: this.journeyDetails.date,
// // //       boardingPoint: this.selectedBoardingPoint,
// // //       purchaseOrderId: purchaseOrderId
// // //     };
// // //     localStorage.setItem('temp_booking', JSON.stringify(bookingData));
    
// // //     this.http.post(`${environment.apiUrl}/payments/esewa/initiate`, {
// // //       amount: amountInRupees,
// // //       purchase_order_id: purchaseOrderId,
// // //       product_name: `${this.getOperatorName()} - ${this.journeyDetails.from} to ${this.journeyDetails.to}`,
// // //       customer_info: {
// // //         name: this.passengers[0]?.name,
// // //         email: this.passengers[0]?.email,
// // //         phone: this.passengers[0]?.phone
// // //       }
// // //     }).subscribe({
// // //       next: (response: any) => {
// // //         if (response.success && response.data.payment_url) {
// // //           window.location.href = response.data.payment_url;
// // //         } else {
// // //           this.paymentError = response.message || 'Failed to initiate eSewa payment';
// // //           this.isProcessingPayment = false;
// // //           this.cdr.detectChanges();
// // //         }
// // //       },
// // //       error: (error) => {
// // //         console.error('eSewa initiation error:', error);
// // //         this.paymentError = 'Failed to connect to eSewa gateway. Please try again.';
// // //         this.isProcessingPayment = false;
// // //         this.cdr.detectChanges();
// // //       }
// // //     });
// // //   }

// // //   initiateCashPayment(): void {
// // //     this.isProcessingPayment = true;
    
// // //     const bookingData: BookingRequest = {
// // //       busId: this.busId,
// // //       seats: this.passengers.map(p => ({
// // //         seatNumber: p.seatNumber,
// // //         passengerName: p.name,
// // //         passengerAge: Number(p.age),
// // //         passengerGender: p.gender,
// // //         passengerPhone: p.phone,
// // //         passengerEmail: p.email || undefined
// // //       })),
// // //       totalAmount: Number(this.bookingSummary.total),
// // //       taxAmount: Number(this.bookingSummary.gst),
// // //       journeyDate: this.journeyDetails.date,
// // //       paymentMethod: 'cash'
// // //     };
    
// // //     this.bookingService.createBooking(bookingData).subscribe({
// // //       next: (response: ApiResponse<any>) => {
// // //         this.isProcessingPayment = false;
// // //         this.showPaymentModal = false;
        
// // //         if (response.success) {
// // //           this.markSeatsAsOccupied(response.data);
// // //           this.router.navigate(['/booking-confirmation', response.data.bookingId]);
// // //         } else {
// // //           this.errorMessage = response.message || 'Booking failed. Please try again.';
// // //           this.clearErrorAfter(3);
// // //         }
// // //         this.cdr.detectChanges();
// // //       },
// // //       error: (error) => {
// // //         this.isProcessingPayment = false;
// // //         console.error('Cash booking error:', error);
// // //         this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
// // //         this.clearErrorAfter(3);
// // //         this.cdr.detectChanges();
// // //       }
// // //     });
// // //   }

// // //   checkPaymentCallback(): void {
// // //     const urlParams = new URLSearchParams(window.location.search);
// // //     const pidx = urlParams.get('pidx');
// // //     const status = urlParams.get('status');
// // //     const transactionId = urlParams.get('transaction_id');
    
// // //     if (pidx && status === 'Completed') {
// // //       window.history.replaceState({}, document.title, window.location.pathname);
// // //       this.verifyKhaltiPayment(pidx, transactionId);
// // //     }
// // //   }

// // //   verifyKhaltiPayment(pidx: string, transactionId: string | null): void {
// // //     this.isProcessingPayment = true;
    
// // //     this.http.post(`${environment.apiUrl}/payments/khalti/verify`, { pidx, transactionId })
// // //       .subscribe({
// // //         next: (response: any) => {
// // //           if (response.success) {
// // //             const tempBooking = localStorage.getItem('temp_booking');
// // //             if (tempBooking) {
// // //               const bookingData = JSON.parse(tempBooking);
// // //               this.passengers = bookingData.passengers;
// // //               this.bookingSummary.total = bookingData.totalAmount;
// // //               this.bookingSummary.gst = bookingData.taxAmount;
// // //               this.journeyDetails.date = bookingData.journeyDate;
              
// // //               this.createBookingWithPayment('khalti', {
// // //                 pidx: pidx,
// // //                 transaction_id: transactionId,
// // //                 status: 'completed'
// // //               });
// // //             } else {
// // //               this.paymentError = 'Booking data not found. Please try again.';
// // //               this.isProcessingPayment = false;
// // //               this.router.navigate(['/bus-list']);
// // //             }
// // //           } else {
// // //             this.paymentError = 'Payment verification failed. Please contact support.';
// // //             this.isProcessingPayment = false;
// // //           }
// // //           this.cdr.detectChanges();
// // //         },
// // //         error: (error) => {
// // //           console.error('Payment verification error:', error);
// // //           this.paymentError = 'Payment verification failed. Please try again.';
// // //           this.isProcessingPayment = false;
// // //           this.cdr.detectChanges();
// // //         }
// // //       });
// // //   }

// // //   createBookingWithPayment(paymentMethod: string, paymentResponse: any): void {
// // //     this.isBooking = true;
    
// // //     const passengers = this.passengers.map(p => ({
// // //       seatNumber: p.seatNumber,
// // //       passengerName: p.name,
// // //       passengerAge: Number(p.age),
// // //       passengerGender: p.gender,
// // //       passengerPhone: p.phone,
// // //       passengerEmail: p.email || undefined
// // //     }));
    
// // //     const bookingData: BookingRequest = {
// // //       busId: this.busId,
// // //       seats: passengers,
// // //       totalAmount: Number(this.bookingSummary.total),
// // //       taxAmount: Number(this.bookingSummary.gst),
// // //       journeyDate: this.journeyDetails.date,
// // //       paymentMethod: paymentMethod
// // //     };
    
// // //     const bookingSub = this.bookingService.createBooking(bookingData).subscribe({
// // //       next: (response: ApiResponse<any>) => {
// // //         this.isBooking = false;
// // //         if (response.success) {
// // //           this.markSeatsAsOccupied(response.data);
// // //           this.router.navigate(['/booking-confirmation', response.data.bookingId]);
// // //           localStorage.removeItem('temp_booking');
// // //           localStorage.removeItem('khalti_pidx');
// // //         } else {
// // //           this.errorMessage = response.message || 'Booking failed. Please try again.';
// // //           this.clearErrorAfter(3);
// // //         }
// // //         this.cdr.detectChanges();
// // //       },
// // //       error: (error) => {
// // //         this.isBooking = false;
// // //         console.error('Booking error:', error);
// // //         this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
// // //         this.clearErrorAfter(3);
// // //         this.cdr.detectChanges();
// // //       }
// // //     });
    
// // //     this.subscriptions.push(bookingSub);
// // //   }

// // //   markSeatsAsOccupied(bookingData: any): void {
// // //     const bookedSeatNumbers = this.passengers.map(p => p.seatNumber);
// // //     this.seats.forEach(seat => {
// // //       if (bookedSeatNumbers.includes(seat.number)) {
// // //         seat.status = 'booked';
// // //         seat.bookedBy = this.currentUser?.firstName + ' ' + this.currentUser?.lastName;
// // //         seat.bookingId = bookingData._id || bookingData.bookingId;
// // //       }
// // //     });
// // //     this.selectedSeats = [];
// // //     this.tempSelectedSeats = [];
// // //   }

// // //   getSeatStatusClass(seat: Seat): string {
// // //     if (seat.seatType === 'driver') return 'seat-driver';
// // //     if (seat.tempSelected) return 'seat-temp';
// // //     if (seat.status === 'selected') return 'seat-selected';
// // //     if (seat.isLadies && seat.status === 'available') return 'seat-ladies';
// // //     if (seat.status === 'booked' || seat.status === 'occupied') return 'seat-occupied';
// // //     return 'seat-available';
// // //   }

// // //   getSeatTooltip(seat: Seat): string {
// // //     if (seat.status === 'booked' || seat.status === 'occupied') {
// // //       return `❌ Seat ${seat.number} is already booked${seat.bookedBy ? ` by ${seat.bookedBy}` : ''}`;
// // //     }
// // //     if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
// // //     if (seat.isLadies) return `👩 Ladies Seat - ₹${seat.price}`;
// // //     return `💺 Seat ${seat.number} - ₹${seat.price}`;
// // //   }

// // //   getOperatorName(): string {
// // //     return this.busDetails?.operator || this.busDetails?.busName?.split(' ')[0] || 'Demo Travels';
// // //   }

// // //   getSelectedSeatsList(): string {
// // //     return this.selectedSeats.map(seat => seat.number).join(', ');
// // //   }

// // //   areAllPassengersValid(): boolean {
// // //     return this.passengers.every(p => 
// // //       p.name && p.name.trim() !== '' && 
// // //       p.age !== null && p.age > 0 && p.age < 120 && 
// // //       p.phone && p.phone.length === 10
// // //     );
// // //   }

// // //   goBack(): void {
// // //     this.router.navigate(['/bus-list'], {
// // //       queryParams: {
// // //         from: this.journeyDetails.from,
// // //         to: this.journeyDetails.to,
// // //         date: this.journeyDetails.date,
// // //         passengers: this.maxSeats
// // //       }
// // //     });
// // //   }

// // //   clearErrorAfter(seconds: number): void {
// // //     setTimeout(() => {
// // //       this.errorMessage = '';
// // //       this.cdr.detectChanges();
// // //     }, seconds * 1000);
// // //   }
// // //   // In seat-selection.component.ts, update the loadBusDetails method:

// // // loadBusDetails(): void {
// // //   this.isLoading = true;
// // //   this.errorMessage = '';
  
// // //   // Use PUBLIC endpoint instead of admin endpoint
// // //   // Change from: this.busService.getBusById(this.busId)
// // //   // To: this.busService.getPublicBusById(this.busId)
  
// // //   const busSub = this.busService.getPublicBusById(this.busId).subscribe({
// // //     next: (response: any) => {
// // //       if (response.success && response.data) {
// // //         this.busDetails = response.data;
// // //         this.generateHiAceSeats();
// // //         this.loadBoardingPoints();
// // //         this.isLoading = false;
// // //       } else {
// // //         this.errorMessage = 'Bus details not found. Using demo data.';
// // //         this.generateDemoSeats();
// // //         this.loadBoardingPoints();
// // //         this.isLoading = false;
// // //       }
// // //       this.cdr.detectChanges();
// // //     },
// // //     error: (error) => {
// // //       console.error('Error loading bus details:', error);
// // //       this.errorMessage = 'Failed to load bus details. Using demo data.';
// // //       this.generateDemoSeats();
// // //       this.loadBoardingPoints();
// // //       this.isLoading = false;
// // //       this.cdr.detectChanges();
// // //     }
// // //   });
  
// // //   this.subscriptions.push(busSub);
// // // }
// // //   generateHiAceSeats() {
// // //     throw new Error('Method not implemented.');
// // //   }


// // //   // Update the loadBookedSeatsFromServer method:

// // // // loadBookedSeatsFromServer(): void {
// // // //   const travelDate = this.journeyDetails.date;
// // // //   console.log('Loading booked seats for bus:', this.busId, 'date:', travelDate);
  
// // // //   const seatsSub = this.busService.getBookedSeats(this.busId, travelDate).subscribe({
// // // //     next: (response: any) => {
// // // //       console.log('Booked seats response:', response);
      
// // // //       if (response.success && response.data) {
// // // //         // Mark seats as booked
// // // //         const bookedSeatNumbers = new Set<string>();
        
// // // //         response.data.forEach((seat: any) => {
// // // //           const seatNumber = seat.seatNumber || seat.number;
// // // //           if (seatNumber) {
// // // //             bookedSeatNumbers.add(seatNumber);
// // // //           }
// // // //         });
        
// // // //         console.log('Booked seat numbers:', Array.from(bookedSeatNumbers));
        
// // // //         // Update seat status
// // // //         this.seats.forEach(seat => {
// // // //           if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
// // // //             seat.status = 'booked';
// // // //             seat.bookedBy = seat.passengerName || 'Another passenger';
// // // //             console.log(`Marked seat ${seat.number} as BOOKED`);
// // // //           }
// // // //         });
        
// // // //         this.cdr.detectChanges();
// // // //       }
// // // //     },
// // // //     error: (error) => {
// // // //       console.error('Error loading booked seats:', error);
// // // //       // Don't show error to user, just continue with available seats
// // // //     }
// // // //   });
  
// // // //   this.subscriptions.push(seatsSub);
// // // // }

// // // // In seat-selection.component.ts



// // // markBookedSeats(seatsData: any[]): void {
// // //   console.log('📋 Marking booked seats with data:', seatsData);
  
// // //   if (!seatsData || seatsData.length === 0) {
// // //     console.log('No booked seats found');
// // //     return;
// // //   }
  
// // //   // Extract all booked seat numbers
// // //   const bookedSeatNumbers = new Set<string>();
// // //   seatsData.forEach((seat: any) => {
// // //     if (seat.seatNumber) {
// // //       bookedSeatNumbers.add(seat.seatNumber);
// // //     }
// // //     // Also check if seat data has different structure
// // //     if (seat.number) {
// // //       bookedSeatNumbers.add(seat.number);
// // //     }
// // //   });
  
// // //   console.log('🔴 Booked seat numbers found:', Array.from(bookedSeatNumbers));
  
// // //   // Update our local seats array
// // //   let bookedCount = 0;
// // //   this.seats.forEach(seat => {
// // //     if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
// // //       seat.status = 'booked';
// // //       seat.bookedBy = 'Another passenger'; // You can enhance this
// // //       bookedCount++;
// // //       console.log(`🔴 Marked seat ${seat.number} as BOOKED`);
// // //     }
// // //   });
  
// // //   console.log(`✅ Total ${bookedCount} seats marked as booked`);
// // //   this.cdr.detectChanges();
// // // }
// // // async loadBookedSeatsAsync(): Promise<void> {
// // //   return new Promise<void>((resolve) => {  // Explicitly type as Promise<void>
// // //     const travelDate = this.journeyDetails.date;
// // //     console.log('Loading booked seats for:', this.busId, 'on date:', travelDate);
    
// // //     this.busService.getBookedSeats(this.busId, travelDate).subscribe({
// // //       next: (response: any) => {
// // //         console.log('✅ Booked seats response from server:', response);
        
// // //         if (response.success && response.data && Array.isArray(response.data)) {
// // //           this.markBookedSeats(response.data);
// // //         } else {
// // //           console.warn('No booked seats data or invalid response:', response);
// // //         }
// // //         resolve();  // ✅ Just resolve() - no parameter needed
// // //       },
// // //       error: (error) => {
// // //         console.error('❌ Error loading booked seats:', error);
// // //         resolve();  // ✅ Continue even on error
// // //       }
// // //     });
// // //   });
// // // }
// // // }
// // import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// // import { Subscription } from 'rxjs';
// // import { HttpClient } from '@angular/common/http';
// // import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
// // import { BusService } from '../../../services/bus.service';
// // import { AuthService } from '../../../services/auth.service';
// // import { environment } from '../../../../environments/environment';

// // export interface Seat {
// //   id: number;
// //   number: string;
// //   row: number;
// //   column: string;
// //   price: number;
// //   status: 'available' | 'booked' | 'selected' | 'ladies' | 'occupied';
// //   isLadies?: boolean;
// //   tempSelected?: boolean;
// //   bookedBy?: string;
// //   bookingId?: string;
// //   seatType?: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle';
// //   passengerName?: string;
// //   passengerGender?: string;
// // }

// // export interface PassengerDetail {
// //   seatNumber: string;
// //   name: string;
// //   age: number | null;
// //   gender: string;
// //   phone: string;
// //   email?: string;
// //   idProof?: string;
// //   idProofNumber?: string;
// // }

// // export interface BoardingPoint {
// //   id: string;
// //   name: string;
// //   address: string;
// //   time: string;
// //   fare: number;
// //   distance?: number;
// //   amenities?: string[];
// // }

// // @Component({
// //   selector: 'app-seat-selection',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, RouterModule],
// //   templateUrl: './seat-selection.component.html',
// //   styleUrls: ['./seat-selection.component.css']
// // })
// // export class SeatSelectionComponent implements OnInit, OnDestroy {
// //   private route = inject(ActivatedRoute);
// //   private router = inject(Router);
// //   private http = inject(HttpClient);
// //   private cdr = inject(ChangeDetectorRef);
// //   private busService = inject(BusService);
// //   private bookingService = inject(BookingService);
// //   private authService = inject(AuthService);

// //   busId: string = '';
// //   busDetails: any = null;
// //   currentUser: any = null;
  
// //   journeyDetails = {
// //     from: '',
// //     to: '',
// //     date: new Date().toISOString().split('T')[0],
// //     passengers: 1
// //   };
  
// //   seats: Seat[] = [];
// //   selectedSeats: Seat[] = [];
// //   tempSelectedSeats: Seat[] = [];
  
// //   boardingPoints: BoardingPoint[] = [];
// //   selectedBoardingPoint: BoardingPoint | null = null;
  
// //   maxSeats: number = 6;
// //   isMultiSelectMode: boolean = false;
  
// //   passengers: PassengerDetail[] = [];
  
// //   bookingSummary = {
// //     baseFare: 0,
// //     tax: 0,
// //     total: 0,
// //     gst: 0,
// //     boardingFare: 0
// //   };
  
// //   showPassengerModal: boolean = false;
// //   showPaymentModal: boolean = false;
// //   showLimitWarning: boolean = false;
// //   showBookingSuccess: boolean = false;
  
// //   isLoading: boolean = true;
// //   isBooking: boolean = false;
// //   isProcessingPayment: boolean = false;
// //   errorMessage: string = '';
// //   successMessage: string = '';
// //   paymentError: string = '';
// //   bookingResponse: any = null;
  
// //   selectedPaymentMethod: string = 'cash';
  
// //   availablePaymentMethods = [
// //     { value: 'khalti', label: 'Khalti Wallet', icon: '💰' },
// //     { value: 'esewa', label: 'eSewa', icon: '💳' },
// //     { value: 'cash', label: 'Cash at Counter', icon: '💵' }
// //   ];

// //   private subscriptions: Subscription[] = [];

// //   ngOnInit(): void {
// //     this.currentUser = this.authService.getCurrentUser();
    
// //     this.route.queryParams.subscribe(params => {
// //       if (params['from']) this.journeyDetails.from = params['from'];
// //       if (params['to']) this.journeyDetails.to = params['to'];
// //       if (params['date']) this.journeyDetails.date = params['date'];
// //       if (params['passengers']) {
// //         this.maxSeats = parseInt(params['passengers']);
// //         this.journeyDetails.passengers = parseInt(params['passengers']);
// //       }
// //     });

// //     this.route.params.subscribe(params => {
// //       this.busId = params['id'];
// //       console.log('🆔 Bus ID from route:', this.busId);
// //       this.loadAllData();
// //     });
// //   }

// //   ngOnDestroy(): void {
// //     this.subscriptions.forEach(sub => sub.unsubscribe());
// //   }

// //   async loadAllData(): Promise<void> {
// //     this.isLoading = true;
// //     this.errorMessage = '';
    
// //     try {
// //       await this.loadBusDetails();
// //       await this.loadBookedSeats();
// //       this.isLoading = false;
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //       this.errorMessage = 'Failed to load seat data. Using demo data.';
// //       this.generateDemoSeats();
// //       this.isLoading = false;
// //     }
// //     this.cdr.detectChanges();
// //   }

// //   loadBusDetails(): Promise<void> {
// //     return new Promise((resolve) => {
// //       console.log(`📡 Loading bus details for ID: ${this.busId}`);
      
// //       this.busService.getBusForSeatSelection(this.busId).subscribe({
// //         next: (response: any) => {
// //           console.log('✅ Bus details response:', response);
          
// //           if (response && response.success === true && response.data) {
// //             this.busDetails = response.data;
// //             console.log('Bus details loaded:', this.busDetails);
// //             this.generateSeatsFromBusDetails();
// //             this.loadBoardingPoints();
// //             resolve();
// //           } else if (response && response.data) {
// //             this.busDetails = response.data;
// //             this.generateSeatsFromBusDetails();
// //             this.loadBoardingPoints();
// //             resolve();
// //           } else {
// //             console.warn('No bus details found, using demo data');
// //             this.generateDemoSeats();
// //             resolve();
// //           }
// //           this.cdr.detectChanges();
// //         },
// //         error: (error) => {
// //           console.error('❌ Error loading bus details:', error);
// //           this.generateDemoSeats();
// //           resolve();
// //         }
// //       });
// //     });
// //   }

// //   generateSeatsFromBusDetails(): void {
// //     const basePrice = this.busDetails?.fare || 800;
// //     const totalSeats = this.busDetails?.totalSeats || 32;
// //     const seatsPerRow = 4;
// //     const totalRows = Math.ceil(totalSeats / seatsPerRow);
    
// //     this.seats = [];
// //     let seatId = 1;
    
// //     for (let row = 1; row <= totalRows; row++) {
// //       for (let col = 0; col < seatsPerRow; col++) {
// //         const columnLetter = String.fromCharCode(65 + col);
// //         const seatNumber = `${row}${columnLetter}`;
        
// //         if (seatId > totalSeats) break;
        
// //         let seatType: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle' = 'passenger';
// //         let price = basePrice;
// //         let isLadies = false;
        
// //         if (row === 1 && col === 0) {
// //           seatType = 'driver';
// //           price = 0;
// //         } else {
// //           if (col === 0 || col === 3) {
// //             seatType = 'window';
// //             price = basePrice + 200;
// //           } else if (col === 1 || col === 2) {
// //             seatType = 'aisle';
// //             price = basePrice + 100;
// //           }
          
// //           if (row % 2 === 0 && (col === 1 || col === 3)) {
// //             isLadies = true;
// //           }
// //         }
        
// //         this.seats.push({
// //           id: seatId,
// //           number: seatNumber,
// //           row: row,
// //           column: columnLetter,
// //           price: price,
// //           status: seatType === 'driver' ? 'occupied' : 'available',
// //           isLadies: isLadies,
// //           seatType: seatType,
// //           tempSelected: false
// //         });
        
// //         seatId++;
// //       }
// //     }
    
// //     console.log(`Generated ${this.seats.length} seats`);
// //   }

// //   // loadBookedSeats(): Promise<void> {
// //   //   return new Promise((resolve) => {
// //   //     const travelDate = this.journeyDetails.date;
// //   //     console.log(`📡 FETCHING booked seats for bus: ${this.busId} on date: ${travelDate}`);
      
// //   //     this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
// //   //       next: (response: any) => {
// //   //         console.log('✅ Booked seats response:', response);
          
// //   //         let bookedSeatsData = null;
          
// //   //         if (response && response.success === true) {
// //   //           bookedSeatsData = response.data;
// //   //         } else if (response && response.data) {
// //   //           bookedSeatsData = response.data;
// //   //         } else if (Array.isArray(response)) {
// //   //           bookedSeatsData = response;
// //   //         }
          
// //   //         if (bookedSeatsData && Array.isArray(bookedSeatsData) && bookedSeatsData.length > 0) {
// //   //           console.log(`✅ Found ${bookedSeatsData.length} booked seats:`, bookedSeatsData);
// //   //           this.markBookedSeats(bookedSeatsData);
// //   //         } else {
// //   //           console.log('ℹ️ No booked seats found');
// //   //         }
// //   //         resolve();
// //   //       },
// //   //       error: (error) => {
// //   //         console.error('❌ Error loading booked seats:', error);
// //   //         resolve();
// //   //       }
// //   //     });
// //   //   });
// //   // }

// //   // markBookedSeats(seatsData: any[]): void {
// //   //   console.log('📋 Marking booked seats:', seatsData);
    
// //   //   if (!seatsData || seatsData.length === 0) return;
    
// //   //   const bookedSeatNumbers = new Set<string>();
    
// //   //   seatsData.forEach((seat: any) => {
// //   //     const seatNumber = seat.seatNumber || seat.number;
// //   //     if (seatNumber) {
// //   //       bookedSeatNumbers.add(seatNumber.toString());
// //   //       console.log(`Found booked seat: ${seatNumber}`);
// //   //     }
// //   //   });
    
// //   //   console.log(`🔴 Booked seat numbers:`, Array.from(bookedSeatNumbers));
    
// //   //   let markedCount = 0;
// //   //   this.seats.forEach(seat => {
// //   //     if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
// //   //       seat.status = 'booked';
// //   //       markedCount++;
// //   //       console.log(`🔴 MARKED seat ${seat.number} as BOOKED`);
// //   //     }
// //   //   });
    
// //   //   console.log(`✅ Marked ${markedCount} seats as booked`);
// //   //   this.cdr.detectChanges();
// //   // }

// //   generateDemoSeats(): void {
// //     const basePrice = 800;
// //     const seatConfig = [
// //       { row: 1, col: 0, type: 'driver' as const, price: 0, number: 'DR', isLadies: false },
// //       { row: 1, col: 1, type: 'window' as const, price: basePrice + 200, number: '1A', isLadies: false },
// //       { row: 1, col: 2, type: 'window' as const, price: basePrice + 200, number: '1B', isLadies: false },
// //       { row: 1, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '1C', isLadies: false },
// //       { row: 2, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '2A', isLadies: true },
// //       { row: 2, col: 1, type: 'middle' as const, price: basePrice, number: '2B', isLadies: false },
// //       { row: 2, col: 2, type: 'middle' as const, price: basePrice, number: '2C', isLadies: false },
// //       { row: 2, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '2D', isLadies: false },
// //       { row: 3, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '3A', isLadies: true },
// //       { row: 3, col: 1, type: 'middle' as const, price: basePrice, number: '3B', isLadies: false },
// //       { row: 3, col: 2, type: 'middle' as const, price: basePrice, number: '3C', isLadies: false },
// //       { row: 3, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '3D', isLadies: false },
// //       { row: 4, col: 0, type: 'window' as const, price: basePrice + 200, number: '4A', isLadies: false },
// //       { row: 4, col: 1, type: 'middle' as const, price: basePrice, number: '4B', isLadies: false },
// //       { row: 4, col: 2, type: 'middle' as const, price: basePrice, number: '4C', isLadies: false },
// //       { row: 4, col: 3, type: 'window' as const, price: basePrice + 200, number: '4D', isLadies: false }
// //     ];
    
// //     this.seats = seatConfig.map((config, index) => ({
// //       id: index + 1,
// //       number: config.number,
// //       row: config.row,
// //       column: ['A', 'B', 'C', 'D'][config.col],
// //       price: config.price,
// //       status: config.type === 'driver' ? 'occupied' : 'available',
// //       isLadies: config.isLadies,
// //       seatType: config.type,
// //       tempSelected: false
// //     }));
    
// //     this.busDetails = {
// //       operator: 'Demo Travels',
// //       busName: 'HiAce Luxury',
// //       busNumber: 'DEMO-001',
// //       fare: 800,
// //       departureTime: '08:00 AM',
// //       arrivalTime: '02:30 PM'
// //     };
// //   }

// //   getRowNumbers(): number[] {
// //     const rows = [...new Set(this.seats.map(seat => seat.row))];
// //     return rows.sort((a, b) => a - b);
// //   }

// //   getSeatsByRow(row: number): Seat[] {
// //     return this.seats.filter(seat => seat.row === row && seat.seatType !== 'driver');
// //   }

// //   getRowLetter(row: number): string {
// //     return String.fromCharCode(64 + row);
// //   }

// //   // loadBoardingPoints(): void {
// //   //   this.boardingPoints = [
// //   //     { id: '1', name: 'Main Bus Stand', address: 'Station Road', time: this.busDetails?.departureTime || '08:00 AM', fare: 0 },
// //   //     { id: '2', name: 'City Mall', address: 'MG Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 15), fare: 50 },
// //   //     { id: '3', name: 'Railway Station', address: 'Station Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 30), fare: 75 },
// //   //     { id: '4', name: 'Airport Junction', address: 'Airport Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 45), fare: 100 }
// //   //   ];
// //   // }

// //   // Replace the loadBoardingPoints method with this version that has default Bus Park
// // loadBoardingPoints(): void {
// //   // Default boarding point - Bus Park
// //   const defaultBoardingPoint: BoardingPoint = { 
// //     id: '0', 
// //     name: 'Bus Park (Main Terminal)', 
// //     address: 'Central Bus Terminal', 
// //     time: this.busDetails?.departureTime || '08:00 AM', 
// //     fare: 0,
// //     distance: 0,
// //     amenities: ['Parking', 'Waiting Lounge', 'Ticket Counter']
// //   };
  
// //   const additionalPoints: BoardingPoint[] = [
// //     { id: '1', name: 'City Center', address: 'Main Road, City Center', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 10), fare: 50, distance: 5 },
// //     { id: '2', name: 'Airport Junction', address: 'Airport Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 20), fare: 80, distance: 8 },
// //     { id: '3', name: 'Railway Station', address: 'Station Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 30), fare: 100, distance: 12 },
// //     { id: '4', name: 'Hospital Road', address: 'Medical College Road', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 15), fare: 60, distance: 6 }
// //   ];
  
// //   this.boardingPoints = [defaultBoardingPoint, ...additionalPoints];
  
// //   // Set default selection to Bus Park
// //   this.selectedBoardingPoint = this.boardingPoints[0];
// //   this.calculateTotal();
// // }

// // // Replace the loadBookedSeats method with this enhanced versionW
// // loadBookedSeats(): Promise<void> {
// //   return new Promise((resolve) => {
// //     const travelDate = this.journeyDetails.date;
// //     console.log(`📡 FETCHING booked seats for bus: ${this.busId} on date: ${travelDate}`);
    
// //     this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
// //       next: (response: any) => {
// //         console.log('✅ Booked seats response:', response);
        
// //         let bookedSeatsData = null;
        
// //         if (response && response.success === true) {
// //           bookedSeatsData = response.data;
// //         } else if (response && response.data) {
// //           bookedSeatsData = response.data;
// //         } else if (Array.isArray(response)) {
// //           bookedSeatsData = response;
// //         }
        
// //         if (bookedSeatsData && Array.isArray(bookedSeatsData) && bookedSeatsData.length > 0) {
// //           console.log(`✅ Found ${bookedSeatsData.length} booked seats:`, bookedSeatsData);
// //           this.markBookedSeats(bookedSeatsData);
// //         } else {
// //           console.log('ℹ️ No booked seats found for this bus/date');
// //         }
// //         resolve();
// //       },
// //       error: (error) => {
// //         console.error('❌ Error loading booked seats:', error);
// //         // Don't show error to user, just use demo data or empty
// //         resolve();
// //       }
// //     });
// //   });
// // }

// // // Enhanced markBookedSeats method W
// // markBookedSeats(seatsData: any[]): void {
// //   console.log('📋 Marking booked seats:', seatsData);
  
// //   if (!seatsData || seatsData.length === 0) return;
  
// //   const bookedSeatNumbers = new Set<string>();
  
// //   seatsData.forEach((seat: any) => {
// //     const seatNumber = seat.seatNumber || seat.number;
// //     if (seatNumber) {
// //       bookedSeatNumbers.add(seatNumber.toString());
// //       console.log(`Found booked seat: ${seatNumber}`);
// //     }
// //   });
  
// //   console.log(`🔴 Booked seat numbers to mark:`, Array.from(bookedSeatNumbers));
  
// //   let markedCount = 0;
// //   this.seats.forEach(seat => {
// //     if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
// //       seat.status = 'booked';
// //       markedCount++;
// //       console.log(`🔴 MARKED seat ${seat.number} as BOOKED`);
// //     }
// //   });
  
// //   console.log(`✅ Marked ${markedCount} seats as booked`);
  
// //   // Force UI update
// //   this.cdr.detectChanges();
// // }
// //   getAdjustedTime(time: string, minutesToAdd: number): string {
// //     if (!time) return '08:00 AM';
// //     const [timeStr, period] = time.split(' ');
// //     let [hourStr, minuteStr] = timeStr.split(':');
// //     let hour = parseInt(hourStr);
// //     let minute = parseInt(minuteStr);
    
// //     if (period === 'PM' && hour !== 12) hour += 12;
// //     if (period === 'AM' && hour === 12) hour = 0;
    
// //     minute += minutesToAdd;
// //     if (minute >= 60) {
// //       hour += Math.floor(minute / 60);
// //       minute = minute % 60;
// //     }
    
// //     const newPeriod = hour >= 12 ? 'PM' : 'AM';
// //     hour = hour % 12;
// //     hour = hour === 0 ? 12 : hour;
    
// //     return `${hour}:${minute.toString().padStart(2, '0')} ${newPeriod}`;
// //   }

// //   toggleSeat(seat: Seat): void {
// //     if (seat.seatType === 'driver') {
// //       this.errorMessage = 'Driver seat is not available';
// //       this.clearErrorAfter(2);
// //       return;
// //     }
    
// //     if (seat.status === 'booked' || seat.status === 'occupied') {
// //       this.errorMessage = `❌ Seat ${seat.number} is already booked`;
// //       this.clearErrorAfter(2);
// //       return;
// //     }
    
// //     if (this.isMultiSelectMode) {
// //       if (seat.tempSelected) {
// //         seat.tempSelected = false;
// //         this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
// //       } else {
// //         if (this.selectedSeats.length + this.tempSelectedSeats.length + 1 > this.maxSeats) {
// //           this.showLimitWarning = true;
// //           setTimeout(() => this.showLimitWarning = false, 2000);
// //           return;
// //         }
// //         seat.tempSelected = true;
// //         this.tempSelectedSeats.push(seat);
// //       }
// //     } else {
// //       if (this.selectedSeats.length >= this.maxSeats) {
// //         this.showLimitWarning = true;
// //         setTimeout(() => this.showLimitWarning = false, 2000);
// //         return;
// //       }
      
// //       if (seat.status === 'selected') {
// //         this.removeSelectedSeat(seat);
// //       } else {
// //         seat.status = 'selected';
// //         this.selectedSeats.push(seat);
// //         this.calculateTotal();
// //       }
// //     }
// //     this.cdr.detectChanges();
// //   }

// //   removeSelectedSeat(seat: Seat): void {
// //     seat.status = 'available';
// //     this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
// //     this.calculateTotal();
// //     this.cdr.detectChanges();
// //   }

// //   confirmMultiSelection(): void {
// //     if (this.tempSelectedSeats.length === 0) return;
    
// //     this.tempSelectedSeats.forEach(seat => {
// //       seat.status = 'selected';
// //       seat.tempSelected = false;
// //     });
// //     this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
// //     this.tempSelectedSeats = [];
// //     this.calculateTotal();
// //     this.isMultiSelectMode = false;
// //     this.cdr.detectChanges();
// //   }

// //   cancelMultiSelection(): void {
// //     this.tempSelectedSeats.forEach(seat => seat.tempSelected = false);
// //     this.tempSelectedSeats = [];
// //     this.cdr.detectChanges();
// //   }

// //   toggleMultiSelectMode(): void {
// //     this.isMultiSelectMode = !this.isMultiSelectMode;
// //     if (!this.isMultiSelectMode) this.cancelMultiSelection();
// //   }

// //   calculateTotal(): void {
// //     const baseFare = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
// //     const boardingFare = this.selectedBoardingPoint?.fare || 0;
// //     const subtotal = baseFare + boardingFare;
// //     const gst = subtotal * 0.05;
// //     this.bookingSummary = {
// //       baseFare: baseFare,
// //       tax: 0,
// //       gst: gst,
// //       total: subtotal + gst,
// //       boardingFare: boardingFare
// //     };
// //   }

// //   hasBoardingFare(): boolean {
// //     return (this.selectedBoardingPoint?.fare || 0) > 0;
// //   }

// //   getBoardingFare(): number {
// //     return this.selectedBoardingPoint?.fare || 0;
// //   }

// //   proceedToBooking(): void {
// //     if (this.selectedSeats.length === 0) {
// //       this.errorMessage = 'Please select at least one seat';
// //       this.clearErrorAfter(2);
// //       return;
// //     }
    
// //     if (!this.selectedBoardingPoint) {
// //       this.errorMessage = 'Please select a boarding point';
// //       this.clearErrorAfter(2);
// //       return;
// //     }
    
// //     this.preparePassengers();
// //     this.showPassengerModal = true;
// //     this.cdr.detectChanges();
// //   }

// //   preparePassengers(): void {
// //     const userData = this.authService.getCurrentUser();
// //     const firstName = userData?.firstName || '';
// //     const lastName = userData?.lastName || '';
// //     const email = userData?.email || '';
// //     const phone = userData?.phone || '';
// //     const gender = userData?.gender || 'male';
    
// //     this.passengers = this.selectedSeats.map(seat => ({
// //       seatNumber: seat.number,
// //       name: `${firstName} ${lastName}`.trim() || 'Passenger',
// //       age: null,
// //       gender: gender,
// //       phone: phone,
// //       email: email,
// //       idProof: '',
// //       idProofNumber: ''
// //     }));
// //   }

// //   confirmAllPassengers(): void {
// //     const isValid = this.passengers.every(p => 
// //       p.name && p.name.trim() !== '' && 
// //       p.age !== null && p.age > 0 && p.age < 120 && 
// //       p.phone && p.phone.length === 10
// //     );
    
// //     if (!isValid) {
// //       this.errorMessage = 'Please fill all passenger details correctly';
// //       this.clearErrorAfter(3);
// //       return;
// //     }
    
// //     this.showPassengerModal = false;
// //     this.openPaymentModal();
// //     this.cdr.detectChanges();
// //   }

// //   openPaymentModal(): void {
// //     this.showPaymentModal = true;
// //     this.selectedPaymentMethod = 'cash';
// //     this.paymentError = '';
// //     this.cdr.detectChanges();
// //   }

// //   closePaymentModal(): void {
// //     this.showPaymentModal = false;
// //     this.paymentError = '';
// //     this.isProcessingPayment = false;
// //     this.cdr.detectChanges();
// //   }

// //   processPayment(): void {
// //     this.initiateCashPayment();
// //   }

// //   initiateCashPayment(): void {
// //     this.isProcessingPayment = true;
    
// //     const bookingData: BookingRequest = {
// //       busId: this.busId,
// //       seats: this.passengers.map(p => ({
// //         seatNumber: p.seatNumber,
// //         passengerName: p.name,
// //         passengerAge: Number(p.age),
// //         passengerGender: p.gender,
// //         passengerPhone: p.phone,
// //         passengerEmail: p.email || undefined
// //       })),
// //       totalAmount: Number(this.bookingSummary.total),
// //       taxAmount: Number(this.bookingSummary.gst),
// //       journeyDate: this.journeyDetails.date,
// //       paymentMethod: 'cash'
// //     };
    
// //     this.bookingService.createBooking(bookingData).subscribe({
// //       next: (response: ApiResponse<any>) => {
// //         this.isProcessingPayment = false;
// //         this.showPaymentModal = false;
        
// //         if (response.success) {
// //           this.successMessage = 'Booking confirmed! Redirecting...';
// //           setTimeout(() => {
// //             this.router.navigate(['/booking-confirmation', response.data.bookingId]);
// //           }, 1500);
// //         } else {
// //           this.errorMessage = response.message || 'Booking failed';
// //           this.clearErrorAfter(3);
// //         }
// //         this.cdr.detectChanges();
// //       },
// //       error: (error) => {
// //         this.isProcessingPayment = false;
// //         console.error('Booking error:', error);
// //         this.errorMessage = error.error?.message || 'Booking failed. Please try again.';
// //         this.clearErrorAfter(3);
// //         this.cdr.detectChanges();
// //       }
// //     });
// //   }

// //   getSeatStatusClass(seat: Seat): string {
// //     if (seat.seatType === 'driver') return 'seat-driver';
// //     if (seat.tempSelected) return 'seat-temp';
// //     if (seat.status === 'selected') return 'seat-selected';
// //     if (seat.isLadies && seat.status === 'available') return 'seat-ladies';
// //     if (seat.status === 'booked' || seat.status === 'occupied') return 'seat-occupied';
// //     return 'seat-available';
// //   }

// //   getSeatTooltip(seat: Seat): string {
// //     if (seat.status === 'booked' || seat.status === 'occupied') {
// //       return `❌ Seat ${seat.number} is already booked`;
// //     }
// //     if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
// //     if (seat.isLadies) return `👩 Ladies Seat - ₹${seat.price}`;
// //     return `💺 Seat ${seat.number} - ₹${seat.price}`;
// //   }

// //   getOperatorName(): string {
// //     return this.busDetails?.operator || this.busDetails?.busName?.split(' ')[0] || 'Demo Travels';
// //   }

// //   getBusName(): string {
// //     return this.busDetails?.busName || 'Demo Bus';
// //   }

// //   getBusNumber(): string {
// //     return this.busDetails?.busNumber || 'DEMO-001';
// //   }

// //   getDepartureTime(): string {
// //     return this.busDetails?.departureTime || '08:00 AM';
// //   }

// //   getArrivalTime(): string {
// //     return this.busDetails?.arrivalTime || '02:30 PM';
// //   }

// //   getSelectedSeatsList(): string {
// //     return this.selectedSeats.map(seat => seat.number).join(', ');
// //   }

// //   areAllPassengersValid(): boolean {
// //     return this.passengers.every(p => 
// //       p.name && p.name.trim() !== '' && 
// //       p.age !== null && p.age > 0 && p.age < 120 && 
// //       p.phone && p.phone.length === 10
// //     );
// //   }

// //   testMarkBookedSeats(): void {
// //     const testBookedSeats = [
// //       { seatNumber: '2A', passengerName: 'Test User 1' },
// //       { seatNumber: '2D', passengerName: 'Test User 2' },
// //       { seatNumber: '3B', passengerName: 'Test User 3' }
// //     ];
// //     this.markBookedSeats(testBookedSeats);
// //     this.errorMessage = 'Test: Marked seats 2A, 2D, 3B as booked';
// //     setTimeout(() => this.errorMessage = '', 3000);
// //   }

// //   goBack(): void {
// //     this.router.navigate(['/bus-list'], {
// //       queryParams: {
// //         from: this.journeyDetails.from,
// //         to: this.journeyDetails.to,
// //         date: this.journeyDetails.date,
// //         passengers: this.maxSeats
// //       }
// //     });
// //   }

// //   clearErrorAfter(seconds: number): void {
// //     setTimeout(() => {
// //       this.errorMessage = '';
// //       this.cdr.detectChanges();
// //     }, seconds * 1000);
// //   }
// // }





// import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { BookingService, BookingRequest, ApiResponse } from '../../../services/booking.service';
// import { BusService } from '../../../services/bus.service';
// import { AuthService } from '../../../services/auth.service';
// import { environment } from '../../../../environments/environment';

// export interface Seat {
//   id: number;
//   number: string;
//   row: number;
//   column: string;
//   price: number;
//   status: 'available' | 'booked' | 'selected' | 'ladies' | 'occupied';
//   isLadies?: boolean;
//   tempSelected?: boolean;
//   bookedBy?: string;
//   bookingId?: string;
//   seatType?: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle';
//   passengerName?: string;
//   passengerGender?: string;
// }

// export interface PassengerDetail {
//   seatNumber: string;
//   name: string;
//   age: number | null;
//   gender: string;
//   phone: string;
//   email?: string;
//   idProof?: string;
//   idProofNumber?: string;
// }

// export interface BoardingPoint {
//   id: string;
//   name: string;
//   address: string;
//   time: string;
//   fare: number;
//   distance?: number;
//   amenities?: string[];
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
//   private busService = inject(BusService);
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
//   tempSelectedSeats: Seat[] = [];
  
//   boardingPoints: BoardingPoint[] = [];
//   selectedBoardingPoint: BoardingPoint | null = null;
  
//   maxSeats: number = 6;
//   isMultiSelectMode: boolean = false;
  
//   passengers: PassengerDetail[] = [];
  
//   bookingSummary = {
//     baseFare: 0,
//     tax: 0,
//     total: 0,
//     gst: 0,
//     boardingFare: 0
//   };
  
//   showPassengerModal: boolean = false;
//   showPaymentModal: boolean = false;
//   showLimitWarning: boolean = false;
//   showBookingSuccess: boolean = false;
  
//   isLoading: boolean = true;
//   isBooking: boolean = false;
//   isProcessingPayment: boolean = false;
//   errorMessage: string = '';
//   successMessage: string = '';
//   paymentError: string = '';
//   bookingResponse: any = null;
  
//   selectedPaymentMethod: string = 'cash';
  
//   availablePaymentMethods = [
//     { value: 'khalti', label: 'Khalti Wallet', icon: '💰' },
//     { value: 'esewa', label: 'eSewa', icon: '💳' },
//     { value: 'cash', label: 'Cash at Counter', icon: '💵' }
//   ];

//   private subscriptions: Subscription[] = [];

//   ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser();
    
//     // Get query params from navigation
//     this.route.queryParams.subscribe(params => {
//       if (params['from']) this.journeyDetails.from = params['from'];
//       if (params['to']) this.journeyDetails.to = params['to'];
//       if (params['date']) this.journeyDetails.date = params['date'];
//       if (params['passengers']) {
//         this.maxSeats = parseInt(params['passengers']);
//         this.journeyDetails.passengers = parseInt(params['passengers']);
//       }
      
//       console.log('📋 Journey Details from query:', this.journeyDetails);
//     });

//     this.route.params.subscribe(params => {
//       this.busId = params['id'];
//       console.log('🆔 Bus ID from route:', this.busId);
//       this.loadAllData();
//     });
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }

//   async loadAllData(): Promise<void> {
//     this.isLoading = true;
//     this.errorMessage = '';
    
//     try {
//       await this.loadBusDetails();
//       await this.loadBookedSeats();
//       this.isLoading = false;
//     } catch (error) {
//       console.error('Error loading data:', error);
//       this.errorMessage = 'Failed to load seat data. Using demo data.';
//       this.generateDemoSeats();
//       this.isLoading = false;
//     }
//     this.cdr.detectChanges();
//   }

//   loadBusDetails(): Promise<void> {
//     return new Promise((resolve) => {
//       console.log(`📡 Loading bus details for ID: ${this.busId}`);
      
//       // Use the public endpoint that doesn't require authentication
//       this.http.get(`${environment.apiUrl}/buses/${this.busId}`).subscribe({
//         next: (response: any) => {
//           console.log('✅ Bus details response:', response);
          
//           if (response && response.success === true && response.data) {
//             this.busDetails = response.data;
//             console.log('Bus details loaded:', this.busDetails);
//             this.generateSeatsFromBusDetails();
//             this.loadBoardingPoints();
//             resolve();
//           } else if (response && response.data) {
//             this.busDetails = response.data;
//             this.generateSeatsFromBusDetails();
//             this.loadBoardingPoints();
//             resolve();
//           } else {
//             console.warn('No bus details found, using demo data');
//             this.generateDemoSeats();
//             resolve();
//           }
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           console.error('❌ Error loading bus details:', error);
//           // Try fallback to bus service
//           this.busService.getBusForSeatSelection(this.busId).subscribe({
//             next: (busResponse: any) => {
//               if (busResponse && busResponse.data) {
//                 this.busDetails = busResponse.data;
//                 this.generateSeatsFromBusDetails();
//                 this.loadBoardingPoints();
//               } else {
//                 this.generateDemoSeats();
//               }
//               resolve();
//             },
//             error: () => {
//               this.generateDemoSeats();
//               resolve();
//             }
//           });
//         }
//       });
//     });
//   }

//  generateSeatsFromBusDetails(): void {
//     const basePrice = this.busDetails?.fare || 800;
//     const totalSeats = this.busDetails?.totalSeats || 32;
//     const seatsPerRow = 4;
//     const totalRows = Math.ceil(totalSeats / seatsPerRow);
    
//     this.seats = [];
//     let seatId = 1;
    
//     for (let row = 1; row <= totalRows; row++) {
//         for (let col = 0; col < seatsPerRow; col++) {
//             const columnLetter = String.fromCharCode(65 + col);
//             const seatNumber = `${row}${columnLetter}`;
            
//             if (seatId > totalSeats) break;
            
//             let seatType: 'driver' | 'passenger' | 'aisle' | 'window' | 'middle' = 'passenger';
//             let price = basePrice;
//             let isLadies = false;
            
//             if (row === 1 && col === 0) {
//                 seatType = 'driver';
//                 price = 0;
//             } else {
//                 if (col === 0 || col === 3) {
//                     seatType = 'window';
//                     price = basePrice + 200;
//                 } else if (col === 1 || col === 2) {
//                     seatType = 'aisle';
//                     price = basePrice + 100;
//                 }
                
//                 if (row % 2 === 0 && (col === 1 || col === 3)) {
//                     isLadies = true;
//                 }
//             }
            
//             this.seats.push({
//                 id: seatId,
//                 number: seatNumber,
//                 row: row,
//                 column: columnLetter,
//                 price: price,
//                 status: seatType === 'driver' ? 'occupied' : 'available', // Start as available
//                 isLadies: isLadies,
//                 seatType: seatType,
//                 tempSelected: false,
//                 bookedBy: undefined,
//                 bookingId: undefined
//             });
            
//             seatId++;
//         }
//     }
    
//     console.log(`Generated ${this.seats.length} seats:`, this.seats.map(s => ({ number: s.number, status: s.status })));
// }

// async loadBookedSeats(): Promise<void> {
//     return new Promise((resolve) => {
//         const travelDate = this.journeyDetails.date;
//         console.log(`📡 FETCHING booked seats for bus: ${this.busId} on date: ${travelDate}`);
        
//         // Small delay to ensure seats are generated
//         setTimeout(() => {
//             this.bookingService.getBookedSeats(this.busId, travelDate).subscribe({
//                 next: (response: any) => {
//                     console.log('✅ Booked seats response:', response);
                    
//                     let bookedSeatsData = null;
                    
//                     if (response && response.success === true) {
//                         bookedSeatsData = response.data;
//                     } else if (response && response.data) {
//                         bookedSeatsData = response.data;
//                     } else if (Array.isArray(response)) {
//                         bookedSeatsData = response;
//                     }
                    
//                     if (bookedSeatsData && Array.isArray(bookedSeatsData) && bookedSeatsData.length > 0) {
//                         console.log(`✅ Found ${bookedSeatsData.length} booked seats:`, bookedSeatsData);
//                         this.markBookedSeats(bookedSeatsData);
//                     } else {
//                         console.log('ℹ️ No booked seats found for this bus/date');
//                     }
//                     resolve();
//                 },
//                 error: (error) => {
//                     console.error('❌ Error loading booked seats:', error);
//                     resolve();
//                 }
//             });
//         }, 100); // Small delay to ensure seats array is populated
//     });
// }
// markBookedSeats(seatsData: any[]): void {
//     console.log('📋 Marking booked seats with data:', seatsData);
    
//     if (!seatsData || seatsData.length === 0) {
//         console.log('No booked seats to mark');
//         return;
//     }
    
//     // Create a Set of booked seat numbers
//     const bookedSeatNumbers = new Set<string>();
    
//     seatsData.forEach((seat: any) => {
//         const seatNumber = seat.seatNumber || seat.number;
//         if (seatNumber) {
//             bookedSeatNumbers.add(seatNumber.toString());
//             console.log(`Found booked seat from API: ${seatNumber}`);
//         }
//     });
    
//     console.log(`🔴 Booked seat numbers to mark:`, Array.from(bookedSeatNumbers));
    
//     // Update the status of each seat
//     let markedCount = 0;
//     this.seats.forEach(seat => {
//         // Skip driver seat
//         if (seat.seatType === 'driver') return;
        
//         // Check if this seat number is in the booked set
//         if (bookedSeatNumbers.has(seat.number)) {
//             seat.status = 'booked';
//             // Store additional booking info
//             const bookingInfo = seatsData.find(b => (b.seatNumber === seat.number));
//             if (bookingInfo) {
//                 seat.bookedBy = bookingInfo.passengerName || 'Another passenger';
//                 seat.bookingId = bookingInfo.bookingId;
//             }
//             markedCount++;
//             console.log(`🔴 MARKED seat ${seat.number} as BOOKED (was ${seat.status})`);
//         } else {
//             // Only set to available if it's not already selected or booked
//             if (seat.status !== 'selected') {
//                 seat.status = 'available';
//             }
//         }
//     });
    
//     console.log(`✅ Marked ${markedCount} seats as booked out of ${this.seats.length} total seats`);
//     console.log('Current seat statuses:', this.seats.map(s => ({ number: s.number, status: s.status })));
    
//     // Force change detection
//     this.cdr.detectChanges();
// }
    
//     console.log(`🔴 Booked seat numbers to mark:`, Array.from(bookedSeatNumbers));
    
//     let markedCount = 0;
//     this.seats.forEach(seat => {
//       if (bookedSeatNumbers.has(seat.number) && seat.seatType !== 'driver') {
//         seat.status = 'booked';
//         markedCount++;
//         console.log(`🔴 MARKED seat ${seat.number} as BOOKED`);
//       }
//     });
    
//     console.log(`✅ Marked ${markedCount} seats as booked`);
    
//     // Force UI update
//     this.cdr.detectChanges();
//   }

//   generateDemoSeats(): void {
//     const basePrice = 800;
//     const seatConfig = [
//       { row: 1, col: 0, type: 'driver' as const, price: 0, number: 'DR', isLadies: false },
//       { row: 1, col: 1, type: 'window' as const, price: basePrice + 200, number: '1A', isLadies: false },
//       { row: 1, col: 2, type: 'window' as const, price: basePrice + 200, number: '1B', isLadies: false },
//       { row: 1, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '1C', isLadies: false },
//       { row: 2, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '2A', isLadies: true },
//       { row: 2, col: 1, type: 'middle' as const, price: basePrice, number: '2B', isLadies: false },
//       { row: 2, col: 2, type: 'middle' as const, price: basePrice, number: '2C', isLadies: false },
//       { row: 2, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '2D', isLadies: false },
//       { row: 3, col: 0, type: 'aisle' as const, price: basePrice + 100, number: '3A', isLadies: true },
//       { row: 3, col: 1, type: 'middle' as const, price: basePrice, number: '3B', isLadies: false },
//       { row: 3, col: 2, type: 'middle' as const, price: basePrice, number: '3C', isLadies: false },
//       { row: 3, col: 3, type: 'aisle' as const, price: basePrice + 100, number: '3D', isLadies: false },
//       { row: 4, col: 0, type: 'window' as const, price: basePrice + 200, number: '4A', isLadies: false },
//       { row: 4, col: 1, type: 'middle' as const, price: basePrice, number: '4B', isLadies: false },
//       { row: 4, col: 2, type: 'middle' as const, price: basePrice, number: '4C', isLadies: false },
//       { row: 4, col: 3, type: 'window' as const, price: basePrice + 200, number: '4D', isLadies: false }
//     ];
    
//     this.seats = seatConfig.map((config, index) => ({
//       id: index + 1,
//       number: config.number,
//       row: config.row,
//       column: ['A', 'B', 'C', 'D'][config.col],
//       price: config.price,
//       status: config.type === 'driver' ? 'occupied' : 'available',
//       isLadies: config.isLadies,
//       seatType: config.type,
//       tempSelected: false
//     }));
    
//     this.busDetails = {
//       operator: 'Demo Travels',
//       busName: 'HiAce Luxury',
//       busNumber: 'DEMO-001',
//       fare: 800,
//       departureTime: '08:00 AM',
//       arrivalTime: '02:30 PM'
//     };
//   }

//   getRowNumbers(): number[] {
//     const rows = [...new Set(this.seats.map(seat => seat.row))];
//     return rows.sort((a, b) => a - b);
//   }

//   getSeatsByRow(row: number): Seat[] {
//     return this.seats.filter(seat => seat.row === row && seat.seatType !== 'driver');
//   }

//   getRowLetter(row: number): string {
//     return String.fromCharCode(64 + row);
//   }

//   loadBoardingPoints(): void {
//     // Default boarding point - Bus Park (set as default)
//     const defaultBoardingPoint: BoardingPoint = { 
//       id: '0', 
//       name: 'Bus Park (Main Terminal)', 
//       address: 'Central Bus Terminal, Main Road', 
//       time: this.busDetails?.departureTime || '08:00 AM', 
//       fare: 0,
//       distance: 0,
//       amenities: ['Parking', 'Waiting Lounge', 'Ticket Counter', 'Restroom']
//     };
    
//     const additionalPoints: BoardingPoint[] = [
//       { id: '1', name: 'City Center', address: 'Main Road, Near City Mall', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 10), fare: 50, distance: 5 },
//       { id: '2', name: 'Airport Junction', address: 'Airport Road, Terminal 1', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 20), fare: 80, distance: 8 },
//       { id: '3', name: 'Railway Station', address: 'Station Road, East Gate', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 30), fare: 100, distance: 12 },
//       { id: '4', name: 'Hospital Road', address: 'Medical College Road, Main Gate', time: this.getAdjustedTime(this.busDetails?.departureTime || '08:00 AM', 15), fare: 60, distance: 6 }
//     ];
    
//     this.boardingPoints = [defaultBoardingPoint, ...additionalPoints];
    
//     // Set default selection to Bus Park
//     this.selectedBoardingPoint = this.boardingPoints[0];
//     this.calculateTotal();
//     console.log('Boarding points loaded, default: Bus Park');
//   }

//   getAdjustedTime(time: string, minutesToAdd: number): string {
//     if (!time) return '08:00 AM';
    
//     // Handle different time formats
//     let hours = 0, minutes = 0, period = 'AM';
    
//     if (time.includes(':')) {
//       const [timeStr, periodStr] = time.split(' ');
//       const [hourStr, minuteStr] = timeStr.split(':');
//       hours = parseInt(hourStr);
//       minutes = parseInt(minuteStr);
//       period = periodStr || (hours >= 12 ? 'PM' : 'AM');
//     } else {
//       // Try to parse as simple hour
//       hours = parseInt(time);
//       period = hours >= 12 ? 'PM' : 'AM';
//       if (hours > 12) hours -= 12;
//     }
    
//     // Convert to 24-hour for calculation
//     let totalMinutes = (period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours) * 60 + minutes;
//     totalMinutes += minutesToAdd;
    
//     // Convert back
//     let newHours = Math.floor(totalMinutes / 60) % 24;
//     const newMinutes = totalMinutes % 60;
//     const newPeriod = newHours >= 12 ? 'PM' : 'AM';
//     newHours = newHours % 12;
//     newHours = newHours === 0 ? 12 : newHours;
    
//     return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
//   }

//   toggleSeat(seat: Seat): void {
//     if (seat.seatType === 'driver') {
//       this.errorMessage = 'Driver seat is not available';
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     if (seat.status === 'booked' || seat.status === 'occupied') {
//       this.errorMessage = `❌ Seat ${seat.number} is already booked`;
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     if (this.isMultiSelectMode) {
//       if (seat.tempSelected) {
//         seat.tempSelected = false;
//         this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
//       } else {
//         if (this.selectedSeats.length + this.tempSelectedSeats.length + 1 > this.maxSeats) {
//           this.showLimitWarning = true;
//           setTimeout(() => this.showLimitWarning = false, 2000);
//           return;
//         }
//         seat.tempSelected = true;
//         this.tempSelectedSeats.push(seat);
//       }
//     } else {
//       if (this.selectedSeats.length >= this.maxSeats) {
//         this.showLimitWarning = true;
//         setTimeout(() => this.showLimitWarning = false, 2000);
//         return;
//       }
      
//       if (seat.status === 'selected') {
//         this.removeSelectedSeat(seat);
//       } else {
//         seat.status = 'selected';
//         this.selectedSeats.push(seat);
//         this.calculateTotal();
//       }
//     }
//     this.cdr.detectChanges();
//   }

//   removeSelectedSeat(seat: Seat): void {
//     seat.status = 'available';
//     this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
//     this.calculateTotal();
//     this.cdr.detectChanges();
//   }

//   confirmMultiSelection(): void {
//     if (this.tempSelectedSeats.length === 0) return;
    
//     this.tempSelectedSeats.forEach(seat => {
//       seat.status = 'selected';
//       seat.tempSelected = false;
//     });
//     this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
//     this.tempSelectedSeats = [];
//     this.calculateTotal();
//     this.isMultiSelectMode = false;
//     this.cdr.detectChanges();
//   }

//   cancelMultiSelection(): void {
//     this.tempSelectedSeats.forEach(seat => seat.tempSelected = false);
//     this.tempSelectedSeats = [];
//     this.cdr.detectChanges();
//   }

//   toggleMultiSelectMode(): void {
//     this.isMultiSelectMode = !this.isMultiSelectMode;
//     if (!this.isMultiSelectMode) this.cancelMultiSelection();
//   }

//   calculateTotal(): void {
//     const baseFare = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
//     const boardingFare = this.selectedBoardingPoint?.fare || 0;
//     const subtotal = baseFare + boardingFare;
//     const gst = subtotal * 0.05;
//     this.bookingSummary = {
//       baseFare: baseFare,
//       tax: 0,
//       gst: gst,
//       total: subtotal + gst,
//       boardingFare: boardingFare
//     };
//   }

//   hasBoardingFare(): boolean {
//     return (this.selectedBoardingPoint?.fare || 0) > 0;
//   }

//   getBoardingFare(): number {
//     return this.selectedBoardingPoint?.fare || 0;
//   }

//   proceedToBooking(): void {
//     if (this.selectedSeats.length === 0) {
//       this.errorMessage = 'Please select at least one seat';
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     if (!this.selectedBoardingPoint) {
//       this.errorMessage = 'Please select a boarding point';
//       this.clearErrorAfter(2);
//       return;
//     }
    
//     this.preparePassengers();
//     this.showPassengerModal = true;
//     this.cdr.detectChanges();
//   }

//   preparePassengers(): void {
//     const userData = this.authService.getCurrentUser();
//     const firstName = userData?.firstName || '';
//     const lastName = userData?.lastName || '';
//     const email = userData?.email || '';
//     const phone = userData?.phone || '';
//     const gender = userData?.gender || 'male';
    
//     this.passengers = this.selectedSeats.map(seat => ({
//       seatNumber: seat.number,
//       name: `${firstName} ${lastName}`.trim() || 'Passenger',
//       age: null,
//       gender: gender,
//       phone: phone,
//       email: email,
//       idProof: '',
//       idProofNumber: ''
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
//     this.paymentError = '';
//     this.cdr.detectChanges();
//   }

//   closePaymentModal(): void {
//     this.showPaymentModal = false;
//     this.paymentError = '';
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
//       taxAmount: Number(this.bookingSummary.gst),
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
//     if (seat.seatType === 'driver') return 'seat-driver';
//     if (seat.tempSelected) return 'seat-temp';
//     if (seat.status === 'selected') return 'seat-selected';
//     if (seat.isLadies && seat.status === 'available') return 'seat-ladies';
//     if (seat.status === 'booked' || seat.status === 'occupied') return 'seat-occupied';
//     return 'seat-available';
//   }

//   getSeatTooltip(seat: Seat): string {
//     if (seat.status === 'booked' || seat.status === 'occupied') {
//       return `❌ Seat ${seat.number} is already booked`;
//     }
//     if (seat.status === 'selected') return `✓ Seat ${seat.number} - Selected - ₹${seat.price}`;
//     if (seat.isLadies) return `👩 Ladies Seat - ₹${seat.price}`;
//     return `💺 Seat ${seat.number} - ₹${seat.price}`;
//   }

//   getOperatorName(): string {
//     return this.busDetails?.operator || this.busDetails?.busName?.split(' ')[0] || 'Demo Travels';
//   }

//   getBusName(): string {
//     return this.busDetails?.busName || 'Demo Bus';
//   }

//   getBusNumber(): string {
//     return this.busDetails?.busNumber || 'DEMO-001';
//   }

//   getDepartureTime(): string {
//     return this.busDetails?.departureTime || '08:00 AM';
//   }

//   getArrivalTime(): string {
//     return this.busDetails?.arrivalTime || '02:30 PM';
//   }

//   getSelectedSeatsList(): string {
//     return this.selectedSeats.map(seat => seat.number).join(', ');
//   }

//   areAllPassengersValid(): boolean {
//     return this.passengers.every(p => 
//       p.name && p.name.trim() !== '' && 
//       p.age !== null && p.age > 0 && p.age < 120 && 
//       p.phone && p.phone.length === 10
//     );
//   }

//   testMarkBookedSeats(): void {
//     const testBookedSeats = [
//       { seatNumber: '2A', passengerName: 'Test User 1' },
//       { seatNumber: '2D', passengerName: 'Test User 2' },
//       { seatNumber: '3B', passengerName: 'Test User 3' }
//     ];
//     this.markBookedSeats(testBookedSeats);
//     this.errorMessage = 'Test: Marked seats 2A, 2D, 3B as booked';
//     setTimeout(() => this.errorMessage = '', 3000);
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