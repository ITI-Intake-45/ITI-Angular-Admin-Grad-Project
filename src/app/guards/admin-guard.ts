import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/AdminAuthService';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const adminAuthService: AdminAuthService = inject(AdminAuthService);
  const router: Router = inject(Router);

  if (!adminAuthService.isAuthenticated()) {
    router.navigateByUrl('/admin/login').then(_ => {})
  }

  return true;
};
