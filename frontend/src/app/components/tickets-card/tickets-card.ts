import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'tr[app-tickets-card]',
  imports: [DatePipe, CommonModule, TitleCasePipe],
  templateUrl: './tickets-card.html',
  styleUrl: './tickets-card.css',
})
export class TicketsCard {
  @Input() ticket: any;
  @Input() index!: number;

  constructor(private router:Router, private activatedRoute: ActivatedRoute, private authService: AuthService){}

  ngOnInit(){
    this.index = Number(this.activatedRoute.snapshot.paramMap.get('i'));
  };

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  edit(){
    this.router.navigate(['/edit-ticket', this.ticket._id]);
  }

  ticketInfo(){
     this.router.navigate(['/ticket-info', this.ticket._id]);
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
