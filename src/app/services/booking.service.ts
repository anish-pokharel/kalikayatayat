// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// export interface Passenger {
//   seatNumber: string;
//   passengerName: string;
//   passengerAge: number;
//   passengerGender: string;
//   passengerPhone: string;
//   passengerEmail?: string;
// }

// export interface BookingRequest {
//   busId: string;
//   seats: Passenger[];
//   totalAmount: number;
//   taxAmount: number;
//   journeyDate: string;
//   paymentMethod: string;
// }

// export interface Booking {
//   _id: string;
//   bookingId: string;
//   userId: any;
//   busId: any;
//   busDetails: {
//     _id?: string;
//     busNumber: string;
//     busName: string;
//     busType: string;
//     operator: string;
//   };
//   routeDetails: {
//     origin: string;
//     destination: string;
//     departureTime: string;
//     arrivalTime: string;
//     duration: string;
//     distance: number;
//   };
//   seats: Array<{
//     seatNumber: string;
//     passengerName: string;
//     passengerAge: number;
//     passengerGender: string;
//     passengerPhone: string;
//     passengerEmail?: string;
//   }>;
//   passengerDetails?: Array<{
//     name: string;
//     age: number;
//     gender: string;
//     seatNumber: string;
//     phone: string;
//     email: string;
//   }>;
//   totalAmount: number;
//   taxAmount: number;
//   bookingDate: string;
//   journeyDate: string;
//   travelDate?: string;
//   status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
//   bookingStatus?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
//   paymentStatus: 'paid' | 'pending' | 'refunded';
//   paymentMethod: string;
//   cancellationDetails?: {
//     cancelledAt: string;
//     refundAmount: number;
//     reason: string;
//   };
//   userDetails?: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//   };
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data: T;
//   count?: number;
// }

// export interface BookingStats {
//   totalBookings: number;
//   totalRevenue: number;
//   confirmedBookings: number;
//   cancelledBookings: number;
//   pendingBookings: number;
//   completedBookings: number;
//   averageBookingValue: number;
//   todayBookings: number;
//   weeklyBookings: number;
//   monthlyBookings: number;
// }

// export interface SeatBookingInfo {
//   seatNumber: string;
//   passengerName: string;
//   passengerPhone: string;
//   passengerEmail?: string;
//   passengerAge?: number;
//   passengerGender?: string;
//   bookingId: string;
//   userId: any;
//   bookingStatus: string;
//   paymentStatus: string;
//   journeyDate: string;
// }

// export interface BusSeatMap {
//   bus: any;
//   journeyDate: string;
//   seats: Array<{
//     seatNumber: string;
//     status: 'available' | 'booked';
//     passenger?: SeatBookingInfo | null;
//     seatType?: string;
//     price?: number;
//   }>;
//   totalSeats: number;
//   bookedSeats: number;
//   availableSeats: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class BookingService {
//   getBusSeatMap(selectedBus: string, selectedJourneyDate: string) {
//     throw new Error('Method not implemented.');
//   }
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiUrl}`;

//   createBooking(bookingData: any): Observable<ApiResponse<any>> {
//     return this.http.post<ApiResponse<any>>(`${this.apiUrl}/bookings`, bookingData);
//   }

//   getMyBookings(): Observable<ApiResponse<Booking[]>> {
//     return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/bookings/my-bookings`);
//   }

//   getBookingById(id: string): Observable<ApiResponse<Booking>> {
//     return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/bookings/${id}`);
//   }

//   cancelBooking(id: string, reason?: string): Observable<ApiResponse<any>> {
//     return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/bookings/${id}/cancel`, { reason });
//   }

//   // Admin booking endpoints
//   getAllBookings(filters?: any): Observable<ApiResponse<Booking[]>> {
//     let url = `${this.apiUrl}/admin/bookings`;
//     const params: string[] = [];

//     if (filters) {
//       if (filters.status) params.push(`status=${filters.status}`);
//       if (filters.busId) params.push(`busId=${filters.busId}`);
//       if (filters.paymentStatus) params.push(`paymentStatus=${filters.paymentStatus}`);
//       if (filters.fromDate) params.push(`fromDate=${filters.fromDate}`);
//       if (filters.toDate) params.push(`toDate=${filters.toDate}`);
//       if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
//       if (filters.page) params.push(`page=${filters.page}`);
//       if (filters.limit) params.push(`limit=${filters.limit}`);
//     }

