import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../share/components/user/user-navbar/user-navbar.component';
import { UserFooterComponent } from '../../share/components/user/user-footer/user-footer.component';
@Component({
  selector: 'app-user',
  imports: [
    RouterModule,
    UserNavbarComponent,
    UserFooterComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
