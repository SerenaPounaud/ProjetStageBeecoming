import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket-service.js';

@Component({
  selector: 'app-ticket-info',
  imports: [DatePipe,RouterLink, TitleCasePipe, CommonModule],
  templateUrl: './ticket-info.html',
  styleUrl: './ticket-info.css',
})
export class TicketInfo {
  ticket:any;

  constructor(private activatedRoute : ActivatedRoute){}
  private ticketService = inject(TicketService);
  
  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.ticketService.getTicketById(id).subscribe((ticket:any) => {
      this.ticket = ticket;
    });
  }
  getStatusStyle(status: string | null | undefined): string {
  if (!status) return '';

  switch (status.toLowerCase()) {
    case 'ouvert':
      return 'status-open';
    case 'en cours':
      return 'status-progress';
    case 'fermé':
      return 'status-closed';
    default:
      return '';
  }
}
}
