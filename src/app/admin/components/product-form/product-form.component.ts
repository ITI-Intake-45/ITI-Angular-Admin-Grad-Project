// Fixed product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductCategory } from '../../../models/ProductCategory';
import { ProductService } from '../../../services/ProductService';
import { ProductManagementService } from '../../services/ProductManagementService';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { CategoryService } from '../../../services/CategoryService';
import { CrudPermissions } from '../../models/CrudPermissions';
import { HttpErrorResponse } from '@angular/common/http';

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
    status: 'ACTIVE', // Set default status
    category: { id: 0, name: '' }
  };

  protected categories: ProductCategory[] = [];
  protected imageFile: File | null = null;
  protected selectedCategoryId: number = 0;

  protected readonly isAddSupported: boolean = CrudPermissions.IS_ADD_PRODUCT_AVAILABLE;
  protected readonly isUpdateSupported: boolean = CrudPermissions.IS_UPDATE_PRODUCT_AVAILABLE;

  protected mode: string | null = null;
  protected id: number | null = null;

  protected readonly ADD_MODE: string = 'add';
  protected readonly UPDATE_MODE: string = 'update';
  protected readonly supportedModes: string[] = [this.ADD_MODE, this.UPDATE_MODE];

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _router: Router,
              private _categoryService: CategoryService,
              private _productService: ProductService,
              private _productManagementService: ProductManagementService) {}

  ngOnInit() {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._activatedRoute.queryParamMap.subscribe({
      next: params => {
        const mode: string | null = params.get('mode');
        if (mode == null || mode === '') {
          this._router.navigateByUrl('/admin/products?message=' + 'Mode must be provided')
            .then(_ => {});
          return;
        }

        if (this.supportedModes.indexOf(mode) === -1) {
          this._router.navigateByUrl('/admin/products?message=' + 'Not a supported mode')
            .then(_ => {});
          return;
        }

        this.mode = mode;
        if (mode == this.UPDATE_MODE) {
          const idString: string | null = params.get('id');
          if (idString === null || idString === '') {
            this._router.navigateByUrl('/admin/products?message' + 'Id must be provided')
              .then(_ => {});
            return;
          }

          this.id = +idString;
          this.loadProductById(this.id);
        }
      },
      error: err => {
        console.error(err);
      }
    });

    this._categoryService.getAllCategories().subscribe((categories: ProductCategory[]) => {
      this.categories = categories;
    });
  }

  private loadProductById(id: number) {
    this._productService.getProductById(id).subscribe({
      next: response => {
        this.product = response;
        this.selectedCategoryId = response.category.id;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.mode == null) {
      throw new Error('Invalid component state, mode cannot be null in submit');
    }

    if (this.mode == this.UPDATE_MODE && this.id == null) {
      throw new Error('Invalid component state, id cannot be null in submit when mode is update');
    }

    if (this.mode == this.ADD_MODE && this.imageFile == null) {
      throw new Error('Image file is mandatory in add mode');
    }

    if (this.mode == this.ADD_MODE && !this.isAddSupported) {
      this.message = 'Add is not allowed';
      return;
    }

    if (this.mode == this.UPDATE_MODE && !this.isUpdateSupported) {
      this.message = 'Update is not allowed';
      return;
    }

    // Setting the category for the product before calling the service.
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == this.selectedCategoryId) {
        this.product.category = this.categories[i];
      }
    }

    if (this.mode == this.ADD_MODE) {
      this._productManagementService.createProduct(this.product, this.imageFile!).subscribe({
        next: response => {
          this._router.navigateByUrl('/admin/products?message=' + 'A product was added with id: ' + response.productId)
            .then(_ => {});
          return;
        },
        error: (err: HttpErrorResponse) => {
          this.message = err.error;
        }
      });
    }

    if (this.mode == this.UPDATE_MODE) {
      this._productManagementService.updateProduct(this.product, this.imageFile).subscribe({
        next: (response) => {
          this._router.navigateByUrl('/admin/products?message=' + response)
            .then(_ => {});
          return;
        },
        error: (err: HttpErrorResponse) => {
          this.message = err.error;
        }
      });
    }
  }

  isDisabled(): boolean {
    const basicFieldsValid = this.product.name.trim() !== '' &&
      this.product.description.trim() !== '' &&
      this.product.price > 0 &&
      this.product.stock >= 0 &&
      this.selectedCategoryId > 0;

    // In ADD mode, image is required
    if (this.mode === this.ADD_MODE) {
      return !basicFieldsValid || this.imageFile === null;
    }

    // In UPDATE mode, image is optional
    if (this.mode === this.UPDATE_MODE) {
      return !basicFieldsValid;
    }

    return true; // Default to disabled state if mode is unknown
  }
}
