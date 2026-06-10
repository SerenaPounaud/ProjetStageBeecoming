import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'sign-in', component: SignIn},
    {path: 'sign-up', component: SignUp}
];
