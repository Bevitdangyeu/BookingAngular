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
    apiUrl = "http://localhost:8080/";
    apiUrlGetAll = "http://localhost:8080/user/appointment/list"
    addApponintment(appoientment: appointmentModel): Observable<{ message: string; status: string }> {
        return this.http.post<{ message: string; status: string }>(this.apiUrl + "public/appointment/add", appoientment);
    }
    findAllAppointmentPublic(): Observable<appointmentModel[]> {
        return this.http.get<appointmentModel[]>(this.apiUrlGetAll);
    }
    findAllByDoctorId(date: string): Observable<appointmentModel[]> {
        return this.http.get<appointmentModel[]>(this.apiUrl + `doctor/appointment/${date}`);
    }
    updateStatus(id: number, status: string): Observable<{ success: boolean; appointment: appointmentModel }> {
        return this.http.post<{ success: boolean; appointment: appointmentModel }>(this.apiUrl + `doctor/appointment/update/${id}/${status}`, null);
    }
    cancelAppointment(id: number, status: string): Observable<{ success: boolean; appointment: appointmentModel }> {
        return this.http.post<{ success: boolean; appointment: appointmentModel }>(this.apiUrl + `public/appointment/update/${id}/${status}`, null);
    }
    findAllByMonth(month: string): Observable<appointmentModel[]> {
        return this.http.get<appointmentModel[]>(this.apiUrl + `doctor/appointment/statistical/${month}`)
    }


}