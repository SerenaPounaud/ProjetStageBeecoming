import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = "http://localhost:3000/api/users";
  
  constructor(private router: Router, private http: HttpClient) {}

  me() {
    return this.http.get(`${this.url}/me`, {withCredentials: true});
  }

  isAdmin(callback: (isAdmin: boolean) => void) {
    this.me().subscribe({
      next: (res: any) => {
        callback(res.role === 'admin');
      },
      error: (err) => {
        callback(false);
      }
    });
  }

  logout() {
    return this.http.post(`${this.url}/logout`, {}, { withCredentials: true });
  }
}


