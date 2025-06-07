import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductService } from '../../../services/ProductService';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductManagementService } from '../../services/ProductManagementService';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  protected message : string | null = null;

  protected product: Product | null = null;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService,
              private _productManagementService: ProductManagementService,
              private _router: Router) {}

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._activatedRoute.paramMap.subscribe({
      next: params => {
        const idString: string | null = params.get('id');
        if (idString == null) {
          this._router.navigateByUrl('/admin/products').then(_ => {});
          return;
        }

        const id = +idString;
        this.loadProductById(id);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  loadProductById(id: number): void {
    this._productService.getProductById(id).subscribe({
      next: response => {
        this.product = response;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  updateProduct() {
    if (this.product == null) {
      throw new Error('Product not found!');
    }

    this._router.navigateByUrl(`/admin/products/productForm?mode=update?id=${this.product.productId}`)
      .then(_ => {});
  }

  deleteProduct() {
    if (this.product == null) {
      throw new Error('Product not found!');
    }

    this._productManagementService.deleteProduct(this.product.productId).subscribe({
      next: response => {
        this._router.navigateByUrl(`/admin/products?message=${response}`)
          .then(_ => {});
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
