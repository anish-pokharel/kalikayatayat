// booking-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  booking: any = null;
  isLoading = true;
  errorMessage = '';
  bookingId = '';
window: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookingId = params['id'];
      if (this.bookingId) {
        this.fetchBookingDetails();
      } else {
        // Try to get from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { booking: any };
        if (state?.booking) {
          this.booking = state.booking;
          this.isLoading = false;
        } else {
          this.errorMessage = 'Booking details not found';
          this.isLoading = false;
        }
      }
    });
  }

  fetchBookingDetails(): void {
    this.http.get(`${environment.apiUrl}/bookings/${this.bookingId}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.booking = response.data;
          } else {
            this.errorMessage = response.message || 'Failed to load booking';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching booking:', error);
          this.errorMessage = 'Failed to load booking details';
          this.isLoading = false;
        }
      });
  }

  downloadTicket(): void {
    // Implement PDF download functionality
    window.print();
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}