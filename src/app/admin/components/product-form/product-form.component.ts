import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductCategory } from '../../../models/ProductCategory';
import { ProductService } from '../../../services/ProductService';
import { ProductManagementService } from '../../services/ProductManagementService';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  protected message: string | null = null;

  protected product: Product = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    status: '',
    category: { id: 0, name: '' }
  };

  protected categories: ProductCategory[] = [];
  protected imageFile: File | null = null;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService,
              private _productManagementService: ProductManagementService) {}

  ngOnInit() {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._productService.getAllCategories().subscribe((categories: ProductCategory[]) => {
      this.categories = categories;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(this.product)], { type: 'application/json' }));
      formData.append('image', this.imageFile);

      this._productManagementService.createProduct(formData).subscribe({
          next: (response) => {
            console.log('Product created:', response);
          },
          error: (error) => {
            console.log('Error creating product:', error);
          }
      });
    }
  }
}
