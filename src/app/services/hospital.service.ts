import { HttpClient } from "@angular/common/http";
import { hospitalModel } from "../models/hospital";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DoctorModel } from "../models/doctor.model";

@Injectable({ // cung cấp provider để angular biết và inject nó vào các componet khác
    providedIn: 'root'// tạo instance của service này và chia sẽ cho toàn bộ ứng dụng
})
export class hospitalService {
    apiUrl = "http://localhost:8080/"
    constructor(private http: HttpClient) { }
    findAll(): Observable<hospitalModel[]> {
        return this.http.get<hospitalModel[]>(this.apiUrl + "public/hospital/findAll")
    }
    findByid(id: number): Observable<DoctorModel> {
        return this.http.get<DoctorModel>(this.apiUrl + `profile/${id}`)
    }
}