import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AuthStore } from './core/store/auth.store'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class App implements OnInit {
  private authStore = inject(AuthStore)

  ngOnInit(): void {
    this.authStore.cargarDesdeToken()
  }
}