import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  loginData = {
    email: '',
    password: '',
    rememberMe: true // Default to true for better UX
  };

  showPassword = false;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  showResendVerification = false;
  unverifiedEmail: string = '';
  returnUrl: string = '/';
  
  private subscriptions: Subscription = new Subscription();

  // Email validation pattern
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  ngOnInit(): void {
    // Get return URL from query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Check for session expired message
    if (this.route.snapshot.queryParams['sessionExpired']) {
      this.errorMessage = 'Your session has expired. Please login again.';
    }
    
    // Check for account locked message
    if (this.route.snapshot.queryParams['accountLocked']) {
      this.errorMessage = 'Your account has been locked. Please try again after 15 minutes.';
    }
    
    // Check for verification success message
    if (this.route.snapshot.queryParams['verified']) {
      this.successMessage = 'Email verified successfully! You can now login.';
    }

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.invalid) {
      this.markFormGroupTouched(loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showResendVerification = false;

    const loginSub = this.authService.login(
      this.loginData.email,
      this.loginData.password,
      this.loginData.rememberMe
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Login successful! Redirecting...';
        
        setTimeout(() => {
          this.redirectBasedOnRole();
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.needsVerification) {
          this.errorMessage = 'Please verify your email before logging in.';
          this.showResendVerification = true;
          this.unverifiedEmail = error.error.email || this.loginData.email;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          this.errorMessage = error.error.errors[0]?.msg || 'Validation error';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });

    this.subscriptions.add(loginSub);
  }

  resendVerification(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const resendSub = this.authService.resendVerification(this.unverifiedEmail).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Verification email sent! Please check your inbox.';
        this.showResendVerification = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send verification email';
      }
    });

    this.subscriptions.add(resendSub);
  }

  fillCredentials(type: 'admin' | 'user'): void {
    if (type === 'admin') {
      this.loginData.email = 'admin@gmail.com';
      this.loginData.password = 'anish123';
    } else {
      this.loginData.email = 'anish.pokharel.710.ap@gmail.com';
      this.loginData.password = 'anish123';
    }
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  private markFormGroupTouched(formGroup: NgForm): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}