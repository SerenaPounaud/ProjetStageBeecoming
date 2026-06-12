import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Banner } from '../banner/banner';

@Component({
  selector: 'app-home',
  imports: [Dashboard, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
