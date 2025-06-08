import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../models/ProductCategory';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { CategoryManagementService } from '../../services/CategoryManagementService';
import { CategoryService } from '../../../services/CategoryService';
import { CrudPermissions } from '../../models/CrudPermissions';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  protected message: string | null = null;
  protected categories: ProductCategory[] = []

  protected readonly isAddSupported: boolean = CrudPermissions.IS_ADD_CATEGORY_AVAILABLE;
  protected readonly isUpdateSupported: boolean = CrudPermissions.IS_UPDATE_CATEGORY_AVAILABLE;
  protected readonly isDeleteSupported: boolean = CrudPermissions.IS_DELETE_CATEGORY_AVAILABLE;

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _categoryService: CategoryService,
              private _categoryManagementService: CategoryManagementService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._categoryService.getAllCategories().subscribe({
      next: response => {
        this.categories = response;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  add(): void {
    this._router.navigateByUrl('/admin/categories/categoryForm?mode=add')
      .then(_ => {});
  }

  update(id: number): void {
    this._router.navigateByUrl(`/admin/categories/categoryForm?mode=update&id=${id}`)
      .then(_ => {});
  }

  delete(id: number): void {
    this._categoryManagementService.deleteCategory(id).subscribe({
      next: response => {
        this.message = response;
      },
      error: (err: HttpErrorResponse) => {
        this.message = err.error;
      }
    })
  }

}
