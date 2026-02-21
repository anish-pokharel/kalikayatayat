import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstin: string;
  totalBuses: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  
  selectedCompany: Company | null = null;
  
  newCompany: Omit<Company, 'id'> = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gstin: '',
    totalBuses: 0,
    status: 'active',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companies = [
      {
        id: 1,
        name: 'VRL Travels',
        email: 'info@vrltravels.com',
        phone: '9876543210',
        address: '123 Bus Stand, MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        gstin: '29ABCDE1234F1Z5',
        totalBuses: 45,
        status: 'active',
        joinedDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'SRS Travels',
        email: 'contact@srstravels.com',
        phone: '9876543211',
        address: '456 Transport Nagar',
        city: 'Delhi',
        state: 'Delhi',
        gstin: '07FGHIJ5678K2L3',
        totalBuses: 32,
        status: 'active',
        joinedDate: '2023-02-20'
      },
      {
        id: 3,
        name: 'Orange Tours',
        email: 'booking@orangetours.com',
        phone: '9876543212',
        address: '789 Civic Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        gstin: '27KLMNO9012P3Q4',
        totalBuses: 28,
        status: 'inactive',
        joinedDate: '2023-03-10'
      },
      {
        id: 4,
        name: 'Kallada Travels',
        email: 'support@kallada.com',
        phone: '9876543213',
        address: '321 Bus Terminal',
        city: 'Chennai',
        state: 'Tamil Nadu',
        gstin: '33PQRST3456U5V6',
        totalBuses: 52,
        status: 'active',
        joinedDate: '2023-04-05'
      },
      {
        id: 5,
        name: 'City Express',
        email: 'info@cityexpress.com',
        phone: '9876543214',
        address: '654 City Center',
        city: 'Kolkata',
        state: 'West Bengal',
        gstin: '19UVWXY7890Z1A2',
        totalBuses: 19,
        status: 'active',
        joinedDate: '2023-05-12'
      }
    ];
    this.filterCompanies();
  }

  filterCompanies() {
    this.filteredCompanies = this.companies.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.gstin.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || company.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.filterCompanies();
  }

  onStatusFilter() {
    this.filterCompanies();
  }

  openAddModal() {
    this.newCompany = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      gstin: '',
      totalBuses: 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveCompany() {
    const newId = this.companies.length + 1;
    const company: Company = {
      id: newId,
      name: this.newCompany.name,
      email: this.newCompany.email,
      phone: this.newCompany.phone,
      address: this.newCompany.address,
      city: this.newCompany.city,
      state: this.newCompany.state,
      gstin: this.newCompany.gstin,
      totalBuses: this.newCompany.totalBuses,
      status: this.newCompany.status,
      joinedDate: this.newCompany.joinedDate
    };
    this.companies.push(company);
    this.filterCompanies();
    this.closeAddModal();
  }

  openViewModal(company: Company) {
    this.selectedCompany = company;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedCompany = null;
  }

  openEditModal(company: Company) {
    this.selectedCompany = { ...company };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedCompany = null;
  }

  updateCompany() {
    if (this.selectedCompany) {
      const index = this.companies.findIndex(c => c.id === this.selectedCompany!.id);
      if (index !== -1) {
        this.companies[index] = this.selectedCompany;
        this.filterCompanies();
      }
      this.closeEditModal();
    }
  }

  openDeleteModal(company: Company) {
    this.selectedCompany = company;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedCompany = null;
  }

  confirmDelete() {
    if (this.selectedCompany) {
      this.companies = this.companies.filter(c => c.id !== this.selectedCompany!.id);
      this.filterCompanies();
      this.closeDeleteModal();
    }
  }

  toggleStatus(company: Company) {
    company.status = company.status === 'active' ? 'inactive' : 'active';
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
}