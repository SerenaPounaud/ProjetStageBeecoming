import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket-info',
  imports: [DatePipe,RouterLink, TitleCasePipe],
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
}
