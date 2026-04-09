// payment-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-payment-callback',
  template: `
    <div class="payment-callback-container">
      <div class="payment-card" *ngIf="isLoading">
        <div class="spinner"></div>
        <h3>Processing Payment...</h3>
        <p>Please wait while we verify your payment.</p>
      </div>
      
      <div class="payment-card success" *ngIf="paymentSuccess">
        <div class="success-icon">✅</div>
        <h2>Payment Successful!</h2>
        <p>Your booking has been confirmed.</p>
        <p class="booking-id">Booking ID: {{ bookingId }}</p>
        <button class="btn-primary" (click)="goToBookings()">View My Bookings</button>
      </div>
      
      <div class="payment-card error" *ngIf="paymentError">
        <div class="error-icon">❌</div>
        <h2>Payment Failed</h2>
        <p>{{ errorMessage }}</p>
        <button class="btn-primary" (click)="retryPayment()">Try Again</button>
        <button class="btn-secondary" (click)="goToHome()">Go to Home</button>
      </div>
    </div>
  `,
  styles: [`
    .payment-callback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .payment-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .success-icon, .error-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    .success-icon { color: #4caf50; }
    .error-icon { color: #f44336; }
    .booking-id {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 8px;
      margin: 20px 0;
      font-family: monospace;
    }
    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px;
      transition: all 0.3s;
    }
    .btn-primary {
      background: #667eea;
      color: white;
    }
    .btn-primary:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }
    .btn-secondary:hover {
      background: #d5d5d5;
    }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  isLoading = true;
  paymentSuccess = false;
  paymentError = false;
  errorMessage = '';
  bookingId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pidx = params['pidx'];
      const status = params['status'];
      const transactionId = params['transaction_id'];
      
      if (pidx && status === 'Completed') {
        this.verifyKhaltiPayment(pidx, transactionId);
      } else if (params['status'] === 'success') {
        this.handleEsewaSuccess(params);
      } else {
        this.paymentError = true;
        this.errorMessage = 'Payment was cancelled or failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  verifyKhaltiPayment(pidx: string, transactionId: string): void {
    this.http.post(`${environment.apiUrl}/payments/khalti/verify`, { pidx, transactionId })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.paymentSuccess = true;
            this.bookingId = response.data?.bookingId || 'N/A';
          } else {
            this.paymentError = true;
            this.errorMessage = response.message || 'Payment verification failed';
          }
        },
        error: (error) => {
          console.error('Verification error:', error);
          this.isLoading = false;
          this.paymentError = true;
          this.errorMessage = 'Failed to verify payment. Please contact support.';
        }
      });
  }

  handleEsewaSuccess(params: any): void {
    const transactionId = params['transaction_id'];
    const amount = params['amount'];
    const purchaseOrderId = params['transaction_uuid'];
    
    this.http.post(`${environment.apiUrl}/payments/esewa/verify`, {
      transactionId,
      amount,
      purchaseOrderId,
      productCode: 'EPAYTEST'
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.paymentSuccess = true;
          this.bookingId = response.data?.bookingId || 'N/A';
        } else {
          this.paymentError = true;
          this.errorMessage = response.message || 'Payment verification failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.paymentError = true;
        this.errorMessage = 'Failed to verify payment';
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  retryPayment(): void {
    this.router.navigate(['/']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}


// // payment-callback.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../environments/environment';
// import { BookingService } from '../../../services/booking.service';

// @Component({
//   selector: 'app-payment-callback',
//   template: `
//     <div class="payment-callback-container">
//       <div class="payment-card" *ngIf="isLoading">
//         <div class="spinner"></div>
//         <h3>Processing Payment...</h3>
//         <p>Please wait while we verify your payment.</p>
//       </div>
      
//       <div class="payment-card success" *ngIf="paymentSuccess">
//         <div class="success-icon">✅</div>
//         <h2>Payment Successful!</h2>
//         <p>Your booking has been confirmed.</p>
//         <p class="booking-id">Booking ID: {{ bookingId }}</p>
//         <button class="btn-primary" (click)="goToBookings()">View My Bookings</button>
//       </div>
      
//       <div class="payment-card error" *ngIf="paymentError">
//         <div class="error-icon">❌</div>
//         <h2>Payment Failed</h2>
//         <p>{{ errorMessage }}</p>
//         <button class="btn-primary" (click)="retryPayment()">Try Again</button>
//         <button class="btn-secondary" (click)="goToHome()">Go to Home</button>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .payment-callback-container {
//       min-height: 100vh;
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       padding: 20px;
//     }
//     .payment-card {
//       background: white;
//       border-radius: 20px;
//       padding: 40px;
//       text-align: center;
//       max-width: 500px;
//       width: 100%;
//       box-shadow: 0 20px 60px rgba(0,0,0,0.3);
//     }
//     .spinner {
//       width: 50px;
//       height: 50px;
//       border: 4px solid #f3f3f3;
//       border-top: 4px solid #667eea;
//       border-radius: 50%;
//       animation: spin 1s linear infinite;
//       margin: 0 auto 20px;
//     }
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//     .success-icon, .error-icon {
//       font-size: 60px;
//       margin-bottom: 20px;
//     }
//     .success-icon { color: #4caf50; }
//     .error-icon { color: #f44336; }
//     .booking-id {
//       background: #f5f5f5;
//       padding: 10px;
//       border-radius: 8px;
//       margin: 20px 0;
//       font-family: monospace;
//     }
//     .btn-primary, .btn-secondary {
//       padding: 12px 24px;
//       border: none;
//       border-radius: 8px;
//       cursor: pointer;
//       font-size: 16px;
//       margin: 10px;
//       transition: all 0.3s;
//     }
//     .btn-primary {
//       background: #667eea;
//       color: white;
//     }
//     .btn-primary:hover {
//       background: #5a67d8;
//       transform: translateY(-2px);
//     }
//     .btn-secondary {
//       background: #e0e0e0;
//       color: #333;
//     }
//     .btn-secondary:hover {
//       background: #d5d5d5;
//     }
//   `]
// })
// export class PaymentCallbackComponent implements OnInit {
//   isLoading = true;
//   paymentSuccess = false;
//   paymentError = false;
//   errorMessage = '';
//   bookingId = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private http: HttpClient,
//     private bookingService: BookingService
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const pidx = params['pidx'];
//       const status = params['status'];
//       const transactionId = params['transaction_id'];
      
//       if (pidx && status === 'Completed') {
//         this.verifyPayment(pidx, transactionId);
//       } else if (params['status'] === 'success') {
//         this.handleEsewaSuccess(params);
//       } else {
//         this.paymentError = true;
//         this.errorMessage = 'Payment was cancelled or failed. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   verifyPayment(pidx: string, transactionId: string): void {
//     // Get temp booking data
//     const tempBooking = localStorage.getItem('temp_booking');
    
//     this.http.post(`${environment.apiUrl}/payments/khalti/verify`, { pidx, transactionId })
//       .subscribe({
//         next: (response: any) => {
//           if (response.success && tempBooking) {
//             const bookingData = JSON.parse(tempBooking);
//             this.createBooking(bookingData, 'khalti', { pidx, transactionId });
//           } else {
//             this.paymentError = true;
//             this.errorMessage = 'Payment verification failed. Please contact support.';
//             this.isLoading = false;
//           }
//         },
//         error: (error) => {
//           console.error('Verification error:', error);
//           this.paymentError = true;
//           this.errorMessage = 'Failed to verify payment. Please contact support.';
//           this.isLoading = false;
//         }
//       });
//   }

//   handleEsewaSuccess(params: any): void {
//     const tempBooking = localStorage.getItem('temp_booking');
//     if (tempBooking) {
//       const bookingData = JSON.parse(tempBooking);
//       this.createBooking(bookingData, 'esewa', params);
//     } else {
//       this.paymentError = true;
//       this.errorMessage = 'Booking data not found.';
//       this.isLoading = false;
//     }
//   }

//   createBooking(bookingData: any, paymentMethod: string, paymentResponse: any): void {
//     const passengers = bookingData.passengers.map((p: any) => ({
//       seatNumber: p.seatNumber,
//       passengerName: p.name,
//       passengerAge: Number(p.age),
//       passengerGender: p.gender,
//       passengerPhone: p.phone,
//       passengerEmail: p.email || undefined
//     }));
    
//     const bookingRequest = {
//       busId: bookingData.busId,
//       seats: passengers,
//       totalAmount: Number(bookingData.totalAmount),
//       taxAmount: Number(bookingData.taxAmount),
//       journeyDate: bookingData.journeyDate,
//       paymentMethod: paymentMethod
//     };
    
//     this.bookingService.createBooking(bookingRequest).subscribe({
//       next: (response: any) => {
//         this.isLoading = false;
//         if (response.success) {
//           this.paymentSuccess = true;
//           this.bookingId = response.data.bookingId;
          
//           // Clear temp data
//           localStorage.removeItem('temp_booking');
//           localStorage.removeItem('khalti_pidx');
//         } else {
//           this.paymentError = true;
//           this.errorMessage = response.message || 'Failed to create booking.';
//         }
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.paymentError = true;
//         this.errorMessage = error.error?.message || 'Failed to create booking.';
//       }
//     });
//   }

//   goToBookings(): void {
//     this.router.navigate(['/dashboard']);
//   }

//   retryPayment(): void {
//     this.router.navigate(['/']);
//   }

//   goToHome(): void {
//     this.router.navigate(['/']);
//   }
// }