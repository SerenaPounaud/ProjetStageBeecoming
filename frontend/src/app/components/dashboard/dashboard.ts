import { Component, inject } from '@angular/core';
import { Tickets } from '../tickets/tickets';
import { CreateTicket } from '../create-ticket/create-ticket';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-dashboard',
  imports: [Tickets, CreateTicket],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isConnected:boolean = false;
  isAdmin: boolean = false;
  sectionActive: string = 'tickets';

  private usersService = inject(UsersService);

  ngOnInit():void {
    this.usersService.me().subscribe({
      next: (res:any) => {
        this.isConnected = res.authenticated;
        this.isAdmin = res.role === 'admin';
      },
      error: (err) => {
        this.isConnected = false;
        this.isAdmin = false;
      }
    })
  }
  changeSection(section: string) {
    this.sectionActive = section;
  }

}
