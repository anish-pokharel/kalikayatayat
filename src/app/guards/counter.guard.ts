// guards/counter.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CounterGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('CounterGuard: Checking access...');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Is counter:', this.authService.isCounter());
    console.log('Current user:', this.authService.getCurrentUser());
    
    if (this.authService.isAuthenticated() && this.authService.isCounter()) {
      console.log('CounterGuard: Access granted');
      return true;
    }
    
    console.log('CounterGuard: Access denied, redirecting to login');
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: '/counter/dashboard', error: 'unauthorized' }
    });
    return false;
  }
}