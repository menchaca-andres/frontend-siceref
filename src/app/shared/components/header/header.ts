import { Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  authStore = inject(AuthStore)
  private router = inject(Router)

  logout(): void {
    this.authStore.logout()
    this.router.navigate(['/auth/login'])
  }
}
