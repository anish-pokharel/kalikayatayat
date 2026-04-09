// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// export interface Bus {
// source: any;
//   _id?: string;
//   busNumber: string;
//   busName: string;
//   busType: string;
//   operator?: string;
//   routeId?: string;
//   routeName?: string;
//   route?: string;
//   origin?: string;
//   destination?: string;
//   departureTime?: string;
//   arrivalTime?: string;
//   duration?: string;
//   fare: number;
//   price?: number;
//   totalSeats: number;
//   availableSeats?: number;
//   bookedSeats?: string[];
//   amenities: string[];
//   seatLayout?: string;
//   status: string;
//   rating?: number;
//   distance?: number;
//   driverName?: string;
//   driverPhone?: string;
//   driverLicense?: string;
//   seats?: any[];
//   boardingPoints?: any[];
//   departureDate?: string;
//   arrivalDate?: string;
// }

// export interface Route {
// busesAssigned: any;
//   _id?: string;
//   routeName: string;
//   routeCode: string;
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: string;
//   stops?: Stop[];
//   status: 'active' | 'inactive';
//   totalStops?: number;
//   boardingPoints?: Stop[];
//   mealStops?: Stop[];
//   createdAt?: string;
// }

// export interface Stop {
//   _id?: string;
//   name: string;
//   type: 'boarding' | 'dropping' | 'rest' | 'meal' | 'pickup';
//   address: string;
//   city: string;
//   arrivalTime: string;
//   departureTime: string;
//   duration: number;
//   fare: number;
//   contact?: string;
//   landmark?: string;
//   amenities?: string[];
//   isMealStop: boolean;
//   mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | null;
//   description?: string;
//   isActive: boolean;
//   order: number;
// }

// export interface BoardingPoint {
//   _id?: string;
//   busId: string;
//   name: string;
//   address: string;
//   time: string;
//   contact: string;
//   landmark?: string;
//   city: string;
//   fare: number;
//   isActive: boolean;
//   order: number;
// }

// export interface Fare {
//   _id?: string;
//   routeId: string;
//   routeName?: string;
//   busType: string;
//   baseFare: number;
//   perKmRate: number;
//   minimumFare: number;
//   discountPercent: number;
//   taxPercent: number;
//   serviceCharge: number;
//   seatFare?: { [key: string]: number };
//   effectiveFrom: string;
//   effectiveTo: string;
//   status: 'active' | 'inactive';
// }

// export interface FareInfo {
//   fare: number;
//   routeName: string;
//   source: 'fare_declaration' | 'calculated';
//   effectiveFrom?: string;
//   effectiveTo?: string;
//   distance?: number;
//   rate?: number;
// }

// export interface SearchCriteria {
//   from: string;
//   to: string;
//   date: string;
//   passengers: number;
//   busType?: string;
// }

// export interface SearchResponse {
//   success: boolean;
//   count: number;
//   data: Bus[];
//   from: string;
//   to: string;
//   date: string;
//   passengers: number;
//   message?: string;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data: T;
//   count?: number;
//   total?: number;
//   page?: number;
//   pages?: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class BusService {
//   private http = inject(HttpClient);
//   private apiUrl = `${environment.apiUrl}`;

//   // ==================== ROUTE MANAGEMENT ====================

//   // Get all routes (admin)
//   getRoutes(filters?: any): Observable<ApiResponse<Route[]>> {
//     let url = `${this.apiUrl}/admin/routes`;
//     const params: string[] = [];

//     if (filters) {
//       if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
//       if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
//     }

//     if (params.length > 0) url += '?' + params.join('&');

//     return this.http.get<ApiResponse<Route[]>>(url);
//   }

//   // Get active routes for dropdown
//   getActiveRoutes(): Observable<ApiResponse<Route[]>> {
//     return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}/routes/active`);
//   }

//   // Get single route by ID
//   getRouteById(id: string): Observable<ApiResponse<Route>> {
//     return this.http.get<ApiResponse<Route>>(`${this.apiUrl}/admin/routes/${id}`);
//   }

//   // Create new route
//   createRoute(routeData: Partial<Route>): Observable<ApiResponse<Route>> {
//     return this.http.post<ApiResponse<Route>>(`${this.apiUrl}/admin/routes`, routeData);
//   }

