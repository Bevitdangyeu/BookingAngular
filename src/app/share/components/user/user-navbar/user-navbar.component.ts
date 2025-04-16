import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-navbar',
  imports: [RouterModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  constructor(private router: Router) { }
  onSearch(keyword: string) {
    if (keyword && keyword.trim()) {
      this.router.navigate([`/public/search/post/`, keyword]);
    }
  }
}
