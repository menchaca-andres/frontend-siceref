import { Component, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  authStore = inject(AuthStore)
}