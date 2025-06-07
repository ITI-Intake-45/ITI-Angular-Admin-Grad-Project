import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../models/ProductCategory';
import { ProductService } from '../../../services/ProductService';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/MessageService';

@Component({
  selector: 'app-category-management',
  standalone: false,
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  protected message: string | null = null;
  protected categories: ProductCategory[] = []

  constructor(private _activatedRoute: ActivatedRoute,
              private _messageService: MessageService,
              private _productService: ProductService) {}

  ngOnInit(): void {
    this.message = this._messageService.getMessage(this._activatedRoute);

    this._productService.getAllCategories().subscribe({
      next: response => {
        this.categories = response;
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
