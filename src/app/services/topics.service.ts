import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { TopicModel } from "../models/topic.model";

@Injectable({
    "providedIn": "root"
})
export class TopicService {
    constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:8080/';
    findAll(): Observable<TopicModel[]> {
        return this.http.get<TopicModel[]>(this.apiUrl + "public/category/findAll")
    }

}