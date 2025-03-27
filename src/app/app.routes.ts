import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { UserComponent } from './layout/user/user.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './page/public/home/home.component';
import { AdminHomeComponent } from './page/admin/admin-home/admin-home.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './page/public/profile/profileComponent/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { AppointmentComponent } from './page/public/appointment/appointment.component';
export const routes: Routes = [
    {
        path: 'public',
        component: UserComponent,

        children: [
            { path: 'HomePage', component: HomeComponent },
            {
                path: 'profile/:id', // định nghĩa Dynamic Route => id sẽ thay đổi theo từng bác sĩ
                loadChildren: () => import('./page/public/profile/profile.routes').then(m => m.profileRoutes)
            },
            { path: 'Appoinment', component: AppointmentComponent }
            // lazy loading  chỉ tải profile component khi người dùng truy cập vào /profile
        ],
    },
    {
        path: 'admin', // url với đường dẫn admin sẽ áp dụng layout admin
        component: AdminComponent,
        children: [
            { path: 'home', component: AdminHomeComponent }
        ],
        canActivate: [AuthGuard], data: { expectedRole: ['ADMIN'] }
    },
    {
        path: 'user', // url với đường dẫn admin sẽ áp dụng layout admin
        component: UserComponent,
        children: [
            { path: 'appoientment/list', component: AppointmentComponent }
        ],

    },
    {
        path: 'login',
        component: LoginComponent,
        children: [
        ]
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)], // cấu hình đây là modul chính của ứng dụng 
    exports: [RouterModule] // xuất để sử dụng tại các modul khác 
})
export class AppRoutingModule { }
