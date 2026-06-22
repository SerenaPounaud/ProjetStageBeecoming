import { Component, inject} from '@angular/core';
import { TicketsCard } from '../tickets-card/tickets-card';
import { TicketService } from '../../services/ticket-service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-tickets',
  imports: [TicketsCard, AsyncPipe],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets$ !: Observable<any[]>; //données du front

  selectedStatus: string = 'tous';

private ticketService = inject(TicketService);

  ngOnInit(): void {
    this.applyFilter();
  }

  //Met à jour la liste
  onStatusChange(event: Event){
    this.selectedStatus = (event.target as HTMLSelectElement).value; //récupère la valeur select
    this.applyFilter();
  }

  //Filtre statut
  applyFilter(){
    this.tickets$ = this.ticketService.getAllTicket().pipe( //affiche les tickets filtrés
      map(tickets => {
        if (this.selectedStatus === 'tous') {
          return tickets;
        }
        return tickets.filter(
          ticket => ticket.status === this.selectedStatus
        );
      })
    );
  }
}
