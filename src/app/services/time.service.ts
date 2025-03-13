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
    private apiUrl = 'http://localhost:8080/public/time/';
    constructor(private http: HttpClient) { }
    getTimeByIdAndTime(id: number, time: String): Observable<timeModel[]> {
        return this.http.get<timeModel[]>(this.apiUrl + `${id}/${time}`);
    }


}