//   // Update route
//   updateRoute(id: string, routeData: Partial<Route>): Observable<ApiResponse<Route>> {
//     return this.http.put<ApiResponse<Route>>(`${this.apiUrl}/admin/routes/${id}`, routeData);
//   }

//   // Delete route
//   deleteRoute(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/routes/${id}`);
//   }

//   // Get route stops
//   getRouteStops(routeId: string): Observable<ApiResponse<{ stops: Stop[] }>> {
//     return this.http.get<ApiResponse<{ stops: Stop[] }>>(`${this.apiUrl}/routes/${routeId}/stops`);
//   }

//   // Update route stops
//   updateRouteStops(routeId: string, stops: Stop[]): Observable<ApiResponse<Stop[]>> {
//     return this.http.put<ApiResponse<Stop[]>>(`${this.apiUrl}/routes/${routeId}/stops`, { stops });
//   }

//   // ==================== BUS MANAGEMENT ====================

//   // Get all buses (admin)
//   getBuses(filters?: any): Observable<ApiResponse<Bus[]>> {
//     let url = `${this.apiUrl}/admin/buses`;
//     const params: string[] = [];

//     if (filters) {
//       if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
//       if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
//       if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
//       if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
//       if (filters.page) params.push(`page=${filters.page}`);
//       if (filters.limit) params.push(`limit=${filters.limit}`);
//     }

//     if (params.length > 0) url += '?' + params.join('&');

//     return this.http.get<ApiResponse<Bus[]>>(url);
//   }

//   // Get active buses for public
//   getActiveBuses(filters?: any): Observable<ApiResponse<Bus[]>> {
//     let url = `${this.apiUrl}/buses/active`;
//     const params: string[] = [];

//     if (filters) {
//       if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
//       if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
//       if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
//     }

//     if (params.length > 0) url += '?' + params.join('&');

//     return this.http.get<ApiResponse<Bus[]>>(url);
//   }

//   // Search buses
//   searchBuses(criteria: SearchCriteria): Observable<SearchResponse> {
//     let url = `${this.apiUrl}/buses/search?from=${encodeURIComponent(criteria.from)}&to=${encodeURIComponent(criteria.to)}`;
//     if (criteria.date) url += `&date=${criteria.date}`;
//     if (criteria.passengers) url += `&passengers=${criteria.passengers}`;
//     if (criteria.busType) url += `&busType=${encodeURIComponent(criteria.busType)}`;
    
//     return this.http.get<SearchResponse>(url);
//   }

//   // Get bus by ID with details
//   getBusDetails(id: string, date?: string): Observable<ApiResponse<Bus>> {
//     let url = `${this.apiUrl}/buses/${id}/details`;
//     if (date) url += `?date=${date}`;
//     return this.http.get<ApiResponse<Bus>>(url);
//   }

//   // Get single bus (admin)
//   getBusById(id: string): Observable<ApiResponse<Bus>> {
//     return this.http.get<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses/${id}`);
//   }

 

//   // Create new bus
//   createBus(busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
//     return this.http.post<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses`, busData);
//   }

//   // Update bus
//   updateBus(id: string, busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
//     return this.http.put<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses/${id}`, busData);
//   }

//   // Delete bus
//   deleteBus(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/buses/${id}`);
//   }

//   // Toggle bus status
//   toggleBusStatus(id: string): Observable<ApiResponse<{ status: string }>> {
//     return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/admin/buses/${id}/toggle-status`, {});
//   }

  
// getBusForSeatSelection(id: string): Observable<any> {
//   return this.http.get(`${this.apiUrl}/buses/${id}`);
// }
// // Get booked seats for a bus on a specific date
// getBookedSeats(busId: string, travelDate: string): Observable<any> {
//   // Use the bookings endpoint which should be accessible to authenticated users
//   return this.http.get(`${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`);
// }

//   // ==================== FARE MANAGEMENT ====================

//   // Get fare for bus type and route
//   getBusFare(routeId: string, busType: string): Observable<ApiResponse<FareInfo>> {
//     return this.http.get<ApiResponse<FareInfo>>(`${this.apiUrl}/bus-fare/${routeId}/${busType}`);
//   }

//   // Get all fares
//   getFares(filters?: any): Observable<ApiResponse<Fare[]>> {
//     let url = `${this.apiUrl}/admin/fares`;
//     const params: string[] = [];

//     if (filters) {
//       if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
//       if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
//       if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
//     }

