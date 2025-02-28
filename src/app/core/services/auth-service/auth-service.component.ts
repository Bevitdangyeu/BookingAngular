import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticationResponse } from '../../../models/authentication-response.model';
@Component({
  selector: 'app-auth-service',
  imports: [],
  templateUrl: './auth-service.component.html',
  styleUrl: './auth-service.component.css'
})
@Injectable({ // cung cấp provider để angular biết và inject nó vào các componet khác
  providedIn: 'root'// tạo instance của service này và chia sẽ cho toàn bộ ứng dụng
})
export class AuthServiceComponent {
  private apiUrl = 'http://localhost:8080/authenticate';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<AuthenticationResponse>(this.apiUrl, credentials);
  }
}
