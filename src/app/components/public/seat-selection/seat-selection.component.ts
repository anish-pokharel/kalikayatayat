import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface Seat {
  id: number;
  number: string;
  row: number;
  column: 'A' | 'B' | 'C' | 'D';
  deck?: 'lower' | 'upper';
  price: number;
  status: 'available' | 'booked' | 'selected' | 'blocked';
  gender?: 'male' | 'female' | 'none';
  type: 'sleeper' | 'seater';
  tempSelected?: boolean;
}

interface BusDetails {
  id: number;
  name: string;
  operator: string;
  type: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: 'sleeper' | 'seater' | 'semi-sleeper';
  totalSeats: number;
}

interface Passenger {
  seatNumber: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string;  // Added phone property
  email?: string; // Optional email
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  busId: number = 0;
  busDetails: BusDetails | null = null;
  
  lowerDeckSeats: Seat[] = [];
  upperDeckSeats: Seat[] = [];
  selectedSeats: Seat[] = [];
  tempSelectedSeats: Seat[] = [];
  showUpperDeck: boolean = false;
  
  // Maximum seats allowed
  maxSeats: number = 6;
  
  // Multi-select mode
  isMultiSelectMode: boolean = false;
  
  passengers: Passenger[] = [];
  
  bookingSummary = {
    baseFare: 0,
    tax: 0,
    total: 0
  };
  
