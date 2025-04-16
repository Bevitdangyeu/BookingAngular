import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceComponent } from '../../core/services/auth-service.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-doctor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})
export class RegisterDoctorComponent {
  loginForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthServiceComponent, private router: Router) {
    this.loginForm = this.fb.group({ // hàm group giúp kiểm tra và định dạng dữ liệu đầu vào 
      username: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required]
    });
  }
  onSubmit() { }
}
