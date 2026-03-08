import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bus {
  _id?: string;
  busNumber: string;
  busName: string;
  busType: string;
  routeId: string;
  routeName?: string;
  origin?: string;
  destination?: string;
  distance?: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  totalSeats: number;
  seatLayout: string;
  amenities: string[];
  fare: number;
  status: 'active' | 'inactive' | 'maintenance';
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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // Get all routes
  getRoutes(): Observable<ApiResponse<Route[]>> {
    return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}/routes`);
  }

  // Get fare for bus type and route - NOW USING FARE DECLARATIONS
  getBusFare(routeId: string, busType: string): Observable<ApiResponse<FareInfo>> {
    return this.http.get<ApiResponse<FareInfo>>(`${this.apiUrl}/bus-fare/${routeId}/${busType}`);
  }

  // Get all buses
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

  // Get single bus
  getBusById(id: string): Observable<ApiResponse<Bus>> {
    return this.http.get<ApiResponse<Bus>>(`${this.apiUrl}/buses/${id}`);
  }

  // Create bus
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

  // Toggle status
  toggleBusStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/buses/${id}/toggle-status`, {});
  }
}