import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SeatCapacity {
  totalSeats: number;
  seatLayout: '2x2' | '2x1' | '1x2' | '2x3';
  lowerDeckSeats: number;
  upperDeckSeats: number;
}

export interface Fare {
  _id?: string;
  routeId: string;
  routeName: string;
  origin?: string;
  destination?: string;
  distance?: number;
  busType: string;
  baseFare: number;
  seatCapacity: SeatCapacity;
  effectiveFrom: Date | string;
  effectiveTo: Date | string;
  status: 'active' | 'inactive';
  createdBy?: any;
  createdAt?: string;
}

export interface Route {
  _id: string;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  status: string;
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
export class FareService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // Get all routes
  getRoutes(): Observable<ApiResponse<Route[]>> {
    return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}/routes`);
  }

  // Get all fares
  getFares(routeId?: string, busType?: string, status?: string, search?: string): Observable<ApiResponse<Fare[]>> {
    let url = `${this.apiUrl}/fares`;
    const params: string[] = [];

    if (routeId && routeId !== 'all') params.push(`routeId=${routeId}`);
    if (busType && busType !== 'all') params.push(`busType=${encodeURIComponent(busType)}`);
    if (status && status !== 'all') params.push(`status=${status}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Fare[]>>(url);
  }

  // Get single fare by ID
  getFareById(id: string): Observable<ApiResponse<Fare>> {
    return this.http.get<ApiResponse<Fare>>(`${this.apiUrl}/fares/${id}`);
  }

  // Create fare
  createFare(fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
    return this.http.post<ApiResponse<Fare>>(`${this.apiUrl}/fares`, fareData);
  }

  // Update fare
  updateFare(id: string, fareData: Partial<Fare>): Observable<ApiResponse<Fare>> {
    return this.http.put<ApiResponse<Fare>>(`${this.apiUrl}/fares/${id}`, fareData);
  }

  // Delete fare
  deleteFare(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/fares/${id}`);
  }

  // Toggle fare status
  toggleFareStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/fares/${id}/toggle-status`, {});
  }
}