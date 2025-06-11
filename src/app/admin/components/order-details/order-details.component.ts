import { Component, OnInit } from '@angular/core';
import { OrderDTO } from '../../../models/OrderDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { OrderManagementService } from '../../services/OrderManagementService';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudPermissions } from '../../models/CrudPermissions';
import { ApiService } from '../../../services/ApiService';
import { OrderStatus } from '../../../models/OrderStatus';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  protected message: string | null = null;

  protected order: OrderDTO | null = null;

  protected readonly isAcceptAllowed: boolean = CrudPermissions.IS_ACCEPT_ORDER_AVAILABLE;
  protected readonly isCancelAllowed: boolean = CrudPermissions.IS_CANCEL_ORDER_AVAILABLE;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _orderManagementService: OrderManagementService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._activatedRoute.paramMap.subscribe({
      next: params => {
        const idString: string | null = params.get('id');
        if (idString == null) {
          this.redirectToOrders('Id must be provided');
          return;
        }

        this.loadOrderById(+idString);
      },
      error: err => {
        this.redirectToOrders(err);
      }
    })
  }

  getImageUrl(imagePath: string): string {
    return ApiService.getRealImagePath(imagePath);
  }

  redirectToOrders(message: string): void {
    this._router.navigateByUrl(`/orders?message=${message}`)
      .then(() => {});
  }

  loadOrderById(id: number): void {
    this._orderManagementService.getOrder(id).subscribe({
      next: response => {
        this.order = response;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    })
  }

  acceptOrder(): void {
    if (!this.isAcceptAllowed) {
      throw new Error('Accepting orders is not allowed');
    }

    if (this.order == null) {
      throw new Error('Illegal state, order cannot be null');
    }

    this._orderManagementService.acceptOrder(this.order.orderId).subscribe({
      next: response => {
        this.message = response;
        this.order!.status = OrderStatus.ACCEPTED;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    });
  }

  cancelOrder(): void {
    if (!this.isCancelAllowed) {
      throw new Error('Canceling order is not allowed');
    }

    if (this.order == null) {
      throw new Error('Illegal state, order cannot be null');
    }

    this._orderManagementService.cancelOrder(this.order.orderId).subscribe({
      next: response => {
        this.message = response;
        this.order!.status = OrderStatus.CANCELLED
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    })
  }

  protected readonly OrderStatus = OrderStatus;
}
