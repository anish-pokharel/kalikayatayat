// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule, ActivatedRoute, Router } from '@angular/router';
// import { BookingService, Booking } from '../../../services/booking.service';

// @Component({
//   selector: 'app-booking',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule], 
//   templateUrl: './booking.component.html',
//   styleUrl: './booking.component.css'
// })
// export class BookingComponent implements OnInit {
//   bookingId: string = '';
//   booking: Booking | null = null;
//   isLoading: boolean = true;
//   errorMessage: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private bookingService: BookingService
//   ) {}

//   ngOnInit() {
//     this.route.params.subscribe(params => {
//       this.bookingId = params['id'];
//       this.loadBooking();
//     });
//   }

//   loadBooking() {
//     this.isLoading = true;
//     this.bookingService.getBookingById(this.bookingId).subscribe({
//       next: (response: any) => {
//         if (response.success) {
//           this.booking = response.data;
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading booking:', error);
//         this.errorMessage = 'Failed to load booking details';
//         this.isLoading = false;
//       }
//     });
//   }

//   downloadTicket() {
//     // Implement ticket download functionality
//     alert('Ticket download feature coming soon!');
//   }

//   printTicket() {
//     window.print();
//   }

//   goToMyBookings() {
//     this.router.navigate(['/my-bookings']);
//   }

