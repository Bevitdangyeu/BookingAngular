import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';


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
  }
  constructor(private http: HttpClient) { { } };
  onload() {

  }
}
