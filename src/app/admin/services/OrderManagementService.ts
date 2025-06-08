import { Observable } from 'rxjs';
import { Order } from '../../models/Order';
import { ApiService } from '../../services/ApiService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class OrderManagementService {

  constructor (private _http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this._http.get<Order[]>(`${ApiService.apiUrl}/admin`);
  }

  getOrder(orderId: number): Observable<Order> {
    return this._http.get<Order>(`${ApiService.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this._http.patch<Order>(`${ApiService.apiUrl}/${orderId}/status`, { status });
  }
}
