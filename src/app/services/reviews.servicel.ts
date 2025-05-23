import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { reviewModel } from "../models/reviews.model";
import { Observable } from "rxjs";
import { reviewReplies } from "../models/ReviewReplies.model";
import { WebSocketService } from "./websocket.service";
@Injectable({
    providedIn: "root"
})
export class reviewsSevice {
    constructor(private http: HttpClient, private websocketService: WebSocketService) { }
    apiUrl = "http://localhost:8080/";

    add(review: reviewModel): Observable<any> {
        console.log("vào service để thêm đánh giá")
        // sendreview sẽ trả về đối tượng được thêm ResponseEntity<Map<String,String>>
        return this.websocketService.sendReview(review);
    }
    update(review: reviewModel): Observable<any> {
        return this.websocketService.updateReview(review);
    }
    findByDoctor(id: number): Observable<reviewModel[]> {
        console.log('id ' + id);
        return this.http.get<reviewModel[]>(this.apiUrl + "public/getReviews/" + `${id}`);
    }
    findReplies(id: number): Observable<reviewReplies[]> {
        return this.http.get<reviewReplies[]>(this.apiUrl + "public/replies/findAll/" + `${id}`);
    }
}