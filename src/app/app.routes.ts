import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { NotFound } from './core/not-found/not-found';
import { authGuard } from './features/auth/guards/auth-guard';
import { loginGuard } from './features/auth/guards/login-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [
      loginGuard
    ],
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login)
  },

  {
    path: '',
    component: Layout,
    canActivate: [
      authGuard
    ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./features/employees/employees.routes')
            .then(m => m.EMPLOYEE_ROUTES)
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('./features/departments/departments.routes')
            .then(m => m.DEPARTMENT_ROUTES)
      }
    ]
  },

  {
    path: '**',
    component: NotFound  }
];