import { DatePipe, LowerCasePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tickets',
  imports: [DatePipe, NgClass],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  tickets:any = [
    { id: 1, titre: 'Problème de connexion', status: 'Ouvert', date: new Date() },
    { id: 2, titre: 'Bug interface mobile', status: 'En cours', date: new Date() },
    { id: 3, titre: 'Demande de remboursement', status: 'Fermé', date: new Date() }
  ];

  getStatusStyle(status: string): string {
    if (status.toLowerCase() === 'ouvert') return 'status-open';
    if (status.toLowerCase() === 'en cours') return 'status-progress';
    if (status.toLowerCase() === 'fermé') return 'status-closed';
    return '';
  }
}
