import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'module/:moduleId', loadComponent: () => import('./features/modules/module-detail.component').then(m => m.ModuleDetailComponent) },
  { path: 'module/:moduleId/lesson/:lessonId', loadComponent: () => import('./features/modules/lesson.component').then(m => m.LessonComponent) },
  { path: 'playground', loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent) },
  { path: 'progress', loadComponent: () => import('./features/progress/progress.component').then(m => m.ProgressComponent) },
  { path: '**', redirectTo: '' }
];
