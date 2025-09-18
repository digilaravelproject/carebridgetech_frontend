import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo:'home', pathMatch: 'full' },
    {
      path: 'home',
      loadComponent: () => import('./pages/home/home.component')  .then(m => m.HomeComponent)
    },
    {
      path: 'about-us',
      loadComponent: () => import('./pages/about/about.component')  .then(m => m.AboutComponent)
    },
    {
      path: 'news',
      loadComponent: () => import('./pages/news/news.component')  .then(m => m.NewsComponent)
    },
    {
      path: 'product-details',
      loadComponent: () => import('./pages/product-details/product-details.component')  .then(m => m.ProductDetailsComponent)
    },
    {
      path: 'contact-us',
      loadComponent: () => import('./pages/contact/contact.component')  .then(m => m.ContactComponent)
    },
     {
      path: 'device',
      loadComponent: () => import('./pages/device/device.component')  .then(m => m.DeviceComponent)
    },
];
