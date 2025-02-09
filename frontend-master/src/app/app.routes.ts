import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegistrationComponent } from './registration/registration.component';
import { SigninComponent } from './signin/signin.component';
import { SellacarComponent } from './sellacar/sellacar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarslistComponent } from './carslist/carslist.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { AuthGuard } from './auth.guard';
import { EditCarComponent } from './edit-car/edit-car.component';
import { YourBookingsComponent } from './your-bookings/your-bookings.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent },
    { path: 'carslist', component: CarslistComponent },
    { path: 'car-details/:id', component: CarDetailComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'registration', component: RegistrationComponent },
    { 
        path: 'sellacar', 
        component: SellacarComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'sellerdashboard', 
        component: SellerDashboardComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'admindashboard', 
        component: AdminDashboardComponent,
        canActivate: [AdminGuard]
    },
    { 
        path: 'edit-car/:id', 
        component: EditCarComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'your-bookings', 
        component: YourBookingsComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/homepage' } // Catch all route
];