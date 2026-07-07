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
  isConnected = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.isConnected$.subscribe(status => {
      console.log("Header reçoit :", status);
      this.isConnected = status;
    });
  }
  
logout(): void {
  this.authService.logout().subscribe({
    next: () => {
      this.authService.setConnected(false);
      this.router.navigate(['/sign-in']);
    }
  });
}
}
