import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { BookingService, BusSeatMap } from '../../../services/booking.service';
import { BusService,Bus } from '../../../services/bus.service';
@Component({
  selector: 'app-manage-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-booking.component.html',
  styleUrl: './manage-booking.component.css'
})


// export class ManageBookingComponent implements OnInit {
//   user: User | null = null;
//   isLoading = false;
  
//   // Search filters
//   selectedBusId: string = '';
//   selectedDate: string = '';
//   busList: Bus[] = [];
  
//   // Seat map data
//   seatMap: any = null;
//   bookedSeats: any[] = [];
//   availableSeats: any[] = [];
  
//   // Statistics
//   totalSeats: number = 0;
//   bookedSeatsCount: number = 0;
//   availableSeatsCount: number = 0;
//   occupancyRate: number = 0;
  
//   // Selected seat details
//   selectedSeat: any = null;
  
//   // Available dates for the selected bus
//   availableDates: string[] = [];
//   isDateLoading: boolean = false;

//   constructor(
//     private authService: AuthService,
//     private bookingService: BookingService,
//     private busService: BusService,
//     public router: Router
//   ) {}

//   ngOnInit(): void {
//     this.user = this.authService.getCurrentUser();
    
//     // Check if user is counter
//     if (!this.authService.isCounter()) {
//       this.router.navigate(['/login']);
//       return;
//     }
    
//     // Set default date to today
//     const today = new Date();
//     this.selectedDate = this.formatDate(today);
    
//     // Load all registered buses
//     this.loadAllBuses();
//   }

//   loadAllBuses(): void {
//     this.isLoading = true;
    
//     // Fetch all active buses from the system
//     this.busService.getActiveBuses().subscribe({
//       next: (response: any) => {
//         if (response.success && response.data) {
//           this.busList = response.data;
//           console.log('Loaded buses:', this.busList);
          
//           // Auto-select first bus if available
//           if (this.busList.length > 0 && !this.selectedBusId) {
//             this.selectedBusId = this.busList[0]._id || '';
//             if (this.selectedBusId) {
//               // Load available dates for the selected bus
//               this.loadAvailableDates();
//               // Then search seats
//               this.searchBusSeats();
//             }
//           }
//         } else {
//           this.loadMockBuses();
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading buses:', error);
//         this.loadMockBuses();
//         this.isLoading = false;
//       }
//     });
//   }

//   loadMockBuses(): void {
//     // Mock data for demonstration when API fails
//     this.busList = [
//       {
//         _id: 'BUS001',
//         busNumber: 'BA 1234',
//         busName: 'Express Bus',
//         busType: 'AC Seater',
//         operator: 'Express Travels',
//         totalSeats: 40,
//         fare: 1200,
//         amenities: ['AC', 'WiFi', 'Charging Point'],
//         status: 'active',
//         origin: 'Kathmandu',
//         destination: 'Pokhara',
//         departureTime: '08:00 AM'
//       } as Bus,
//       {
//         _id: 'BUS002',
//         busNumber: 'BA 5678',
//         busName: 'City Deluxe',
//         busType: 'AC Sleeper',
//         operator: 'City Travels',
//         totalSeats: 35,
//         fare: 1500,
//         amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket'],
//         status: 'active',
//         origin: 'Kathmandu',
//         destination: 'Chitwan',
//         departureTime: '09:30 AM'
//       } as Bus,
//       {
//         _id: 'BUS003',
//         busNumber: 'BA 9012',
//         busName: 'Mountain Express',
//         busType: 'Non-AC Seater',
//         operator: 'Mountain Travels',
//         totalSeats: 45,
//         fare: 800,
//         amenities: ['Charging Point'],
//         status: 'active',
//         origin: 'Kathmandu',
//         destination: 'Lumbini',
//         departureTime: '11:00 AM'
//       } as Bus
//     ];
    