//   goToHome() {
//     this.router.navigate(['/']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingId: string = '';
  booking: Booking | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  downloadInProgress: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bookingId = params['id'];
      this.loadBooking();
    });
  }

  loadBooking() {
    this.isLoading = true;
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.booking = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading booking:', error);
        this.errorMessage = 'Failed to load booking details';
        this.isLoading = false;
      }
    });
  }

  downloadTicket() {
    if (!this.booking) return;
    
    this.downloadInProgress = true;
    
    try {
      // Create PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Colors
      const primaryColor = [52, 152, 219]; // #3498db
      const secondaryColor = [46, 204, 113]; // #2ecc71
      
      // Header with gradient effect
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('E-Ticket', pageWidth / 2, 25, { align: 'center' });
      
      // Booking ID
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Booking ID: ${this.booking.bookingId}`, pageWidth / 2, 35, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Journey Details
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Journey Details', 20, 55);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const journeyY = 65;
      doc.text(`From: ${this.booking.routeDetails.origin}`, 20, journeyY);
      doc.text(`To: ${this.booking.routeDetails.destination}`, 20, journeyY + 7);
      doc.text(`Date: ${formatDate(this.booking.journeyDate, 'fullDate', 'en-US')}`, 20, journeyY + 14);
      doc.text(`Departure: ${this.booking.routeDetails.departureTime}`, 20, journeyY + 21);
      doc.text(`Arrival: ${this.booking.routeDetails.arrivalTime}`, 20, journeyY + 28);
      doc.text(`Duration: ${this.booking.routeDetails.duration}`, 20, journeyY + 35);
      
      // Bus Details
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Bus Details', 120, 55);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      doc.text(`Bus: ${this.booking.busDetails.busName}`, 120, 65);
      doc.text(`Number: ${this.booking.busDetails.busNumber}`, 120, 72);
      doc.text(`Type: ${this.booking.busDetails.busType}`, 120, 79);
      doc.text(`Operator: ${this.booking.busDetails.operator}`, 120, 86);
      
      // Passenger Details Table
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Passenger Details', 20, 110);
      
      const tableColumn = ['Seat', 'Name', 'Age', 'Gender', 'Phone'];
      const tableRows: any[][] = [];
      
      this.booking.seats.forEach(seat => {
        const row = [
          seat.seatNumber,
          seat.passengerName,
          seat.passengerAge,
          seat.passengerGender,
          seat.passengerPhone
        ];
        tableRows.push(row);
      });
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 115,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: primaryColor, textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      
      // Payment Details
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 20, finalY);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const paymentY = finalY + 10;
      doc.text(`Base Fare: ₹${this.booking.totalAmount}`, 20, paymentY);
      doc.text(`GST (18%): ₹${this.booking.taxAmount}`, 20, paymentY + 7);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Total Paid: ₹${this.booking.totalAmount + this.booking.taxAmount}`, 20, paymentY + 17);
      
      // Reset color
      doc.setTextColor(0, 0, 0);
      
      // Footer with instructions
      const footerY = paymentY + 35;
      
      doc.setFillColor(245, 245, 245);
      doc.rect(20, footerY, pageWidth - 40, 30, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('Important Instructions:', 25, footerY + 7);
      doc.text('• Please arrive at least 30 minutes before departure', 25, footerY + 14);
      doc.text('• Carry a valid ID proof for all passengers', 25, footerY + 21);
      doc.text('• This is a paperless e-ticket. Show this on your mobile device', 25, footerY + 28);
      
      // Save PDF
      doc.save(`Ticket_${this.booking.bookingId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate ticket. Please try again.');
    } finally {
      this.downloadInProgress = false;
    }
  }

  printTicket() {
    if (!this.booking) return;
    
    // Create a printable version
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <html>
        <head>
          <title>Booking Ticket - ${this.booking.bookingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; }
            .header { background: #3498db; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0 0; opacity: 0.9; }
            .section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .section h2 { color: #2c3e50; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { margin-bottom: 8px; }
            .info-item .label { font-weight: 600; color: #666; display: inline-block; width: 100px; }
            .info-item .value { color: #2c3e50; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #3498db; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #e1e5ee; }
            .payment-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .payment-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #27ae60; margin-top: 10px; padding-top: 10px; }
            .status-paid { background: #27ae60; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
            .footer { text-align: center; margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>E-Ticket</h1>
            <p>Booking ID: ${this.booking.bookingId}</p>
          </div>
          
          <div class="section">
            <h2>Journey Details</h2>
            <div class="grid">
              <div>
                <div class="info-item"><span class="label">From:</span> <span class="value">${this.booking.routeDetails.origin}</span></div>
                <div class="info-item"><span class="label">To:</span> <span class="value">${this.booking.routeDetails.destination}</span></div>
                <div class="info-item"><span class="label">Date:</span> <span class="value">${formatDate(this.booking.journeyDate, 'fullDate', 'en-US')}</span></div>
              </div>
              <div>
                <div class="info-item"><span class="label">Departure:</span> <span class="value">${this.booking.routeDetails.departureTime}</span></div>
                <div class="info-item"><span class="label">Arrival:</span> <span class="value">${this.booking.routeDetails.arrivalTime}</span></div>
                <div class="info-item"><span class="label">Duration:</span> <span class="value">${this.booking.routeDetails.duration}</span></div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Bus Details</h2>
            <div class="grid">
              <div>
                <div class="info-item"><span class="label">Bus:</span> <span class="value">${this.booking.busDetails.busName}</span></div>
                <div class="info-item"><span class="label">Number:</span> <span class="value">${this.booking.busDetails.busNumber}</span></div>
              </div>
              <div>
                <div class="info-item"><span class="label">Type:</span> <span class="value">${this.booking.busDetails.busType}</span></div>
                <div class="info-item"><span class="label">Operator:</span> <span class="value">${this.booking.busDetails.operator}</span></div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Passenger Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Seat</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                ${this.booking.seats.map(seat => `
                  <tr>
                    <td>${seat.seatNumber}</td>
                    <td>${seat.passengerName}</td>
                    <td>${seat.passengerAge}</td>
                    <td>${seat.passengerGender}</td>
                    <td>${seat.passengerPhone}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Payment Details</h2>
            <div class="payment-row">
              <span>Base Fare:</span>
              <span>₹${this.booking.totalAmount}</span>
            </div>
            <div class="payment-row">
              <span>GST (18%):</span>
              <span>₹${this.booking.taxAmount}</span>
            </div>
            <div class="payment-row total">
              <span>Total Paid:</span>
              <span>₹${this.booking.totalAmount + this.booking.taxAmount}</span>
            </div>
            <div style="text-align: right; margin-top: 15px;">
              <span class="status-paid">PAID</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing us! Please carry a valid ID proof.</p>
            <p>This is a computer generated ticket - no signature required.</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        // Keep the window open after printing (optional)
        // printWindow.close();
      };
    } else {
      alert('Please allow pop-ups to print the ticket');
    }
  }

  goToMyBookings() {
    this.router.navigate(['/my-bookings']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  // Format date for display
  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate total with tax
  getTotalWithTax(): number {
    if (!this.booking) return 0;
    return this.booking.totalAmount + this.booking.taxAmount;
  }
}