import { Component } from '@angular/core'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'

@Component({
  selector: 'app-home',
  imports: [PublicNavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home { }
