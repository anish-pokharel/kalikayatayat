import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Stop {
  _id?: string;
  name: string;
  arrivalTime: string;
  departureTime: string;
  fare: number;
}

export interface Route {
  _id?: string;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  stops: Stop[];
  status: 'active' | 'inactive';
  busesAssigned: number;
  totalStops?: number;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
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
export class RouteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/routes`;

  // Get all routes with optional filters
  getRoutes(status?: string, search?: string): Observable<ApiResponse<Route[]>> {
    let url = this.apiUrl;
    const params: string[] = [];

    if (status && status !== 'all') {
      params.push(`status=${status}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<ApiResponse<Route[]>>(url);
  }

  // Get single route by ID
  getRouteById(id: string): Observable<ApiResponse<Route>> {
    return this.http.get<ApiResponse<Route>>(`${this.apiUrl}/${id}`);
  }

  // Create new route
  createRoute(routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.post<ApiResponse<Route>>(this.apiUrl, routeData);
  }

  // Update route
  updateRoute(id: string, routeData: Partial<Route>): Observable<ApiResponse<Route>> {
    return this.http.put<ApiResponse<Route>>(`${this.apiUrl}/${id}`, routeData);
  }

  // Delete route
  deleteRoute(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  // Toggle route status
  toggleRouteStatus(id: string): Observable<ApiResponse<Route>> {
    return this.http.patch<ApiResponse<Route>>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  // Get route stops
  getRouteStops(id: string): Observable<ApiResponse<{ routeName: string; origin: string; destination: string; stops: Stop[] }>> {
    return this.http.get<ApiResponse<{ routeName: string; origin: string; destination: string; stops: Stop[] }>>(`${this.apiUrl}/${id}/stops`);
  }

  // Update route stops
  updateRouteStops(id: string, stops: Stop[]): Observable<ApiResponse<Stop[]>> {
    return this.http.put<ApiResponse<Stop[]>>(`${this.apiUrl}/${id}/stops`, { stops });
  }
}