//     if (params.length > 0) url += '?' + params.join('&');

//     return this.http.get<ApiResponse<Fare[]>>(url);
//   }

//   // Get fare by ID
//   getFareById(id: string): Observable<ApiResponse<Fare>> {
//     return this.http.get<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares/${id}`);
//   }

//   // Create fare
//   createFare(fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
//     return this.http.post<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares`, fareData);
//   }

//   // Update fare
//   updateFare(id: string, fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
//     return this.http.put<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares/${id}`, fareData);
//   }

//   // Delete fare
//   deleteFare(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/fares/${id}`);
//   }

//   // Toggle fare status
//   toggleFareStatus(id: string): Observable<ApiResponse<{ status: string }>> {
//     return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/admin/fares/${id}/toggle-status`, {});
//   }

//   // ==================== POPULAR ROUTES & OPERATORS ====================

//   // Get popular routes
//   getPopularRoutes(): Observable<ApiResponse<string[]>> {
//     return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/popular-routes`);
//   }

//   // Get operators
//   getOperators(): Observable<ApiResponse<string[]>> {
//     return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/operators`);
//   }

//   // ==================== BOARDING POINT MANAGEMENT ====================

//   // Get boarding points for a bus
//   getBoardingPoints(busId: string): Observable<ApiResponse<BoardingPoint[]>> {
//     return this.http.get<ApiResponse<BoardingPoint[]>>(`${this.apiUrl}/buses/${busId}/boarding-points`);
//   }

//   // Create boarding point
//   createBoardingPoint(busId: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
//     return this.http.post<ApiResponse<BoardingPoint>>(`${this.apiUrl}/admin/buses/${busId}/boarding-points`, data);
//   }

//   // Update boarding point
//   updateBoardingPoint(id: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
//     return this.http.put<ApiResponse<BoardingPoint>>(`${this.apiUrl}/admin/boarding-points/${id}`, data);
//   }

//   // Delete boarding point
//   deleteBoardingPoint(id: string): Observable<ApiResponse<null>> {
//     return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/boarding-points/${id}`);
//   }
//   // In bus.service.ts
// getPublicBusById(id: string): Observable<any> {
//   return this.http.get(`${this.apiUrl}/buses/${id}`);
// }

//   // ==================== UTILITY METHODS ====================

//   // Get bus types
//   getBusTypes(): string[] {
//     return [
//       'AC Sleeper',
//       'AC Seater',
//       'Non-AC Sleeper',
//       'Non-AC Seater',
//       'Luxury',
//       'Volvo'
//     ];
//   }

//   // Get seat layouts
//   getSeatLayouts(): string[] {
//     return ['2x2', '2x1', '1x2', '2x3'];
//   }

//   // Get amenities
//   getAmenities(): string[] {
//     return [
//       'AC', 'WiFi', 'Charging Point', 'Water Bottle', 
//       'Blanket', 'Snacks', 'Movie', 'GPS', 'Reading Light',
//       'Emergency Exit', 'First Aid', 'Fire Extinguisher'
//     ];
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bus {
source: any;
  _id?: string;
  busNumber: string;
  busName: string;
  busType: string;
  operator?: string;
  routeId?: string;
  routeName?: string;
  route?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  fare: number;
  price?: number;
  totalSeats: number;
  availableSeats?: number;
  bookedSeats?: string[];
  amenities: string[];
  seatLayout?: string;
  status: string;
  rating?: number;
  distance?: number;
  driverName?: string;
  driverPhone?: string;
  driverLicense?: string;
  seats?: any[];
  boardingPoints?: any[];
  departureDate?: string;
  arrivalDate?: string;
}

export interface Route {
busesAssigned: any;
  _id?: string;
  routeName: string;
  routeCode: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  stops?: Stop[];
  status: 'active' | 'inactive';
  totalStops?: number;
  boardingPoints?: Stop[];
  mealStops?: Stop[];
  createdAt?: string;
}

