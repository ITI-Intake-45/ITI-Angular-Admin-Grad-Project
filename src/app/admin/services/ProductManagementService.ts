import { Observable } from 'rxjs';
import { Product } from '../../models/Product';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/ApiService';

export class ProductManagementService {

  constructor(private _http: HttpClient) {}

  createProduct(formData: FormData): Observable<Product> {
    return this._http.post<Product>(`${ApiService.apiUrl}/products`, formData, { withCredentials: true });
  }
}
