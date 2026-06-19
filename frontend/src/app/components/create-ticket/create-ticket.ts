import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket-service';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  createTicketForm !: FormGroup;
  usersTickets:any=[];
  isEditMode:boolean = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {}
  ticketService = inject(TicketService);

  ngOnInit():void{
    this.createTicketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (idParam){
      this.isEditMode = true;

      const tickets = JSON.parse(localStorage.getItem("usersTickets") || '[]');
      const ticketToEdit = tickets.find((t:any) => t.id === idParam);

      if (ticketToEdit) {
        this.createTicketForm.patchValue(ticketToEdit);
      }
    } else {
      this.isEditMode = false;
    }
  }

 saveTicket() {
  if (this.createTicketForm.valid) {

    this.usersTickets = JSON.parse(localStorage.getItem('usersTickets') || '[]');

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.isEditMode && idParam){

      const index = this.usersTickets.findIndex((t: any) => t.id ===idParam); //retourne la position du ticket

      if (index !==-1){
        const existingTicket = this.usersTickets[index];

        //remplace le ticket, même id + nouvelles valeurs
        this.usersTickets[index] = {
          ...existingTicket, //garde date + statut
          id: idParam,
          ...this.createTicketForm.value
        };
      }
    } else {
      this.ticketService.addTicket(this.createTicketForm.value).subscribe({
        next: (res) => {
          alert(this.isEditMode ? 'Ticket modifié avec succès' : 'Ticket créé avec succès');
          this.createTicketForm.reset();
        },
        error:(err) => {
          console.log(err);
          alert("Erreur lors de la création du ticket");
        }
      })/*
      this.usersTickets.push({
        id: crypto.randomUUID(), //créer un id
        ...this.createTicketForm.value,
          status: 'ouvert'
      });*/
    }

    localStorage.setItem('usersTickets', JSON.stringify(this.usersTickets));

    //alert(this.isEditMode ? 'Ticket modifié avec succès' : 'Ticket créé avec succès');
    this.createTicketForm.reset();
  }
}
}
