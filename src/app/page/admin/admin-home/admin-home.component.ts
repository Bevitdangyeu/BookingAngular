import { Component } from '@angular/core';
import { LichKhamService } from '../../../services/lichkhamservice';
import { Router, RouterModule } from '@angular/router';
import { appointmentService } from '../../../services/appoinment.service';
import { appointmentModel } from '../../../models/appoinment.model';
import { CommonModule } from '@angular/common';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { jwtDecode } from 'jwt-decode';
import { jwtPayloadd } from '../../../services/jwtPayloadd.service';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
@Component({
  selector: 'app-admin-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  appointments: appointmentModel[] = [];
  chart: any;
  sum: number = 0;
  constructor(private lichKham: LichKhamService, private appointmentService: appointmentService) { }
  // getLichKham() {
  //   console.log("gọi getLichKham")
  //   this.lichKham.getStringFromApi().subscribe({
  //     next: (response) => {
  //       console.log("Chuỗi từ API:", response);
  //     },
  //     error: (error) => {
  //       console.error("Lỗi khi gọi API:", error);
  //     },
  //     complete: () => {
  //       console.log("API call completed.");
  //     }
  //   });

  // }
  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.findAllByDoctorId(new Date().toISOString().split('T')[0]).subscribe((appointments: any[]) => {
      this.appointments = appointments;
      console.log(" Danh sách lịch khám: " + this.appointments)
      if (this.appointments != null) {
        this.sum = this.appointments.length;
      }
      else {
        this.sum = 0;
      }
      // Thống kê số lượng trạng thái
      const pendingCount = appointments.filter(a => a.status === 'Pending approval').length;
      const confirmedCount = appointments.filter(a => a.status === 'Confiemed').length;
      const done = appointments.filter(a => a.status === 'Done').length;
      const cancel = appointments.filter(a => a.status === 'Cancel').length;
      // Vẽ biểu đồ
      this.createChart(pendingCount, confirmedCount, done, cancel);
    });
  }

  createChart(pendingCount: number, confirmedCount: number, done: number, cancel: number) {
    const values = [pendingCount, confirmedCount, done, cancel];
    const maxValue = Math.max(...values);
    const roundedMax = Math.ceil((maxValue + 1) / 1); // giữ nguyên max thực tế

    this.chart = new Chart('appointmentChart', {
      type: 'bar',
      data: {
        labels: ['Chờ xác nhận', 'Đã xác nhận', 'Đã khám', 'Đã hủy'],
        datasets: [{
          label: 'Số lượng lịch hẹn',
          data: values,
          backgroundColor: ['#f9ec9a', '#77e5a9', '#39add2', '#f7ac8e'],
          barThickness: 25 // chiều rộng cột
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Cho phép can thiệp chiều cao
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Số lượng lịch hẹn',
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Trạng thái'
            },
            grid: {
              display: false // Tắt đường kẻ ngăn cách trục X
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            },

            suggestedMax: roundedMax <= 10 ? 10 : roundedMax // nếu nhỏ hơn 20, đặt gợi ý là 20
          }
        }
      }
    });
  }
  getRole(): String {
    //lấy token từ localStorge
    const token = localStorage.getItem("accessToken");
    let role;
    if (token) {
      try {
        const decode = jwtDecode<jwtPayloadd>(token);
        role = decode.role ?? "";
        console.log("role: " + role)
        return role;
      } catch (error) {
        console.error("Không thể decode token:", error);
      }
    }
    return "";
  }
}
