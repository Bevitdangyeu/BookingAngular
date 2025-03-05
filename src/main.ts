import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AdminComponent } from './app/layout/admin/admin.component';
import { AuthInterceptor } from './app/interceptors/auth.interceptors/auth.interceptors';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Dùng Dependency Injection cho Interceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Đăng ký Interceptor. Thêm token vào header, tự động gửi yêu cầu refresh token
  ]
}).catch(err => console.error(err));
