import { Component, inject} from '@angular/core';
import { TicketsCard } from '../tickets-card/tickets-card';
import { TicketService } from '../../services/ticket-service';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-tickets',
  imports: [TicketsCard],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets: any[] = [];
  page = 1;
  limit = 10
  totalPages = 0;

  selectedStatus: string = 'tous';

private ticketService = inject(TicketService);
private authService = inject(AuthService);

  ngOnInit(): void {
    this.loadTicket();
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  //Met à jour la liste en fonction du statut
  onStatusChange(event: Event){
    this.selectedStatus = (event.target as HTMLSelectElement).value; //récupère la valeur select
    this.page = 1;
    this.loadTicket();
  }
  loadTicket() {
    this.ticketService.getAllTicket(this.page, this.limit, this.selectedStatus).subscribe(res => {
      //stocke tickets reçus + nb total de pages
      this.tickets = res.data;
      this.totalPages = res.totalPages;
    });
  }

  //pagination
  nextPage(){
    if (this.page < this.totalPages){
      this.page++;
      this.loadTicket();
    }
  }
  previousPage(){
    if (this.page > 1) {
      this.page--;
      this.loadTicket();
    }
  }
}
