import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string,
  role: string,
  name: string,
  exp: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
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
}
