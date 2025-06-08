import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/ProductService';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductManagementService } from '../../services/ProductManagementService';
import { MessageService } from '../../services/MessageService';
import { CrudPermissions } from '../../models/CrudPermissions';
updateOrderStatus
@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  protected message: string | null = null;

  protected products: Product[] = [];

  protected isAddSupported: boolean = CrudPermissions.IS_ADD_PRODUCT_AVAILABLE;
  protected isUpdateSupported: boolean = CrudPermissions.IS_UPDATE_PRODUCT_AVAILABLE;
  protected isDeleteSupported: boolean = CrudPermissions.IS_DELETE_PRODUCT_AVAILABLE;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService,
              private _productManagementService: ProductManagementService,
              private _router: Router) {}

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._productService.getAllProducts().subscribe({
      next: response => {
        this.products = response;
      },
      error: err => {
        console.log(err);
      }
    });

  }

  addProduct(): void {
    this._router.navigateByUrl('/admin/products/productForm?mode=add')
      .then(_ => {});
  }

  updateProduct(product: Product): void {
    this._router.navigateByUrl(`/admin/products/productForm?mode=update?id=${product.productId}`)
      .then(_ => {});
  }

  deleteProduct(product: Product): void {
    this._productManagementService.deleteProduct(product.productId).subscribe({
      next: response => {
        this.message = response;
        this.products.splice(this.products.indexOf(product), 1);
      },
      error: err => {
        console.log(err);
      }
    });

  }
}
