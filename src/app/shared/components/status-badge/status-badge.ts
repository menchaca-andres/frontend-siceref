import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss'
})
export class StatusBadgeComponent {
  @Input() status = ''

  label(): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      CANCELADA: 'Cancelada',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada',
      Disponible: 'Disponible',
      'No disponible': 'No disponible',
      leida: 'Leída',
      pendiente: 'Pendiente'
    }

    return labels[this.status] || this.status || 'Sin estado'
  }

  tone(): string {
    const tones: Record<string, string> = {
      PENDIENTE: 'pending',
      CANCELADA: 'muted',
      APROBADA: 'success',
      RECHAZADA: 'danger',
      Disponible: 'success',
      'No disponible': 'muted',
      leida: 'muted',
      pendiente: 'pending'
    }

    return tones[this.status] || 'muted'
  }
}
