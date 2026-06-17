import { Routes } from '@angular/router';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-in', loadComponent:() => import('./components/sign-in/sign-in').then(m => m.SignIn)},
    {path: 'sign-up', loadComponent:() => import('./components/sign-up/sign-up').then(m => m.SignUp)},
    {path: 'dashboard', loadComponent:() => import('./components/dashboard/dashboard').then(m => m.Dashboard)},
    {path: 'tickets', loadComponent:() => import('./components/tickets/tickets').then(m => m.Tickets)},
    {path: 'create-ticket', loadComponent:() => import('./components/create-ticket/create-ticket').then(m => m.CreateTicket)},
    {path: 'edit-ticket/:id', loadComponent:() => import('./components/create-ticket/create-ticket').then(m => m.CreateTicket)},
    {path: 'ticket-info/:id', loadComponent:() => import('./components/ticket-info/ticket-info').then(m => m.TicketInfo)},
    {path: 'legal-notice', loadComponent:() => import('./components/legal-notice/legal-notice').then(m => m.LegalNotice)},
    {path: 'confidentialite', loadComponent:() => import('./components/confidentialite/confidentialite').then(m => m.Confidentialite)}
];
