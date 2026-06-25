import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket-service';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  createTicketForm !: FormGroup;
  ticketID !: any;
  isEditMode:boolean = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {}
  ticketService = inject(TicketService);

  ngOnInit():void{
    this.createTicketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    this.ticketID = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.ticketID){
      this.isEditMode = true;

    this.ticketService.getTicketById(this.ticketID).subscribe({
      next: (ticket) => {
        if (ticket) {this.createTicketForm.patchValue(ticket)}
      },
      error: (err) => {
        console.error('Erreur chargement ticket', err);
      }
    });
    } else {
      this.isEditMode = false;
    }
  }

 saveTicket() {
  if (this.createTicketForm.valid) {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.isEditMode && idParam){

      this.ticketService.updateTicket(idParam, this.createTicketForm.value).subscribe({
        next: () => {
          alert('Ticket modifié');
          this.createTicketForm.reset();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la modification");
        }
      });
    } else {
      this.ticketService.addTicket(this.createTicketForm.value).subscribe({
        next: (res) => {
          alert('Ticket créé avec succès');
          this.createTicketForm.reset();
        },
        error:(err) => {
          console.log(err);
          alert("Erreur lors de la création du ticket");
        }
      })
    }
  }
}
}
