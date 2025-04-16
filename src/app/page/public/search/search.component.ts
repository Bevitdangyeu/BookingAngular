import { Component } from '@angular/core';
import { PostModel } from '../../../models/post.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../../services/post.service';
@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  listPost: PostModel[] = [];
  constructor(private router: ActivatedRoute, private postService: PostService) { }
  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      const key = String(params.get('key'));
      console.log("key:", key);
      this.postService.findByKey(key).subscribe({
        next: (data) => {
          this.listPost = data;
          console.log("listPost:", this.listPost);
        },
        error: (error) => {
          console.log("Lỗi:", error);
        }
      });
    });
  }
  loadPost() {
    const key = String(this.router.snapshot.paramMap.get('key'));
    console.log("key" + key);
    this.postService.findByKey(key).subscribe({
      next: (data) => {
        this.listPost = data;
        console.log(" listPost: " + this.listPost);
      },
      error: (error) => {
        console.log("lỗi: " + error);
      }
    })
  }
}
