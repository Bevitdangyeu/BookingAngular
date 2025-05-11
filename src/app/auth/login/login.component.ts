import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceComponent } from '../../core/services/auth-service.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationResponse } from '../../models/authentication-response.model';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
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
    else {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: AuthenticationResponse) => {
          // Lưu token vào localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          if (response.role === 'ADMIN') {
            // Chuyển hướng admin
            this.router.navigate(['/admin/home']);
          } else if (response.role == 'USER') {
            this.router.navigate(['/public/HomePage']);
          } else if (response.role == 'DOCTOR') {
            this.router.navigate(['/admin/home']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
        }
      });
    }
  }
}
