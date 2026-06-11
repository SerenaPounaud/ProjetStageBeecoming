import { Component } from '@angular/core';
import { Banner } from '../banner/banner';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-home',
  imports: [Banner, Dashboard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
