import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  createTicketForm !: FormGroup;
  usersTickets:string[]=[];

  constructor(private fb: FormBuilder){}

  ngOnInit():void{
    this.createTicketForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    })
  }

  saveTicket() {
    if(this.createTicketForm.valid){
      this.usersTickets = JSON.parse(localStorage.getItem('usersTickets') || '[]');
      this.usersTickets.push(this.createTicketForm.value);
      localStorage.setItem('usersTickets', JSON.stringify(this.usersTickets));
      alert('Ticket créé avec succès');
      this.createTicketForm.reset();
    }
  }
}