export interface Stop {
  _id?: string;
  name: string;
  type: 'boarding' | 'dropping' | 'rest' | 'meal' | 'pickup';
  address: string;
  city: string;
  arrivalTime: string;
  departureTime: string;
  duration: number;
  fare: number;
  contact?: string;
  landmark?: string;
  amenities?: string[];
  isMealStop: boolean;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | null;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface BoardingPoint {
  _id?: string;
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
}

export interface Fare {
  _id?: string;
  routeId: string;
  routeName?: string;
  busType: string;
  baseFare: number;
  perKmRate: number;
  minimumFare: number;
  discountPercent: number;
  taxPercent: number;
  serviceCharge: number;
  seatFare?: { [key: string]: number };
  effectiveFrom: string;
  effectiveTo: string;
  status: 'active' | 'inactive';
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

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
  passengers: number;
  busType?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // ==================== ROUTE MANAGEMENT ====================

  // Get all routes (admin)
  getRoutes(filters?: any): Observable<ApiResponse<Route[]>> {
    let url = `${this.apiUrl}/admin/routes`;
    const params: string[] = [];

    if (filters) {
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Route[]>>(url);
  }

  // Get active routes for dropdown
  getActiveRoutes(): Observable<ApiResponse<Route[]>> {
    return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}/routes/active`);
  }

  // Get single route by ID
  getRouteById(id: string): Observable<ApiResponse<Route>> {
    return this.http.get<ApiResponse<Route>>(`${this.apiUrl}/admin/routes/${id}`);
  }

  // Create new route
  createRoute(routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.post<ApiResponse<Route>>(`${this.apiUrl}/admin/routes`, routeData);
  }

  // Update route
  updateRoute(id: string, routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.put<ApiResponse<Route>>(`${this.apiUrl}/admin/routes/${id}`, routeData);
  }

  // Delete route
  deleteRoute(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/routes/${id}`);
  }

  // Get route stops
  getRouteStops(routeId: string): Observable<ApiResponse<{ stops: Stop[] }>> {
    return this.http.get<ApiResponse<{ stops: Stop[] }>>(`${this.apiUrl}/routes/${routeId}/stops`);
  }

  // Update route stops
  updateRouteStops(routeId: string, stops: Stop[]): Observable<ApiResponse<Stop[]>> {
    return this.http.put<ApiResponse<Stop[]>>(`${this.apiUrl}/routes/${routeId}/stops`, { stops });
  }

  // ==================== BUS MANAGEMENT ====================

  // Get all buses (admin)
  getBuses(filters?: any): Observable<ApiResponse<Bus[]>> {
    let url = `${this.apiUrl}/admin/buses`;
    const params: string[] = [];

    if (filters) {
      if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
      if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.page) params.push(`page=${filters.page}`);
      if (filters.limit) params.push(`limit=${filters.limit}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Bus[]>>(url);
  }

  // Get active buses for public
  getActiveBuses(filters?: any): Observable<ApiResponse<Bus[]>> {
    let url = `${this.apiUrl}/buses/active`;
    const params: string[] = [];

    if (filters) {
      if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
      if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Bus[]>>(url);
  }

  // Search buses
  searchBuses(criteria: SearchCriteria): Observable<SearchResponse> {
    let url = `${this.apiUrl}/buses/search?from=${encodeURIComponent(criteria.from)}&to=${encodeURIComponent(criteria.to)}`;
    if (criteria.date) url += `&date=${criteria.date}`;
    if (criteria.passengers) url += `&passengers=${criteria.passengers}`;
    if (criteria.busType) url += `&busType=${encodeURIComponent(criteria.busType)}`;
    
    return this.http.get<SearchResponse>(url);
  }

  // Get bus by ID with details
  getBusDetails(id: string, date?: string): Observable<ApiResponse<Bus>> {
    let url = `${this.apiUrl}/buses/${id}/details`;
    if (date) url += `?date=${date}`;
    return this.http.get<ApiResponse<Bus>>(url);
  }

  // Get single bus (admin)
  getBusById(id: string): Observable<ApiResponse<Bus>> {
    return this.http.get<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses/${id}`);
  }

