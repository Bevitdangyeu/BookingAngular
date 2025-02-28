import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInterceptorsComponent } from './auth.interceptors.component';

describe('AuthInterceptorsComponent', () => {
  let component: AuthInterceptorsComponent;
  let fixture: ComponentFixture<AuthInterceptorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInterceptorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthInterceptorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
