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
import { PostComponent } from './page/admin/post/post.component';
import { PublicPostComponent } from './page/public/post/publicPost.component';
import { TopicComponent } from './page/public/topic/topic.component';
import { AdminAppointmentComponent } from './page/admin/admin-appointment/admin-appointment.component';
import { DoctorProfile } from './page/admin/profile/doctor_profile.component';
import { SearchComponent } from './page/public/search/search.component';
import { TimeComponent } from './page/admin/time/time.component';
import { RegisterComponent } from './auth/register/register.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';
import { StatisticalComponent } from './page/admin/statistical/statistical.component';
import { DoctorComponent } from './page/public/doctor/doctor.component';
import { AccountDoctorComponent } from './page/admin/account-doctor/account-doctor.component';
import { AccountUserComponent } from './page/admin/account-user/account-user.component';
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
            { path: 'appointment/list', component: AppointmentComponent },
            { path: 'post/:id', component: PublicPostComponent },
            { path: 'topic/:id', component: TopicComponent },
            { path: 'search/post/:key', component: SearchComponent },
            { path: 'doctor/:expertise', component: DoctorComponent }
            // lazy loading  chỉ tải profile component khi người dùng truy cập vào /profile
        ],
    },
    {
        path: 'admin', // url với đường dẫn admin sẽ áp dụng layout admin
        component: AdminComponent,
        children: [
            { path: 'home', component: AdminHomeComponent },
            { path: 'post', component: PostComponent },
            { path: 'appointment', component: AdminAppointmentComponent },
            { path: 'profile', component: DoctorProfile },
            { path: 'time', component: TimeComponent },
            { path: 'statistical', component: StatisticalComponent },
            { path: 'user', component: AccountUserComponent },
            { path: 'doctor', component: AccountDoctorComponent },
        ],
        canActivate: [AuthGuard], data: { expectedRole: ['DOCTOR', 'ADMIN'] }
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
    },
    {
        path: 'register/user',
        component: RegisterComponent,
        children: [

        ]
    }, {
        path: 'register/doctor',
        component: RegisterDoctorComponent,
        children: [

        ]
    }

];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }