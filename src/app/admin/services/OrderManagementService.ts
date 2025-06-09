import { Observable } from 'rxjs';
import { Order } from '../../models/Order';
import { ApiService } from '../../services/ApiService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../../Pagination/Page';

@Injectable({
  providedIn: "root",
})
export class OrderManagementService {

  constructor (private _http: HttpClient) {}

  getAllOrders(): Observable<Page<Order>> {
    return this._http.get<Page<Order>>(`${ApiService.apiUrl}/orders`, { withCredentials: true });
  }

  getOrder(orderId: number): Observable<Order> {
    return this._http.get<Order>(`${ApiService.apiUrl}/orders/${orderId}`, { withCredentials: true });
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    const updateOrderDTO = {
      status: status
    }

    return this._http.patch<Order>(`${ApiService.apiUrl}/orders/${orderId}/status`, updateOrderDTO, { withCredentials: true });
  }
}
