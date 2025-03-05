import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorModel } from '../../../../models/doctor.model';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  doctor: DoctorModel = {} as DoctorModel;
  dates: string[] = [];
  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {
    registerLocaleData(localeVi);
  }
  ngOnInit(): void {
    this.loadDetailDoctor();
    this.generateNext7Days();
  }
  loadDetailDoctor(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Chuyển về number
    if (!id) {
      console.error("ID không hợp lệ!");
      return;
    }
    this.doctorService.getDoctorDetails(+id).subscribe({
      next: (data) => {
        this.doctor = data;
        console.log(data);
      },
      error: (error) => {
        console.log("Lỗi khi lấy danh sách bác sĩ", error);
      },
      complete: () => {
        console.log("Hoàn thành tải danh sách bác sĩ");
      }
    })
  }
  generateNext7Days(): void {
    const today = new Date();
    const locale = 'vi-VN';

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);

      // ✅ Sử dụng locale "vi-VN" sau khi đăng ký
      const formattedDate = formatDate(futureDate, 'EEEE, dd/MM/yyyy', locale);
      this.dates.push(formattedDate);
    }

    console.log(this.dates)
  }
  getDate(event: Event): void {
    const selectedDate = (event.target as HTMLSelectElement).value;
    console.log('Ngày được chọn:', selectedDate);
  }
}
