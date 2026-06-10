import { DatePipe } from '@angular/common'
import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { forkJoin } from 'rxjs'
import { PagoQrAdminResumen, PagoQrMovimiento } from '../../../core/models/pagos/pago-qr.model'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'
import { PagoQrService } from '../../../shared/services/pagos/pago-qr.service'

@Component({
  selector: 'app-pagos-admin',
  imports: [DatePipe, TablePaginationComponent],
  templateUrl: './pagos.html',
  styleUrl: './pagos.scss'
})
export class PagosAdminComponent implements OnInit {
  private pagoService = inject(PagoQrService)

  resumen = signal<PagoQrAdminResumen | null>(null)
  movimientos = signal<PagoQrMovimiento[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  pageSize = 8
  page = signal(1)

  movimientosPaginados = computed(() => this.movimientos().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize))

  ngOnInit(): void {
    this.cargarPagos()
  }

  cargarPagos(): void {
    this.loading.set(true)
    this.error.set(null)

    forkJoin({
      resumen: this.pagoService.getAdminSummary(),
      movimientos: this.pagoService.getAdminMovements(),
    }).subscribe({
      next: ({ resumen, movimientos }) => {
        this.resumen.set(resumen)
        this.movimientos.set(movimientos)
        this.page.set(1)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudieron cargar los pagos')
        this.loading.set(false)
      }
    })
  }

  nombreCompleto(usuario: PagoQrMovimiento['usuario']): string {
    if (!usuario) return 'Sin usuario'
    return [usuario.nom_usu, usuario.apell_usu].filter(Boolean).join(' ')
  }

  montoPagado(movimiento: PagoQrMovimiento): string {
    return movimiento.monto_a_pagar ?? movimiento.monto
  }
}
