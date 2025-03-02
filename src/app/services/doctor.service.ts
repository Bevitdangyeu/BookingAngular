import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DoctorModel } from "../models/doctor.model";

@Injectable({
    providedIn: "root"
})

export class DoctorService {
    private apiUrl = 'http://localhost:8080/public/doctor/';
    constructor(private http: HttpClient) { }
    // viết hàm lấy danh sách doctor
    getDoctor(): Observable<DoctorModel[]> {
        return this.http.get<DoctorModel[]>(this.apiUrl + "list")
    }
}