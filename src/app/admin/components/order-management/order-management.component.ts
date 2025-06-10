import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { OrderManagementService } from '../../services/OrderManagementService';
import { OrderDTO } from '../../../models/OrderDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../../../Pagination/Page';

@Component({
  selector: 'app-order-management',
  standalone: false,
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  protected message: string | null = null;

  private readonly DEFAULT_PAGE_SIZE: number = 6;
  protected orderPage: Page<OrderDTO> | null = null;
  protected orders: OrderDTO[] = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _orderManagementService: OrderManagementService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);
    this.loadPage(0);
  }

  private loadPage(pageNumber: number): void {
    // Remove the old message from a failure attempt.
    if (this.message != null) {
      this.message = null;
    }

    this._orderManagementService.getOrdersPage(pageNumber, this.DEFAULT_PAGE_SIZE).subscribe({
      next: response => {
        this.orderPage = response;
        this.orders = this.orderPage.content;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    })
  }

  private validateIsPageLoaded(): void {
    if (this.orderPage == null) {
      throw new Error('Illegal state, order page is not loaded');
    }
  }

  getCurrentPageNumber(): number {
    this.validateIsPageLoaded();

    return this.orderPage!.number + 1;
  }

  getTotalNumberOfPages(): number {
    this.validateIsPageLoaded();

    return this.orderPage!.totalPages;
  }

  previousPage(): void {
    this.validateIsPageLoaded();

    if (!this.orderPage!.first) {
      this.loadPage(this.orderPage!.number - 1);
    }
  }

  advancePage(): void {
    this.validateIsPageLoaded();

    if (!this.orderPage!.last) {
      this.loadPage(this.orderPage!.number + 1);
    }
  }

  // Prevents non-digit characters from being entered
  onInputPageNumber(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    // Allow only digits
    if (!/^\d*$/.test(input)) {
      (event.target as HTMLInputElement).value = input.replace(/\D/g, '');
    }
  }

  // Wrapper method to safely call goToPage()
  onGoToPage(inputValue: string): void {
    const pageNumberStr = inputValue.trim();
    if (!pageNumberStr) return;

    const pageNumber = parseInt(pageNumberStr, 10);
    if (isNaN(pageNumber) || pageNumber <= 0 || pageNumber > this.orderPage!.totalPages) {
      this.message = `Please enter a valid page number between 1 and ${this.orderPage!.totalPages}`;
      return;
    }

    this.goToPage(pageNumber); // Safe to proceed
  }

  goToPage(pageNumber: number): boolean {
    this.validateIsPageLoaded();

    // Make sure that the page number is zero-based.
    pageNumber--;

    if (pageNumber < 0 || pageNumber >= this.orderPage!.totalPages) {
      this.message = `${pageNumber + 1} is not a valid page number, `
       + 'page number must range from 1 to the current maximum number of pages';
      return false;
    }

    this.loadPage(pageNumber);
    return true;
  }

  viewOrder(order: OrderDTO) {
    this._router.navigateByUrl(`/admin/orders/${order.orderId}`)
      .then(() => {});
  }
}
