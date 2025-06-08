import { Observable } from 'rxjs';
import { Product } from '../../models/Product';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/ApiService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class ProductManagementService {

  constructor(private _http: HttpClient) {
  }

  createProduct(formData: FormData): Observable<Product> {
    return this._http.post<Product>(`${ApiService.apiUrl}/products`, formData, {withCredentials: true});
  }

  updateProduct(formData: FormData): Observable<Product> {
    return this._http.put<Product>(`${ApiService.apiUrl}/products/` + formData, {withCredentials: true});
  }

  deleteProduct(id: number): Observable<string> {
    return this._http.delete<string>(`${ApiService.apiUrl}/products/${id}`, {withCredentials: true});
  }
}
