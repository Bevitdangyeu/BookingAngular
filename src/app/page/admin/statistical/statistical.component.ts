import { Component } from '@angular/core';
import { appointmentService } from '../../../services/appoinment.service';
import { appointmentModel } from '../../../models/appoinment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
@Component({
  selector: 'app-statistical',
  imports: [CommonModule, FormsModule],
  templateUrl: './statistical.component.html',
  styleUrl: './statistical.component.css'
})
export class StatisticalComponent {
  selectedMonth: string = "";
  appointments: appointmentModel[] = [];
  confiemed: number = 0;
  done: number = 0;
  cancel: number = 0;
  sum: number = 0;
  chart: any;
  constructor(private appointmentService: appointmentService) { }
  ngOnInit() {
    this.loadAppointments();
  }
  loadAppointments() {
    if (this.selectedMonth === "") {
      this.selectedMonth = new Date().toISOString().slice(0, 7);
    }
    this.appointmentService.findAllByMonth(this.selectedMonth).subscribe({
      next: (data) => {
        this.appointments = data;
        console.log(this.appointments);
        if (this.appointments != null) {
          this.sum = data.length;
          const pendingCount = this.appointments.filter(a => a.status === 'Pending approval').length;
          const confirmedCount = this.appointments.filter(a => a.status === 'Confiemed').length;
          const doneCount = this.appointments.filter(a => a.status === 'Done').length;
          const cancelCount = this.appointments.filter(a => a.status === 'Cancel').length;
          const sum = confirmedCount + doneCount + cancelCount;

          let confirmedPercent = Math.floor((confirmedCount / sum) * 100);
          let donePercent = Math.floor((doneCount / sum) * 100);
          let cancelPercent = Math.floor((cancelCount / sum) * 100);

          // Tổng hiện tại sau khi làm tròn
          let total = confirmedPercent + donePercent + cancelPercent;

          // Nếu chưa đủ 100%, thêm vào phần còn thiếu
          let difference = 100 - total;

          // Tìm phần dư từng loại
          let diffs = [
            { key: 'confirmed', value: (confirmedCount / sum) * 100 - confirmedPercent },
            { key: 'done', value: (doneCount / sum) * 100 - donePercent },
            { key: 'cancel', value: (cancelCount / sum) * 100 - cancelPercent }
          ];

          // Sắp xếp giảm dần để phân bổ phần chênh lệch
          diffs.sort((a, b) => b.value - a.value);

          // Phân bổ phần chênh lệch
          for (let i = 0; i < difference; i++) {
            const key = diffs[i % 3].key;
            if (key === 'confirmed') confirmedPercent++;
            if (key === 'done') donePercent++;
            if (key === 'cancel') cancelPercent++;
          }

          // Gán kết quả
          this.confiemed = confirmedPercent;
          this.done = donePercent;
          this.cancel = cancelPercent;
          // Vẽ biểu đồ
          this.createChart(pendingCount, confirmedCount, doneCount, cancelCount);
        }
        else {
          this.sum = 0;
          this.confiemed = 0;
          this.done = 0;
          this.cancel = 0;
        }

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  createChart(pendingCount: number, confirmedCount: number, done: number, cancel: number) {
    const values = [pendingCount, confirmedCount, done, cancel];
    const maxValue = Math.max(...values);
    const roundedMax = Math.ceil((maxValue + 1) / 1); // giữ nguyên max thực tế
    // hủy nếu biểu đồ cũ đã tồn tại
    if (this.chart) {
      this.chart.destroy();
    }
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
            text: 'THỐNG KÊ',
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
}
