import { Observable } from 'rxjs';
import { ProductCategory } from '../models/ProductCategory';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Product } from '../models/Product';
import { Page } from '../models/Page';

export class ProductService {

  constructor(private _http: HttpClient) {
  }

  getCategories(): Observable<ProductCategory[]> {
    return this._http.get<ProductCategory[]>(`${ApiService.apiUrl}/categories`, {withCredentials: true});
  }

  getProductById(id: string): Observable<Product> {
    return this._http.get<Product>(`${ApiService.apiUrl}/products/${id}`, {withCredentials: true});
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this._http.get<Product[]>(`${ApiService.apiUrl}/products/category/${categoryId}`, {withCredentials: true});
  }

  getFilteredProducts(
    name: string | null,
    category: string | null,
    minPrice: number | null,
    maxPrice: number | null,
    sortDir: string,
    page: number,
    size: number
  ): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortDir', sortDir);

    if (name) params = params.set('name', name);
    if (category) params = params.set('category', category);
    if (minPrice !== null) params = params.set('minPrice', minPrice.toString()); // ← added
    if (maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());

    return this._http.get<Page<Product>>(`${ApiService.apiUrl}/products/filter`, {
      params,
      withCredentials: true
    });
  }
}
