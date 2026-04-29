import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NotificationsComponent } from '../../components/notifications/notifications.component'

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, NotificationsComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayoutComponent { }