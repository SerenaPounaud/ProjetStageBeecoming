import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { CreateTicket } from '../create-ticket/create-ticket';
import { Banner } from '../banner/banner';

@Component({
  selector: 'app-home',
  imports: [Dashboard, CreateTicket, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
