import { Component } from '@angular/core';
import { LichKhamService } from '../../../services/lichkhamservice';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  imports: [RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  constructor(private lichKham: LichKhamService) { }
  getLichKham() {
    console.log("gọi getLichKham")
    this.lichKham.getStringFromApi().subscribe({
      next: (response) => {
        console.log("Chuỗi từ API:", response);
      },
      error: (error) => {
        console.error("Lỗi khi gọi API:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    });

  }
}
