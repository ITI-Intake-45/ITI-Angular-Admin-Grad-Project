import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/ApiService';
import { ProductCategory } from '../../models/ProductCategory';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class CategoryManagementService {

  constructor(private _http: HttpClient) {
  }

  createCategory(formData: FormData): Observable<ProductCategory> {
    return this._http.post<ProductCategory>(`${ApiService.apiUrl}/categories`, formData, {withCredentials: true});
  }

  updateCategory(formData: FormData): Observable<ProductCategory> {
    return this._http.put<ProductCategory>(`${ApiService.apiUrl}/categories`, formData, {withCredentials: true});
  }

  deleteCategory(id: number): Observable<string> {
    return this._http.delete<string>(`${ApiService.apiUrl}/categories/${id}`);
  }
}
