import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    if (authService.isAdmin()) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};




// // admin.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
  
//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}
  
//   canActivate(): boolean {
//     const user = this.authService.getCurrentUser();
    
//     if (user && user.role === 'admin') {
//       return true;
//     }
    
//     // Redirect to home or login if not admin
//     this.router.navigate(['/']);
//     return false;
//   }
// }