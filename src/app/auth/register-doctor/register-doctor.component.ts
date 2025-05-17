import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceComponent } from '../../core/services/auth-service.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorModel } from '../../models/doctor.model';
import { DoctorService } from '../../services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-doctor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})
export class RegisterDoctorComponent {
  loginForm: FormGroup;
  isLoading = false;
  constructor(private fb: FormBuilder, private authService: AuthServiceComponent, private router: Router, private doctorService: DoctorService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      expertise: [''],
      experience: [''],
      hospital: [''],
      phoneNumber: [''],
      address: ['']
    }, { validators: this.passwordMatchValidator });
  }
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      // Nếu confirmPassword có lỗi passwordMismatch thì xóa lỗi đó đi
      const errors = form.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          form.get('confirmPassword')?.setErrors(null);
        } else {
          form.get('confirmPassword')?.setErrors(errors);
        }
      }
    }
    return null;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      // Tạo đối tượng doctor từ giá trị form
      const doctor: DoctorModel = {
        idDoctor: 0,
        expertise: formValue.expertise,
        experience: formValue.experience,
        hospital: formValue.hospital,
        phoneNumber: formValue.phoneNumber,
        userDTO: {
          fullName: formValue.fullName,
          email: '', // Nếu có input email thì thêm vào formGroup để lấy
          username: formValue.username,
          password: formValue.password,
          address: formValue.address
        }
      };
      this.doctorService.addDoctor(doctor).subscribe({
        next: (data) => {
          console.log(data);
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
}
