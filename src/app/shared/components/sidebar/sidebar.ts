import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  authStore = inject(AuthStore)
  @Input() collapsed = false
  @Output() collapsedChange = new EventEmitter<boolean>()

  toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed)
  }
}
