
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userModel } from '../../../models/user.model';
import { AccountService } from '../../../services/account.service';
import Swal from 'sweetalert2';
import { DoctorModel } from '../../../models/doctor.model';
@Component({
  selector: 'app-account-user',
  imports: [CommonModule],
  templateUrl: './account-doctor.component.html',
  styleUrl: './account-doctor.component.css'
})
export class AccountDoctorComponent {
  constructor(private accountService: AccountService) { }
  doctors: DoctorModel[] = []
  ngOnInit() {
    this.findAllUser();
  }
  findAllUser() {
    this.accountService.findAllDoctor().subscribe({
      next: (data) => {
        this.doctors = data;
        console.log(data)
      }
    })
  }
  lockAccount(idUser: number) {
    Swal.fire({
      title: 'Warning',
      text: 'Bạn có chắc chắn muốn tiếp tục',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        // tiến hành gọi api để xóa
        this.accountService.lock(idUser).subscribe({
          next: (data) => {
            console.log("status: " + data);
            const index = this.doctors.findIndex(u => u.userDTO.idUser === idUser);
            if (index !== -1) {
              this.doctors[index].userDTO = data;
            }
            if (data)
              Swal.fire({
                title: 'Successfully!',
                text: 'Cập nhật thành công',
                icon: 'success',
                confirmButtonText: 'OK',
                timerProgressBar: true,
                customClass: {
                  popup: 'custom-popup-logout',
                  title: 'custom-title-logout'
                }
              });
          }, error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Cập nhật thất bại',
              icon: 'error',
              confirmButtonText: 'OK',
              timerProgressBar: true,
              customClass: {
                popup: 'custom-popup-logout',
                title: 'custom-title-logout'
              }
            });
          }
        })
      }
    })
  }
}

