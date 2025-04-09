import { Component } from '@angular/core';
import { PostModel } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TopicModel } from '../../../models/topic.model';
import { TopicService } from '../../../services/topics.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';  // dùng routerLink
@Component({
  selector: 'app-topic',
  imports: [CommonModule, FormsModule, RouterModule], // import vào đây để có thể sử dụng được router link
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {
  selectedCategoryId: number = 0;
  time: string = "";
  imageUploaded: string = "";
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  listPost: PostModel[] = [];
  topics: TopicModel[] = []
  constructor(private postServie: PostService, private topicService: TopicService, private router: ActivatedRoute) { }
  ngOnInit(): void {
    this.loadPosts();
    this.findAllCategory();
  }
  // hàm lấy lên danh sách các bài viết theo category
  loadPosts() {
    // lấy category từ url
    const id = Number(this.router.snapshot.paramMap.get('id'));
    this.postServie.findByTopic(id, this.currentPage).subscribe({
      next: (data) => {
        this.listPost = data.listPostDTO
        this.totalPages = data.totalPages;
        console.log(" bài viết: " + data.listPostDTO)
        console.log(" bài viết: " + this.listPost)
      },
      error: (error) => {
        console.log(error);
      }
    })

  }
  findAllCategory() {
    this.topicService.findAll().subscribe({
      next: (data) => {
        this.topics = data
        console.log(data);
      }, error: (error) => {
        console.log(error);
      }
    })
  }
  filterByCategory() {
    this.currentPage = 0;
    this.postServie.findByTopic(this.selectedCategoryId, this.currentPage).subscribe({
      next: (data) => {
        this.listPost = data.listPostDTO;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  resetFilter() {
    this.selectedCategoryId = 0;
    this.time = "";
    this.loadPosts();
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
