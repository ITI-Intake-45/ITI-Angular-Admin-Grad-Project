import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AdminAuthService {

  private isLoggedIn: boolean = false;

  login(email: string, password: string): boolean {
    // ApiService.apiUrl + '/admin/login'
    // ApiService.apiUrl + '/admin/logout'
    // ApiService.apiUrl + '/auth/status'
    console.log('email:', email, 'password:', password);

    if (this.isLoggedIn) {
      return true;
    }

    this.isLoggedIn = true;
    return true;
  }

  logout(): boolean {
    if (!this.isLoggedIn) {
      return false;
    }

    this.isLoggedIn = false;
    return true;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
