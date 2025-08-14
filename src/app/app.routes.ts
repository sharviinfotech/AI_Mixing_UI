import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent) },
  { path: 'signup', loadComponent: () => import('./signup/signup').then(m => m.Signup) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'bale-inventory', loadComponent: () => import('./bale-inventory/bale-inventory').then(m => m.BaleInventory) },
  { path: 'ai-mix-planner', loadComponent: () => import('./ai-mix-planner/ai-mix-planner').then(m => m.AiMixPlanner) },
  { path: 'chat-widget', loadComponent: () => import('./chat-widget/chat-widget').then(m => m.ChatWidget) }
];
