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

export interface BookingRequest {
  busId: string;
  seats: Passenger[];
  totalAmount: number;
  taxAmount: number;
  journeyDate: string;
  paymentMethod: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  userId: any;
  busId: any;
  busDetails: {
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
    seatNumber: string;
    passengerName: string;
    passengerAge: number;
    passengerGender: string;
    passengerPhone: string;
    passengerEmail?: string;
  }>;
  totalAmount: number;
  taxAmount: number;
  bookingDate: string;
  journeyDate: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;  // ADD THIS LINE
  cancellationDetails?: {
    cancelledAt: string;
    refundAmount: number;
    reason: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
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

  // Admin booking endpoints
  getAllBookings(filters?: any): Observable<ApiResponse<Booking[]>> {
    let url = `${this.apiUrl}/admin/bookings`;
    const params: string[] = [];

    if (filters) {
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.busId) params.push(`busId=${filters.busId}`);
      if (filters.paymentStatus) params.push(`paymentStatus=${filters.paymentStatus}`);
      if (filters.fromDate) params.push(`fromDate=${filters.fromDate}`);
      if (filters.toDate) params.push(`toDate=${filters.toDate}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.page) params.push(`page=${filters.page}`);
      if (filters.limit) params.push(`limit=${filters.limit}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Booking[]>>(url);
  }

  // ADD THIS MISSING METHOD
  getBookingStatistics(period: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/statistics?period=${period}`);
  }

  updateBookingStatus(id: string, status: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/admin/bookings/${id}/status`, { status });
  }

  getBusBookings(busId: string, date?: string): Observable<ApiResponse<any>> {
    let url = `${this.apiUrl}/admin/bookings/bus/${busId}`;
    if (date) url += `?date=${date}`;
    return this.http.get<ApiResponse<any>>(url);
  }
}
