import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerData = {
    firstName: '',  // Changed from fullName to firstName
    lastName: '',   // Added lastName
    email: '',
    phoneNo: '',    // Changed from phone to phoneNo
    mobileNo: '',   // Added mobileNo
    address: '',    // Added address
    password: '',
    confirmPassword: '',
    termCondition: false,  // Changed from agreeTerms to termCondition
    role: 'customer'       // Added role with default value
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  private subscriptions: Subscription = new Subscription();

  // Email validation pattern
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // Phone validation pattern (Nepal phone numbers)
  phonePattern = '^(98|97)[0-9]{8}$';

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(registerForm: NgForm): void {
    if (registerForm.invalid) {
      this.markFormGroupTouched(registerForm);
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.registerData.termCondition) {
      this.errorMessage = 'You must agree to the terms and conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Split full name into first and last name if using fullName field
    // If you're using separate fields, remove this logic
    if (this.registerData.firstName && !this.registerData.lastName) {
      const nameParts = this.registerData.firstName.split(' ');
      this.registerData.firstName = nameParts[0] || '';
      this.registerData.lastName = nameParts.slice(1).join(' ') || '';
    }

    const registerSub = this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Registration successful! Please check your email to verify your account.';
        
        // Clear form
        registerForm.resetForm();
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { registered: true }
          });
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          this.errorMessage = error.error.errors[0]?.msg || 'Validation error';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
        
        // Scroll to top to show error
        window.scrollTo(0, 0);
      }
    });

    this.subscriptions.add(registerSub);
  }

  passwordsMatch(): boolean {
    return this.registerData.password === this.registerData.confirmPassword;
  }

  getPasswordStrength(): { strength: number; text: string; color: string } {
    const password = this.registerData.password;
    let strength = 0;
    let text = '';
    let color = '';

    if (!password) {
      return { strength: 0, text: 'No password', color: '#ccc' };
    }

    // Check length
    if (password.length >= 8) strength += 25;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Check for numbers
    if (/[0-9]/.test(password)) strength += 25;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    if (strength <= 25) {
      text = 'Weak';
      color = '#e74c3c';
    } else if (strength <= 50) {
      text = 'Fair';
      color = '#f39c12';
    } else if (strength <= 75) {
      text = 'Good';
      color = '#3498db';
    } else {
      text = 'Strong';
      color = '#27ae60';
    }

    return { strength, text, color };
  }

  private markFormGroupTouched(formGroup: NgForm): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Helper method to fill demo data (optional)
  fillDemoData(): void {
    this.registerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNo: '9841234567',
      mobileNo: '9841234567',
      address: 'Kathmandu, Nepal',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      termCondition: true,
      role: 'customer'
    };
  }

  // Navigate to login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}