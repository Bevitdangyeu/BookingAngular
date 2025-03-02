import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, GuardResult, MaybeAsync } from "@angular/router";
import { AuthServiceComponent } from "../core/services/auth-service.component";
import { Observer } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthServiceComponent, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        const expectedRole = route.data['expectedRole'];// role yêu cầu từ route
        const userRole = this.authService.getUserRole();// lấy role từ token
        if (userRole && expectedRole.includes(userRole)) {
            return true; // Cho phép truy cập nếu user có role phù hợp
        }
        this.router.navigate(['/login']);
        return false;

    }
}

