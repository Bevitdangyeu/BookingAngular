import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { timeModel } from "../models/time.model";
@Injectable({
    providedIn: "root"
})
export class TimeService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    getTimeByIdAndTime(id: number, time: String): Observable<timeModel[]> {
        return this.http.get<timeModel[]>(this.apiUrl + `public/time/${id}/${time}`);
    }
    getAllTime(): Observable<timeModel[]> {
        return this.http.get<timeModel[]>(this.apiUrl + "public/time/findAll");
    }
    getAllTimeForDoctor(): Observable<timeModel[]> {
        return this.http.get<timeModel[]>(this.apiUrl + "doctor/time");
    }
    updateTime(time: timeModel[]): Observable<timeModel[]> {
        return this.http.post<timeModel[]>(this.apiUrl + "doctor/time/update", time)
    }
}