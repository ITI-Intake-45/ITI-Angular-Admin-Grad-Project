import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/UserProfile';
import { ApiService } from '../../services/ApiService';

export class UserManagementService {

  constructor(private _http: HttpClient) {}

  getAllUsers(): Observable<UserProfile[]> {
    return this._http.get<UserProfile[]>(`${ApiService.apiUrl}/admin`);
  }
}
