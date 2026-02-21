import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Fare {
  id: number;
  routeId: number;
  routeName: string;
  busType: 'AC Sleeper' | 'AC Seater' | 'Non-AC Sleeper' | 'Non-AC Seater' | 'Luxury' | 'Volvo';
  baseFare: number;
  perKmRate: number;
  minimumFare: number;
  discountPercent: number;
  taxPercent: number;
  serviceCharge: number;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'active' | 'inactive';
}

interface Route {
  id: number;
  name: string;
}

@Component({
  selector: 'app-fare-declaration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fare-declaration.component.html',
  styleUrls: ['./fare-declaration.component.css']
})
export class FareDeclarationComponent implements OnInit {
  fares: Fare[] = [];
  filteredFares: Fare[] = [];
  routes: Route[] = [];
  
  searchTerm: string = '';
  selectedRoute: string = 'all';
  selectedBusType: string = 'all';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showBulkUploadModal: boolean = false;
  
  selectedFare: Fare | null = null;
  
  newFare: Omit<Fare, 'id'> = {
    routeId: 0,
    routeName: '',
    busType: 'AC Sleeper',
    baseFare: 0,
    perKmRate: 0,
    minimumFare: 0,
    discountPercent: 0,
    taxPercent: 18,
    serviceCharge: 0,
    effectiveFrom: '',
    effectiveTo: '',
    status: 'active'
  };

  busTypes = [
    'AC Sleeper',
    'AC Seater',
    'Non-AC Sleeper',
    'Non-AC Seater',
    'Luxury',
    'Volvo'
  ];

  ngOnInit() {
    this.loadRoutes();
    this.loadFares();
  }

  loadRoutes() {
    // Sample data - In real app, this would come from a service
    this.routes = [
      { id: 1, name: 'Delhi-Mumbai Express' },
      { id: 2, name: 'Bangalore-Chennai' },
      { id: 3, name: 'Mumbai-Pune' },
      { id: 4, name: 'Delhi-Agra' },
      { id: 5, name: 'Kolkata-Delhi' }
    ];
  }

  loadFares() {
    // Sample data - In real app, this would come from a service
    this.fares = [
      {
        id: 1,
        routeId: 1,
        routeName: 'Delhi-Mumbai Express',
        busType: 'AC Sleeper',
        baseFare: 1200,
        perKmRate: 1.2,
        minimumFare: 500,
        discountPercent: 5,
        taxPercent: 18,
        serviceCharge: 50,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'active'
      },
      {
        id: 2,
        routeId: 1,
        routeName: 'Delhi-Mumbai Express',
        busType: 'Non-AC Sleeper',
        baseFare: 800,
        perKmRate: 0.8,
        minimumFare: 300,
        discountPercent: 3,
        taxPercent: 18,
        serviceCharge: 40,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'active'
      },
      {
        id: 3,
        routeId: 2,
        routeName: 'Bangalore-Chennai',
        busType: 'AC Seater',
        baseFare: 450,
        perKmRate: 0.9,
        minimumFare: 200,
        discountPercent: 10,
        taxPercent: 18,
        serviceCharge: 30,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'active'
      },
      {
        id: 4,
        routeId: 3,
        routeName: 'Mumbai-Pune',
        busType: 'Volvo',
        baseFare: 350,
        perKmRate: 0.7,
        minimumFare: 150,
        discountPercent: 0,
        taxPercent: 18,
        serviceCharge: 25,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'inactive'
      },
      {
        id: 5,
        routeId: 5,
        routeName: 'Kolkata-Delhi',
        busType: 'Luxury',
        baseFare: 1800,
        perKmRate: 1.5,
        minimumFare: 800,
        discountPercent: 8,
        taxPercent: 18,
        serviceCharge: 60,
        effectiveFrom: '2024-01-01',
        effectiveTo: '2024-12-31',
        status: 'active'
      }
    ];
    this.filterFares();
  }

  filterFares() {
    this.filteredFares = this.fares.filter(fare => {
      const matchesSearch = 
        fare.routeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fare.busType.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRoute = this.selectedRoute === 'all' || fare.routeId === Number(this.selectedRoute);
      const matchesBusType = this.selectedBusType === 'all' || fare.busType === this.selectedBusType;
      const matchesStatus = this.selectedStatus === 'all' || fare.status === this.selectedStatus;
      
      return matchesSearch && matchesRoute && matchesBusType && matchesStatus;
    });
  }

  onSearch() {
    this.filterFares();
  }

  onFilterChange() {
    this.filterFares();
  }

  calculateFinalFare(fare: Fare): number {
    const baseAmount = fare.baseFare;
    const discount = (baseAmount * fare.discountPercent) / 100;
    const afterDiscount = baseAmount - discount;
    const tax = (afterDiscount * fare.taxPercent) / 100;
    return afterDiscount + tax + fare.serviceCharge;
  }

  openAddModal() {
    this.newFare = {
      routeId: 0,
      routeName: '',
      busType: 'AC Sleeper',
      baseFare: 0,
      perKmRate: 0,
      minimumFare: 0,
      discountPercent: 0,
      taxPercent: 18,
      serviceCharge: 0,
      effectiveFrom: '',
      effectiveTo: '',
      status: 'active'
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  // FIXED: No more duplicate id issue
  saveFare() {
    // Get route name from selected route ID
    const selectedRoute = this.routes.find(r => r.id === this.newFare.routeId);
    if (selectedRoute) {
      this.newFare.routeName = selectedRoute.name;
    }

    const newId = this.fares.length + 1;
    const fare: Fare = {
      id: newId,
      routeId: this.newFare.routeId,
      routeName: this.newFare.routeName,
      busType: this.newFare.busType,
      baseFare: this.newFare.baseFare,
      perKmRate: this.newFare.perKmRate,
      minimumFare: this.newFare.minimumFare,
      discountPercent: this.newFare.discountPercent,
      taxPercent: this.newFare.taxPercent,
      serviceCharge: this.newFare.serviceCharge,
      effectiveFrom: this.newFare.effectiveFrom,
      effectiveTo: this.newFare.effectiveTo,
      status: this.newFare.status
    };
    
    this.fares.push(fare);
    this.filterFares();
    this.closeAddModal();
  }

  openEditModal(fare: Fare) {
    this.selectedFare = { ...fare };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedFare = null;
  }

  updateFare() {
    if (this.selectedFare) {
      const index = this.fares.findIndex(f => f.id === this.selectedFare!.id);
      if (index !== -1) {
        // Update route name if route ID changed
        const selectedRoute = this.routes.find(r => r.id === this.selectedFare!.routeId);
        if (selectedRoute) {
          this.selectedFare.routeName = selectedRoute.name;
        }
        this.fares[index] = this.selectedFare;
        this.filterFares();
      }
      this.closeEditModal();
    }
  }

  openDeleteModal(fare: Fare) {
    this.selectedFare = fare;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedFare = null;
  }

  confirmDelete() {
    if (this.selectedFare) {
      this.fares = this.fares.filter(f => f.id !== this.selectedFare!.id);
      this.filterFares();
      this.closeDeleteModal();
    }
  }

  openBulkUploadModal() {
    this.showBulkUploadModal = true;
  }

  closeBulkUploadModal() {
    this.showBulkUploadModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file);
      // In real app, this would upload and process the file
    }
  }

  downloadTemplate() {
    // In real app, this would download an Excel template
    console.log('Downloading template...');
  }

  toggleStatus(fare: Fare) {
    fare.status = fare.status === 'active' ? 'inactive' : 'active';
    // In real app, this would call a service
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}