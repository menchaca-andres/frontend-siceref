import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from '../../components/header/header'
import { SidebarComponent } from '../../components/sidebar/sidebar'

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent { }