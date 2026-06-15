import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Tickets } from './components/tickets/tickets';
import { CreateTicket } from './components/create-ticket/create-ticket';
import { TicketInfo } from './components/ticket-info/ticket-info';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-in', component: SignIn},
    {path: 'sign-up', component: SignUp},
    {path: 'dashboard', component: Dashboard},
    {path: 'tickets', component: Tickets},
    {path: 'create-ticket', component: CreateTicket},
    {path: 'edit-ticket/:id', component: CreateTicket},
    {path: 'ticket-info/:id', component: TicketInfo},


];
