import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductCategory } from '../../../models/ProductCategory';
import { ProductService } from '../../../services/ProductService';
import { ProductManagementService } from '../../services/ProductManagementService';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { CategoryService } from '../../../services/CategoryService';
import { CrudPermissions } from '../../models/CrudPermissions';

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

    this._activatedRoute.paramMap.subscribe({
      next: params => {
        const mode: string | null = params.get('mode');
        if (mode == null || mode === '') {
          this._router.navigateByUrl('/admin/products?message=' + 'Mode must be provided')
            .then(_ => {});
          return;
        }

        if (this.supportedModes.indexOf(mode) === -1) {
          this._router.navigateByUrl('/admin/categories?message=' + 'Not a supported mode')
            .then(_ => {});
          return;
        }

        this.mode = mode;
        if (mode == this.UPDATE_MODE) {
          const idString: string | null = params.get('id');
          if (idString === null || idString === '') {
            this._router.navigateByUrl('/admin/categories?message' + 'Id must be provided')
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

    if (this.mode == this.ADD_MODE && !this.isAddSupported) {
      alert('Add is not supported yet');
      return;
    }

    if (this.mode == this.UPDATE_MODE && !this.isUpdateSupported) {
      alert('Update is not supported yet');
      return;
    }

    if (this.imageFile) {
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(this.product)], {type: 'application/json'}));
      formData.append('image', this.imageFile);

      if (this.mode == this.ADD_MODE) {
        this._productManagementService.createProduct(formData).subscribe({
          next: response => {
            console.log('Product created:', response);
          },
          error: error => {
            console.log('Error creating product:', error);
          }
        });
      }

      if (this.mode == this.UPDATE_MODE) {
        this._productManagementService.updateProduct(formData).subscribe({
          next: (response) => {
            console.log('Product updated:', response);
          },
          error: err => {
            console.log('Error updating product:', err);
          }
        })
      }
    }
  }
}
