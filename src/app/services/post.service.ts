import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { PostModel } from "../models/post.model";
import { PagebleModel } from "../models/pageblePost.model";
@Injectable({
    "providedIn": "root"
})
export class PostService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    addPost(post: PostModel): Observable<{ message: string; post: PostModel }> {
        return this.http.post<{ message: string; post: PostModel }>(this.apiUrl + "doctor/post/add", post);
    }
    getPost(): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(this.apiUrl + "public/post");
    }
    getPostByDoctorId(page: number): Observable<PagebleModel> {
        return this.http.get<PagebleModel>(this.apiUrl + `doctor/listPost/${page}`)
    }
}