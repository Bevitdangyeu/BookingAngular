import { HttpClient } from "@angular/common/http";
import { Component, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { userModel } from "../models/user.model";
@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(private http: HttpClient) { }
    private apiURL = "http://localhost:8080/";
    addUser(user: userModel): Observable<userModel> {
        return this.http.post<userModel>(this.apiURL + "public/add/user", user);
    }
}