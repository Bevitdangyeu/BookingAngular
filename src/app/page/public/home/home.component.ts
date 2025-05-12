import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  //  dùng *ngFor, ngClass
import { RouterModule } from '@angular/router';  // dùng routerLink
import { DoctorModel } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { hospitalModel } from '../../../models/hospital';
import { hospitalService } from '../../../services/hospital.service';
import { PostModel } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  //khởi tạo biến để lưu danh sách bác sĩ
  doctors: DoctorModel[] = [];
  hospital: hospitalModel[] = [];
  groupedDoctors: DoctorModel[][] = []; // Nhóm các bác sĩ thành nhóm 3 người
  groupedHospital: hospitalModel[][] = [];
  post: PostModel[] = [];
  groupedPost: PostModel[][] = []
  constructor(private doctorService: DoctorService, private router: Router, private hospitalService: hospitalService, private postService: PostService) { }
  // tạo hàm khơi tạo ( tức là render ngay khi trang được load)
  ngOnInit(): void {
    this.loadDoctors();
    this.loadHospital();
    this.loadPost();
  }
  // hàm lấy danh sách doctor
  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
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
  viewProfile(id: number) {
    this.router.navigate(['/public/profile', id]); // Chuyển hướng đến trang Profile
  }
  loadHospital(): void {
    this.hospitalService.findAll().subscribe({
      next: (data) => {
        this.hospital = data;
        this.groupHospital();
        console.log(this.hospital)
      },
      error: (error) => {
        console.log("Lỗi khi lấy danh sách bệnh viện", error);
      },
      complete: () => {
        console.log("Hoàn thành tải danh bệnh viện");
      }
    });
  }

  // hàm chia nhóm bác sĩ thành 3 người/nhóm
  groupHospital(): void {
    this.groupedHospital = [];
    for (let i = 0; i < this.hospital.length; i += 3) {
      this.groupedHospital.push(this.hospital.slice(i, i + 3));
    }
  }
  viewHospital(id: number) {
    this.router.navigate(['/public/profile', id]); // Chuyển hướng đến trang Profile
  }

  // quản lý bài viết
  loadPost() {
    this.postService.getPost().subscribe({
      next: (data) => {
        this.post = data
        this.post.forEach(post => console.log(post));

        this.groupPost();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  groupPost() {
    this.groupedPost = []
    for (let i = 0; i < this.post.length; i += 3) {
      console.log("post: " + this.post.slice(i, i + 1))
      this.groupedPost.push(this.post.slice(i, i + 3))
    }
  }
  findByExpertise(expertise: String) {
    this.router.navigate(['public/doctor', expertise]);
  }
}
