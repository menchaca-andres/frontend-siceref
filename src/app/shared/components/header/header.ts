import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-header',
  templateUrl: './header.html'
})
export class HeaderComponent {
  authStore = inject(AuthStore)
  private router = inject(Router)

  logout(): void {
    this.authStore.logout()
    this.router.navigate(['/auth/login'])
  }
}