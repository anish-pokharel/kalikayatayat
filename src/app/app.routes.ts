


import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
import { BusListComponent } from './components/public/bus-list/bus-list.component';
import { SeatSelectionComponent } from './components/public/seat-selection/seat-selection.component';
import { CustomersComponent } from './components/admin/customers/customers.component';
import { AuthGuard } from './guards/auth.guard';
import { BusFleetComponent } from './components/admin/bus-fleet/bus-fleet.component';
import { AdminGuard } from './guards/admin.guard';
import { MyBookingsComponent } from './components/public/my-bookings/my-bookings.component';
import { BookingComponent } from './components/public/booking/booking.component';
import { AdminBookingComponent } from './components/admin/admin-booking/admin-booking.component';
import { RoutemanagementComponent } from './components/admin/routemanagement/routemanagement.component';
import { PaymentCallbackComponent } from './components/public/payment-callback/payment-callback.component';
import { CounterDashboardComponent } from './components/counter/counter-dashboard/counter-dashboard.component';
import { CounterNewBookingComponent } from './components/counter/counter-new-booking/counter-new-booking.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'buses', component: BusListComponent },
    { path: 'seat-selection/:id', component: SeatSelectionComponent },
    { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
    { path: 'booking/:id', component: BookingComponent, canActivate: [AuthGuard] },
    { 
        path: 'booking-confirmation/:id', 
        loadComponent: () => import('./components/public/booking-confirmation/booking-confirmation.component')
            .then(m => m.BookingConfirmationComponent)
    },
    {
        path: 'payment-callback',
        component: PaymentCallbackComponent
    },
    {
        path: 'admin',
        component: AdminDashboardComponent, // Use AdminDashboardComponent as layout
        canActivate: [AuthGuard, AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent }, // Same component for dashboard view
            { path: 'bookingdetails', component: AdminBookingComponent },
            { path: 'customers', component: CustomersComponent },
            { path: 'route-plan', component: RoutePlanComponent },
            { path: 'routes', component: RoutemanagementComponent },
            { path: 'bus-fleet', component: BusFleetComponent },
            { path: 'fare-declaration', component: FareDeclarationComponent }
        ]
    },
    // Counter Routes (Protected by CounterGuard)
    {
        path: 'counter',
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CounterDashboardComponent },
            { path: 'new-booking', component: CounterNewBookingComponent },
            // { path: 'manage-bookings', component: CounterManageBookingsComponent },
            // { path: 'booking/:id', component: CounterBookingDetailsComponent },
            // { path: 'booking/edit/:id', component: CounterEditBookingComponent },
            // { path: 'customers', component: CounterCustomersComponent },
            // { path: 'customer/:id', component: CounterCustomerDetailsComponent },
            // { path: 'bus-schedule', component: CounterBusScheduleComponent },
            // { path: 'bus-schedule/:id', component: CounterBusScheduleComponent },
            // { path: 'reports', component: CounterReportsComponent }
        ]
    },
    
    { path: '**', redirectTo: '' }
];