import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { userModel } from "../models/user.model";
import { DoctorModel } from "../models/doctor.model";
@Injectable({
    providedIn: "root"
})
export class AccountService {
    constructor(private http: HttpClient) { }
    apiUrl = "http://localhost:8080/";

    findAllUser(): Observable<userModel[]> {
        return this.http.get<userModel[]>(this.apiUrl + "admin1/getAll/user");
    }
    findAllDoctor(): Observable<DoctorModel[]> {
        return this.http.get<DoctorModel[]>(this.apiUrl + "admin1/getAll/doctor");
    }
    lock(id: number): Observable<userModel> {
        return this.http.post<userModel>(`${this.apiUrl}admin1/lock/${id}`, null);
    }
}