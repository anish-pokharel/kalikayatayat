import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Offer {
  id: number;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'waiver';
  discountValue: number;
  maxDiscount?: number;
  minBookingAmount: number;
  applicableOn: 'all' | 'specific' | 'first' | 'weekend';
  applicableRoutes?: number[];
  applicableBusTypes?: string[];
  startDate: string;
  endDate: string;
  usageLimit: number;
  usagePerUser: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  termsAndConditions: string[];
  image?: string;
  bgColor?: string;
  textColor?: string;
  featured: boolean;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl:'./offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  selectedApplicable: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  showBulkUploadModal: boolean = false;
  showStatsModal: boolean = false;
  
  selectedOffer: Offer | null = null;
  
  // For add/edit form
  editOfferCode: string = '';
  editOfferTitle: string = '';
  editOfferDescription: string = '';
  editOfferType: string = 'percentage';
  editOfferDiscountValue: number = 0;
  editOfferMaxDiscount: number | undefined = undefined;
  editOfferMinBookingAmount: number = 0;
  editOfferStartDate: string = '';
  editOfferEndDate: string = '';
  editOfferApplicableOn: string = 'all';
  editOfferApplicableBusTypes: string[] = [];
  editOfferApplicableRoutes: number[] = [];
  editOfferUsageLimit: number = 100;
  editOfferUsagePerUser: number = 1;
  editOfferTerms: string = '';
  editOfferFeatured: boolean = false;
  editOfferStatus: string = 'active';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Statistics
  totalOffers: number = 0;
  activeOffers: number = 0;
  totalUsage: number = 0;
  totalDiscountGiven: number = 0;
  
  offerTypes = [
    { value: 'percentage', label: 'Percentage (%)', icon: '%' },
    { value: 'fixed', label: 'Fixed Amount (₹)', icon: '💰' },
    { value: 'bogo', label: 'Buy One Get One', icon: '🎁' },
    { value: 'waiver', label: 'Cancellation Waiver', icon: '🔄' }
  ];
  
  busTypes = [
    'AC Sleeper',
    'AC Seater',
    'Non-AC Sleeper',
    'Non-AC Seater',
    'Luxury',
    'Volvo',
    'All'
  ];
  
  routes = [
    { id: 1, name: 'Delhi-Mumbai' },
    { id: 2, name: 'Bangalore-Chennai' },
    { id: 3, name: 'Mumbai-Pune' },
    { id: 4, name: 'Delhi-Agra' },
    { id: 5, name: 'Kolkata-Delhi' }
  ];

  ngOnInit() {
    this.loadOffers();
    this.calculateStatistics();
  }

  loadOffers() {
    this.offers = [
      {
        id: 1,
        code: 'WELCOME20',
        title: 'Welcome Offer',
        description: 'Get 20% off on your first booking',
        type: 'percentage',
        discountValue: 20,
        maxDiscount: 500,
        minBookingAmount: 1000,
        applicableOn: 'first',
        applicableRoutes: [1, 2, 3, 4, 5],
        applicableBusTypes: ['AC Sleeper', 'Volvo'],
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        usageLimit: 5000,
        usagePerUser: 1,
        usedCount: 2345,
        status: 'active',
        createdAt: '2024-01-01',
        termsAndConditions: [
          'Valid for first time users only',
          'Maximum discount of ₹500',
          'Valid on all routes'
        ],
        bgColor: '#4f46e5',
        textColor: '#ffffff',
        featured: true
      },
      {
        id: 2,
        code: 'FLAT300',
        title: 'Flat ₹300 Off',
        description: 'Get flat ₹300 off on bookings above ₹1500',
        type: 'fixed',
        discountValue: 300,
        minBookingAmount: 1500,
        applicableOn: 'all',
        applicableRoutes: [1, 2, 3],
        applicableBusTypes: ['AC Sleeper', 'AC Seater', 'Volvo'],
        startDate: '2024-02-01',
        endDate: '2024-04-30',
        usageLimit: 2000,
        usagePerUser: 2,
        usedCount: 876,
        status: 'active',
        createdAt: '2024-02-01',
        termsAndConditions: [
          'Valid on bookings above ₹1500',
          'Valid on selected routes only'
        ],
        bgColor: '#e11d48',
        textColor: '#ffffff',
        featured: true
      },
      {
        id: 3,
        code: 'BOGO50',
        title: 'Buy 1 Get 1 at 50%',
        description: 'Buy one ticket and get second at 50% off',
        type: 'bogo',
        discountValue: 50,
        minBookingAmount: 2000,
        applicableOn: 'specific',
        applicableRoutes: [1, 5],
        applicableBusTypes: ['Luxury', 'Volvo'],
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        usageLimit: 1000,
        usagePerUser: 1,
        usedCount: 234,
        status: 'active',
        createdAt: '2024-03-01',
        termsAndConditions: [
          'Valid on Luxury and Volvo buses',
          'Second ticket of equal or lesser value'
        ],
        bgColor: '#0891b2',
        textColor: '#ffffff',
        featured: false
      },
      {
        id: 4,
        code: 'WEEKEND15',
        title: 'Weekend Special',
        description: '15% off on weekend travel',
        type: 'percentage',
        discountValue: 15,
        maxDiscount: 400,
        minBookingAmount: 800,
        applicableOn: 'weekend',
        applicableRoutes: [1, 2, 3, 4],
        applicableBusTypes: ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper'],
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        usageLimit: 1500,
        usagePerUser: 3,
        usedCount: 567,
        status: 'active',
        createdAt: '2024-04-01',
        termsAndConditions: [
          'Valid on Friday, Saturday and Sunday travel',
          'Maximum discount of ₹400'
        ],
        bgColor: '#65a30d',
        textColor: '#ffffff',
        featured: true
      },
      {
        id: 5,
        code: 'CANCELFREE',
        title: 'Free Cancellation',
        description: 'Get free cancellation on your booking',
        type: 'waiver',
        discountValue: 0,
        minBookingAmount: 500,
        applicableOn: 'all',
        applicableRoutes: [1, 2, 3, 4, 5],
        applicableBusTypes: ['All'],
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        usageLimit: 500,
        usagePerUser: 1,
        usedCount: 500,
        status: 'expired',
        createdAt: '2024-01-01',
        termsAndConditions: [
          'Free cancellation up to 2 hours before departure',
          'Valid on all routes'
        ],
        bgColor: '#b45309',
        textColor: '#ffffff',
        featured: false
      },
      {
        id: 6,
        code: 'SUMMER25',
        title: 'Summer Special',
        description: '25% off on summer travel',
        type: 'percentage',
        discountValue: 25,
        maxDiscount: 600,
        minBookingAmount: 1200,
        applicableOn: 'all',
        applicableRoutes: [2, 3, 4],
        applicableBusTypes: ['AC Sleeper', 'Luxury'],
        startDate: '2024-05-01',
        endDate: '2024-07-31',
        usageLimit: 2000,
        usagePerUser: 2,
        usedCount: 0,
        status: 'inactive',
        createdAt: '2024-04-15',
        termsAndConditions: [
          'Valid from May to July',
          'Maximum discount of ₹600'
        ],
        bgColor: '#ca8a04',
        textColor: '#ffffff',
        featured: false
      }
    ];
    this.filteredOffers = [...this.offers];
    this.calculatePagination();
  }

  calculateStatistics() {
    this.totalOffers = this.offers.length;
    this.activeOffers = this.offers.filter(o => o.status === 'active').length;
    this.totalUsage = this.offers.reduce((sum, o) => sum + o.usedCount, 0);
    this.totalDiscountGiven = this.totalUsage * 200;
  }

  filterOffers() {
    this.filteredOffers = this.offers.filter(offer => {
      const matchesSearch = this.searchTerm === '' || 
        offer.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.selectedType === 'all' || offer.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || offer.status === this.selectedStatus;
      const matchesApplicable = this.selectedApplicable === 'all' || offer.applicableOn === this.selectedApplicable;
      
      return matchesSearch && matchesType && matchesStatus && matchesApplicable;
    });
    
    this.calculatePagination();
  }

  onSearch() {
    this.currentPage = 1;
    this.filterOffers();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.filterOffers();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.selectedStatus = 'all';
    this.selectedApplicable = 'all';
    this.filterOffers();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredOffers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPaginatedOffers(): Offer[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOffers.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // FIXED: Helper methods for featured offers
  hasFeaturedActiveOffers(): boolean {
    return this.offers.filter(o => o.featured && o.status === 'active').length > 0;
  }

  getFeaturedActiveOffers(): Offer[] {
    return this.offers.filter(o => o.featured && o.status === 'active').slice(0, 3);
  }

  openAddModal() {
    this.editOfferCode = '';
    this.editOfferTitle = '';
    this.editOfferDescription = '';
    this.editOfferType = 'percentage';
    this.editOfferDiscountValue = 0;
    this.editOfferMaxDiscount = undefined;
    this.editOfferMinBookingAmount = 0;
    this.editOfferStartDate = new Date().toISOString().split('T')[0];
    this.editOfferEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
    this.editOfferApplicableOn = 'all';
    this.editOfferApplicableBusTypes = [];
    this.editOfferApplicableRoutes = [];
    this.editOfferUsageLimit = 100;
    this.editOfferUsagePerUser = 1;
    this.editOfferTerms = 'Valid on selected routes only\nCannot be combined with other offers';
    this.editOfferFeatured = false;
    this.editOfferStatus = 'active';
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveOffer() {
    const newId = this.offers.length + 1;
    const termsArray = this.editOfferTerms.split('\n').filter(term => term.trim() !== '');
    
    const offer: Offer = {
      id: newId,
      code: this.editOfferCode,
      title: this.editOfferTitle,
      description: this.editOfferDescription,
      type: this.editOfferType as any,
      discountValue: this.editOfferDiscountValue,
      maxDiscount: this.editOfferMaxDiscount,
      minBookingAmount: this.editOfferMinBookingAmount,
      applicableOn: this.editOfferApplicableOn as any,
      applicableRoutes: this.editOfferApplicableRoutes,
      applicableBusTypes: this.editOfferApplicableBusTypes,
      startDate: this.editOfferStartDate,
      endDate: this.editOfferEndDate,
      usageLimit: this.editOfferUsageLimit,
      usagePerUser: this.editOfferUsagePerUser,
      usedCount: 0,
      status: this.editOfferStatus as any,
      createdAt: new Date().toISOString().split('T')[0],
      termsAndConditions: termsArray,
      featured: this.editOfferFeatured,
      bgColor: this.generateRandomColor(),
      textColor: '#ffffff'
    };
    
    this.offers.push(offer);
    this.filterOffers();
    this.calculateStatistics();
    this.closeAddModal();
  }

  openViewModal(offer: Offer) {
    this.selectedOffer = { ...offer };
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOffer = null;
  }

  openEditModal(offer: Offer) {
    this.selectedOffer = { ...offer };
    this.editOfferCode = offer.code;
    this.editOfferTitle = offer.title;
    this.editOfferDescription = offer.description;
    this.editOfferType = offer.type;
    this.editOfferDiscountValue = offer.discountValue;
    this.editOfferMaxDiscount = offer.maxDiscount;
    this.editOfferMinBookingAmount = offer.minBookingAmount;
    this.editOfferStartDate = offer.startDate;
    this.editOfferEndDate = offer.endDate;
    this.editOfferApplicableOn = offer.applicableOn;
    this.editOfferApplicableBusTypes = [...(offer.applicableBusTypes || [])];
    this.editOfferApplicableRoutes = [...(offer.applicableRoutes || [])];
    this.editOfferUsageLimit = offer.usageLimit;
    this.editOfferUsagePerUser = offer.usagePerUser;
    this.editOfferTerms = offer.termsAndConditions.join('\n');
    this.editOfferFeatured = offer.featured;
    this.editOfferStatus = offer.status;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedOffer = null;
  }

  updateOffer() {
    if (this.selectedOffer) {
      const index = this.offers.findIndex(o => o.id === this.selectedOffer!.id);
      if (index !== -1) {
        const termsArray = this.editOfferTerms.split('\n').filter(term => term.trim() !== '');
        
        const updatedOffer: Offer = {
          ...this.selectedOffer,
          code: this.editOfferCode,
          title: this.editOfferTitle,
          description: this.editOfferDescription,
          type: this.editOfferType as any,
          discountValue: this.editOfferDiscountValue,
          maxDiscount: this.editOfferMaxDiscount,
          minBookingAmount: this.editOfferMinBookingAmount,
          startDate: this.editOfferStartDate,
          endDate: this.editOfferEndDate,
          applicableOn: this.editOfferApplicableOn as any,
          applicableBusTypes: this.editOfferApplicableBusTypes,
          applicableRoutes: this.editOfferApplicableRoutes,
          usageLimit: this.editOfferUsageLimit,
          usagePerUser: this.editOfferUsagePerUser,
          termsAndConditions: termsArray,
          featured: this.editOfferFeatured,
          status: this.editOfferStatus as any
        };
        
        this.offers[index] = updatedOffer;
        this.filterOffers();
        this.calculateStatistics();
      }
      this.closeEditModal();
    }
  }

  openDeleteModal(offer: Offer) {
    this.selectedOffer = offer;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedOffer = null;
  }

  confirmDelete() {
    if (this.selectedOffer) {
      this.offers = this.offers.filter(o => o.id !== this.selectedOffer!.id);
      this.filterOffers();
      this.calculateStatistics();
      this.closeDeleteModal();
    }
  }

  openBulkUploadModal() {
    this.showBulkUploadModal = true;
  }

  closeBulkUploadModal() {
    this.showBulkUploadModal = false;
  }

  openStatsModal() {
    this.showStatsModal = true;
  }

  closeStatsModal() {
    this.showStatsModal = false;
  }

  toggleStatus(offer: Offer) {
    if (offer.status === 'active') {
      offer.status = 'inactive';
    } else if (offer.status === 'inactive') {
      offer.status = 'active';
    }
  }

  toggleFeatured(offer: Offer) {
    offer.featured = !offer.featured;
  }

  duplicateOffer(offer: Offer) {
    const newOffer = { ...offer, id: this.offers.length + 1, code: `${offer.code}-COPY`, usedCount: 0 };
    this.offers.push(newOffer);
    this.filterOffers();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'expired': return 'status-expired';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'percentage': '%',
      'fixed': '₹',
      'bogo': '🎁',
      'waiver': '🔄'
    };
    return icons[type] || '🏷️';
  }

  getTypeLabel(type: string): string {
    const typeObj = this.offerTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getApplicableLabel(applicable: string): string {
    const labels: {[key: string]: string} = {
      'all': 'All Bookings',
      'specific': 'Specific Routes',
      'first': 'First Booking Only',
      'weekend': 'Weekend Travel'
    };
    return labels[applicable] || applicable;
  }

  getUsagePercentage(offer: Offer): number {
    return (offer.usedCount / offer.usageLimit) * 100;
  }

  getDaysRemaining(offer: Offer): number {
    const today = new Date();
    const endDate = new Date(offer.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isExpiringSoon(offer: Offer): boolean {
    const days = this.getDaysRemaining(offer);
    return days <= 7 && days > 0 && offer.status === 'active';
  }

  generateRandomColor(): string {
    const colors = ['#4f46e5', '#e11d48', '#0891b2', '#65a30d', '#b45309', '#7c3aed', '#db2777', '#0284c7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  exportData() {
    alert('Exporting offers data...');
  }

  downloadTemplate() {
    alert('Downloading template...');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      alert(`File selected: ${file.name}`);
    }
  }

  getTotalActiveOffers(): number {
    return this.offers.filter(o => o.status === 'active').length;
  }

  getTotalExpiredOffers(): number {
    return this.offers.filter(o => o.status === 'expired').length;
  }

  getTotalInactiveOffers(): number {
    return this.offers.filter(o => o.status === 'inactive').length;
  }

  getTotalFeaturedOffers(): number {
    return this.offers.filter(o => o.featured).length;
  }

  getRedemptionRate(): number {
    const totalUsed = this.offers.reduce((sum, o) => sum + o.usedCount, 0);
    const totalLimit = this.offers.reduce((sum, o) => sum + o.usageLimit, 0);
    return totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
  }

  toggleBusType(type: string) {
    const index = this.editOfferApplicableBusTypes.indexOf(type);
    if (index === -1) {
      this.editOfferApplicableBusTypes.push(type);
    } else {
      this.editOfferApplicableBusTypes.splice(index, 1);
    }
  }

  toggleRoute(routeId: number) {
    const index = this.editOfferApplicableRoutes.indexOf(routeId);
    if (index === -1) {
      this.editOfferApplicableRoutes.push(routeId);
    } else {
      this.editOfferApplicableRoutes.splice(index, 1);
    }
  }

  isBusTypeSelected(type: string): boolean {
    return this.editOfferApplicableBusTypes.includes(type);
  }

  isRouteSelected(routeId: number): boolean {
    return this.editOfferApplicableRoutes.includes(routeId);
  }
// Add this method to get count of offers by type
getOfferCountByType(typeValue: string): number {
  return this.offers.filter(o => o.type === typeValue).length;
}
  // Helper method to get route names from IDs
  getRouteNames(routeIds: number[] | undefined): string {
    if (!routeIds || routeIds.length === 0) {
      return 'No specific routes';
    }
    
    return routeIds.map(id => {
      const route = this.routes.find(r => r.id === id);
      return route ? route.name : 'Unknown';
    }).join(', ');
  }
}