//     if (this.busList.length > 0 && !this.selectedBusId) {
//       this.selectedBusId = this.busList[0]._id || '';
//       if (this.selectedBusId) {
//         this.loadAvailableDates();
//         this.searchBusSeats();
//       }
//     }
//   }

//   onBusChange(): void {
//     // Reset seat map when bus changes
//     this.seatMap = null;
//     this.bookedSeats = [];
//     this.availableSeats = [];
    
//     if (this.selectedBusId) {
//       // Load available dates for the selected bus
//       this.loadAvailableDates();
//       // Search seats for the selected date
//       this.searchBusSeats();
//     }
//   }

//   onDateChange(): void {
//     if (this.selectedBusId && this.selectedDate) {
//       this.searchBusSeats();
//     }
//   }

//   loadAvailableDates(): void {
//     this.isDateLoading = true;
//     this.availableDates = [];
    
//     // Get dates from today to next 30 days
//     const today = new Date();
//     const dates: string[] = [];
    
//     for (let i = 0; i < 30; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       const dateStr = this.formatDate(date);
//       dates.push(dateStr);
//     }
    
//     // Check which dates have bookings for this bus
//     const bookingChecks = dates.map(date => 
//       this.bookingService.getBookedSeats(this.selectedBusId, date).toPromise()
//     );
    
//     Promise.all(bookingChecks).then((responses: any[]) => {
//       this.availableDates = dates.filter((date: string, index: number) => {
//         const response = responses[index];
//         return response && response.success;
//       });
      
//       // If no specific dates found, show all upcoming dates
//       if (this.availableDates.length === 0) {
//         this.availableDates = dates;
//       }
      
//       this.isDateLoading = false;
//     }).catch(error => {
//       console.error('Error loading available dates:', error);
//       // Show all upcoming dates as fallback
//       const fallbackDates: string[] = [];
//       const todayDate = new Date();
//       for (let i = 0; i < 30; i++) {
//         const date = new Date(todayDate);
//         date.setDate(todayDate.getDate() + i);
//         fallbackDates.push(this.formatDate(date));
//       }
//       this.availableDates = fallbackDates;
//       this.isDateLoading = false;
//     });
//   }

//   searchBusSeats(): void {
//     if (!this.selectedBusId || !this.selectedDate) {
//       alert('Please select both bus and date');
//       return;
//     }
    
//     this.isLoading = true;
//     this.selectedSeat = null;
    
//     // Use the public endpoint to get booked seats
//     this.bookingService.getBookedSeats(this.selectedBusId, this.selectedDate).subscribe({
//       next: (response: any) => {
//         if (response.success) {
//           const selectedBus = this.busList.find(b => b._id === this.selectedBusId);
//           const totalSeats = selectedBus?.totalSeats || 40;
          
//           // Create a Set of booked seat numbers
//           const bookedSeatNumbers = new Set<string>();
//           const bookedSeatsData: any[] = [];
          
//           if (response.data && Array.isArray(response.data)) {
//             response.data.forEach((seat: any) => {
//               bookedSeatNumbers.add(seat.seatNumber);
//               bookedSeatsData.push(seat);
//             });
//           }
          
//           // Generate all seats
//           const seats = [];
//           for (let i = 1; i <= totalSeats; i++) {
//             const seatNumber = i.toString();
//             const isBooked = bookedSeatNumbers.has(seatNumber);
//             const bookedInfo = bookedSeatsData.find(s => s.seatNumber === seatNumber);
            
//             seats.push({
//               seatNumber: seatNumber,
//               status: isBooked ? 'booked' : 'available',
//               passenger: isBooked ? {
//                 passengerName: bookedInfo?.passengerName || `Passenger`,
//                 passengerPhone: bookedInfo?.passengerPhone || 'N/A',
//                 bookingId: bookedInfo?.bookingId || `BK${1000 + i}`
//               } : null
//             });
//           }
          
