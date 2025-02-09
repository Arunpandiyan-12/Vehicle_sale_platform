import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection: string = 'dashboard';
  
  // Analytics Data
  analytics = {
    totalCars: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    soldCars: 0,
    totalBookings: 0
  };

  pendingCars: any[] = [];
  users: any[] = [];

  // For rejection dialog
  showRejectDialog = false;
  selectedCar: any = null;
  rejectReason: string = '';

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getAdminAnalytics().subscribe({
      next: (data) => {
        this.analytics = {
          totalCars: data.totalCarsListed,
          totalUsers: data.totalUsers,
          pendingApprovals: data.pendingCarListings,
          soldCars: data.carsSold,
          totalBookings: data.totalBookings
        };
      },
      error: () => this.toastr.error('Failed to load analytics')
    });

    if (this.activeSection === 'pending-approvals') {
      this.loadPendingCars();
    } else if (this.activeSection === 'users') {
      this.loadUsers();
    }
  }

  loadPendingCars() {
    this.adminService.getPendingCars().subscribe({
      next: (cars) => {
        this.pendingCars = cars;
      },
      error: () => this.toastr.error('Failed to load pending cars')
    });
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map((user: any) => ({
          ...user,
          selectedRole: user.role
        }));
      },
      error: () => this.toastr.error('Failed to load users')
    });
  }

  approveCar(carId: number) {
    this.adminService.approveCar(carId).subscribe({
      next: () => {
        this.toastr.success('Car approved successfully');
        this.loadPendingCars();
        this.loadDashboardData();
      },
      error: () => this.toastr.error('Failed to approve car')
    });
  }

  openRejectDialog(car: any) {
    this.selectedCar = car;
    this.showRejectDialog = true;
  }

  rejectCar() {
    if (!this.selectedCar || !this.rejectReason.trim()) return;

    this.adminService.rejectCar(this.selectedCar.id).subscribe({
      next: () => {
        this.toastr.success('Car rejected successfully');
        this.closeRejectDialog();
        this.loadPendingCars();
        this.loadDashboardData();
      },
      error: () => this.toastr.error('Failed to reject car')
    });
  }

  closeRejectDialog() {
    this.showRejectDialog = false;
    this.selectedCar = null;
    this.rejectReason = '';
  }

  changeUserRole(userId: number, newRole: string) {
    if (!newRole) return;
    
    this.adminService.changeUserRole(userId, newRole).subscribe({
      next: () => {
        this.toastr.success('User role updated successfully');
        this.loadUsers();
      },
      error: () => this.toastr.error('Failed to update user role')
    });
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.loadDashboardData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
