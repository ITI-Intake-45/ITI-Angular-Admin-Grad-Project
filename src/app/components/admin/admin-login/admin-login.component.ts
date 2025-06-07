import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/AdminAuthService';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  constructor(private _adminAuthService: AdminAuthService, private _router: Router) {}

  login(email: string, password: string): void {
    const isSuccessful: boolean = this._adminAuthService.login(email, password);
    if (isSuccessful) {
      this._router.navigateByUrl(`/admin`).then(_ => {});
    }
  }

  validatePreviousSession(): void {
    if (this._adminAuthService.isAuthenticated()) {
      this._router.navigateByUrl(`/admin`).then(_ => {});
    }
  }
}