  // Create new bus
  createBus(busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
    return this.http.post<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses`, busData);
  }

  // Update bus
  updateBus(id: string, busData: Partial<Bus>): Observable<ApiResponse<Bus>> {
    return this.http.put<ApiResponse<Bus>>(`${this.apiUrl}/admin/buses/${id}`, busData);
  }

  // Delete bus
  deleteBus(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/buses/${id}`);
  }

  // Toggle bus status
  toggleBusStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/admin/buses/${id}/toggle-status`, {});
  }

  // ==================== SEAT SELECTION METHODS ====================
  
  /**
   * Get bus details for seat selection (public endpoint)
   * This method is specifically for the seat selection component
   * Uses public endpoint that doesn't require admin authentication
   */
  getBusForSeatSelection(id: string): Observable<any> {
    console.log(`📡 BusService: Fetching bus for seat selection - ID: ${id}`);
    return this.http.get(`${this.apiUrl}/buses/${id}`);
  }

  /**
   * Get booked seats for a bus on a specific date
   * This method is for the seat selection component to show which seats are already booked
   */
  getBookedSeats(busId: string, travelDate: string): Observable<any> {
    console.log(`📡 BusService: Fetching booked seats for bus ${busId} on date ${travelDate}`);
    // Use the bookings endpoint which should be accessible to authenticated users
    return this.http.get(`${this.apiUrl}/bookings/seats/available/${busId}/${travelDate}`);
  }

  /**
   * Get public bus details (alias for getBusForSeatSelection for backward compatibility)
   */
  getPublicBusById(id: string): Observable<any> {
    return this.getBusForSeatSelection(id);
  }

  // ==================== FARE MANAGEMENT ====================

  // Get fare for bus type and route
  getBusFare(routeId: string, busType: string): Observable<ApiResponse<FareInfo>> {
    return this.http.get<ApiResponse<FareInfo>>(`${this.apiUrl}/bus-fare/${routeId}/${busType}`);
  }

  // Get all fares
  getFares(filters?: any): Observable<ApiResponse<Fare[]>> {
    let url = `${this.apiUrl}/admin/fares`;
    const params: string[] = [];

    if (filters) {
      if (filters.routeId && filters.routeId !== 'all') params.push(`routeId=${filters.routeId}`);
      if (filters.busType && filters.busType !== 'all') params.push(`busType=${encodeURIComponent(filters.busType)}`);
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Fare[]>>(url);
  }

  // Get fare by ID
  getFareById(id: string): Observable<ApiResponse<Fare>> {
    return this.http.get<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares/${id}`);
  }

  // Create fare
  createFare(fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
    return this.http.post<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares`, fareData);
  }

  // Update fare
  updateFare(id: string, fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
    return this.http.put<ApiResponse<Fare>>(`${this.apiUrl}/admin/fares/${id}`, fareData);
  }

  // Delete fare
  deleteFare(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/fares/${id}`);
  }

  // Toggle fare status
  toggleFareStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/admin/fares/${id}/toggle-status`, {});
  }

  // ==================== POPULAR ROUTES & OPERATORS ====================

  // Get popular routes
  getPopularRoutes(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/popular-routes`);
  }

  // Get operators
  getOperators(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/operators`);
  }

  // ==================== BOARDING POINT MANAGEMENT ====================

  // Get boarding points for a bus
  getBoardingPoints(busId: string): Observable<ApiResponse<BoardingPoint[]>> {
    return this.http.get<ApiResponse<BoardingPoint[]>>(`${this.apiUrl}/buses/${busId}/boarding-points`);
  }

  // Create boarding point
  createBoardingPoint(busId: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
    return this.http.post<ApiResponse<BoardingPoint>>(`${this.apiUrl}/admin/buses/${busId}/boarding-points`, data);
  }

  // Update boarding point
  updateBoardingPoint(id: string, data: Partial<BoardingPoint>): Observable<ApiResponse<BoardingPoint>> {
    return this.http.put<ApiResponse<BoardingPoint>>(`${this.apiUrl}/admin/boarding-points/${id}`, data);
  }

  // Delete boarding point
  deleteBoardingPoint(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/boarding-points/${id}`);
  }

  // ==================== UTILITY METHODS ====================

  // Get bus types
  getBusTypes(): string[] {
    return [
      'AC Sleeper',
      'AC Seater',
      'Non-AC Sleeper',
      'Non-AC Seater',
      'Luxury',
      'Volvo'
    ];
  }

  // Get seat layouts
  getSeatLayouts(): string[] {
    return ['2x2', '2x1', '1x2', '2x3'];
  }

  // Get amenities
  getAmenities(): string[] {
    return [
      'AC', 'WiFi', 'Charging Point', 'Water Bottle', 
      'Blanket', 'Snacks', 'Movie', 'GPS', 'Reading Light',
      'Emergency Exit', 'First Aid', 'Fire Extinguisher'
    ];
  }
}