import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-info',
  imports: [DatePipe,RouterLink, TitleCasePipe, CommonModule],
  templateUrl: './ticket-info.html',
  styleUrl: './ticket-info.css',
})
export class TicketInfo {
  ticket:any;

  constructor(private activatedRoute : ActivatedRoute){}
  
  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    const tickets = JSON.parse(localStorage.getItem("usersTickets") || '[]');
    this.ticket = tickets.find((t:any) => t.id == id);
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
