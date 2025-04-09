import { Component } from '@angular/core';
import { PostModel } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../services/topics.service';
import { TopicModel } from '../../../models/topic.model';

@Component({
  selector: 'app-post',
  imports: [RouterModule, CommonModule],
  templateUrl: './publicPost.component.html',
  styleUrl: './publicPost.component.css'
})
export class PublicPostComponent {
  post: PostModel = {
    postId: 0,
    category: {
      categoryId: 0
    },
    content: "",
    title: ""
  }
  topics: TopicModel[] = [];
  constructor(private postService: PostService, private router: ActivatedRoute, private topicService: TopicService) { }
  ngOnInit() {
    this.findPostById();
    this.findAllCategory();
  }
  findPostById() {
    // lấy id từ url
    const id = Number(this.router.snapshot.paramMap.get('id'));
    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.post = data.post;
        console.log("post: " + this.post);
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
}
