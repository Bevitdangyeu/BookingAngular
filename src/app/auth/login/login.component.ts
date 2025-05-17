import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceComponent } from '../../core/services/auth-service.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationResponse } from '../../models/authentication-response.model';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthServiceComponent, private router: Router) {
    this.loginForm = this.fb.group({ // hàm group giúp kiểm tra và định dạng dữ liệu đầu vào 
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: AuthenticationResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          console.log(returnUrl);
          this.router.navigateByUrl(returnUrl);
          sessionStorage.removeItem('returnUrl');
        } else if (response.role === 'ADMIN' || response.role === 'DOCTOR') {
          this.router.navigate(['/admin/home']);
        } else if (response.role === 'USER') {
          this.router.navigate(['/public/HomePage']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: JSON.stringify(err.error) || 'Đã có lỗi xảy ra',
          icon: 'error',
          confirmButtonText: 'OK',
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
        // alert(JSON.stringify(err.error) || 'Đã có lỗi xảy ra');
        console.log(err)
      }
    });
  }
}