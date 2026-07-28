import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './bus.service';

export interface AddNewBus {
  _id?: string;
  busNumber: string;
  busName: string;
  busType: string;
  totalSeats: number;
  seatLayout: string;
  status: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  amenities: string[];
  instituteName?: string;
  instituteId?: string;
  routeId?: string;        // ✅ Added
  fare?: number;           // ✅ Added
  departureTime?: string;  // ✅ Added
  departureDate?: string;  // ✅ Added
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AddNewBusService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all buses from the database
   * This calls /api/getNewBuses
   */
  getBusNumberOptions(): Observable<ApiResponse<AddNewBus[]>> {
    return this.http.get<ApiResponse<AddNewBus[]>>(`${this.apiUrl}/getNewBuses`);
  }

  /**
   * Get a single bus by ID
   * This calls /api/addNewBuses/:id
   */
  getBusById(id: string): Observable<ApiResponse<AddNewBus>> {
    return this.http.get<ApiResponse<AddNewBus>>(`${this.apiUrl}/addNewBuses/${id}`);
  }

  /**
   * Create a new bus
   * This calls /api/addNewBuses
   */
  createBus(busData: any): Observable<ApiResponse<AddNewBus>> {
    return this.http.post<ApiResponse<AddNewBus>>(`${this.apiUrl}/addNewBuses`, busData);
  }

  /**
   * Update a bus
   * This calls /api/addNewBuses/:id
   */
  updateBus(id: string, busData: any): Observable<ApiResponse<AddNewBus>> {
    return this.http.put<ApiResponse<AddNewBus>>(`${this.apiUrl}/addNewBuses/${id}`, busData);
  }

  /**
   * Delete a bus (soft delete)
   * This calls /api/addNewBuses/:id
   */
  deleteBus(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/addNewBuses/${id}`);
  }

  /**
   * Toggle bus status
   * This calls /api/addNewBuses/:id/status
   */
  toggleBusStatus(id: string): Observable<ApiResponse<{ status: string }>> {
    return this.http.patch<ApiResponse<{ status: string }>>(`${this.apiUrl}/addNewBuses/${id}/status`, {});
  }
}