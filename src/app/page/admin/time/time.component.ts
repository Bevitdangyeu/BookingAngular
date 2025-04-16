import { Component } from '@angular/core';
import { DoctorModel } from '../../../models/doctor.model';
import { timeModel } from '../../../models/time.model';
import { ɵsetDocument } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { TimeService } from '../../../services/time.service';


@Component({
  selector: 'app-time',
  imports: [CommonModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {
  doctors!: DoctorModel;
  times: timeModel[] = [];// danh sách tất cả thời gian
  selectedTimes: timeModel[] = []; // Chứa các thời gian được chọn
  updatedTimes: number[] = [];  // Lưu các thời gian đã chọn để gửi đến server
  constructor(private doctorService: DoctorService, private timeService: TimeService) { }
  ngOnInit(): void {
    this.loadAllTime();
    this.loadTimeOfDoctor();
  }
  loadAllTime() {
    this.timeService.getAllTime().subscribe({
      next: (data) => {
        this.times = data;
        console.log(" tất cả lịch khám: " + this.times);
      },
      error: (error) => {
        console.log("lỗi khi tải danh sách lịch khám: " + error);
      }
    })
  }
  loadTimeOfDoctor() {
    this.timeService.getAllTimeForDoctor().subscribe({
      next: (data) => {
        this.selectedTimes = data;
        console.log(" danh sách lịch khám: " + this.times);
      },
      error: (error) => {
        console.log("lỗi khi tải danh sách lịch khám: " + error);
      }
    })
  }

  isSelected(time: timeModel): Boolean {
    return this.selectedTimes.some(t => t.timeId === time.timeId);
  }
  toggleTimeSelection(time: timeModel): void {

  }

  onToggle(time: timeModel, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      // Thêm vào danh sách nếu chưa có
      if (!this.isSelected(time)) {
        this.selectedTimes.push(time);
      }
    } else {
      // Xóa khỏi danh sách
      this.selectedTimes = this.selectedTimes.filter(t => t.timeId !== time.timeId);
    }
  }
  updateDoctorTimes() {
    // Loại bỏ phần tử trùng trước khi gửi
    this.selectedTimes = Array.from(
      new Map(this.selectedTimes.map(item => [item.timeId, item])).values()
    );
    console.log(" size lịch khám khi gửi" + this.selectedTimes.length)
    this.timeService.updateTime(this.selectedTimes).subscribe({
      next: (data) => {
        this.selectedTimes = data;
        //  console.log("selectedTimes" + this.selectedTimes.forEach)
      }, error: (error) => {
        console.log("error: " + error);
      }
    })
  }

}
