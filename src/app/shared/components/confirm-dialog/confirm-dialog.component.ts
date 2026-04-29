import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="form-actions">
            <button class="btn-secondary" (click)="onCancel()">{{ cancelText }}</button>
            <button class="btn-danger" (click)="onConfirm()" [disabled]="isLoading()">
              {{ isLoading() ? 'Eliminando...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ConfirmDialogComponent {
  @Input() title = '¿Está seguro?'
  @Input() message = '¿Desea continuar con esta acción?'
  @Input() confirmText = 'Confirmar'
  @Input() cancelText = 'Cancelar'
  @Input() isOpen = () => false
  @Input() isLoading = () => false
  @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  onConfirm(): void {
    this.confirm.emit()
  }

  onCancel(): void {
    this.cancel.emit()
  }
}
