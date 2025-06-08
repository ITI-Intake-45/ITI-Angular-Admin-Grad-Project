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
  protected emailValue: string = '';
  protected passwordValue: string = '';

  protected message: string | null = null;

  constructor(private _adminAuthService: AdminAuthService) {}

  login(email: string, password: string): void {
    this._adminAuthService.login(email, password);
    this._adminAuthService.message$.subscribe(response => {
      this.message = response;
    });
  }

  resetForm(emailField: HTMLInputElement, passwordField: HTMLInputElement) {
    this.emailValue = '';
    this.passwordValue = '';
    emailField.value = '';
    passwordField.value = '';
  }
}
