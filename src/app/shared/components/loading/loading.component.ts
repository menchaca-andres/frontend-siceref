import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div class="loading-container" [class.centered]="centered">
        <div class="spinner"></div>
        <p>{{ message }}</p>
      </div>
    }
  `,
  styles: [`
    .loading-container {
      padding: 2rem;
      text-align: center;
      color: var(--gray);

      &.centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      .spinner {
        border: 4px solid var(--light-gray);
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      p {
        margin: 0;
        font-weight: 500;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  @Input() isVisible = false
  @Input() message = 'Cargando...'
  @Input() centered = true
}
