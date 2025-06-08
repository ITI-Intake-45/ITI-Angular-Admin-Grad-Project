import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/UserProfile';
import { ApiService } from '../../services/ApiService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class UserManagementService {

  constructor(private _http: HttpClient) {}

  getAllUsers(): Observable<UserProfile[]> {
    return this._http.get<UserProfile[]>(`${ApiService.apiUrl}/admin`);
  }
}
