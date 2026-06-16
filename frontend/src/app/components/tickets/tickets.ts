import { Component} from '@angular/core';
import { TicketsCard } from '../tickets-card/tickets-card';
import { TicketService } from '../../services/ticket-service';

@Component({
  selector: 'app-tickets',
  imports: [TicketsCard],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets:any[] = [];

//constructor(private pService: TicketService){}

  ngOnInit(): void {
    this.tickets = JSON.parse(localStorage.getItem('usersTickets') || '[]');
  //this.pService.getAllTicket().subscribe();
  }
}
