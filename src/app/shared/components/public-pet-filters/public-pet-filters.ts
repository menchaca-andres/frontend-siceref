import { Component, EventEmitter, Input, Output } from '@angular/core'

export interface PublicPetBreedFilter {
  id: number
  nombre: string
}

export interface PublicPetSpeciesFilter {
  id: number
  nombre: string
}

export interface PublicPetSizeFilter {
  id: number
  nombre: string
}

@Component({
  selector: 'app-public-pet-filters',
  templateUrl: './public-pet-filters.html',
  styleUrl: './public-pet-filters.scss'
})
export class PublicPetFiltersComponent {
  @Input() razas: PublicPetBreedFilter[] = []
  @Input() especies: PublicPetSpeciesFilter[] = []
  @Input() tamanios: PublicPetSizeFilter[] = []
  @Input() razaSeleccionada = ''
  @Input() especieSeleccionada = ''
  @Input() tamanioSeleccionado = ''
  @Input() sexoSeleccionado = ''

  @Output() razaChange = new EventEmitter<string>()
  @Output() especieChange = new EventEmitter<string>()
  @Output() tamanioChange = new EventEmitter<string>()
  @Output() sexoChange = new EventEmitter<string>()
  @Output() clearFilters = new EventEmitter<void>()

  actualizarRaza(event: Event): void {
    this.razaChange.emit((event.target as HTMLSelectElement).value)
  }

  actualizarEspecie(event: Event): void {
    this.especieChange.emit((event.target as HTMLSelectElement).value)
  }

  actualizarTamanio(event: Event): void {
    this.tamanioChange.emit((event.target as HTMLSelectElement).value)
  }

  actualizarSexo(event: Event): void {
    this.sexoChange.emit((event.target as HTMLSelectElement).value)
  }
}
