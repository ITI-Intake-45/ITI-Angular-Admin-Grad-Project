import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/ProductCategory';
import { ApiService } from './ApiService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private _http: HttpClient) {
  }

  getAllCategories(): Observable<ProductCategory[]> {
    return this._http.get<ProductCategory[]>(`${ApiService.apiUrl}/categories`, {withCredentials: true});
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this._http.get<ProductCategory>(`${ApiService.apiUrl}/categories/${id}`, {withCredentials: true});
  }
}
