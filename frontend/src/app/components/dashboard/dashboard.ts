import { Component, inject } from '@angular/core';
import { Tickets } from '../tickets/tickets';
import { CreateTicket } from '../create-ticket/create-ticket';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [Tickets, CreateTicket],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isConnected:boolean = false;
  sectionActive: string = 'tickets';
  private authService = inject(AuthService);

  ngOnInit():void {
    this.isConnected = localStorage.getItem('isConnected') === 'true';
  }
    get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  changeSection(section: string) {
    this.sectionActive = section;
  }

}
