import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contato',
    loadComponent: () =>
      import('./pages/contatct/contact.page').then((m) => m.ContactPageComponent),
  },
];
