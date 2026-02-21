import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface Seat {
  id: number;
  number: string;
  type: 'sleeper' | 'seater';
  deck: 'upper' | 'lower';
  price: number;
  status: 'available' | 'booked' | 'selected' | 'blocked';
  gender?: 'male' | 'female' | 'none';
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
  
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  
  passengerDetails = {
    name: '',
    age: null,
    gender: 'male',
    phone: '',
    email: ''
  };
  
  bookingSummary = {
    baseFare: 0,
    tax: 0,
    total: 0
  };
  
  showPassengerModal: boolean = false;
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
        name: 'VRL Volvo AC Sleeper',
        operator: 'VRL Travels',
        type: 'AC Sleeper',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '18:30',
        arrivalTime: '06:30',
        duration: '12h 00m',
        price: 1299
      },
      2: {
        id: 2,
        name: 'SRS Luxury AC Seater',
        operator: 'SRS Travels',
        type: 'AC Seater',
        origin: 'Delhi',
        destination: 'Mumbai',
        departureTime: '20:00',
        arrivalTime: '08:00',
        duration: '12h 00m',
        price: 999
      },
      3: {
        id: 3,
        name: 'Orange Tours Volvo',
        operator: 'Orange Tours',
        type: 'Volvo',
        origin: 'Bangalore',
        destination: 'Chennai',
        departureTime: '22:00',
        arrivalTime: '05:00',
        duration: '7h 00m',
        price: 899
      },
      4: {
        id: 4,
        name: 'Kallada Non-AC Sleeper',
        operator: 'Kallada Travels',
        type: 'Non-AC Sleeper',
        origin: 'Mumbai',
        destination: 'Pune',
        departureTime: '23:30',
        arrivalTime: '03:00',
        duration: '3h 30m',
        price: 499
      },
      5: {
        id: 5,
        name: 'City Express AC Sleeper',
        operator: 'City Express',
        type: 'AC Sleeper',
        origin: 'Delhi',
        destination: 'Agra',
        departureTime: '07:00',
        arrivalTime: '11:00',
        duration: '4h 00m',
        price: 799
      }
    };

    this.busDetails = busData[this.busId] || {
      id: this.busId,
      name: 'Unknown Bus',
      operator: 'Unknown Operator',
      type: 'AC Sleeper',
      origin: 'Unknown',
      destination: 'Unknown',
      departureTime: '00:00',
      arrivalTime: '00:00',
      duration: '0h',
      price: 0
    };
  }

  loadSeats() {
    const seats: Seat[] = [];
    let id = 1;
    
    // Lower deck - 30 seats (10 rows x 3 columns)
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 3; col++) {
        const seatNumber = `L${row}${String.fromCharCode(64 + col)}`;
        const status = this.getRandomStatus();
        seats.push({
          id: id++,
          number: seatNumber,
          type: 'sleeper',
          deck: 'lower',
          price: this.busDetails?.price || 1299,
          status: status,
          gender: status === 'booked' ? (Math.random() > 0.5 ? 'male' : 'female') : 'none'
        });
      }
    }
    
    // Upper deck - 30 seats (10 rows x 3 columns)
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 3; col++) {
        const seatNumber = `U${row}${String.fromCharCode(64 + col)}`;
        const status = this.getRandomStatus();
        seats.push({
          id: id++,
          number: seatNumber,
          type: 'sleeper',
          deck: 'upper',
          price: this.busDetails?.price || 1299,
          status: status,
          gender: status === 'booked' ? (Math.random() > 0.5 ? 'male' : 'female') : 'none'
        });
      }
    }
    
    this.seats = seats;
  }

  getRandomStatus(): 'available' | 'booked' | 'selected' | 'blocked' {
    const rand = Math.random();
    if (rand < 0.6) return 'available';
    if (rand < 0.85) return 'booked';
    return 'blocked';
  }

  getLowerDeckSeats(): Seat[] {
    return this.seats.filter(seat => seat.deck === 'lower');
  }

  getUpperDeckSeats(): Seat[] {
    return this.seats.filter(seat => seat.deck === 'upper');
  }

  toggleSeat(seat: Seat) {
    if (seat.status === 'booked' || seat.status === 'blocked') {
      return;
    }
    
    if (seat.status === 'available') {
      this.currentSeat = seat;
      this.showPassengerModal = true;
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
      this.calculateTotal();
    }
  }

  confirmSeatSelection() {
    if (this.currentSeat) {
      this.currentSeat.status = 'selected';
      this.selectedSeats.push(this.currentSeat);
      this.calculateTotal();
      this.showPassengerModal = false;
      this.currentSeat = null;
      this.passengerDetails = {
        name: '',
        age: null,
        gender: 'male',
        phone: '',
        email: ''
      };
    }
  }

  cancelSeatSelection() {
    this.showPassengerModal = false;
    this.currentSeat = null;
    this.passengerDetails = {
      name: '',
      age: null,
      gender: 'male',
      phone: '',
      email: ''
    };
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
    alert('Proceeding to payment! This would connect to Khalti/eSewa in a real app.');
  }

  getSeatStatusClass(seat: Seat): string {
    switch(seat.status) {
      case 'available': return 'seat-available';
      case 'booked': return 'seat-booked';
      case 'selected': return 'seat-selected';
      case 'blocked': return 'seat-blocked';
      default: return '';
    }
  }

  getSeatGenderClass(seat: Seat): string {
    if (seat.status !== 'booked') return '';
    return seat.gender === 'male' ? 'seat-male' : 'seat-female';
  }

  getAvailableSeatsCount(): number {
    return this.seats.filter(s => s.status === 'available').length;
  }

  getBookedSeatsCount(): number {
    return this.seats.filter(s => s.status === 'booked').length;
  }

  goBack() {
    this.router.navigate(['/buses']);
  }
}