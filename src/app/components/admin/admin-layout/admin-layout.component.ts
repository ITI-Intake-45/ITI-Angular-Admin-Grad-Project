import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/AdminAuthService';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isCollapsed = true;

  constructor (private _adminAuthService: AdminAuthService,
               private _router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this._adminAuthService.logout();
    this._router.navigateByUrl('/admin/login').then(_ => {});
  }
}
