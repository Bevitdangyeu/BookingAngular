import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = "Hello";
  ngOnInit(): void {
    this.onload();
    this.scrollToTopOnNavigation();
  }
  constructor(private http: HttpClient, private router: Router) { { } };
  onload() {

  }
  private scrollToTopOnNavigation() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Filter for NavigationEnd events
      )
      .subscribe(() => {
        // Scroll to the top of the window when navigation ends
        window.scrollTo({ top: 0, behavior: 'smooth' }); // or 'auto' if you prefer immediate scroll
      });
  }
}
