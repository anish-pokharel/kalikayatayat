// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/home/home.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { 
//         path: 'admin', 
//         component: AdminDashboardComponent,
//         canActivate: [AuthGuard]
//     },
//     { path: '**', redirectTo: '' }
// ];


// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/home/home.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
// import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { 
//         path: 'admin', 
//         component: AdminDashboardComponent,
//         canActivate: [AuthGuard],
//         children: [
//             { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//             { path: 'dashboard', component: AdminDashboardComponent },
//             { path: 'route-plan', component: RoutePlanComponent },
//             { path: 'fare-declaration', component: FareDeclarationComponent }
//             // Add other admin routes here
//         ]
//     },
//     { path: '**', redirectTo: '' }
// ];


// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/home/home.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { CompaniesComponent } from './components/admin/companies/companies.component';
// import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
// import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { 
//         path: 'admin', 
//         component: AdminDashboardComponent,
//         canActivate: [AuthGuard],
//         children: [
//             { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//             { path: 'dashboard', component: AdminDashboardComponent },
//             { path: 'companies', component: CompaniesComponent },
//             { path: 'route-plan', component: RoutePlanComponent },
//             { path: 'fare-declaration', component: FareDeclarationComponent }
//             // Add other components as you create them
//         ]
//     },
//     { path: '**', redirectTo: '' }
// ];



// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/home/home.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { CompaniesComponent } from './components/admin/companies/companies.component';
// import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
// import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
// import { UserSetupComponent } from './components/admin/user-setup/user-setup.component';
// import { ReportsComponent } from './components/admin/reports/reports.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { 
//         path: 'admin', 
//         component: AdminDashboardComponent,
//         canActivate: [AuthGuard],
//         children: [
//             { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//             { path: 'dashboard', component: AdminDashboardComponent },
//             { path: 'companies', component: CompaniesComponent },
//             { path: 'route-plan', component: RoutePlanComponent },
//             { path: 'fare-declaration', component: FareDeclarationComponent },
//             { path: 'user-setup', component: UserSetupComponent },
//             { path: 'reports', component: ReportsComponent }
//             // Add other components as you create them
//             // { path: 'customers', component: CustomersComponent },
//             // { path: 'bus-fleet', component: BusFleetComponent },
//             // { path: 'offers', component: OffersComponent }
//         ]
//     },
//     { path: '**', redirectTo: '' }
// ];





// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { HomeComponent } from './components/home/home.component';
// import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
// import { CompaniesComponent } from './components/admin/companies/companies.component';
// import { RoutePlanComponent } from './components/admin/route-plan/route-plan.component';
// import { FareDeclarationComponent } from './components/admin/fare-declaration/fare-declaration.component';
// import { UserSetupComponent } from './components/admin/user-setup/user-setup.component';
// import { ReportsComponent } from './components/admin/reports/reports.component';
// import { BusListComponent } from './components/public/bus-list/bus-list.component';
// import { SeatSelectionComponent } from './components/public/seat-selection/seat-selection.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },
//     { path: 'register', component: RegisterComponent },
//     { path: 'buses', component: BusListComponent },
//     { path: 'seat-selection/:id', component: SeatSelectionComponent },
//     { 
//         path: 'admin', 
//         component: AdminDashboardComponent,
//         canActivate: [AuthGuard],
//         children: [
//             { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//             { path: 'dashboard', component: AdminDashboardComponent },
//             { path: 'companies', component: CompaniesComponent },
//             { path: 'route-plan', component: RoutePlanComponent },
//             { path: 'fare-declaration', component: FareDeclarationComponent },
//             { path: 'user-setup', component: UserSetupComponent },
//             { path: 'reports', component: ReportsComponent }
//         ]
//     },
//     { path: '**', redirectTo: '' }
// ];






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
import { BusListComponent } from './components/public/bus-list/bus-list.component';
import { SeatSelectionComponent } from './components/public/seat-selection/seat-selection.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'buses', component: BusListComponent },
    { path: 'seat-selection/:id', component: SeatSelectionComponent },
    { 
        path: 'admin', 
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'companies', component: CompaniesComponent },
            { path: 'route-plan', component: RoutePlanComponent },
            { path: 'fare-declaration', component: FareDeclarationComponent },
            { path: 'user-setup', component: UserSetupComponent },
            { path: 'reports', component: ReportsComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];