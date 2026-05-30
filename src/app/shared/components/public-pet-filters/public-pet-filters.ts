import { Component, EventEmitter, Input, Output, signal } from '@angular/core'

export interface PublicPetBreedFilter {
  id: number
  ids: number[]
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
  @Input() razasSeleccionadas: number[] = []
  @Input() especiesSeleccionadas: number[] = []
  @Input() tamaniosSeleccionados: number[] = []
  @Input() sexosSeleccionados: string[] = []

  @Output() razaChange = new EventEmitter<number[]>()
  @Output() especieChange = new EventEmitter<number[]>()
  @Output() tamanioChange = new EventEmitter<number[]>()
  @Output() sexoChange = new EventEmitter<string[]>()
  @Output() clearFilters = new EventEmitter<void>()

  sexos = ['Macho', 'Hembra']
  mobileFiltersOpen = signal(false)

  get filtrosSeleccionados(): string[] {
    return [
      ...this.especies.filter((especie) => this.especiesSeleccionadas.includes(especie.id)).map((especie) => especie.nombre),
      ...this.razas.filter((raza) => raza.ids.some((id) => this.razasSeleccionadas.includes(id))).map((raza) => raza.nombre),
      ...this.sexos.filter((sexo) => this.sexosSeleccionados.includes(sexo)),
      ...this.tamanios.filter((tamanio) => this.tamaniosSeleccionados.includes(tamanio.id)).map((tamanio) => tamanio.nombre)
    ]
  }

  toggleRaza(raza: PublicPetBreedFilter): void {
    const selected = raza.ids.some((id) => this.razasSeleccionadas.includes(id))
    this.razaChange.emit(selected
      ? this.razasSeleccionadas.filter((id) => !raza.ids.includes(id))
      : [...this.razasSeleccionadas, ...raza.ids.filter((id) => !this.razasSeleccionadas.includes(id))])
  }

  isRazaSelected(raza: PublicPetBreedFilter): boolean {
    return raza.ids.some((id) => this.razasSeleccionadas.includes(id))
  }

  toggleEspecie(id: number): void {
    this.especieChange.emit(this.toggleNumber(this.especiesSeleccionadas, id))
  }

  toggleTamanio(id: number): void {
    this.tamanioChange.emit(this.toggleNumber(this.tamaniosSeleccionados, id))
  }

  toggleSexo(sexo: string): void {
    this.sexoChange.emit(this.sexosSeleccionados.includes(sexo)
      ? this.sexosSeleccionados.filter((value) => value !== sexo)
      : [...this.sexosSeleccionados, sexo])
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update((isOpen) => !isOpen)
  }

  closeMobileFilters(): void {
    this.mobileFiltersOpen.set(false)
  }

  private toggleNumber(values: number[], value: number): number[] {
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value]
  }
}
