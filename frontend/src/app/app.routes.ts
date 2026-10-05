import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { ApplicationForm } from './pages/application-form/application-form';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'applications/new',
    component: ApplicationForm
  },
  {
    path: 'applications/:id/edit',
    component: ApplicationForm
  }

];