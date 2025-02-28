import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { UserComponent } from './layout/user/user.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './page/public/home/home.component';
import { AdminHomeComponent } from './page/admin/admin-home/admin-home.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './page/public/profile/profile.component';
export const routes: Routes = [
    {
        path: 'public',
        component: UserComponent,
        children: [
            { path: 'HomePage', component: HomeComponent }
        ]
    },
    {
        path: 'admin', // url với đường dẫn admin sẽ áp dụng layout admin
        component: AdminComponent,
        children: [
            { path: 'home', component: AdminHomeComponent }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        children: [

        ]
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