//           this.seatMap = {
//             bus: {
//               _id: selectedBus?._id,
//               busName: selectedBus?.busName,
//               busNumber: selectedBus?.busNumber,
//               busType: selectedBus?.busType,
//               source: selectedBus?.origin || 'N/A',
//               destination: selectedBus?.destination || 'N/A',
//               departureTime: selectedBus?.departureTime,
//               departureDate: selectedBus?.departureDate
//             },
//             journeyDate: this.selectedDate,
//             seats: seats,
//             totalSeats: totalSeats,
//             bookedSeats: bookedSeatNumbers.size,
//             availableSeats: totalSeats - bookedSeatNumbers.size
//           };
          
//           this.processSeatData(this.seatMap);
//         } else {
//           this.loadMockSeatData();
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading seat map:', error);
//         this.loadMockSeatData();
//         this.isLoading = false;
//       }
//     });
//   }

//   processSeatData(data: any): void {
//     if (!data || !data.seats) return;
    
//     this.totalSeats = data.totalSeats;
//     this.bookedSeatsCount = data.bookedSeats;
//     this.availableSeatsCount = data.availableSeats;
//     this.occupancyRate = (this.bookedSeatsCount / this.totalSeats) * 100;
    
//     // Separate booked and available seats
//     this.bookedSeats = data.seats.filter((seat: any) => seat.status === 'booked');
//     this.availableSeats = data.seats.filter((seat: any) => seat.status === 'available');
//   }

//   loadMockSeatData(): void {
//     // Mock data for demonstration based on selected date
//     const selectedBus = this.busList.find(b => b._id === this.selectedBusId);
//     const totalSeats = selectedBus?.totalSeats || 40;
    
//     // Generate different booked seats based on the date to show date relevance
//     const dateSeed = new Date(this.selectedDate).getDate();
//     const bookedSeatNumbers: number[] = [];
//     const numberOfBookedSeats = 10 + (dateSeed % 20); // Varies between 10-30 seats
    
//     for (let i = 0; i < numberOfBookedSeats; i++) {
//       const seatNum = (dateSeed + i * 3) % totalSeats + 1;
//       if (!bookedSeatNumbers.includes(seatNum)) {
//         bookedSeatNumbers.push(seatNum);
//       }
//     }
//     bookedSeatNumbers.sort((a, b) => a - b);
    
//     const seats = [];
//     for (let i = 1; i <= totalSeats; i++) {
//       const seatNumber = i.toString();
//       const isBooked = bookedSeatNumbers.includes(i);
//       seats.push({
//         seatNumber: seatNumber,
//         status: isBooked ? 'booked' : 'available',
//         passenger: isBooked ? {
//           passengerName: `Passenger ${i}`,
//           passengerPhone: '9800000000',
//           bookingId: `BK${1000 + i}`
//         } : null
//       });
//     }
    
//     this.seatMap = {
//       bus: {
//         _id: selectedBus?._id,
//         busName: selectedBus?.busName,
//         busNumber: selectedBus?.busNumber,
//         busType: selectedBus?.busType,
//         source: selectedBus?.origin || 'N/A',
//         destination: selectedBus?.destination || 'N/A',
//         departureTime: selectedBus?.departureTime
//       },
//       journeyDate: this.selectedDate,
//       seats: seats,
//       totalSeats: totalSeats,
//       bookedSeats: bookedSeatNumbers.length,
//       availableSeats: totalSeats - bookedSeatNumbers.length
//     };
    
//     this.processSeatData(this.seatMap);
//   }

//   selectSeat(seat: any): void {
//     if (seat.status === 'booked') {
//       this.selectedSeat = seat;
//       // Show passenger details
//       if (seat.passenger) {
//         alert(`Seat ${seat.seatNumber}\nPassenger: ${seat.passenger.passengerName}\nPhone: ${seat.passenger.passengerPhone}\nBooking ID: ${seat.passenger.bookingId}`);
//       }
//     } else {
//       // For available seats, navigate to create booking
//       if (confirm(`Seat ${seat.seatNumber} is available for ${this.formatDisplayDate(this.selectedDate)}. Would you like to create a booking for this seat?`)) {
//         this.router.navigate(['/counter/new-booking'], { 
//           queryParams: { 
//             busId: this.selectedBusId, 
//             seatNumber: seat.seatNumber,
//             date: this.selectedDate
//           }
//         });
//       }
//     }
//   }

