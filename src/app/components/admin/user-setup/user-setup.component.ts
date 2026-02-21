import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'operator' | 'accountant' | 'viewer';
  department: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

@Component({
  selector: 'app-user-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.css']
})
export class UserSetupComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  selectedStatus: string = 'all';
  
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showViewModal: boolean = false;
  showPermissionsModal: boolean = false;
  
  selectedUser: User | null = null;
  
  roles = ['admin', 'manager', 'operator', 'accountant', 'viewer'];
  departments = ['Management', 'Operations', 'Finance', 'Customer Service', 'IT', 'Sales'];
  availablePermissions = [
    'view_dashboard',
    'manage_companies',
    'manage_customers',
    'manage_routes',
    'manage_buses',
    'manage_offers',
    'manage_users',
    'manage_fares',
    'view_reports',
    'manage_bookings',
    'process_payments',
    'handle_cancellations'
  ];

  newUser: Omit<User, 'id' | 'lastLogin' | 'createdAt'> = {
    username: '',
    email: '',
    fullName: '',
    role: 'operator',
    department: 'Operations',
    phone: '',
    status: 'active',
    permissions: ['view_dashboard']
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@travel.com',
        fullName: 'Admin User',
        role: 'admin',
        department: 'Management',
        phone: '9876543210',
        status: 'active',
        lastLogin: '2024-01-15 09:30 AM',
        createdAt: '2023-01-01',
        permissions: ['view_dashboard', 'manage_companies', 'manage_customers', 'manage_routes', 'manage_buses', 'manage_offers', 'manage_users', 'manage_fares', 'view_reports', 'manage_bookings', 'process_payments', 'handle_cancellations']
      },
      {
        id: 2,
        username: 'john.manager',
        email: 'john@travel.com',
        fullName: 'John Smith',
        role: 'manager',
        department: 'Operations',
        phone: '9876543211',
        status: 'active',
        lastLogin: '2024-01-14 10:15 AM',
        createdAt: '2023-02-15',
        permissions: ['view_dashboard', 'manage_routes', 'manage_buses', 'view_reports', 'manage_bookings']
      },
      {
        id: 3,
        username: 'sarah.operator',
        email: 'sarah@travel.com',
        fullName: 'Sarah Johnson',
        role: 'operator',
        department: 'Customer Service',
        phone: '9876543212',
        status: 'active',
        lastLogin: '2024-01-15 08:45 AM',
        createdAt: '2023-03-10',
        permissions: ['view_dashboard', 'manage_bookings', 'handle_cancellations']
      },
      {
        id: 4,
        username: 'mike.accountant',
        email: 'mike@travel.com',
        fullName: 'Mike Wilson',
        role: 'accountant',
        department: 'Finance',
        phone: '9876543213',
        status: 'inactive',
        lastLogin: '2024-01-10 11:20 AM',
        createdAt: '2023-04-05',
        permissions: ['view_dashboard', 'view_reports', 'process_payments']
      },
      {
        id: 5,
        username: 'emma.viewer',
        email: 'emma@travel.com',
        fullName: 'Emma Davis',
        role: 'viewer',
        department: 'Sales',
        phone: '9876543214',
        status: 'suspended',
        lastLogin: '2024-01-05 02:30 PM',
        createdAt: '2023-05-12',
        permissions: ['view_dashboard', 'view_reports']
      }
    ];
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = this.selectedRole === 'all' || user.role === this.selectedRole;
      const matchesStatus = this.selectedStatus === 'all' || user.status === this.selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  onSearch() {
    this.filterUsers();
  }

  onFilterChange() {
    this.filterUsers();
  }

  openAddModal() {
    this.newUser = {
      username: '',
      email: '',
      fullName: '',
      role: 'operator',
      department: 'Operations',
      phone: '',
      status: 'active',
      permissions: ['view_dashboard']
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveUser() {
    const newId = this.users.length + 1;
    const user: User = {
      id: newId,
      username: this.newUser.username,
      email: this.newUser.email,
      fullName: this.newUser.fullName,
      role: this.newUser.role,
      department: this.newUser.department,
      phone: this.newUser.phone,
      status: this.newUser.status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: this.newUser.permissions
    };
    this.users.push(user);
    this.filterUsers();
    this.closeAddModal();
  }

  openViewModal(user: User) {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  updateUser() {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = this.selectedUser;
        this.filterUsers();
      }
      this.closeEditModal();
    }
  }

  openPermissionsModal(user: User) {
    this.selectedUser = { ...user };
    this.showPermissionsModal = true;
  }

  closePermissionsModal() {
    this.showPermissionsModal = false;
    this.selectedUser = null;
  }

  updatePermissions() {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index].permissions = this.selectedUser.permissions;
        this.filterUsers();
      }
      this.closePermissionsModal();
    }
  }

  togglePermission(permission: string) {
    if (this.selectedUser) {
      const index = this.selectedUser.permissions.indexOf(permission);
      if (index > -1) {
        this.selectedUser.permissions.splice(index, 1);
      } else {
        this.selectedUser.permissions.push(permission);
      }
    }
  }

  hasPermission(permission: string): boolean {
    return this.selectedUser?.permissions.includes(permission) || false;
  }

  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  confirmDelete() {
    if (this.selectedUser) {
      this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
      this.filterUsers();
      this.closeDeleteModal();
    }
  }

  toggleStatus(user: User) {
    if (user.status === 'active') {
      user.status = 'inactive';
    } else if (user.status === 'inactive') {
      user.status = 'active';
    }
    // For suspended, you might want to handle separately
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'suspended': return 'status-suspended';
      default: return '';
    }
  }

  getRoleClass(role: string): string {
    switch(role) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      case 'operator': return 'role-operator';
      case 'accountant': return 'role-accountant';
      case 'viewer': return 'role-viewer';
      default: return '';
    }
  }

  getPermissionLabel(permission: string): string {
    const labels: {[key: string]: string} = {
      'view_dashboard': 'View Dashboard',
      'manage_companies': 'Manage Companies',
      'manage_customers': 'Manage Customers',
      'manage_routes': 'Manage Routes',
      'manage_buses': 'Manage Buses',
      'manage_offers': 'Manage Offers/Coupons',
      'manage_users': 'Manage Users',
      'manage_fares': 'Manage Fares',
      'view_reports': 'View Reports',
      'manage_bookings': 'Manage Bookings',
      'process_payments': 'Process Payments',
      'handle_cancellations': 'Handle Cancellations'
    };
    return labels[permission] || permission;
  }
}