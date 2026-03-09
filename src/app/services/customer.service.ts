import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Customer {
  _id?: string;
  customerId: string;
  firstName: string;
  lastName: string;
  name?: string; // Combined name
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  idProofType: 'aadhar' | 'pan' | 'passport' | 'driving' | 'voter';
  idProofNumber: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking?: string;
  registeredOn: string;
  status: 'active' | 'inactive' | 'blocked';
  preferences?: {
    busType?: string[];
    seatPreference?: 'window' | 'aisle' | 'any';
    mealPreference?: string[];
  };
  bookings?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  totalRevenue: number;
  averageSpending: number;
  growthData: { month: string; count: number }[];
  bookingTrend: { month: string; bookings: number }[];
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
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  // Get all customers with filters
  getCustomers(filters?: any): Observable<ApiResponse<Customer[]>> {
    let url = this.apiUrl;
    const params: string[] = [];

    if (filters) {
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
      if (filters.gender && filters.gender !== 'all') params.push(`gender=${filters.gender}`);
      if (filters.city && filters.city !== 'all') params.push(`city=${filters.city}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
      if (filters.fromDate) params.push(`fromDate=${filters.fromDate}`);
      if (filters.toDate) params.push(`toDate=${filters.toDate}`);
      if (filters.page) params.push(`page=${filters.page}`);
      if (filters.limit) params.push(`limit=${filters.limit}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<ApiResponse<Customer[]>>(url);
  }

  // Get single customer by ID
  getCustomerById(id: string): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(`${this.apiUrl}/${id}`);
  }

  // Create new customer
  createCustomer(customerData: Partial<Customer>): Observable<ApiResponse<Customer>> {
    return this.http.post<ApiResponse<Customer>>(this.apiUrl, customerData);
  }

  // Update customer
  updateCustomer(id: string, customerData: Partial<Customer>): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(`${this.apiUrl}/${id}`, customerData);
  }

  // Delete customer
  deleteCustomer(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  // Toggle customer status
  toggleCustomerStatus(id: string): Observable<ApiResponse<Customer>> {
    return this.http.patch<ApiResponse<Customer>>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  // Get customer statistics
  getCustomerStats(): Observable<ApiResponse<CustomerStats>> {
    return this.http.get<ApiResponse<CustomerStats>>(`${this.apiUrl}/stats`);
  }

  // Get customer bookings
  getCustomerBookings(customerId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${customerId}/bookings`);
  }

  // Get all unique cities
  getCities(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/cities`);
  }

  // Export customers
  exportCustomers(format: 'pdf' | 'excel' | 'csv', filters?: any): Observable<Blob> {
    let url = `${this.apiUrl}/export/${format}`;
    const params: string[] = [];

    if (filters) {
      if (filters.status && filters.status !== 'all') params.push(`status=${filters.status}`);
      if (filters.gender && filters.gender !== 'all') params.push(`gender=${filters.gender}`);
      if (filters.city && filters.city !== 'all') params.push(`city=${filters.city}`);
      if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
    }

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get(url, { responseType: 'blob' });
  }

  // Send email to customer
  sendEmail(customerId: string, emailData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${customerId}/send-email`, emailData);
  }

  // Send SMS to customer
  sendSMS(customerId: string, smsData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${customerId}/send-sms`, smsData);
  }
}