//   viewBookingDetails(bookingId: string): void {
//     if (bookingId) {
//       this.router.navigate(['/counter/booking', bookingId]);
//     }
//   }

//   getSeatRows(): any[][] {
//     if (!this.seatMap || !this.seatMap.seats) return [];
    
//     const rows: any[][] = [];
//     const seatsPerRow = 4;
    
//     for (let i = 0; i < this.seatMap.seats.length; i += seatsPerRow) {
//       rows.push(this.seatMap.seats.slice(i, i + seatsPerRow));
//     }
    
//     return rows;
//   }

//   getSeatClass(seat: any): string {
//     if (seat.status === 'booked') {
//       return 'seat-booked';
//     }
//     return 'seat-available';
//   }

//   getOccupancyClass(): string {
//     if (this.occupancyRate >= 80) return 'high';
//     if (this.occupancyRate >= 50) return 'medium';
//     return 'low';
//   }

//   formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   formatDisplayDate(dateStr: string): string {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   }

//   formatCurrency(amount: number): string {
//     return new Intl.NumberFormat('ne-NP', {
//       style: 'currency',
//       currency: 'NPR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   }

//   getTodayDate(): string {
//     return this.formatDate(new Date());
//   }

//   getMinDate(): string {
//     return this.formatDate(new Date());
//   }

//   getMaxDate(): string {
//     const maxDate = new Date();
//     maxDate.setMonth(maxDate.getMonth() + 3);
//     return this.formatDate(maxDate);
//   }

//   getBusDisplayName(bus: Bus): string {
//     const busNumber = bus.busNumber || 'N/A';
//     const busName = bus.busName || 'Bus';
//     const origin = bus.origin || 'N/A';
//     const destination = bus.destination || 'N/A';
//     const departureTime = bus.departureTime || 'N/A';
//     return `${busName} (${busNumber}) - ${origin} → ${destination} | Departs: ${departureTime}`;
//   }

//   goBack(): void {
//     this.router.navigate(['/counter/dashboard']);
//   }

//   createNewBooking(): void {
//     this.router.navigate(['/counter/new-booking'], { 
//       queryParams: { 
//         busId: this.selectedBusId, 
//         date: this.selectedDate
//       }
//     });
//   }
// }




