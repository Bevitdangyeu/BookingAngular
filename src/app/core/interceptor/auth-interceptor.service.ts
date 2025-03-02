import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthServiceComponent } from "../services/auth-service.component";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        throw new Error("Method not implemented.");
    }

}