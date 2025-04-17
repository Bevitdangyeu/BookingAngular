import { Component } from '@angular/core';
import { DoctorModel } from '../../../models/doctor.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular'; // Import TinyMCE Module
import { uploadService } from '../../../services/uploadFile.service';
import { DoctorService } from '../../../services/doctor.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, EditorModule],
  templateUrl: './doctor_profile.component.html',
  styleUrl: './doctor_profile.component.css'
})
export class DoctorProfile {
  // hình ảnh cũ được lấy lên từ database
  imageUploaded: string = "";
  // lưu url hình ảnh để hiển thị preview 
  imageUrl: string | ArrayBuffer | null = null; // Lưu URL hình ảnh
  editorConfig = {
    apiKey: 'hzqvekar7x08uycop3yi0u1uszhrv4brvjndfxblep0evjcq',
    height: 500,
    menubar: false,
    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'wordcount'],
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    readonly: false,
  };
  doctor!: DoctorModel;
  isDisabled: boolean = false;
  constructor(private uploadFile: uploadService, private doctorService: DoctorService) { }
  ngOnInit(): void {
    this.loadDoctor();
  }
  loadDoctor() {
    this.doctorService.FindDoctorDetails().subscribe({
      next: (data) => {
        this.imageUploaded = data.userDTO.image!;
        this.doctor = data;
        this.imageUrl = "http://localhost:8080/uploads/" + data.userDTO.image;
        this.checkImageStatus();
        console.log(
          this.doctor
        )
      }
    })
  }
  checkImageStatus() {
    this.isDisabled = this.imageUrl !== null;
  }
  deleteImg() {
    this.imageUrl = null;
    this.imageUploaded = "";
    this.checkImageStatus();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // cập nhật lại file input để nếu chọn cùng ảnh trước thì mới có thể kích hoạt được sự kiện even
    }
  }
  previewImage(event: Event) {
    this.imageUploaded = "";
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
          this.checkImageStatus()
        }
      }
      reader.readAsDataURL(file); // Chuyển file thành base64
    }
  }
  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) {
        console.warn("Chưa chọn file!");
        resolve(""); // Trả về rỗng nếu không có file
        return;
      }

      const selectedFile = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);

      this.uploadFile.uploadFile(formData).subscribe({
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
  async updateDoctor(doctor: DoctorModel) {
    // kiểm tra hình ảnh
    if (this.imageUploaded === "") {
      this.imageUploaded = await this.uploadImage();
    }
    doctor.userDTO.image = this.imageUploaded;
    console.log(doctor)
    this.doctorService.updateDoctor(doctor).subscribe({
      next: (data) => {
        doctor = data
        console.log(data)
        Swal.fire({
          title: 'Successfully!',
          text: 'Cập nhật thông tin thành công!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'Cập nhật thông tin thất bại!',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });
      }
    })
  }
}
