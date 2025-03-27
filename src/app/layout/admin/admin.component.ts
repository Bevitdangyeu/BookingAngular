import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../share/components/Admin/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../share/components/Admin/admin-sidebar/admin-sidebar.component';
import { AdminFooterComponent } from '../../share/components/Admin/admin-footer/admin-footer.component';
import { Renderer2, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-admin',
  imports:
    [
      RouterModule,
      AdminNavbarComponent,
      AdminSidebarComponent,
      AdminFooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnDestroy, OnInit {
  private cssLink!: HTMLLinkElement;
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    this.cssLink = this.renderer.createElement('link');
    this.cssLink.rel = 'stylesheet';
    this.cssLink.href = '/assets/admin/css/argon-dashboard.css?v=2.1.0';
    this.renderer.appendChild(document.head, this.cssLink);

  }
  ngOnDestroy(): void {
    if (this.cssLink) {
      this.renderer.removeChild(document.head, this.cssLink);
    }

  }

}
