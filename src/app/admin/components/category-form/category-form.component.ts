import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/MessageService';
import { CategoryManagementService } from '../../services/CategoryManagementService';
import { CategoryService } from '../../../services/CategoryService';
import { CrudPermissions } from '../../models/CrudPermissions';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent implements OnInit {
  protected message: string | null = null;

  protected readonly isAddSupported: boolean = CrudPermissions.IS_ADD_CATEGORY_AVAILABLE;
  protected readonly isUpdateSupported: boolean = CrudPermissions.IS_UPDATE_CATEGORY_AVAILABLE;

  protected mode: string = 'add';
  protected id: number | null = null;
  protected name: string | null = null;

  protected readonly ADD_MODE: string = 'add';
  protected readonly UPDATE_MODE: string = 'update';
  protected readonly supportedModes: string[] = [this.ADD_MODE, this.UPDATE_MODE];

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _categoryService: CategoryService,
              private _categoryManagementService: CategoryManagementService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._activatedRoute.queryParamMap.subscribe({
      next: params => {
        const mode: string | null = params.get('mode');
        if (mode == null || mode === '') {
          this._router.navigateByUrl('/admin/categories?message=' + 'Mode must be provided')
            .then(_ => {});
          return;
        }

        if (this.supportedModes.indexOf(mode) === -1) {
          this._router.navigateByUrl('/admin/categories?message' + 'Not a supported mode')
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
          this.loadCategoryById(this.id);
        }
      }
    })
  }

  loadCategoryById(id: number): void {
    this._categoryService.getCategoryById(id).subscribe({
      next: response => {
        this.name = response.name;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  submit(name: string): void {
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

    if (this.mode == this.ADD_MODE) {
      const formData = new FormData();
      formData.append('name', name);
      this._categoryManagementService.createCategory(formData).subscribe({
        next: response => {
          this._router.navigateByUrl('/admin/categories?message' + `A category with added with id=${response.id}`)
            .then(_ => {});
        },
        error: err => {
          console.log(err);
        }
      });
    }

    if (this.mode == this.UPDATE_MODE) {
      const formData = new FormData();
      formData.append('id', this.id + '');
      formData.append('name', name);
      this._categoryManagementService.updateCategory(formData).subscribe({
        next: response => {
          this._router.navigateByUrl('/admin/categories?message' + `The category with ${response.id} was updated`)
            .then(_ => {});
        },
        error: err => {
          console.log(err);
        }
      });
    }

  }
}
