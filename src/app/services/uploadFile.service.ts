import { HttpClient } from "@angular/common/http";
import { Component, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class uploadService {
    private apiURL = "http://localhost:8080/public/upload";
    constructor(private http: HttpClient) { }
    uploadFile(formData: FormData): Observable<{ message: string; fileName: string }> {
        return this.http.post<{ message: string; fileName: string }>(this.apiURL, formData);
    }
}