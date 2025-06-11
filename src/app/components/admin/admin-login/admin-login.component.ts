import { Component } from '@angular/core';
import { AdminAuthService } from '../../../services/AdminAuthService';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  protected usernameValue: string = '';
  protected passwordValue: string = '';

  protected message: string | null = null;

  constructor(private _adminAuthService: AdminAuthService) {}

  login(username: string, password: string): void {
    this._adminAuthService.login(username, password);
    this._adminAuthService.message$.subscribe(response => {
      this.message = response;
    });
  }

  resetForm(emailField: HTMLInputElement, passwordField: HTMLInputElement) {
    this.usernameValue = '';
    this.passwordValue = '';
    emailField.value = '';
    passwordField.value = '';
  }
}
