import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthServiceComponent } from '../../core/services/auth-service.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { userModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: userModel = {
    email: '',
    fullName: '',
    image: '',
    address: '',
    username: '',
    password: ''
  };
  loginForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthServiceComponent, private router: Router, private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
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
    const newUser = this.loginForm.value;
    console.log("thông tin đăng kí " + this.user)
    this.userService.addUser(newUser).subscribe({
      next: (data) => {
        this.user = data;
        Swal.fire({
          title: 'Successfully!',
          text: 'Đăng kí tài khoản thành công! Vui  lòng đăng nhập',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Đăng kí tài khoản thất bại! Vui  lòng thử lại',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
        console.log("Lỗi: " + error);
      }
    })
  }
}
