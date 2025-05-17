import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { jwtPayloadd } from '../../../../services/jwtPayloadd.service';
import { FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceComponent } from '../../../../core/services/auth-service.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-navbar',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  constructor(private router: Router, private AuthService: AuthServiceComponent) { }
  onSearch(keyword: string) {
    if (keyword && keyword.trim()) {
      this.router.navigate([`/public/search/post/`, keyword]);
    }
  }
  getIdUser(): number {
    //lấy token từ localStorge
    const token = localStorage.getItem("accessToken");
    let userIdFromToken;
    if (token) {
      try {
        const decode = jwtDecode<jwtPayloadd>(token);
        userIdFromToken = decode.id ?? 0;
        return userIdFromToken;
      } catch (error) {
        console.error("Không thể decode token:", error);
      }
    }
    return 0;
  }
  logout() {
    this.AuthService.logout();
  }
  getAppointment() {
    const idUser = this.getIdUser();
    if (idUser == 0) {
      const returnUrl = this.router.url;
      sessionStorage.setItem('returnUrl', "/public/appointment/list");
      Swal.fire({
        title: 'Lỗi!',
        text: 'Bạn chưa đăng nhập! Vui lòng đăng nhập',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
        customClass: {
          popup: 'custom-popup-logout',
          title: 'custom-title-logout'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
        // Nếu là Hủy (result.isDismissed), không cần làm gì thêm
      });

      return;
    }
    else {
      this.router.navigate([`/public/appointment/list`])
    }
  }

}