//     if (params.length > 0) url += '?' + params.join('&');

//     return this.http.get<ApiResponse<Booking[]>>(url);
//   }

//   // Get booking statistics
//   getBookingStatistics(period: string): Observable<ApiResponse<any>> {
//     return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/statistics?period=${period}`);
//   }
  
//   // Get booked seats
//   // getBookedSeats(busId: string, travelDate: string): Observable<any> {
//   //   return this.http.get(`${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`);
//   // }

//   // Update booking status
//   updateBookingStatus(id: string, status: string): Observable<ApiResponse<any>> {
//     return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/admin/bookings/${id}/status`, { status });
//   }

//   // Get bus bookings
//   getBusBookings(busId: string, date?: string): Observable<ApiResponse<any>> {
//     let url = `${this.apiUrl}/admin/bookings/bus/${busId}`;
//     if (date) url += `?date=${date}`;
//     return this.http.get<ApiResponse<any>>(url);
//   }
  
//   // Get bus seat map with booking details
//   getBusSeats(busId: string, journeyDate: string): Observable<ApiResponse<BusSeatMap>> {
//     return this.http.get<ApiResponse<BusSeatMap>>(`${this.apiUrl}/bookings/admin/bus-seats/${busId}/${journeyDate}`);
//   }

//   // Get bookings by bus and date
//   getBookingsByBusAndDate(busId: string, date: string): Observable<ApiResponse<Booking[]>> {
//     return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/admin/bookings/bus/${busId}?date=${date}`);
//   }

//   // Get passenger details by booking
//   getPassengerDetails(bookingId: string): Observable<ApiResponse<any>> {
//     return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/bookings/${bookingId}/passengers`);
//   }

//   // Export bookings to CSV/Excel
//   exportBookings(filters?: any): Observable<Blob> {
//     let url = `${this.apiUrl}/admin/bookings/export`;
//     const params: string[] = [];
    
//     if (filters) {
//       Object.keys(filters).forEach(key => {
//         if (filters[key]) params.push(`${key}=${encodeURIComponent(filters[key])}`);
//       });
//     }
    
//     if (params.length > 0) url += '?' + params.join('&');
    
//     return this.http.get(url, { responseType: 'blob' });
//   }

// // Add this method to your BookingService class
// getPublicBookedSeats(busId: string, travelDate: string): Observable<any> {
//   return this.http.get(`${this.apiUrl}/bookings/public/seats/available/${busId}/${travelDate}`);
// }
// // In booking.service.ts - Make sure this method exists
// // getBookedSeats(busId: string, travelDate: string): Observable<any> {
// //   console.log(`📡 BookingService: Fetching booked seats for bus ${busId} on date ${travelDate}`);
// //   return this.http.get(`${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`);
// // }

// // In booking.service.ts
// getBookedSeats(busId: string, travelDate: string): Observable<any> {
//     console.log(`📡 BookingService.getBookedSeats called with busId: ${busId}, travelDate: ${travelDate}`);
//     const url = `${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`;
//     console.log(`📡 API URL: ${url}`);
//     return this.http.get(url);
// }

// }


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Passenger {
  seatNumber: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  passengerPhone: string;
  passengerEmail?: string;
}

// export interface BookingRequest {
//   busId: string;
//   seats: Passenger[];
//   totalAmount: number;
//   taxAmount: number;
//   journeyDate: string;
//   paymentMethod: string;
//   // Add optional boarding fields
//   boardingPoint?: string;
//   boardingAddress?: string;
//   boardingTime?: string;
// }

export interface BookingRequest {
  busId: string;
  seats: Passenger[];
  totalAmount: number;
  taxAmount: number;
  journeyDate: string;
  paymentMethod: string;
  boardingPoint?: string;
  boardingAddress?: string;
  boardingTime?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  userId: any;
  busId: any;
  busDetails: {
    _id?: string;
    busNumber: string;
    busName: string;
    busType: string;
    operator: string;
  };
  routeDetails: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    distance: number;
  };
  seats: Array<{
name: string;
    seatNumber: string;
    passengerName: string;
    passengerAge: number;
    passengerGender: string;
    passengerPhone: string;
    passengerEmail?: string;
  }>;
  passengerDetails?: Array<{
    name: string;
    age: number;
    gender: string;
    seatNumber: string;
    phone: string;
    email: string;
  }>;
  totalAmount: number;
  taxAmount: number;
  bookingDate: string;
  journeyDate: string;
  travelDate?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  bookingStatus?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  cancellationDetails?: {
    cancelledAt: string;
    refundAmount: number;
    reason: string;
  };
  userDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
}




