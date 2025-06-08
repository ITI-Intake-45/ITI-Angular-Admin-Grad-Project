import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'categories',
    component: CategoryManagementComponent
  },
  {
    path: 'categories/categoryForm',
    component: CategoryFormComponent
  },
  {
    path: 'products',
    component: ProductManagementComponent
  },
  {
    path: 'products/productForm', // Should come BEFORE parameterized route
    component: ProductFormComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'users',
    component: UserManagementComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
