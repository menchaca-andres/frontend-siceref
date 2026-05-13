import { ApplicationConfig } from '@angular/core'
import { provideRouter, withInMemoryScrolling } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { routes } from './app.routes'
import { tokenInterceptor } from './core/interceptors/token.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimations()
  ]
}
