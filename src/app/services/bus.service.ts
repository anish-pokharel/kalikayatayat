import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bus {
  _id?: string;
  busNumber: string;
  busName: string;
  busType: string;
  operator?: string;
  origin?: string;
  destination?: string;
  route?: string;           // Add this
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  fare: number;
  price?: number;           // Add this (for backward compatibility)
  totalSeats: number;
  availableSeats?: number;  // Add this
  rating?: number;          // Add this
  amenities: string[];
  status: string;
  distance?: number;        // Add this
  routeId?: string;         // Add this
  routeName?: string;       // Add this
  driverName?: string;      // Add this
  driverPhone?: string;     // Add this
  driverLicense?: string;   // Add this
  seatLayout?: string;      // Add this
  createdAt?: string;       // Add this
}

export interface BoardingPoint {
  _id: string;
  busId: string;
  name: string;
  address: string;
  time: string;
  contact: string;
  landmark?: string;
  city: string;
  fare: number;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface Seat {
  _id?: string;
  seatNumber: string;
  isAvailable: boolean;
  isBooked?: boolean;
  isSelected?: boolean;
  passengerName?: string;
  passengerAge?: number;
  passengerGender?: string;
  price?: number;
}
export interface PassengerDetail {
  seatNumber: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  passengerPhone: string;
  passengerEmail?: string;
}

export interface BookingRequest {
  busId: string;
  seats: PassengerDetail[];
  boardingPoint: any;
  totalAmount: number;
  taxAmount: number;
  journeyDate: string;
  paymentMethod: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
  data?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  bookingId?: any;
}

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  data: Bus[];
  from: string;
  to: string;
  date: string;
  passengers: number;
  message?: string;
}

export interface Route {
  _id: string;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  status: string;
}

export interface FareInfo {
  fare: number;
  routeName: string;
  source: 'fare_declaration' | 'calculated';
  effectiveFrom?: string;
  effectiveTo?: string;
  distance?: number;
  rate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // ==================== ADMIN ENDPOINTS ====================

  // Get all routes
  getRoutes(): Observable<ApiResponse<Route[]>> {
    return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}/routes`);
  }

  // Get fare for bus type and route
  getBusFare(routeId: string, busType: string): Observable<ApiResponse<FareInfo>> {
    return this.http.get<ApiResponse<FareInfo>>(`${this.apiUrl}/bus-fare/${routeId}/${busType}`);
  }

  // Get all buses (admin)
  getBuses(routeId?: string, busType?: string, status?: string, search?: string): Observable<ApiResponse<Bus[]>> {
    let url = `${this.apiUrl}/buses`;
    const params: string[] = [];

    if (routeId && routeId !== 'all') params.push(`routeId=${routeId}`);
    if (busType && busType !== 'all') params.push(`busType=${encodeURIComponent(busType)}`);
    if (status && status !== 'all') params.push(`status=${status}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Bus[]>>(url);
  }

  // Create new bus
  createBus(busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
    return this.http.post<ApiResponse<Bus>>(`${this.apiUrl}/buses`, busData);
  }

  // Update bus
  updateBus(id: string, busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
    return this.http.put<ApiResponse<Bus>>(`${this.apiUrl}/buses/${id}`, busData);
  }

  // Delete bus
  deleteBus(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/buses/${id}`);
  }

  // Toggle bus status
  toggleBusStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/buses/${id}/toggle-status`, {});
  }

  // ==================== PUBLIC ENDPOINTS ====================

  // Search buses by route
  searchBuses(criteria: SearchCriteria): Observable<SearchResponse> {
    let url = `${this.apiUrl}/buses/search?from=${encodeURIComponent(criteria.from)}&to=${encodeURIComponent(criteria.to)}`;
    if (criteria.date) url += `&date=${criteria.date}`;
    if (criteria.passengers) url += `&passengers=${criteria.passengers}`;

    return this.http.get<SearchResponse>(url);
  }

  // Get popular routes
  getPopularRoutes(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/popular-routes`);
  }

  // Get all operators
  getOperators(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/operators`);
  }

  // Get bus by ID for public users (seat selection)
  getBusById(id: string): Observable<ApiResponse<Bus>> {
    return this.http.get<ApiResponse<Bus>>(`${this.apiUrl}/buses/public/${id}`);
  }

  // Get boarding points for a bus


  // Get seat layout for a bus
  getBusSeats(busId: string): Observable<ApiResponse<Seat[]>> {
    return this.http.get<ApiResponse<Seat[]>>(`${this.apiUrl}/buses/${busId}/seats`);
  }

  // ==================== BOOKING ENDPOINTS ====================

  // Create booking
  createBooking(bookingData: BookingRequest): Observable<ApiResponse<BookingResponse>> {
    return this.http.post<ApiResponse<BookingResponse>>(`${this.apiUrl}/bookings`, bookingData);
  }

  // Get booking by ID
  getBookingById(bookingId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  // Cancel booking
  cancelBooking(bookingId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/bookings/${bookingId}`);
  }

  // Get user's bookings
  getUserBookings(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/bookings/my-bookings`);
  }
  // Add to your BusService class

    getBoardingPoints(busId: string): Observable<ApiResponse<BoardingPoint[]>> {
    return this.http.get<ApiResponse<BoardingPoint[]>>(`${this.apiUrl}/buses/${busId}/boarding-points`);
  }

  // Admin methods for boarding points
  createBoardingPoint(busId: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
    return this.http.post<ApiResponse<BoardingPoint>>(`${this.apiUrl}/buses/${busId}/boarding-points`, data);
  }

  getBoardingPointById(id: string): Observable<ApiResponse<BoardingPoint>> {
    return this.http.get<ApiResponse<BoardingPoint>>(`${this.apiUrl}/boarding-points/${id}`);
  }

  updateBoardingPoint(id: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
    return this.http.put<ApiResponse<BoardingPoint>>(`${this.apiUrl}/boarding-points/${id}`, data);
  }

  deleteBoardingPoint(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/boarding-points/${id}`);
  }

  toggleBoardingPointStatus(id: string): Observable<ApiResponse<BoardingPoint>> {
    return this.http.patch<ApiResponse<BoardingPoint>>(`${this.apiUrl}/boarding-points/${id}/toggle-status`, {});
  }
  // Add this method to your BusService
// Get route stops by route ID
getRouteStops(routeId: string): Observable<ApiResponse<any>> {
  return this.http.get<ApiResponse<any>>(`${this.apiUrl}/routes/${routeId}/stops`);
}
// Get booked seats for a bus
getBookedSeats(busId: string): Observable<ApiResponse<any[]>> {
  return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/buses/${busId}/booked-seats`);
}
}