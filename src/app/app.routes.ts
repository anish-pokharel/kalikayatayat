import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CompaniesComponent } from './components/admin/companies/companies.component';
import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
import { UserSetupComponent } from './components/admin/user-setup/user-setup.component';
import { ReportsComponent } from './components/admin/reports/reports.component';
import { OffersComponent } from './components/admin/offers/offers.component';
import { BusListComponent } from './components/public/bus-list/bus-list.component';
import { SeatSelectionComponent } from './components/public/seat-selection/seat-selection.component';
import { CustomersComponent } from './components/admin/customers/customers.component';

import { AuthGuard } from './guards/auth.guard';
import { BusFleetComponent } from './components/admin/bus-fleet/bus-fleet.component';
import { AdminGuard } from './guards/admin.guard';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'buses', component: BusListComponent },
    { path: 'seat-selection/:id', component: SeatSelectionComponent },
    { 
        path: 'admin', 
        component: AdminDashboardComponent,
        canActivate: [AuthGuard, AdminGuard], // Both guards ensure admin access
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'companies', component: CompaniesComponent },
            { path: 'customers', component: CustomersComponent },
            { path: 'route-plan', component: RoutePlanComponent },
            { path: 'bus-fleet', component: BusFleetComponent },
            { path: 'offers', component: OffersComponent },
            { path: 'user-setup', component: UserSetupComponent },
            { path: 'fare-declaration', component: FareDeclarationComponent },
            { path: 'reports', component: ReportsComponent }
        ]
    },
    { path: 'routes', redirectTo: '/admin/route-plan', pathMatch: 'full' }, // Redirect to admin version
    { path: '**', redirectTo: '' }
];