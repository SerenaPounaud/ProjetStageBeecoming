import { Component, inject} from '@angular/core';
import { TicketsCard } from '../tickets-card/tickets-card';
import { TicketService } from '../../services/ticket-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tickets',
  imports: [TicketsCard, AsyncPipe],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets:any[] = [];
  tickets$ !: Observable<any[]>; //données du front

  selectedStatus: string = 'tous';
  filteredTickets: any[] =[];

private ticketService = inject(TicketService);

  ngOnInit(): void {
    this.tickets$ = this.ticketService.getAllTicket();
    this.applyFilter();
  }

  //Met à jour la liste
  onStatusChange(event: Event){
    const value = (event.target as HTMLSelectElement).value; //récupère la valeur select
    this.selectedStatus = value;
    this.applyFilter();
  }

  //Filtre statut
  applyFilter(){
    if (this.selectedStatus === 'tous') {
      this.filteredTickets = this.tickets;
    } else {
      this.filteredTickets = this.tickets.filter(t => t.status === this.selectedStatus);
    }
  }

}
