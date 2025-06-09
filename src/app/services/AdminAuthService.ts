import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AdminAuthService {
  private isLoggedIn: boolean = false;

  // BehaviorSubject holds the current value and emits it to new subscribers
  private messageSubject = new BehaviorSubject<string>('Connecting to server...');

  // Observable stream ($ convention indicates it's an Observable)
  public message$ = this.messageSubject.asObservable();

  constructor(private _http: HttpClient,
              private _router: Router) {
  }

  login(email: string, password: string): void {
    if (this.isLoggedIn) {
      this.redirectToAdminHome();
      return;
    }

    const loginDTO = {
      email: email,
      password: password,
    };

    this._http.post(ApiService.authApiUrl + '/admin/login', loginDTO, {
      withCredentials: true,
      responseType: 'text' // Tell Angular to expect plain text, not JSON
    }).subscribe({
      next: response => {
        this.messageSubject.next(response);
        this.isLoggedIn = true;

        setTimeout(() => {
          this.redirectToAdminHome();
        }, 500);
      },
      error: err => {
        if (err.error) {
          this.messageSubject.next(err.error);
        } else {
          this.messageSubject.next('Login failed');
        }
      }
    });
  }


  logout(): void {
    if (!this.isLoggedIn) {
      this.redirectToLogin();
      return;
    }

    this._http.post<string>(ApiService.authApiUrl + '/admin/logout', { withCredentials: true }).subscribe({
      next: response => {
        this.messageSubject.next(response);
        this.isLoggedIn = false;

        setTimeout(() => {
          this.redirectToLogin();
        }, 500);
      },
      error: err => {
        this.messageSubject.next(err);
      }
    });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  private redirectToAdminHome(): void {
    this._router.navigateByUrl('/admin')
      .then(_ => {});
  }

  private redirectToLogin(): void {
    this._router.navigateByUrl('/admin/login')
      .then(_ => {});
  }

}
