import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  //  dùng *ngFor, ngClass
import { ActivatedRoute, RouterModule } from '@angular/router';  // dùng routerLink
import { DoctorModel } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor',
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  doctors: DoctorModel[] = [];
  groupedDoctors: DoctorModel[][] = [];
  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private router: Router) { }
  ngOnInit(): void {
    this.loadDoctors();
  }
  loadDoctors() {
    // lấy chuyên khoa từ url
    const expertise = String(this.route.snapshot.paramMap.get('expertise'));
    this.doctorService.findByExpertise(expertise).subscribe({
      next: (data) => {
        this.doctors = data;
        this.groupDoctors();
      }, error: (error) => {
        console.log("Lỗi khi lấy danh sách bác sĩ", error);
      },
    }
    )
  }
  // hàm chia nhóm bác sĩ thành 3 người/nhóm
  groupDoctors(): void {
    this.groupedDoctors = [];
    for (let i = 0; i < this.doctors.length; i += 3) {
      this.groupedDoctors.push(this.doctors.slice(i, i + 3));
    }
  }
  onSearch(keyword: string) {
    if (keyword && keyword.trim()) {
      this.router.navigate([`/public/search/post/`, keyword]);
    }
  }
}
