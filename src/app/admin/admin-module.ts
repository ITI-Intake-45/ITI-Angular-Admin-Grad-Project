import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AdminRoutingModule } from './admin-routing-module';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoryManagementComponent,
    CategoryFormComponent,
    ProductManagementComponent,
    ProductFormComponent,
    UserManagementComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
