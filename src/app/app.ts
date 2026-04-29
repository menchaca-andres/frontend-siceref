import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AuthStore } from './core/store/auth.store'
import { NotificationsComponent } from './shared/components/notifications/notifications.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationsComponent],
  template: `
    <app-notifications></app-notifications>
    <router-outlet />
  `,
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  private authStore = inject(AuthStore)

  ngOnInit(): void {
    this.authStore.cargarDesdeToken()
  }
}