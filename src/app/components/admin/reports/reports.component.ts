import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Report {
  id: string;
  name: string;
  type: 'sales' | 'booking' | 'customer' | 'payment' | 'route' | 'cancellation';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  generatedOn: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  size: string;
}

interface SalesData {
  date: string;
  revenue: number;
  bookings: number;
  cancellations: number;
  refunds: number;
}

interface RoutePerformance {
  routeName: string;
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  popularTime: string;
}

interface PaymentSummary {
  method: string;
  count: number;
  amount: number;
  successRate: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedPeriod: string = 'all';
  
  showGenerateModal: boolean = false;
  showPreviewModal: boolean = false;
  showDeleteModal: boolean = false;
  
  selectedReport: Report | null = null;
  activeTab: string = 'sales';
  
  dateRange = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  };
  
  salesData: SalesData[] = [];
  routePerformance: RoutePerformance[] = [];
  paymentSummary: PaymentSummary[] = [];
  
  // Computed properties for template - initialized with default values
  totalRevenue: number = 0;
  totalBookings: number = 0;
  totalCancellations: number = 0;
  totalRefunds: number = 0;
  netRevenue: number = 0;
  averageOccupancy: number = 0;
  
  reportTypes = ['sales', 'booking', 'customer', 'payment', 'route', 'cancellation'];
  periods = ['daily', 'weekly', 'monthly', 'yearly', 'custom'];
  exportFormats = ['pdf', 'excel', 'csv'];

  ngOnInit() {
    this.loadReports();
    this.loadSalesData();
    this.loadRoutePerformance();
    this.loadPaymentSummary();
    this.calculateTotals();
  }

  loadReports() {
    this.reports = [
      {
        id: 'RPT-001',
        name: 'Daily Sales Report - Jan 15, 2024',
        type: 'sales',
        period: 'daily',
        generatedOn: '2024-01-15 10:30 AM',
        generatedBy: 'Admin User',
        format: 'pdf',
        size: '2.4 MB'
      },
      {
        id: 'RPT-002',
        name: 'Weekly Booking Summary (Jan 8-14)',
        type: 'booking',
        period: 'weekly',
        generatedOn: '2024-01-15 09:15 AM',
        generatedBy: 'John Smith',
        format: 'excel',
        size: '1.8 MB'
      },
      {
        id: 'RPT-003',
        name: 'Customer Report - December 2023',
        type: 'customer',
        period: 'monthly',
        generatedOn: '2024-01-01 11:00 AM',
        generatedBy: 'Sarah Johnson',
        format: 'pdf',
        size: '3.2 MB'
      },
      {
        id: 'RPT-004',
        name: 'Payment Gateway Summary (Q1 2024)',
        type: 'payment',
        period: 'yearly',
        generatedOn: '2024-01-10 02:45 PM',
        generatedBy: 'Mike Wilson',
        format: 'csv',
        size: '1.1 MB'
      },
      {
        id: 'RPT-005',
        name: 'Route Performance - Delhi-Mumbai',
        type: 'route',
        period: 'monthly',
        generatedOn: '2024-01-14 04:20 PM',
        generatedBy: 'Emma Davis',
        format: 'excel',
        size: '2.7 MB'
      }
    ];
    this.filterReports();
  }

  loadSalesData() {
    this.salesData = [
      { date: 'Jan 1', revenue: 45678, bookings: 156, cancellations: 12, refunds: 4500 },
      { date: 'Jan 2', revenue: 52341, bookings: 178, cancellations: 8, refunds: 3200 },
      { date: 'Jan 3', revenue: 48902, bookings: 165, cancellations: 10, refunds: 3800 },
      { date: 'Jan 4', revenue: 61234, bookings: 198, cancellations: 15, refunds: 5600 },
      { date: 'Jan 5', revenue: 58765, bookings: 187, cancellations: 9, refunds: 3400 },
      { date: 'Jan 6', revenue: 49876, bookings: 169, cancellations: 11, refunds: 4100 },
      { date: 'Jan 7', revenue: 63456, bookings: 203, cancellations: 14, refunds: 5200 }
    ];
  }

  loadRoutePerformance() {
    this.routePerformance = [
      { routeName: 'Delhi-Mumbai', totalBookings: 1234, revenue: 987654, occupancyRate: 85, popularTime: 'Night' },
      { routeName: 'Bangalore-Chennai', totalBookings: 987, revenue: 543210, occupancyRate: 78, popularTime: 'Morning' },
      { routeName: 'Mumbai-Pune', totalBookings: 1543, revenue: 678901, occupancyRate: 92, popularTime: 'Evening' },
      { routeName: 'Delhi-Agra', totalBookings: 765, revenue: 345678, occupancyRate: 71, popularTime: 'Morning' },
      { routeName: 'Kolkata-Delhi', totalBookings: 543, revenue: 876543, occupancyRate: 65, popularTime: 'Night' }
    ];
  }

  loadPaymentSummary() {
    this.paymentSummary = [
      { method: 'Khalti', count: 2345, amount: 2345678, successRate: 98 },
      { method: 'eSewa', count: 1876, amount: 1876543, successRate: 97 },
      { method: 'My Pay', count: 654, amount: 654321, successRate: 96 },
      { method: 'Credit Card', count: 432, amount: 432109, successRate: 99 },
      { method: 'Cash', count: 123, amount: 123456, successRate: 100 }
    ];
  }

  calculateTotals() {
    this.totalRevenue = this.salesData.reduce((sum, item) => sum + item.revenue, 0);
    this.totalBookings = this.salesData.reduce((sum, item) => sum + item.bookings, 0);
    this.totalCancellations = this.salesData.reduce((sum, item) => sum + item.cancellations, 0);
    this.totalRefunds = this.salesData.reduce((sum, item) => sum + item.refunds, 0);
    this.netRevenue = this.totalRevenue - this.totalRefunds;
    
    if (this.routePerformance.length > 0) {
      const totalOccupancy = this.routePerformance.reduce((sum, item) => sum + item.occupancyRate, 0);
      this.averageOccupancy = Math.round(totalOccupancy / this.routePerformance.length);
    }
  }

  filterReports() {
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = 
        report.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedType === 'all' || report.type === this.selectedType;
      const matchesPeriod = this.selectedPeriod === 'all' || report.period === this.selectedPeriod;
      
      return matchesSearch && matchesType && matchesPeriod;
    });
  }

  onSearch() {
    this.filterReports();
  }

  onFilterChange() {
    this.filterReports();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openGenerateModal() {
    this.showGenerateModal = true;
  }

  closeGenerateModal() {
    this.showGenerateModal = false;
  }

  generateReport() {
    // In real app, this would generate the report
    console.log('Generating report...');
    this.closeGenerateModal();
  }

  openPreviewModal(report: Report) {
    this.selectedReport = report;
    this.showPreviewModal = true;
  }

  closePreviewModal() {
    this.showPreviewModal = false;
    this.selectedReport = null;
  }

  openDeleteModal(report: Report) {
    this.selectedReport = report;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedReport = null;
  }

  confirmDelete() {
    if (this.selectedReport) {
      this.reports = this.reports.filter(r => r.id !== this.selectedReport!.id);
      this.filterReports();
      this.closeDeleteModal();
    }
  }

  downloadReport(report: Report, format: string) {
    // In real app, this would download the report
    console.log(`Downloading ${report.name} in ${format} format`);
  }

  exportCurrentView(format: string) {
    // In real app, this would export the current view
    console.log(`Exporting current view as ${format}`);
  }

  printReport(report: Report) {
    // In real app, this would print the report
    console.log(`Printing ${report.name}`);
  }

  getReportTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'sales': 'Sales Report',
      'booking': 'Booking Report',
      'customer': 'Customer Report',
      'payment': 'Payment Report',
      'route': 'Route Report',
      'cancellation': 'Cancellation Report'
    };
    return labels[type] || type;
  }
  
  getStatusClass(successRate: number): string {
    if (successRate > 95) return 'status-active';
    if (successRate > 90) return 'status-pending';
    return 'status-inactive';
  }
  
  getStatusText(successRate: number): string {
    if (successRate > 95) return 'Excellent';
    if (successRate > 90) return 'Good';
    return 'Needs Review';
  }
}