// // src/app/services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api';

//   constructor(private http: HttpClient) {}

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, credentials);
//   }

//   register(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, userData);
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }
// }


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: string = '';

  constructor(private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.isAuthenticated = true;
      this.userRole = userData.role;
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@travel.com' && password === 'admin123') {
      this.isAuthenticated = true;
      this.userRole = 'admin';
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
      localStorage.setItem('token', 'dummy-jwt-token');
      return true;
    } else if (email === 'user@travel.com' && password === 'user123') {
      this.isAuthenticated = true;
      this.userRole = 'user';
      localStorage.setItem('user', JSON.stringify({ email, role: 'user' }));
      localStorage.setItem('token', 'dummy-jwt-token');
      return true;
    }
    return false;
  }

  register(userData: any): boolean {
    console.log('Registering user:', userData);
    return true;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userRole = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): string {
    return this.userRole;
  }
}