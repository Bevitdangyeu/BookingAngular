import { Component, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from '../../models/authentication-response.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AUTH_SERVICE = new InjectionToken<AuthServiceComponent>('AUTH_SERVICE');
@Injectable({ // cung cấp provider để angular biết và inject nó vào các componet khác
  providedIn: 'root'// tạo instance của service này và chia sẽ cho toàn bộ ứng dụng
})

export class AuthServiceComponent {

  private apiUrl = 'http://localhost:8080/authenticate';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<AuthenticationResponse>(this.apiUrl, credentials);
  }
  // refresh token
  refreshToken(): Observable<AuthenticationResponse> {
    const token = localStorage.getItem('accessToken');
    return this.http.post<AuthenticationResponse>(`http://localhost:8080/refreshToken`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Authorization-Refresh': localStorage.getItem('refreshToken') || ''
      }
    });
  }

  // đăng xuất
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log(" đã tới logout");
    this.router.navigate(["/login"]);
  }
  // hàm kiểm tra người dùng đã đăng nhập chưa
  isAuthenticate(): boolean {
    // lấy token nếu có thì đã đăng nhập
    const token = localStorage.getItem("accessToken");
    if (token !== null) {
      return true;
    } else {
      return false;
    }
  }
  // lấy role từ token để kiểm tra 
  getUserRole(): String {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return "";
    }
    try {
      const decodeToken: any = jwtDecode(token);
      return decodeToken.role || "";
    } catch {
      console.error('Lỗi khi giải mã token:', Error);
      return '';
    }
  }
}
