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

  createProduct(product: Product, imageFile: File): Observable<Product> {
    const formData = new FormData();

    const createProductDTO = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.category.id,
      stock: product.stock
    };

    // Append as JSON with correct parameter name
    formData.append('dto', new Blob([JSON.stringify(createProductDTO)], {
      type: 'application/json'
    }));

    formData.append('imageFile', imageFile);

    return this._http.post<Product>(`${ApiService.apiUrl}/products`, formData, {
      withCredentials: true
    });
  }

  updateProduct(product: Product, imageFile: File | null): Observable<string> {
    const formData = new FormData();

    const updateProductDTO = {
      id: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.category.id,
      stock: product.stock
    };

    formData.append('dto', new Blob([JSON.stringify(updateProductDTO)], {
      type: 'application/json'
    }));

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this._http.put(`${ApiService.apiUrl}/products`, formData, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  deleteProduct(id: number): Observable<string> {
    return this._http.delete(`${ApiService.apiUrl}/products/${id}`, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
