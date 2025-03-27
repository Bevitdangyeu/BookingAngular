import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { appointmentModel } from "../models/appoinment.model";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class appointmentService {
    constructor(private http: HttpClient) { }
    apiUrl = "http://localhost:8080/public/appointment/add";
    apiUrlGetAll = "http://localhost:8080/user/appointment/list"
    addApponintment(appoientment: appointmentModel): Observable<{ message: string; status: string }> {
        return this.http.post<{ message: string; status: string }>(this.apiUrl, appoientment);
    }
    findAllAppointmentPublic(): Observable<appointmentModel[]> {
        return this.http.get<appointmentModel[]>(this.apiUrlGetAll);
    }
}