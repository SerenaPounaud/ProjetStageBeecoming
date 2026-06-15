import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  createTicketForm !: FormGroup;
  usersTickets:any=[];
  isEditMode:boolean = false;

  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute) {}

  ngOnInit():void{
    this.createTicketForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
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
        //remplace le ticket, même id + nouvelles valeurs
        this.usersTickets[index] = {
          id: idParam,
          ...this.createTicketForm.value
        };
      }


    } else {

      this.usersTickets.push({
        id: crypto.randomUUID(), //créer un id
        ...this.createTicketForm.value,
          status: 'Fermé',
          date: new Date().toISOString()
      });

    }

    localStorage.setItem('usersTickets', JSON.stringify(this.usersTickets));

    alert(this.isEditMode ? 'Ticket modifié avec succès' : 'Ticket créé avec succès');
    this.createTicketForm.reset();
  }
}
}
