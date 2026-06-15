import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  ticketURL:string = 'http://localhost:3000/api/tickets';

  constructor(private httpClient: HttpClient){}

  getAllTicket(){
    return this.httpClient.get(this.ticketURL);
  }

  getTicketById(id:number){
    return this.httpClient.get(this.ticketURL + "/" + id);
  }

  addTicket(ticketObj:any){
    return this.httpClient.post(this.ticketURL, ticketObj);
  }

  updateTicket(ticketObj:any){
    return this.httpClient.put(this.ticketURL, ticketObj);
  }

}
