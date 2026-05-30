import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { gsap } from 'gsap'
import { Subscription } from 'rxjs'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'

@Component({
  selector: 'app-home',
  imports: [RouterLink, PublicNavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  private publicacionService = inject(PublicacionService)
  private readonly heroText = '¿Puedes adoptarnos?'
  private readonly aboutText = 'Siceref ayuda a centralizar publicaciones de mascotas disponibles para adopción, facilitando que cada refugio pueda mostrar sus animales y que los adoptantes encuentren una mascota compatible de forma simple y responsable.'
  private heroTypewriterInterval: ReturnType<typeof setInterval> | null = null
  private aboutTypewriterInterval: ReturnType<typeof setInterval> | null = null
  private fragmentSubscription: Subscription | null = null
  private scrollState = { y: 0 }

  publicaciones = signal<Publicacion[]>([])
  carouselPage = signal(0)
  tituloPortada = signal('')
  sobreNosotrosTexto = signal('')
  flippedPetId = signal<number | null>(null)

  publicacionesCarrusel = computed(() => this.publicaciones()
    .filter((publicacion) => publicacion.estad_publ && publicacion.mascota)
    .slice(0, 12))

  carouselPages = computed(() => {
    const publicaciones = this.publicacionesCarrusel()
    const pages: Publicacion[][] = []

    for (let index = 0; index < publicaciones.length; index += 3) {
      pages.push(publicaciones.slice(index, index + 3))
    }

    return pages
  })

  currentCarouselItems = computed(() => this.carouselPages()[this.carouselPage()] ?? [])

  ngOnInit(): void {
    this.iniciarTypewriterPortada()
    this.iniciarTypewriterSobreNosotros()
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => {
      if (fragment) setTimeout(() => this.scrollToSection(fragment))
    })

    this.publicacionService.getAll().subscribe({
      next: (data) => this.publicaciones.set(data),
      error: () => this.publicaciones.set([])
    })
  }

  ngOnDestroy(): void {
    this.detenerTypewriterPortada()
    this.detenerTypewriterSobreNosotros()
    this.fragmentSubscription?.unsubscribe()
    gsap.killTweensOf(this.scrollState)
  }

  previousPets(): void {
    const totalPages = this.carouselPages().length
    if (totalPages === 0) return

    this.flippedPetId.set(null)
    this.carouselPage.update((page) => page === 0 ? totalPages - 1 : page - 1)
  }

  nextPets(): void {
    const totalPages = this.carouselPages().length
    if (totalPages === 0) return

    this.flippedPetId.set(null)
    this.carouselPage.update((page) => page === totalPages - 1 ? 0 : page + 1)
  }

  togglePetCard(id: number): void {
    this.flippedPetId.update((flippedId) => flippedId === id ? null : id)
  }

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }

  private iniciarTypewriterSobreNosotros(): void {
    let index = 0

    this.aboutTypewriterInterval = setInterval(() => {
      index++
      this.sobreNosotrosTexto.set(this.aboutText.slice(0, index))

      if (index >= this.aboutText.length) this.detenerTypewriterSobreNosotros()
    }, 24)
  }

  private detenerTypewriterSobreNosotros(): void {
    if (!this.aboutTypewriterInterval) return

    clearInterval(this.aboutTypewriterInterval)
    this.aboutTypewriterInterval = null
  }

  private iniciarTypewriterPortada(): void {
    let index = 0

    this.heroTypewriterInterval = setInterval(() => {
      index++
      this.tituloPortada.set(this.heroText.slice(0, index))

      if (index >= this.heroText.length) this.detenerTypewriterPortada()
    }, 90)
  }

  private detenerTypewriterPortada(): void {
    if (!this.heroTypewriterInterval) return

    clearInterval(this.heroTypewriterInterval)
    this.heroTypewriterInterval = null
  }

  private scrollToSection(fragment: string): void {
    const section = document.getElementById(fragment)
    if (!section) return

    this.scrollState.y = window.scrollY
    gsap.to(this.scrollState, {
      y: section.getBoundingClientRect().top + window.scrollY - 82,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => window.scrollTo(0, this.scrollState.y)
    })
  }
}
