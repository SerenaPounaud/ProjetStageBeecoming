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

  /*tickets:any = [
    { id: 1, titre: 'Problème de connexion', status: 'Ouvert', date: new Date() },
    { id: 2, titre: 'Bug interface mobile', status: 'En cours', date: new Date() },
    { id: 3, titre: 'Demande de remboursement', status: 'Fermé', date: new Date() }
  ];*/
}
