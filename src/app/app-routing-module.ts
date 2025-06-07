import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { adminRedirectGuard } from './guards/admin-redirect-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },
  {
    path: 'admin/login', // Must come BEFORE the lazy-loaded admin route
    canActivate: [adminRedirectGuard],
    component: AdminLoginComponent
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminLayoutComponent,
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
