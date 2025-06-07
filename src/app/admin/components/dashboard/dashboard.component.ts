import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/ProductService';
import { UserManagementService } from '../../services/UserManagementService';
import { OrderManagementService } from '../../services/OrderManagementService';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  protected message : string | null = null;

  protected categoriesCount: number = 0;
  protected productsCount: number = 0;
  protected usersCount: number = 0;
  protected ordersCount: number = 0;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService,
              private _userManagementService: UserManagementService,
              private _orderManagementService: OrderManagementService) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._productService.getAllCategories().subscribe({
      next: response => {
        this.categoriesCount = response.length;
      },
      error: err => {
        console.log(err);
      }
    });

    this._productService.getAllProducts().subscribe({
      next: response => {
        this.productsCount = response.length;
      },
      error: err => {
        console.log(err);
      }
    });

    this._userManagementService.getAllUsers().subscribe({
      next: response => {
        this.usersCount = response.length;
      },
      error: err => {
        console.log(err);
      }
    });

    this._orderManagementService.getAllOrders().subscribe({
      next: response => {
        this.ordersCount = response.length;
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
