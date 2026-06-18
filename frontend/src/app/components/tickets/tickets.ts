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
  selectedStatus: string = 'tous';
  filteredTickets: any[] =[];

//constructor(private pService: TicketService){}

  ngOnInit(): void {
    this.tickets = JSON.parse(localStorage.getItem('usersTickets') || '[]');
    this.applyFilter();
  //this.pService.getAllTicket().subscribe();
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
