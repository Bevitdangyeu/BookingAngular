import { Router, Routes } from "@angular/router";
import { ProfileComponent } from "./profileComponent/profile.component";
import { Component } from "@angular/core";
// định tuyến động
// nhận tham số động từ url để hiển thị thông tin bác sĩ
export const profileRoutes: Routes = [
    { path: '', component: ProfileComponent }
];