import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
    //vérifie si l'user est connecté
    this.authService.checkAuth().subscribe(res => {
      this.authService.setConnected(res.authenticated);
    });
  }
}
