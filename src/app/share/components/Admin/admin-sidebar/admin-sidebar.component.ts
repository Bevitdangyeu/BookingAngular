import { Component } from '@angular/core';
import { AuthServiceComponent } from '../../../../core/services/auth-service.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  constructor(private auth: AuthServiceComponent) { }
  isShowed: boolean = false;
  showClick() {
    this.isShowed = !this.isShowed;
  }
  logout() {
    this.auth.logout();
    Swal.fire({
      title: 'Đăng xuất thành công!',
      text: 'Bạn đã được đăng xuất khỏi hệ thống.',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 30000,
      timerProgressBar: true,
      customClass: {
        popup: 'custom-popup-logout',
        title: 'custom-title-logout'
      }
    });
  }
}
