// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-customers',
//   standalone: true,
//   imports: [],
//   templateUrl: './customers.component.html',
//   styleUrl: './customers.component.css'
// })
// export class CustomersComponent {

// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Customer {
  id: number;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  idProofType: 'aadhar' | 'pan' | 'passport' | 'driving' | 'voter';
  idProofNumber: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  registeredOn: string;
  status: 'active' | 'inactive' | 'blocked';
  preferences?: {
    busType?: string[];
    seatPreference?: 'window' | 'aisle' | 'any';
    mealPreference?: string[];
  };
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedGender: string = 'all';
  selectedCity: string = 'all';
  dateRange = {
    from: '',
    to: ''
  };
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  showBookingHistoryModal: boolean = false;
  showExportModal: boolean = false;
  
  selectedCustomer: Customer | null = null;
  cities: string[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Chart data
  customerGrowthData: any[] = [];
  bookingTrendData: any[] = [];
  
  newCustomer: Omit<Customer, 'id' | 'customerId' | 'totalBookings' | 'totalSpent' | 'lastBooking' | 'registeredOn'> = {
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    idProofType: 'aadhar',
    idProofNumber: '',
    status: 'active',
    preferences: {
      busType: [],
      seatPreference: 'any',
      mealPreference: []
    }
  };

  ngOnInit() {
    this.loadCustomers();
    this.loadCustomerGrowthData();
    this.loadBookingTrendData();
    this.extractCities();
  }

  loadCustomers() {
    this.customers = [
      {
        id: 1,
        customerId: 'CUST001',
        name: 'Rajesh Kumar',
        email: 'rajesh.k@email.com',
        phone: '9876543210',
        alternatePhone: '9876543211',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        address: '123 Gandhi Nagar',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        idProofType: 'aadhar',
        idProofNumber: '1234-5678-9012',
        totalBookings: 12,
        totalSpent: 24500,
        lastBooking: '2024-02-15',
        registeredOn: '2023-01-10',
        status: 'active',
        preferences: {
          busType: ['AC Sleeper', 'Volvo'],
          seatPreference: 'window',
          mealPreference: ['Vegetarian']
        }
      },
      {
        id: 2,
        customerId: 'CUST002',
        name: 'Priya Sharma',
        email: 'priya.s@email.com',
        phone: '9876543212',
        dateOfBirth: '1990-08-22',
        gender: 'female',
        address: '456 Lake View',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        idProofType: 'pan',
        idProofNumber: 'ABCDE1234F',
        totalBookings: 8,
        totalSpent: 18900,
        lastBooking: '2024-02-10',
        registeredOn: '2023-03-15',
        status: 'active',
        preferences: {
          busType: ['AC Seater'],
          seatPreference: 'aisle'
        }
      },
      {
        id: 3,
        customerId: 'CUST003',
        name: 'Amit Patel',
        email: 'amit.p@email.com',
        phone: '9876543213',
        dateOfBirth: '1988-11-03',
        gender: 'male',
        address: '789 Tech Park',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        idProofType: 'passport',
        idProofNumber: 'P1234567',
        totalBookings: 5,
        totalSpent: 11200,
        lastBooking: '2024-01-25',
        registeredOn: '2023-06-20',
        status: 'inactive'
      },
      {
        id: 4,
        customerId: 'CUST004',
        name: 'Sneha Reddy',
        email: 'sneha.r@email.com',
        phone: '9876543214',
        dateOfBirth: '1992-02-28',
        gender: 'female',
        address: '321 Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        idProofType: 'driving',
        idProofNumber: 'TS0123456789',
        totalBookings: 15,
        totalSpent: 35600,
        lastBooking: '2024-02-18',
        registeredOn: '2022-12-05',
        status: 'active',
        preferences: {
          busType: ['Luxury', 'Volvo'],
          seatPreference: 'window'
        }
      },
      {
        id: 5,
        customerId: 'CUST005',
        name: 'Vikram Singh',
        email: 'vikram.s@email.com',
        phone: '9876543215',
        dateOfBirth: '1983-07-19',
        gender: 'male',
        address: '567 Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        idProofType: 'voter',
        idProofNumber: 'RJ1234567',
        totalBookings: 3,
        totalSpent: 6800,
        lastBooking: '2024-01-05',
        registeredOn: '2023-09-12',
        status: 'blocked'
      },
      {
        id: 6,
        customerId: 'CUST006',
        name: 'Anjali Nair',
        email: 'anjali.n@email.com',
        phone: '9876543216',
        dateOfBirth: '1995-12-10',
        gender: 'female',
        address: '432 Marine Drive',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001',
        idProofType: 'aadhar',
        idProofNumber: '2345-6789-0123',
        totalBookings: 7,
        totalSpent: 15900,
        lastBooking: '2024-02-05',
        registeredOn: '2023-07-18',
        status: 'active'
      },
      {
        id: 7,
        customerId: 'CUST007',
        name: 'Rahul Verma',
        email: 'rahul.v@email.com',
        phone: '9876543217',
        dateOfBirth: '1987-09-30',
        gender: 'male',
        address: '876 Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        idProofType: 'pan',
        idProofNumber: 'FGHIJ5678K',
        totalBookings: 10,
        totalSpent: 22300,
        lastBooking: '2024-02-12',
        registeredOn: '2023-04-25',
        status: 'active'
      },
      {
        id: 8,
        customerId: 'CUST008',
        name: 'Kavita Joshi',
        email: 'kavita.j@email.com',
        phone: '9876543218',
        dateOfBirth: '1993-04-17',
        gender: 'female',
        address: '234 FC Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        idProofType: 'passport',
        idProofNumber: 'P7654321',
        totalBookings: 2,
        totalSpent: 4500,
        lastBooking: '2024-01-18',
        registeredOn: '2023-11-30',
        status: 'inactive'
      }
    ];
    this.filterCustomers();
    this.calculatePagination();
  }

  loadCustomerGrowthData() {
    this.customerGrowthData = [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 52 },
      { month: 'Mar', count: 68 },
      { month: 'Apr', count: 74 },
      { month: 'May', count: 89 },
      { month: 'Jun', count: 102 },
      { month: 'Jul', count: 118 },
      { month: 'Aug', count: 135 },
      { month: 'Sep', count: 149 },
      { month: 'Oct', count: 162 },
      { month: 'Nov', count: 178 },
      { month: 'Dec', count: 194 }
    ];
  }

  loadBookingTrendData() {
    this.bookingTrendData = [
      { month: 'Jan', bookings: 78 },
      { month: 'Feb', bookings: 92 },
      { month: 'Mar', bookings: 105 },
      { month: 'Apr', bookings: 98 },
      { month: 'May', bookings: 112 },
      { month: 'Jun', bookings: 128 },
      { month: 'Jul', bookings: 145 },
      { month: 'Aug', bookings: 162 },
      { month: 'Sep', bookings: 158 },
      { month: 'Oct', bookings: 172 },
      { month: 'Nov', bookings: 189 },
      { month: 'Dec', bookings: 210 }
    ];
  }

  extractCities() {
    const uniqueCities = [...new Set(this.customers.map(c => c.city))];
    this.cities = uniqueCities.sort();
  }

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = this.searchTerm === '' || 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm) ||
        customer.customerId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || customer.status === this.selectedStatus;
      const matchesGender = this.selectedGender === 'all' || customer.gender === this.selectedGender;
      const matchesCity = this.selectedCity === 'all' || customer.city === this.selectedCity;
      
      const matchesDateRange = (!this.dateRange.from || new Date(customer.registeredOn) >= new Date(this.dateRange.from)) &&
                               (!this.dateRange.to || new Date(customer.registeredOn) <= new Date(this.dateRange.to));
      
      return matchesSearch && matchesStatus && matchesGender && matchesCity && matchesDateRange;
    });
    
    this.calculatePagination();
  }

  onSearch() {
    this.currentPage = 1;
    this.filterCustomers();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.filterCustomers();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedGender = 'all';
    this.selectedCity = 'all';
    this.dateRange = { from: '', to: '' };
    this.filterCustomers();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPaginatedCustomers(): Customer[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCustomers.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  openAddModal() {
    this.newCustomer = {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      city: '',
      state: '',
      pincode: '',
      idProofType: 'aadhar',
      idProofNumber: '',
      status: 'active',
      preferences: {
        busType: [],
        seatPreference: 'any',
        mealPreference: []
      }
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveCustomer() {
    const newId = this.customers.length + 1;
    const customerId = `CUST${String(newId).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const customer: Customer = {
      id: newId,
      customerId: customerId,
      name: this.newCustomer.name,
      email: this.newCustomer.email,
      phone: this.newCustomer.phone,
      alternatePhone: this.newCustomer.alternatePhone,
      dateOfBirth: this.newCustomer.dateOfBirth,
      gender: this.newCustomer.gender,
      address: this.newCustomer.address,
      city: this.newCustomer.city,
      state: this.newCustomer.state,
      pincode: this.newCustomer.pincode,
      idProofType: this.newCustomer.idProofType,
      idProofNumber: this.newCustomer.idProofNumber,
      totalBookings: 0,
      totalSpent: 0,
      lastBooking: '',
      registeredOn: today,
      status: this.newCustomer.status,
      preferences: this.newCustomer.preferences
    };
    
    this.customers.push(customer);
    this.extractCities();
    this.filterCustomers();
    this.closeAddModal();
  }

  openViewModal(customer: Customer) {
    this.selectedCustomer = { ...customer };
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedCustomer = null;
  }

  openEditModal(customer: Customer) {
    this.selectedCustomer = { ...customer };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedCustomer = null;
  }

  updateCustomer() {
    if (this.selectedCustomer) {
      const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
      if (index !== -1) {
        this.customers[index] = this.selectedCustomer;
        this.extractCities();
        this.filterCustomers();
      }
      this.closeEditModal();
    }
  }

  openDeleteModal(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedCustomer = null;
  }

  confirmDelete() {
    if (this.selectedCustomer) {
      this.customers = this.customers.filter(c => c.id !== this.selectedCustomer!.id);
      this.extractCities();
      this.filterCustomers();
      this.closeDeleteModal();
    }
  }

  openBookingHistory(customer: Customer) {
    this.selectedCustomer = customer;
    this.showBookingHistoryModal = true;
  }

  closeBookingHistory() {
    this.showBookingHistoryModal = false;
    this.selectedCustomer = null;
  }

  openExportModal() {
    this.showExportModal = true;
  }

  closeExportModal() {
    this.showExportModal = false;
  }

  exportData(format: 'pdf' | 'excel' | 'csv') {
    alert(`Exporting customer data as ${format.toUpperCase()}`);
    this.closeExportModal();
  }

  sendEmail(customer: Customer) {
    alert(`Sending email to ${customer.email}`);
  }

  sendSMS(customer: Customer) {
    alert(`Sending SMS to ${customer.phone}`);
  }

  blockCustomer(customer: Customer) {
    customer.status = 'blocked';
    alert(`Customer ${customer.name} has been blocked`);
  }

  toggleStatus(customer: Customer) {
    if (customer.status === 'active') {
      customer.status = 'inactive';
    } else if (customer.status === 'inactive') {
      customer.status = 'active';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'blocked': return 'status-blocked';
      default: return '';
    }
  }

  getGenderIcon(gender: string): string {
    switch(gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '🧑';
      default: return '👤';
    }
  }

  getIdProofLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'aadhar': 'Aadhar Card',
      'pan': 'PAN Card',
      'passport': 'Passport',
      'driving': 'Driving License',
      'voter': 'Voter ID'
    };
    return labels[type] || type;
  }

  getTotalActiveCustomers(): number {
    return this.customers.filter(c => c.status === 'active').length;
  }

  getTotalInactiveCustomers(): number {
    return this.customers.filter(c => c.status === 'inactive').length;
  }

  getTotalBlockedCustomers(): number {
    return this.customers.filter(c => c.status === 'blocked').length;
  }

  getTotalRevenue(): number {
    return this.customers.reduce((sum, c) => sum + c.totalSpent, 0);
  }

  getAverageSpending(): number {
    return this.customers.length > 0 ? Math.round(this.getTotalRevenue() / this.customers.length) : 0;
  }
}