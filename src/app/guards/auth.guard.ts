import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    
    // Check if user is verified
    if (user && !user.isVerified) {
      router.navigate(['/verify-email']);
      return false;
    }
    
    // Check if route requires admin
    if (state.url.startsWith('/admin')) {
      if (authService.isAdmin()) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    }
    return true;
  }

  // Not logged in, redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};