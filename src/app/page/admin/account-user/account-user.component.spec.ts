import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserComponent } from './account-user.component';

describe('AccountUserComponent', () => {
  let component: AccountUserComponent;
  let fixture: ComponentFixture<AccountUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
