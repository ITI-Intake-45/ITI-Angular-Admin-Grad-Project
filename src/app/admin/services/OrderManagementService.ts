import { Observable } from 'rxjs';
import { OrderDTO } from '../../models/OrderDTO';
import { ApiService } from '../../services/ApiService';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../../Pagination/Page';
import { OrdersListStatsDTO } from '../models/OrdersListStatsDTO';

@Injectable({
  providedIn: "root",
})
export class OrderManagementService {

  constructor (private _http: HttpClient) {}

  getOrdersStats(): Observable<OrdersListStatsDTO> {
    return this._http.get<OrdersListStatsDTO>(`${ApiService.apiUrl}/orders/stats`, { withCredentials: true });
  }

  getOrdersPage(pageNumber: number, pageSize: number = 10): Observable<Page<OrderDTO>> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    return this._http.get<Page<OrderDTO>>(`${ApiService.apiUrl}/orders`, {
      params: params,
      withCredentials: true
    });
  }

  getOrder(orderId: number): Observable<OrderDTO> {
    return this._http.get<OrderDTO>(`${ApiService.apiUrl}/orders/${orderId}`, { withCredentials: true });
  }

  acceptOrder(orderId: number): Observable<string> {
    return this._http.patch(`${ApiService.apiUrl}/orders/${orderId}/accept`, null, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  cancelOrder(orderId: number): Observable<string> {
    return this._http.patch(`${ApiService.apiUrl}/orders/${orderId}/cancel`, null, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
