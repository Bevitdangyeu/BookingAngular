import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicModel } from '../../../models/topic.model';
import { TopicService } from '../../../services/topics.service';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular'; // Import TinyMCE Module
import { PostModel } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
import { uploadService } from '../../../services/uploadFile.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  isDisabled: boolean = false;
  imageUrl: string | ArrayBuffer | null = null; // Lưu URL hình ảnh
  editorConfig = {
    apiKey: 'hzqvekar7x08uycop3yi0u1uszhrv4brvjndfxblep0evjcq',
    height: 500,
    menubar: false,
    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'wordcount'],
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    readonly: false,
  };
  // selectedCategory: number = 0;
  // editorContent: string = '';
  imageUploaded: string = "";
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  listPost: PostModel[] = [];
  postEdit: PostModel = {
    postId: 0,
    title: '',
    content: '',
    category: {
      categoryId: 0
    },
    image: ""
  };

  constructor(private topicService: TopicService, private postService: PostService, private uploadFile: uploadService, private cdr: ChangeDetectorRef) { }
  topics: TopicModel[] = []
  ngOnInit(): void {
    this.findAllTopics()
    this.loadPosts()
  }
  checkImageStatus() {
    this.isDisabled = this.imageUrl !== null;
  }
  findAllTopics() {
    this.topicService.findAll().subscribe({
      next: (data) => {
        this.topics = data;
      }, error(error) {
        console.log(error);
      }
    })
  }
  async addPost() {
    console.log("image: " + this.imageUploaded, typeof this.imageUploaded);
    if (this.imageUploaded === "") {
      this.imageUploaded = await this.uploadImage();
    }
    const postData: PostModel = {
      postId: this.postEdit.postId,
      content: this.postEdit.content, // Lấy nội dung từ ngModel
      category: {
        categoryId: this.postEdit.category.categoryId
      },
      title: this.postEdit.title,
      image: this.imageUploaded!
    };
    this.postService.addPost(postData).subscribe({
      next: (data) => {
        if (this.postEdit.postId === 0) {
          this.listPost.unshift(data.post);
        } else {
          const index = this.listPost.findIndex(p => p.postId === data.post.postId);
          if (index !== -1) {
            this.listPost[index] = data.post;
          }
        }

        const bookingModal = document.getElementById("AddPostModel");
        if (bookingModal) {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(bookingModal);

          bookingModal.addEventListener('hidden.bs.modal', () => {
            // Cleanup
            bookingModal.classList.remove("show");
            bookingModal.removeAttribute("style");
            bookingModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            document.body.removeAttribute("style");

            // Optional: Xóa backdrop nếu vẫn còn tồn tại (tránh đè lên lần mở sau)
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            Swal.fire({
              title: 'Successfully!',
              text: 'Thêm/cập nhật bài viết thành công!',
              icon: 'success',
              confirmButtonText: 'OK',
              timer: 3000,
              timerProgressBar: true,
              customClass: {
                popup: 'custom-popup-logout',
                title: 'custom-title-logout'
              }
            });
          }, { once: true });

          modalInstance.hide(); // Gọi đúng sau khi gán listener
        }

        this.resetForm();
      },

      error: (error) => {
        const bookingModal = document.getElementById("AddPostModel");
        if (bookingModal) {
          const modalInstance = bootstrap.Modal.getOrCreateInstance(bookingModal);
          modalInstance.hide();

          setTimeout(() => {
            bookingModal.classList.remove("show");
            bookingModal.removeAttribute("style");
            document.body.classList.remove("modal-open");
            document.body.removeAttribute("style");
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          }, 100);
        }

        Swal.fire({
          title: 'Error!',
          text: 'Thêm/cập nhật bài viết thất bại, vui lòng thử lại!',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'custom-popup-logout',
            title: 'custom-title-logout'
          }
        });

        this.resetForm();
        console.log(error);
      }
    });
  }
  resetForm() {
    this.postEdit.title = "";
    this.postEdit.content = "";
    this.postEdit.image = "";
    this.imageUrl = null;
    this.postEdit.category.categoryId = 0;
    this.postEdit.category = {
      categoryId: 0
    }
    // Reset input file bằng '' thì lần sau hàm previewImage(event: Event) { mới kích hoạt sự kiện nếu không gán lại thì nó sẽ không kích hoạt sự kiện
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Quan trọng!
    }
    this.checkImageStatus()
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
  deleteImg() {
    this.imageUrl = null;
    this.imageUploaded = "";
    this.checkImageStatus();
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // cập nhật lại file input để nếu chọn cùng ảnh trước thì mới có thể kích hoạt được sự kiện even
    }
  }
  loadPosts() {
    this.postService.getPostByDoctorId(this.currentPage).subscribe({
      next: (data) => {
        this.listPost = data.listPostDTO;
        this.totalPages = data.totalPages;
        console.log(" bài viết: " + data.listPostDTO)
        console.log(" bài viết: " + this.listPost)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  editPost(post: PostModel) {
    this.imageUploaded = post.image!;
    this.postEdit.postId = post.postId;
    this.postEdit.title = post.title;
    this.postEdit.category.categoryId = post.category.categoryId;
    this.postEdit.content = post.content
    this.imageUrl = "http://localhost:8080/uploads/" + post.image || null;
    this.checkImageStatus();
    let bookingModal = document.getElementById("AddPostModel");
    if (bookingModal) {
      let modalInstance = bootstrap.Modal.getOrCreateInstance(bookingModal); // dùng getOrCreateInstance 
      modalInstance.show();
    }
  }

  deletePost(id: number) {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        // tiến hành gọi api để xóa
        this.postService.delete(id).subscribe({
          next: (data) => {
            const index = this.listPost.findIndex(p => p.postId === id);
            if (index !== -1) {
              this.listPost = this.listPost.filter(post => post.postId !== id);
            }
            console.log(" trạng thái xóa: " + data.message)
            if (data.message)
              Swal.fire({
                title: 'Successfully!',
                text: 'Xóa bài viết thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                  popup: 'custom-popup-logout',
                  title: 'custom-title-logout'
                }
              });
          }, error: (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'Xóa bài viết thất bại, vui lòng thử lại!',
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
    })
  }
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPosts();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPosts();
    }
  }
  // chọn trang bất kì
  setPage(page: number) {
    this.currentPage = page;
    this.loadPosts();
  }
}
