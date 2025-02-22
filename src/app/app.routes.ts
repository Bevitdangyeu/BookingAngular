import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { UserComponent } from './layout/user/user.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './page/public/home/home.component';
import { AdminHomeComponent } from './page/admin/admin-home/admin-home.component';
import { ProfileComponent } from './page/public/profile/profile.component';
export const routes: Routes = [
    {
        path: '', // 👈 Đây là trang mặc định khi vào "/"
        component: UserComponent,
        children: [
            { path: '', component: HomeComponent }, // 👈 Đảm bảo có trang mặc định cho user
            { path: 'profile', component: ProfileComponent }
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
        path: 'public',
        component: UserComponent,
        children: [

        ]
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
