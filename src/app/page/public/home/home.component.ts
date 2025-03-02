import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  //  dùng *ngFor, ngClass
import { RouterModule } from '@angular/router';  // dùng routerLink
import { DoctorModel } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  //khởi tạo biến để lưu danh sách bác sĩ
  doctors: DoctorModel[] = [];
  groupedDoctors: DoctorModel[][] = []; // Nhóm các bác sĩ thành nhóm 3 người
  constructor(private doctorService: DoctorService) { }
  // tạo hàm khơi tạo ( tức là render ngay khi trang được load)
  ngOnInit(): void {
    this.loadDoctors();
  }
  // hàm lấy danh sách doctor
  loadDoctors(): void {
    this.doctorService.getDoctor().subscribe({
      next: (data) => {
        this.doctors = data;
        this.groupDoctors();
        console.table(this.groupedDoctors)
      },
      error: (error) => {
        console.log("Lỗi khi lấy danh sách bác sĩ", error);
      },
      complete: () => {
        console.log("Hoàn thành tải danh sách bác sĩ");
      }
    });
  }

  // hàm chia nhóm bác sĩ thành 3 người/nhóm
  groupDoctors(): void {
    this.groupedDoctors = [];
    for (let i = 0; i < this.doctors.length; i += 3) {
      this.groupedDoctors.push(this.doctors.slice(i, i + 3));
    }
  }
}
