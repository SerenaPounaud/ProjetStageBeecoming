import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tr[app-tickets-card]',
  imports: [DatePipe],
  templateUrl: './tickets-card.html',
  styleUrl: './tickets-card.css',
})
export class TicketsCard {
  @Input() ticket: any;
  @Input() index!: number;

  tickets:any[]=[];

  constructor(private router:Router, private activatedRoute: ActivatedRoute){}

  ngOnInit(){
    this.index = Number(this.activatedRoute.snapshot.paramMap.get('i'));
  }

  edit(i: number){
    this.router.navigate(['/edit-ticket', i]);
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
