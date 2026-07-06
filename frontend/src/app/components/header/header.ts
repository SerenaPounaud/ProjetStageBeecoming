import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isConnected:boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit():void {
    this.authService.me().subscribe({
      next: (res:any) => {
        this.isConnected = res.authenticated;
      },
      error: (err) => {
        this.isConnected = false;
      }
    })
  }
  
logout(): void {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/sign-in']);
    }
  });
}
}
