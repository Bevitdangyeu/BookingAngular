import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Injectable({ // cung cấp provider để angular biết và inject nó vào các componet khác
    providedIn: 'root'// tạo instance của service này và chia sẽ cho toàn bộ ứng dụng
})
export class LichKhamService {
    constructor(private http: HttpClient) { }
    private apiUrl = 'http://localhost:8080/admin1';
    getStringFromApi(): Observable<string> {
        return this.http.get(this.apiUrl, { responseType: 'text' }); // Yêu cầu trả về dạng text
    }
}