  showPassengerModal: boolean = false;
  showLimitWarning: boolean = false;
  showMultiSelectConfirm: boolean = false;
  currentSeat: Seat | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.busId = +params['id'];
      this.loadBusDetails();
      this.loadSeats();
    });
  }

  loadBusDetails() {
    const busData: {[key: number]: BusDetails} = {
      1: {
        id: 1,
        name: 'VRL Volvo Multi-Axle Sleeper',
        operator: 'VRL Travels',
        type: 'AC Sleeper',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '18:30',
        arrivalTime: '06:30',
        duration: '12h 00m',
        price: 1299,
        busType: 'sleeper',
        totalSeats: 36
      },
      2: {
        id: 2,
        name: 'SRS Luxury Volvo',
        operator: 'SRS Travels',
        type: 'AC Seater',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '20:00',
        arrivalTime: '08:00',
        duration: '12h 00m',
        price: 999,
        busType: 'seater',
        totalSeats: 40
      }
    };

    this.busDetails = busData[this.busId] || {
      id: this.busId,
      name: 'Volvo Multi-Axle Bus',
      operator: 'Travels',
      type: 'AC Sleeper',
      origin: 'Delhi',
      destination: 'Mumbai',
      departureTime: '18:30',
      arrivalTime: '06:30',
      duration: '12h',
      price: 1299,
      busType: 'sleeper',
      totalSeats: 36
    };
  }

  loadSeats() {
    this.loadLowerDeckSeats();
    this.loadUpperDeckSeats();
  }

  loadLowerDeckSeats() {
    const seats: Seat[] = [];
    let id = 1;
    
    for (let row = 1; row <= 8; row++) {
      // Column A
      seats.push({
        id: id++,
        number: `L${row}A`,
        row: row,
        column: 'A',
        deck: 'lower',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row, 'A'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'male' : 'none',
        tempSelected: false
      });
      
      // Column B
      seats.push({
        id: id++,
        number: `L${row}B`,
        row: row,
        column: 'B',
        deck: 'lower',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row, 'B'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'female' : 'none',
        tempSelected: false
      });
      
      // Column C
      seats.push({
        id: id++,
        number: `L${row}C`,
        row: row,
        column: 'C',
        deck: 'lower',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row, 'C'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'male' : 'none',
        tempSelected: false
      });
      
      // Column D
      seats.push({
        id: id++,
        number: `L${row}D`,
        row: row,
        column: 'D',
        deck: 'lower',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row, 'D'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'female' : 'none',
        tempSelected: false
      });
    }
    
    this.lowerDeckSeats = seats;
  }

  loadUpperDeckSeats() {
    const seats: Seat[] = [];
    let id = 100;
    
    for (let row = 1; row <= 8; row++) {
      seats.push({
        id: id++,
        number: `U${row}A`,
        row: row,
        column: 'A',
        deck: 'upper',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row + 10, 'A'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'male' : 'none',
        tempSelected: false
      });
      
      seats.push({
        id: id++,
        number: `U${row}B`,
        row: row,
        column: 'B',
        deck: 'upper',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row + 10, 'B'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'female' : 'none',
        tempSelected: false
      });
      
      seats.push({
        id: id++,
        number: `U${row}C`,
        row: row,
        column: 'C',
        deck: 'upper',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row + 10, 'C'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'male' : 'none',
        tempSelected: false
      });
      
      seats.push({
        id: id++,
        number: `U${row}D`,
        row: row,
        column: 'D',
        deck: 'upper',
        price: this.busDetails?.price || 1299,
        status: this.getSeatStatus(row + 10, 'D'),
        type: 'sleeper',
        gender: Math.random() > 0.7 ? 'female' : 'none',
        tempSelected: false
      });
    }
    
    this.upperDeckSeats = seats;
  }

  getSeatStatus(row: number, column: string): 'available' | 'booked' | 'selected' | 'blocked' {
    const bookedSeats = [
      'L3B', 'L4C', 'L5A', 'L6D', 'L7B', 'L8C',
      'U2A', 'U3D', 'U4B', 'U5C', 'U7A'
    ];
    
    const seatNum = `${row}${column}`;
    
    if (bookedSeats.includes(seatNum)) {
      return 'booked';
    }
    
    return 'available';
  }

  toggleDeck() {
    this.showUpperDeck = !this.showUpperDeck;
  }

  getCurrentDeckSeats(): Seat[] {
    return this.showUpperDeck ? this.upperDeckSeats : this.lowerDeckSeats;
  }

  getSeatsByColumn(column: 'A' | 'B' | 'C' | 'D'): Seat[] {
    return this.getCurrentDeckSeats()
      .filter(seat => seat.column === column)
      .sort((a, b) => a.row - b.row);
  }

  // Toggle multi-select mode
  toggleMultiSelectMode() {
    this.isMultiSelectMode = !this.isMultiSelectMode;
    if (!this.isMultiSelectMode) {
      this.clearTempSelection();
    }
  }

  // Clear temporary selection
  clearTempSelection() {
    this.getCurrentDeckSeats().forEach(seat => {
      if (seat.tempSelected) {
        seat.tempSelected = false;
      }
    });
    this.tempSelectedSeats = [];
  }

  // Updated toggleSeat method for multi-select
  toggleSeat(seat: Seat) {
    if (seat.status === 'booked' || seat.status === 'blocked' || seat.status === 'selected') {
      return;
    }
    
    if (this.isMultiSelectMode) {
      // Multi-select mode
      if (seat.tempSelected) {
        seat.tempSelected = false;
        this.tempSelectedSeats = this.tempSelectedSeats.filter(s => s.id !== seat.id);
      } else {
        // Check if adding this seat would exceed max seats
        const totalAfterAdd = this.selectedSeats.length + this.tempSelectedSeats.length + 1;
        if (totalAfterAdd > this.maxSeats) {
          this.showLimitWarning = true;
          setTimeout(() => {
            this.showLimitWarning = false;
          }, 3000);
          return;
        }
        seat.tempSelected = true;
        this.tempSelectedSeats.push(seat);
      }
    } else {
      // Single select mode - direct selection
      if (this.selectedSeats.length >= this.maxSeats) {
        this.showLimitWarning = true;
        setTimeout(() => {
          this.showLimitWarning = false;
        }, 3000);
        return;
      }
      
      this.currentSeat = seat;
      this.passengers = [{
        seatNumber: seat.number,
        name: '',
        age: null,
        gender: 'male',
        phone: '',
        email: ''
      }];
      this.showPassengerModal = true;
    }
  }

  // Confirm multi-selection
  confirmMultiSelection() {
    if (this.tempSelectedSeats.length === 0) {
      return;
    }
    
    // Prepare passengers array for all temp selected seats
    this.passengers = this.tempSelectedSeats.map(seat => ({
      seatNumber: seat.number,
      name: '',
      age: null,
      gender: 'male',
      phone: '',
      email: ''
    }));
    
    this.showMultiSelectConfirm = false;
    this.showPassengerModal = true;
  }

  // Cancel multi-selection
  cancelMultiSelection() {
    this.clearTempSelection();
    this.showMultiSelectConfirm = false;
  }

  // Confirm all passenger details
  confirmAllPassengers() {
    // Validate all passengers have required fields
    const isValid = this.passengers.every(p => p.name && p.age && p.phone);
    
    if (!isValid) {
      alert('Please fill in all passenger details');
      return;
    }
    
    // Mark all temp selected seats as selected
    this.tempSelectedSeats.forEach(seat => {
      const seatToUpdate = this.findSeatById(seat.id);
      if (seatToUpdate) {
        seatToUpdate.status = 'selected';
        seatToUpdate.tempSelected = false;
      }
    });
    
    this.selectedSeats = [...this.selectedSeats, ...this.tempSelectedSeats];
    this.tempSelectedSeats = [];
    this.calculateTotal();
    this.showPassengerModal = false;
    this.isMultiSelectMode = false;
  }

  // Find seat by ID in both decks
  findSeatById(id: number): Seat | undefined {
    return [...this.lowerDeckSeats, ...this.upperDeckSeats].find(s => s.id === id);
  }

  // Remove a selected seat
  removeSelectedSeat(seat: Seat) {
    const seatToUpdate = this.findSeatById(seat.id);
    if (seatToUpdate) {
      seatToUpdate.status = 'available';
    }
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
    
    alert(`Proceeding to payment with ${this.selectedSeats.length} seats`);
    // Navigate to payment page
    // this.router.navigate(['/payment'], { state: { seats: this.selectedSeats, bus: this.busDetails } });
  }

  getSeatStatusClass(seat: Seat): string {
    if (seat.tempSelected) {
      return 'seat-temp-selected';
    }
    switch(seat.status) {
      case 'available': return 'seat-available';
      case 'booked': return 'seat-booked';
      case 'selected': return 'seat-selected';
      case 'blocked': return 'seat-blocked';
      default: return '';
    }
  }

  getAvailableSeatsCount(): number {
    return this.getCurrentDeckSeats().filter(s => s.status === 'available').length;
  }

  getBookedSeatsCount(): number {
    return this.getCurrentDeckSeats().filter(s => s.status === 'booked').length;
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

  getRowNumbers(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }

  // Update passenger details
  updatePassenger(index: number, field: string, value: any) {
    if (this.passengers[index]) {
      (this.passengers[index] as any)[field] = value;
    }
  }

  // Check if all passengers are valid
  areAllPassengersValid(): boolean {
    return this.passengers.every(p => 
      p.name && 
      p.name.trim() !== '' && 
      p.age !== null && 
      p.age > 0 && 
      p.age < 120 && 
      p.phone && 
      p.phone.length === 10
    );
  }
}