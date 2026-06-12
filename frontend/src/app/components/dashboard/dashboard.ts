import { Component } from '@angular/core';
import { Tickets } from '../tickets/tickets';
import { CreateTicket } from '../create-ticket/create-ticket';

@Component({
  selector: 'app-dashboard',
  imports: [Tickets, CreateTicket],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isConnected:boolean = false;
  sectionActive: string = 'tickets';

  ngOnInit():void {
    this.isConnected = localStorage.getItem('isConnected') === 'true';
  }

  changeSection(section: string) {
    this.sectionActive = section;
  }

}
