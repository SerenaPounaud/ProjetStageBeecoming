import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string,
  role: string,
  exp: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logoutTimer ?: any; //stock l'id du timer
  
  constructor(private router: Router) {}

  getUserRole() {
    const token = localStorage.getItem('token');
    if(!token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.role;
    } catch (error) {
      console.error('Token invalide', error);
      return null;
    }
  }

  isAdmin():boolean {
    return this.getUserRole() === 'admin';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  getTokenExp():number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp;
    } catch (error) {
      return null;
    }
  }

  //déco auto si token expiré
  autoLogout(){
    this.clearAutoLogout();

    const exp = this.getTokenExp();
    if (!exp) return;

    const now = Math.floor(Date.now() /1000); //convertit en sec
    const timeLeft = exp - now;

    if (timeLeft <= 0) {
      this.logout();
      return;
    }
    //déco auto à expiration
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, timeLeft * 1000); //conversion millisecondes
  }
  //arrête timer déjà existant
  clearAutoLogout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
