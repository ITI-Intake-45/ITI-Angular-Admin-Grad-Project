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

  createCategory(name: string): Observable<ProductCategory> {
    const createCategoryDTO = {
      name: name
    };

    return this._http.post<ProductCategory>(`${ApiService.apiUrl}/categories`, createCategoryDTO, { withCredentials: true });
  }

  updateCategory(id: number, name: string): Observable<string> {
    const updateCategoryDTO = {
      id: id,
      name: name
    };

    return this._http.put(`${ApiService.apiUrl}/categories`, updateCategoryDTO, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  deleteCategory(id: number): Observable<string> {
    return this._http.delete<string>(`${ApiService.apiUrl}/categories/${id}`);
  }
}
