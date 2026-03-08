import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();

  // Skip token attachment for auth endpoints
  const isAuthEndpoint = req.url.includes('/login') || 
                         req.url.includes('/signupUser') || 
                         req.url.includes('/forgot-password') ||
                         req.url.includes('/reset-password') ||
                         req.url.includes('/resend-verification');

  let authReq = req;
  if (token && !isAuthEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        // Check if it's a verification error
        if (error.error?.needsVerification) {
          // Handle verification error in component
          return throwError(() => error);
        }
        
        authService.logout(false);
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      } else if (error.status === 403) {
        router.navigate(['/forbidden']);
      } else if (error.status === 423) {
        router.navigate(['/login'], {
          queryParams: { accountLocked: true }
        });
      }
      return throwError(() => error);
    })
  );
};