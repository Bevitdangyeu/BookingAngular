import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorModel } from '../../../../models/doctor.model';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { TimeService } from '../../../../services/time.service';
import { timeModel } from '../../../../models/time.model';
import { appointmentModel } from '../../../../models/appoinment.model';
import { uploadService } from '../../../../services/uploadFile.service';
import { appointmentService } from '../../../../services/appoinment.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { reviewModel } from '../../../../models/reviews.model';
import { reviewsSevice } from '../../../../services/reviews.servicel';
import { ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../../../../services/websocket.service';
import { reviewReplies } from '../../../../models/ReviewReplies.model';
import { jwtDecode } from 'jwt-decode';
import { jwtPayloadd } from '../../../../services/jwtPayloadd.service'

@Component({
  selector: 'app-profile',
  imports: [RouterModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  imageUrl: string | ArrayBuffer | null = null; // Lưu URL hình ảnh
  timeId: number = 0;
  thoigiankham: String = "";
  times: timeModel[] = [];
  doctor: DoctorModel = {} as DoctorModel;
  dates: string[] = [];
  reviews: reviewModel[] = [];
  status: String = "";
  selectDate: Date = new Date();
  replyVisibility: { [key: number]: boolean } = {};
  reviewsReplies: reviewReplies[] = [];
  constructor(private route: ActivatedRoute,
    private doctorService: DoctorService,
    private timeService: TimeService,
    private uploadService: uploadService,
    private appointmentService: appointmentService,
    private reviewService: reviewsSevice,
    private cdr: ChangeDetectorRef,
    private socket: WebSocketService,
    private router: Router
  ) {
    registerLocaleData(localeVi);
  }
  ngOnInit(): void {
    this.loadDetailDoctor();
    this.generateNext7Days();
    // đăng kí nhận revierw 
    // this.socket.subscribeReviewsToDoctor(this.doctor.idDoctor);

  }

  ngOnDestroy(): void {
    this.socket.disconnect(); // Gọi hàm hủy kết nối khi rời trang
  }
  loadDetailDoctor(): void {
    const today = new Date();
    const time = today.toISOString().split("T")[0];
    const id = Number(this.route.snapshot.paramMap.get('id')); //lấy id từ url Chuyển về number
    if (!id) {
      console.error("ID không hợp lệ!");
      return;
    }
    this.doctorService.getDoctorDetails(+id).subscribe({
      next: (data) => {
        this.doctor = data;
        console.log(data);
        // gọi load review để phía dưới có danh sách review để thêm review mới
        this.loadReviews()
        // Gọi WebSocket ở đây vì doctor đã có dữ liệu
        // đăng kí nhận revierw 
        this.socket.subscribeReviewsToDoctor(this.doctor.idDoctor);
        // Lắng nghe sự kiện cập nhật review
        this.socket.getReview().subscribe(newReview => {
          this.reviews = [newReview, ...this.reviews];//thay đổi tham chiếu để UI tự động cập nhật
          this.cdr.detectChanges(); // Cập nhật giao diện khi có dữ liệu mới
        });
      },
      error: (error) => {
        console.log("Lỗi khi lấy danh sách bác sĩ", error);
      },
      complete: () => {
        console.log("Hoàn thành tải danh sách bác sĩ");
      }
    })
    this.timeService.getTimeByIdAndTime(id, time).subscribe({
      next: (data) => {
        this.times = data;
      },
      error: (error) => {
        console.error("Lỗi khi gọi API:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    })
  }
  loadReviews() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.reviewService.findByDoctor(id).subscribe(
      {
        next: (data) => {
          this.reviews = data
          console.log(this.reviews)
        },
        error: (error) => {
          console.log(error)
        }
      }
    )
  }
  generateNext7Days(): void {
    const today = new Date();
    const locale = 'vi-VN';

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      const formattedDate = formatDate(futureDate, 'yyyy-MM-dd', locale);
      this.dates.push(formattedDate);
    }

    console.log(this.dates)
  }
  getDate(event: Event): void {
    this.times = [];
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const selectedDate = (event.target as HTMLSelectElement).value;
    const selectedDateString = (selectedDate);
    this.selectDate = new Date(selectedDateString);
    console.log("time" + selectedDate)
    // gọi api lấy danh sách
    this.timeService.getTimeByIdAndTime(id, selectedDate).subscribe({
      next: (data) => {
        this.times = data;
      },
      error: (error) => {
        console.error("Lỗi khi gọi API:", error);
      },
      complete: () => {
        console.log("API call completed.");
      }
    })
  }
  chonDatLich(time: timeModel) {
    this.thoigiankham = time.time;
    this.timeId = time.timeId;
  }
  previewImage(event: Event) {
    // lấy input từ sự kiện
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // lấy file đầu tiên
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // gán ảnh vào biến để hiển thị
        if (e.target?.result !== undefined) {
          this.imageUrl = e.target.result as string | ArrayBuffer; // Ép kiểu
        }
      }
      reader.readAsDataURL(file); // Chuyển file thành base64
    }
  }
  async bookingClick() {
    const token = localStorage.getItem("accessToken");
    let userIdFromToken: number | undefined = undefined;
    console.log("token khi đặt lịch: " + token);
    if (token) {
      try {
        const decoded = jwtDecode<jwtPayloadd>(token);
        console.log("vào giải mã token: " + token);
        userIdFromToken = decoded.id;
        console.log("Thông tin user:", decoded);
      } catch (err) {
        console.error("Không thể decode token:", err);
      }
    } else {
      userIdFromToken = 0;
    }
    const imageUrl = await this.uploadImage();
    const appointment: appointmentModel = {
      fullName: (document.getElementById("fullName") as HTMLInputElement).value,
      phoneNumber: (document.getElementById("phoneNumber") as HTMLInputElement).value,
      gmail: (document.getElementById("email") as HTMLInputElement).value,
      time: {
        timeId: Number((document.getElementById("Thoigiankham") as HTMLButtonElement).value),
        hide: 1,
        time: ""
      },
      address: (document.getElementById("addressBN") as HTMLInputElement).value,
      dateOfBirth: (document.getElementById("dob") as HTMLInputElement).value,
      description: (document.getElementById("moTa") as HTMLTextAreaElement).value,
      sex: (1),
      image: imageUrl,
      doctor: this.doctor,
      date: this.selectDate,
      reviewed: false,
      idUser: userIdFromToken
    }
    // gọi đến service upload
    this.appointmentService.addApponintment(appointment).subscribe({
      next: (response) => {
        let bookingModal = document.getElementById("bookingModal");
        if (bookingModal) {
          let modalInstance = bootstrap.Modal.getInstance(bookingModal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        Swal.fire({
          title: 'Appointment has been successfully booked!',
          text: 'Chúc mừng bạn đã đặt lịch hẹn thành công! Vui lòng theo dõi trạng thái tại đây',
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
        console.log("Đặt lịch thành công:", response);
        //this.router.navigate(['/public/Appoinment']);
      },
      error: (error) => {
        Swal.fire({
          title: 'FAIL',
          text: 'Đặt lịch hẹn không thành công, vui lòng thử lại',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
        console.log("Đặt lịch thất bại:", error);
      }

    });
    console.log(appointment);
  }
  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) {
        resolve(""); // Trả về rỗng nếu không có file
        return;
      }
      const selectedFile = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      this.uploadService.uploadFile(formData).subscribe({
        next: (response) => {
          console.log("Upload thành công:", response.fileName);
          resolve(response.fileName);
        },
        error: (error) => {
          console.error("Upload ảnh thất bại:", error);
          reject("");
        }

      });
    });
  }
  showReplyBox(reviewId: number, status: number) {
    console.log('replyVisibility:', this.replyVisibility);
    if (status == 1) {
      this.replyVisibility[reviewId] = true;
    }
    else {
      this.replyVisibility[reviewId] = false;
    }
    this.cdr.detectChanges();
  }
  // Mở/đóng replies của một comment
  toggleReplies(review: reviewModel) {
    // mở
    if (!review.showReplies) {
      // chưa mở lần nào thì gọi api lấy lên ds
      if (!review.replies) {
        this.reviewService.findReplies(review.reviewsId!).subscribe({
          next: (response) => {
            review.replies = response;
          }
        })
        review.showReplies = true;
        // đã có nhưng đóng thì mở lên
      } else {
        review.showReplies = true;
      }
      // đóng
    } else {
      review.showReplies = false;
    }
  }
  getReplyBox(reviewId: number) {
    this.socket.subscribeRepliesToDoctor(reviewId);
    this.socket.getReplies().subscribe(newReplies => {
      console.log("Nhận được reply: " + newReplies)
      const review = this.reviews.find(r => r.reviewsId === newReplies.reviews!.reviewsId);
      if (review && review.showReplies == true) {
        // Kiểm tra nếu reply đã tồn tại trước khi thêm
        if (!review.replies!.some(r => r.idReviewReplies !== newReplies.idReviewReplies)) {
          console.log("📥 Nhận reply mới:", newReplies);
          review.replies = [newReplies, ...review.replies!];
        }
        console.log("Nhận được reply: " + newReplies)
        review.replies = [newReplies, ...review.replies!];// thay đổi tham chiếu để có thể cập nhật giao diện
      }
    });
    this.reviewService.findReplies(reviewId).subscribe({
      next: (response) => {
        const review = this.reviews.find(r => r.reviewsId === reviewId);
        if (review) {
          review.replies = response;
          review.showReplies = true;
        }
      },
      error: (error) => {
        console.error("Mở danh sách các câu trả lời thất bại:", error);
      }
    })
  }
  senReplies(reviewId: number, content: string, star: number) {
    const Contentreplies = (document.getElementById("inputReplies" + reviewId) as HTMLInputElement).value
    console.log("Contentreplies")
    // lấy thông tin qua
    const replies: reviewReplies = {
      content: Contentreplies,
      reviews: {
        reviewsId: reviewId,
        content: content,
        start: star
      }
    }
    this.socket.sendReviewReplies(replies)
  }
}

