import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router) {}

  get isConnected(): boolean {
    return localStorage.getItem('isConnected') === 'true';
  }

  logout(): void {
    localStorage.setItem('isConnected', 'false');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
}
