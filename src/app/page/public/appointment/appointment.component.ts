import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { appointmentModel } from '../../../models/appoinment.model';
import { appointmentService } from '../../../services/appoinment.service';
import { HttpClient } from '@angular/common/http';
import { DoctorModel } from '../../../models/doctor.model';
import { reviewModel } from '../../../models/reviews.model';
import { reviewsSevice } from '../../../services/reviews.servicel';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-appointment',
  imports: [CommonModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  showImageOverlay: boolean = false;
  selectedAppointment?: appointmentModel;
  appointments: appointmentModel[] = []
  idAppointment: number | undefined = 0;
  doctor: string = "";
  idDoctor = 0;
  constructor(private appointmentService: appointmentService, private reviewsService: reviewsSevice) { }
  ngOnInit(): void {
    this.getAllAppointment();
  }
  getAllAppointment(): appointmentModel[] {
    this.appointmentService.findAllAppointmentPublic().subscribe({
      next: (data) => {
        this.appointments = data
        console.log(data)
      },
      error: (error) => {
        console.error();
      }
    })
    return this.appointments;
  }
  review(idApppontment: number | undefined, name: string, idDoctor: number) {
    this.idAppointment = idApppontment;
    this.doctor = name;
    this.idDoctor = idDoctor;
  }
  addReviews() {
    const review: reviewModel = {
      content: (document.getElementById("reviewText") as HTMLTextAreaElement).value,
      doctor: { idDoctor: this.idDoctor } as Partial<DoctorModel>,
      appointment: { appointmentId: this.idAppointment },
      start: 5,
      // user: { idUser: 1 }
    }
    // gọi service thêm đánh giá
    this.reviewsService.add(review).subscribe({
      next: (response) => {
        if (response.Message === "Đánh giá đã được gửi") {
          console.log("data: " + response)
          this.appointments = this.appointments.map(a =>
            a.appointmentId === this.idAppointment ? { ...a, reviewed: true } : a
          );
          let bookingModal = document.getElementById("reviewDoctorModal");
          if (bookingModal) {
            let modalInstance = bootstrap.Modal.getInstance(bookingModal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          Swal.fire({
            title: 'Successfully reviewed!',
            text: 'Cảm ơn bạn đã gửi đánh giá!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            customClass: {
              popup: 'custom-popup-logout',
              title: 'custom-title-logout'
            }
          });
          // Xóa backdrop khỏi DOM
          document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.remove();
          });
        }
      }, error: (error) => {
        Swal.fire({
          title: 'Fail reviewed!',
          text: 'Gửi đánh giá thất bại vui lòng thử lại!',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        })
        // Xóa backdrop khỏi DOM
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
          backdrop.remove();
        });
      }

    });

  }
  updateStatus(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId, "Cancel").subscribe({
      next: (data) => {
        const index = this.appointments.findIndex(a => a.appointmentId == appointmentId)
        if (index != -1) {
          this.appointments[index] = data.appointment;
        }
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  loadDetail(appointmentModel: appointmentModel) {
    console.log("Lịch hẹn" + appointmentModel.address);
    console.log("Lịch hẹn" + appointmentModel.email);
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