export class ManageBookingComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  
  // Search filters
  selectedBusId: string = '';
  selectedDate: string = '';
  busList: Bus[] = [];
  
  // Seat map data
  seatMap: any = null;
  bookedSeats: any[] = [];
  availableSeats: any[] = [];
  
  // Statistics
  totalSeats: number = 0;
  bookedSeatsCount: number = 0;
  availableSeatsCount: number = 0;
  occupancyRate: number = 0;
  
  // Selected seat details
  selectedSeat: any = null;
  
  // Available dates for the selected bus
  availableDates: string[] = [];
  isDateLoading: boolean = false;

  // Seat fare
  seatFare: number = 1250;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private busService: BusService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
    // Check if user is counter
    if (!this.authService.isCounter()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set default date to today
    const today = new Date();
    this.selectedDate = this.formatDate(today);
    
    // Load all registered buses
    this.loadAllBuses();
  }

  loadAllBuses(): void {
    this.isLoading = true;
    
    // Fetch all active buses from the system
    this.busService.getActiveBuses().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.busList = response.data;
          console.log('Loaded buses:', this.busList);
          
          // Auto-select first bus if available
          if (this.busList.length > 0 && !this.selectedBusId) {
            this.selectedBusId = this.busList[0]._id || '';
            if (this.selectedBusId) {
              // Load available dates for the selected bus
              this.loadAvailableDates();
              // Then search seats
              this.searchBusSeats();
            }
          }
        } else {
          this.loadMockBuses();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading buses:', error);
        this.loadMockBuses();
        this.isLoading = false;
      }
    });
  }

  loadMockBuses(): void {
    // Mock data for demonstration when API fails
    this.busList = [
      {
        _id: 'BUS001',
        busNumber: 'BA 1234',
        busName: 'Express Bus',
        busType: 'AC Seater',
        operator: 'Express Travels',
        totalSeats: 40,
        fare: 1250,
        amenities: ['AC', 'WiFi', 'Charging Point'],
        status: 'active',
        origin: 'Kathmandu',
        destination: 'Pokhara',
        departureTime: '08:00 AM'
      } as Bus,
      {
        _id: 'BUS002',
        busNumber: 'BA 5678',
        busName: 'City Deluxe',
        busType: 'AC Sleeper',
        operator: 'City Travels',
        totalSeats: 35,
        fare: 1500,
        amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket'],
        status: 'active',
        origin: 'Kathmandu',
        destination: 'Chitwan',
        departureTime: '09:30 AM'
      } as Bus
    ];
    
    if (this.busList.length > 0 && !this.selectedBusId) {
      this.selectedBusId = this.busList[0]._id || '';
      if (this.selectedBusId) {
        this.loadAvailableDates();
        this.searchBusSeats();
      }
    }
  }

  onBusChange(): void {
    // Reset seat map when bus changes
    this.seatMap = null;
    this.bookedSeats = [];
    this.availableSeats = [];
    
    if (this.selectedBusId) {
      // Load available dates for the selected bus
      this.loadAvailableDates();
      // Search seats for the selected date
      this.searchBusSeats();
    }
  }

  onDateChange(): void {
    if (this.selectedBusId && this.selectedDate) {
      this.searchBusSeats();
    }
  }

  loadAvailableDates(): void {
    this.isDateLoading = true;
    this.availableDates = [];
    
    // Get dates from today to next 30 days
    const today = new Date();
    const dates: string[] = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = this.formatDate(date);
      dates.push(dateStr);
    }
    
    // Check which dates have bookings for this bus
    const bookingChecks = dates.map(date => 
      this.bookingService.getBookedSeats(this.selectedBusId, date).toPromise()
    );
    
    Promise.all(bookingChecks).then((responses: any[]) => {
      this.availableDates = dates.filter((date: string, index: number) => {
        const response = responses[index];
        return response && response.success;
      });
      
      // If no specific dates found, show all upcoming dates
      if (this.availableDates.length === 0) {
        this.availableDates = dates;
      }
      
      this.isDateLoading = false;
    }).catch(error => {
      console.error('Error loading available dates:', error);
      const fallbackDates: string[] = [];
      const todayDate = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(todayDate);
        date.setDate(todayDate.getDate() + i);
        fallbackDates.push(this.formatDate(date));
      }
      this.availableDates = fallbackDates;
      this.isDateLoading = false;
    });
  }

  generateSeats(totalSeats: number, bookedSeatNumbers: Set<string>): any[] {
    const seats: any[] = [];
    const seatsPerRow = 4;
    const rows = Math.ceil(totalSeats / seatsPerRow);
    const columns = ['A', 'B', 'C', 'D'];
    
    for (let row = 1; row <= rows; row++) {
      for (let col of columns) {
        const seatNumber = `${row}${col}`;
        const isBooked = bookedSeatNumbers.has(seatNumber);
        
        // Only add seat if it's within total seats
        const seatIndex = (row - 1) * seatsPerRow + columns.indexOf(col);
        if (seatIndex < totalSeats) {
          seats.push({
            seatNumber: seatNumber,
            row: row,
            column: col,
            status: isBooked ? 'booked' : 'available',
            fare: this.seatFare,
            passenger: isBooked ? {
              passengerName: `Passenger ${seatNumber}`,
              passengerPhone: '9800000000',
              bookingId: `BK${1000 + seatIndex}`
            } : null
          });
        }
      }
    }
    
    return seats;
  }

  searchBusSeats(): void {
    if (!this.selectedBusId || !this.selectedDate) {
      alert('Please select both bus and date');
      return;
    }
    
    this.isLoading = true;
    this.selectedSeat = null;
    
    // Get fare for the selected bus
    const selectedBus = this.busList.find(b => b._id === this.selectedBusId);
    this.seatFare = selectedBus?.fare || 1250;
    
    // Use the public endpoint to get booked seats
    this.bookingService.getBookedSeats(this.selectedBusId, this.selectedDate).subscribe({
      next: (response: any) => {
        if (response.success) {
          const totalSeats = selectedBus?.totalSeats || 40;
          
          // Create a Set of booked seat numbers
          const bookedSeatNumbers = new Set<string>();
          const bookedSeatsData: any[] = [];
          
          if (response.data && Array.isArray(response.data)) {
            response.data.forEach((seat: any) => {
              bookedSeatNumbers.add(seat.seatNumber);
              bookedSeatsData.push(seat);
            });
          }
          
          // Generate seats with row and column format (1A, 1B, 1C, 1D, etc.)
          const seats = this.generateSeats(totalSeats, bookedSeatNumbers);
          
          // Update booked seats with actual passenger data
          seats.forEach(seat => {
            const bookedInfo = bookedSeatsData.find(s => s.seatNumber === seat.seatNumber);
            if (bookedInfo && seat.status === 'booked') {
              seat.passenger = {
                passengerName: bookedInfo.passengerName || `Passenger`,
                passengerPhone: bookedInfo.passengerPhone || 'N/A',
                bookingId: bookedInfo.bookingId || `BK${seat.seatNumber}`
              };
            }
          });
          
          this.seatMap = {
            bus: {
              _id: selectedBus?._id,
              busName: selectedBus?.busName,
              busNumber: selectedBus?.busNumber,
              busType: selectedBus?.busType,
              source: selectedBus?.origin || 'N/A',
              destination: selectedBus?.destination || 'N/A',
              departureTime: selectedBus?.departureTime,
              departureDate: selectedBus?.departureDate
            },
            journeyDate: this.selectedDate,
            seats: seats,
            totalSeats: totalSeats,
            bookedSeats: bookedSeatNumbers.size,
            availableSeats: totalSeats - bookedSeatNumbers.size,
            fare: this.seatFare
          };
          
          this.processSeatData(this.seatMap);
        } else {
          this.loadMockSeatData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading seat map:', error);
        this.loadMockSeatData();
        this.isLoading = false;
      }
    });
  }

  processSeatData(data: any): void {
    if (!data || !data.seats) return;
    
    this.totalSeats = data.totalSeats;
    this.bookedSeatsCount = data.bookedSeats;
    this.availableSeatsCount = data.availableSeats;
    this.occupancyRate = (this.bookedSeatsCount / this.totalSeats) * 100;
    
    // Separate booked and available seats
    this.bookedSeats = data.seats.filter((seat: any) => seat.status === 'booked');
    this.availableSeats = data.seats.filter((seat: any) => seat.status === 'available');
  }

  loadMockSeatData(): void {
    const selectedBus = this.busList.find(b => b._id === this.selectedBusId);
    const totalSeats = selectedBus?.totalSeats || 40;
    this.seatFare = selectedBus?.fare || 1250;
    
    // Generate different booked seats based on the date
    const dateSeed = new Date(this.selectedDate).getDate();
    const bookedSeatNumbersSet = new Set<string>();
    const numberOfBookedSeats = 10 + (dateSeed % 20);
    
    // Generate random booked seats in format like 1A, 2B, etc.
    const rows = Math.ceil(totalSeats / 4);
    const columns = ['A', 'B', 'C', 'D'];
    let bookedCount = 0;
    
    for (let i = 0; i < numberOfBookedSeats && bookedCount < numberOfBookedSeats; i++) {
      const row = (dateSeed + i) % rows + 1;
      const col = columns[(dateSeed + i * 2) % 4];
      const seatNumber = `${row}${col}`;
      if (!bookedSeatNumbersSet.has(seatNumber)) {
        bookedSeatNumbersSet.add(seatNumber);
        bookedCount++;
      }
    }
    
    const seats = this.generateSeats(totalSeats, bookedSeatNumbersSet);
    
    this.seatMap = {
      bus: {
        _id: selectedBus?._id,
        busName: selectedBus?.busName,
        busNumber: selectedBus?.busNumber,
        busType: selectedBus?.busType,
        source: selectedBus?.origin || 'N/A',
        destination: selectedBus?.destination || 'N/A',
        departureTime: selectedBus?.departureTime
      },
      journeyDate: this.selectedDate,
      seats: seats,
      totalSeats: totalSeats,
      bookedSeats: bookedSeatNumbersSet.size,
      availableSeats: totalSeats - bookedSeatNumbersSet.size,
      fare: this.seatFare
    };
    
    this.processSeatData(this.seatMap);
  }

  selectSeat(seat: any): void {
    if (seat.status === 'booked') {
      this.selectedSeat = seat;
      // Show passenger details
      if (seat.passenger) {
        alert(`Seat ${seat.seatNumber}\nFare: ${this.formatCurrency(seat.fare)}\nPassenger: ${seat.passenger.passengerName}\nPhone: ${seat.passenger.passengerPhone}\nBooking ID: ${seat.passenger.bookingId}`);
      }
    } else {
      // For available seats, navigate to create booking
      if (confirm(`Seat ${seat.seatNumber} (${this.formatCurrency(seat.fare)}) is available for ${this.formatDisplayDate(this.selectedDate)}. Would you like to create a booking for this seat?`)) {
        this.router.navigate(['/counter/new-booking'], { 
          queryParams: { 
            busId: this.selectedBusId, 
            seatNumber: seat.seatNumber,
            date: this.selectedDate,
            fare: seat.fare
          }
        });
      }
    }
  }

  getSeatRows(): any[][] {
    if (!this.seatMap || !this.seatMap.seats) return [];
    
    const rows: any[][] = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < this.seatMap.seats.length; i += seatsPerRow) {
      rows.push(this.seatMap.seats.slice(i, i + seatsPerRow));
    }
    
    return rows;
  }

  getSeatClass(seat: any): string {
    if (seat.status === 'booked') {
      return 'seat-booked';
    }
    if (this.selectedSeat?.seatNumber === seat.seatNumber) {
      return 'seat-selected';
    }
    return 'seat-available';
  }

  getOccupancyClass(): string {
    if (this.occupancyRate >= 80) return 'high';
    if (this.occupancyRate >= 50) return 'medium';
    return 'low';
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }

  getTodayDate(): string {
    return this.formatDate(new Date());
  }

  getMinDate(): string {
    return this.formatDate(new Date());
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return this.formatDate(maxDate);
  }

  getBusDisplayName(bus: Bus): string {
    const busNumber = bus.busNumber || 'N/A';
    const busName = bus.busName || 'Bus';
    const origin = bus.origin || 'N/A';
    const destination = bus.destination || 'N/A';
    const departureTime = bus.departureTime || 'N/A';
    return `${busName} (${busNumber}) - ${origin} → ${destination} | Departs: ${departureTime}`;
  }

  goBack(): void {
    this.router.navigate(['/counter/dashboard']);
  }

  createNewBooking(): void {
    this.router.navigate(['/counter/new-booking'], { 
      queryParams: { 
        busId: this.selectedBusId, 
        date: this.selectedDate,
        fare: this.seatFare
      }
    });
  }
}