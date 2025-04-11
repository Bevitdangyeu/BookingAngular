import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // sử dụng được ngIf,ngFor
import { appointmentModel } from '../../../models/appoinment.model';
import { appointmentService } from '../../../services/appoinment.service';
import { FormsModule } from '@angular/forms'; // để sử dụng đc ngModel
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-appointment',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-appointment.component.html',
  styleUrl: './admin-appointment.component.css'
})
export class AdminAppointmentComponent {
  showImageOverlay: boolean = false;
  selectedAppointment?: appointmentModel;
  appointments: appointmentModel[] = []
  selectedDate: string = "";
  constructor(private appointmentService: appointmentService) { }
  ngOnInit(): void {
    this.loadAppoinment();
  }
  loadAppoinment() {
    if (this.selectedDate === "") {
      this.selectedDate = new Date().toISOString().split('T')[0];
    }
    this.appointmentService.findAllByDoctorId(this.selectedDate).subscribe({
      next: (data) => {
        this.appointments = data
        console.log(this.appointments);
      }
    })
  }
  openImageModal() {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Không tìm thấy phần tử modal!');
    }
  }
  updateStatus(id: number, status: string) {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: (data) => {
        if (data.success === true) {
          const index = this.appointments.findIndex(a => a.appointmentId === id);
          if (index !== -1) {
            this.appointments[index] = data.appointment;
            console.log("appointments: " + this.appointments);
            console.log("appointment: " + data.appointment);
          }
        }
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  loadDetail(appointmentModel: appointmentModel) {
    this.selectedAppointment = appointmentModel;
  }
  openImageOverlay() {
    this.showImageOverlay = true;
  }

  closeImageOverlay(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Ngăn sự kiện click lan ra div ngoài
    }
    this.showImageOverlay = false;
  }
}
