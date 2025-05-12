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
    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(this.apiUrl + `doctor/post/delete/${id}`)
    }
    getPostById(id: number): Observable<{ message: string; post: PostModel }> {
        return this.http.get<{ message: string; post: PostModel }>(this.apiUrl + `public/post/${id}`);
    }
    filterByCategoryAndTime(categoryId: number, month: string, page: number): Observable<PagebleModel> {
        return this.http.get<PagebleModel>(this.apiUrl + `doctor/post/${categoryId}/${month}/${page}`);
    }
    findByTopic(id: number, page: number) {
        return this.http.get<PagebleModel>(this.apiUrl + `public/post/category/${id}/${page}`)
    }
    findByKey(key: string): Observable<PostModel[]> {
        const normalizedKey = key.normalize('NFC');
        return this.http.get<PostModel[]>(this.apiUrl + `public/post/findByKey/${normalizedKey}`)
    }
}