// // In booking.service.ts
// // booking.service.ts
export interface Booking1 {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  status?: string; // Alias for bookingStatus
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  taxAmount: number;
  contactNumber?: string;
  email?: string;
  bookingDate: string;
  journeyDate?: string;
  travelDate?: string;
  boardingPoint?: string;
  busId: any;
  routeId: any;
  seats: any[];
  passengerDetails?: any[];
  busName?: string;
  busNumber?: string;
  busType?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: any;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  
  // For transformed data from API
  busDetails?: {
    busName: string;
    busNumber: string;
    busType: string;
    operator: string;
  };
  
  routeDetails?: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    distance?: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export interface BusSeatMap {
  bus: any;
  journeyDate: string;
  seats: Array<{
    seatNumber: string;
    status: 'available' | 'booked';
    passenger?: any;
    seatType?: string;
    price?: number;
  }>;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  createBooking(bookingData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/bookings`, bookingData);
  }

  getMyBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/bookings/my-bookings`);
  }

  getBookingById(id: string): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/bookings/${id}`);
  }

  cancelBooking(id: string, reason?: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/bookings/${id}/cancel`, { reason });
  }

  // Admin booking endpoints - FIXED PATH
  getAllBookings(filters?: any): Observable<ApiResponse<Booking[]>> {
    let url = `${this.apiUrl}/bookings/admin/all`;  // Changed from admin/bookings to bookings/admin/all
    const params: string[] = [];

    if (filters) {
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
      if (filters.busId && filters.busId !== 'all') params.push(`busId=${filters.busId}`);
      if (filters.paymentStatus && filters.paymentStatus !== 'all') params.push(`paymentStatus=${filters.paymentStatus}`);
      if (filters.fromDate) params.push(`fromDate=${filters.fromDate}`);
      if (filters.toDate) params.push(`toDate=${filters.toDate}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.page) params.push(`page=${filters.page}`);
      if (filters.limit) params.push(`limit=${filters.limit}`);
    }

    if (params.length > 0) url += '?' + params.join('&');
    
    console.log('Fetching bookings from:', url);
    return this.http.get<ApiResponse<Booking[]>>(url);
  }

  // Get booking statistics
  getBookingStatistics(period: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/bookings/admin/statistics?period=${period}`);
  }
  
  // Get booked seats for public
  getBookedSeats(busId: string, travelDate: string): Observable<any> {
    console.log(`📡 BookingService.getBookedSeats called with busId: ${busId}, travelDate: ${travelDate}`);
    const url = `${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`;
    return this.http.get(url);
  }

  // Update booking status - FIXED PATH
  updateBookingStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/bookings/admin/${id}/status`, { status });
  }

  // Get bus bookings - FIXED PATH
  getBusBookings(busId: string, date?: string): Observable<ApiResponse<any>> {
    let url = `${this.apiUrl}/bookings/admin/bus/${busId}`;
    if (date) url += `?date=${date}`;
    return this.http.get<ApiResponse<any>>(url);
  }
  
  // Get bus seat map with booking details - FIXED PATH
  getBusSeats(busId: string, journeyDate: string): Observable<ApiResponse<BusSeatMap>> {
    return this.http.get<ApiResponse<BusSeatMap>>(`${this.apiUrl}/bookings/admin/bus-seats/${busId}/${journeyDate}`);
  }

  // Get bookings by bus and date
  getBookingsByBusAndDate(busId: string, date: string): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/bookings/admin/bus/${busId}?date=${date}`);
  }

  // Get passenger details by booking
  getPassengerDetails(bookingId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/bookings/admin/${bookingId}/passengers`);
  }

  // Export bookings to CSV/Excel
  exportBookings(filters?: any): Observable<Blob> {
    let url = `${this.apiUrl}/bookings/admin/export`;
    const params: string[] = [];
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.push(`${key}=${encodeURIComponent(filters[key])}`);
      });
    }
    
    if (params.length > 0) url += '?' + params.join('&');
    
    return this.http.get(url, { responseType: 'blob' });
  }

  // Public endpoint for available seats
  getPublicBookedSeats(busId: string, travelDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`);
  }
}