



import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
   id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;  // Add phone
  gender?: string; // Add gender
  role: 'customer' | 'admin';
  isVerified: boolean;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // New subject for logout messages
  private logoutMessageSubject = new BehaviorSubject<string>('');
  public logoutMessage$ = this.logoutMessageSubject.asObservable();
  
  private tokenKey = 'auth_token';
  private tokenExpiryKey = 'auth_token_expiry';
  private tokenCheckInterval: any;
  private storageEventListener: any;

  constructor() {
    this.loadStoredUser();
    this.startTokenCheck();
    this.listenToStorageChanges();
  }

  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    if (this.storageEventListener) {
      window.removeEventListener('storage', this.storageEventListener);
    }
  }

  private listenToStorageChanges(): void {
    this.storageEventListener = (event: StorageEvent) => {
      if (event.key === this.tokenKey || event.key === this.tokenExpiryKey) {
        if (!event.newValue) {
          this.logout(false, 'You have been logged out from another tab');
        } else {
          this.loadStoredUser();
        }
      }
    };
    window.addEventListener('storage', this.storageEventListener);
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10);
      const now = Date.now();
      
      if (now < expiryTime) {
        try {
          const decoded = this.decodeToken(token);
          if (decoded) {
            const user: User = {
              id: decoded.userId || decoded.id,
              email: decoded.email,
              firstName: decoded.firstName || '',
              lastName: decoded.lastName || '',
              role: decoded.role || decoded.userRole || 'customer',
              isVerified: decoded.isVerified || true
            };
            this.currentUserSubject.next(user);
            
            const timeUntilExpiry = expiryTime - now;
            const oneHour = 60 * 60 * 1000;
            if (timeUntilExpiry < oneHour) {
              this.refreshToken().subscribe({
                error: () => this.logout(false, 'Session expired')
              });
            }
          } else {
            this.logout(false, 'Invalid session');
          }
        } catch (error) {
          console.error('Error loading user from token:', error);
          this.logout(false, 'Session error');
        }
      } else {
        this.logout(false, 'Session expired');
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private refreshToken(): Observable<any> {
    const token = this.getToken();
    return this.http.post(`${this.apiUrl}/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token, true);
        }
      })
    );
  }

  private setToken(token: string, rememberMe: boolean): void {
    localStorage.setItem(this.tokenKey, token);
    const expiryTime = Date.now() + (rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000);
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
  }

  private startTokenCheck(): void {
    this.tokenCheckInterval = setInterval(() => {
      const token = this.getToken();
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      
      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() >= expiryTime) {
          this.logout(false, 'Your session has expired');
        }
      }
    }, 60000);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.token, rememberMe);
          this.currentUserSubject.next(response.user);
          // Clear any logout message on successful login
          this.logoutMessageSubject.next('');
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signupUser`, userData);
  }

  // Updated logout method with optional message
  logout(navigate: boolean = true, message: string = 'Logged out successfully'): void {
    // Clear tokens
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    
    // Update user subject
    this.currentUserSubject.next(null);
    
    // Set logout message
    this.logoutMessageSubject.next(message);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      this.logoutMessageSubject.next('');
    }, 5000);
    
    if (navigate) {
      this.router.navigate(['/login'], {
        queryParams: { logout: 'success' }
      });
    }
  }

  verifyToken(): Observable<{ valid: boolean; user: User }> {
    const token = this.getToken();
    return this.http.get<{ valid: boolean; user: User }>(`${this.apiUrl}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        if (response.valid && response.user) {
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        this.logout(false, 'Session verification failed');
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password?token=${token}`, { newPassword, confirmPassword });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email?token=${token}`);
  }

  resendVerification(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    
    if (!token || !expiry) return false;
    
    const expiryTime = parseInt(expiry, 10);
    const isValid = Date.now() < expiryTime;
    
    if (!isValid) {
      this.logout(false, 'Session expired');
    }
    
    return isValid;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  refreshUserData(): void {
    this.loadStoredUser();
  }

  getSessionTimeRemaining(): number {
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (!expiry) return 0;
    
    const expiryTime = parseInt(expiry, 10);
    const remaining = expiryTime - Date.now();
    return Math.max(0, remaining);
  }

  getSessionTimeRemainingFormatted(): string {
    const remaining = this.getSessionTimeRemaining();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Clear logout message (useful when navigating away)
  clearLogoutMessage(): void {
    this.logoutMessageSubject.next('');
  }
}