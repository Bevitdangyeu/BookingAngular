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
    getDoctors(): Observable<DoctorModel[]> {
        return this.http.get<DoctorModel[]>(this.apiUrl + "list")
    }
    // viết hàm lấy thông tin chi tiết của một bác sĩ
    getDoctorDetails(id: number): Observable<DoctorModel> {
        return this.http.get<DoctorModel>(this.apiUrl + `profile/${id}`)
    }
    FindDoctorDetails(): Observable<DoctorModel> {
        return this.http.get<DoctorModel>("http://localhost:8080/doctor/profile")
    }
    updateDoctor(doctor: DoctorModel): Observable<DoctorModel> {
        return this.http.post<DoctorModel>("http://localhost:8080/doctor/profile/update", doctor);
    }
    addDoctor(doctor: DoctorModel): Observable<DoctorModel> {
        return this.http.post<DoctorModel>("http://localhost:8080/public/doctor/add", doctor);
    }
    findByExpertise(expertise: string): Observable<DoctorModel[]> {
        return this.http.get<DoctorModel[]>(`http://localhost:8080/public/doctor/findByExpertise/${expertise}`);
    }
}