# Frontend Siceref - Guía de Arquitectura y Mejoras

## 📚 Estructura Actualizada

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts        # Protege rutas que requieren autenticación
│   │   └── roles.guard.ts       # Valida permisos por rol
│   ├── interceptors/
│   │   └── token.interceptor.ts # ✨ Manejo HTTP + Errores mejorado
│   ├── models/                  # DTOs e interfaces
│   └── store/
│       └── auth.store.ts        # Estado global con NgRx Signals
│
├── shared/
│   ├── components/
│   │   ├── header/              # ✨ Header mejorado
│   │   ├── sidebar/             # ✨ Sidebar mejorado
│   │   ├── notifications/       # ✨ Sistema de toasts
│   │   ├── confirm-dialog/      # ✨ Diálogo de confirmación
│   │   └── loading/             # ✨ Componente loading reutilizable
│   ├── layout/
│   │   ├── main-layout/         # Layout principal con header + sidebar
│   │   └── auth-layout/         # Layout para login/register
│   ├── services/
│   │   ├── auth/                # Servicios de autenticación
│   │   ├── notification.service.ts  # ✨ Sistema de notificaciones
│   │   ├── mascotas/
│   │   ├── usuarios/
│   │   └── ...                  # Otros servicios
│   └── utils/
│       └── token.helper.ts      # Manejo de JWT
│
├── features/
│   ├── auth/
│   │   ├── login/               # ✨ Mejorado
│   │   └── register/
│   ├── home/
│   ├── refugio/
│   │   ├── mascotas/            # ✨ CRUD mejorado
│   │   ├── razas/
│   │   └── especies/
│   ├── superadmin/
│   │   ├── refugios/
│   │   ├── usuarios/
│   │   └── roles/
│   └── adoptante/
│       └── perfil/
│
├── app.ts                       # ✨ Root component con notificaciones
├── app.routes.ts                # Rutas lazy-loaded
└── styles.scss                  # ✨ Estilos globales mejorados
```

---

## 🎯 Servicios Principales

### 1. **NotificationService** (✨ NUEVO)
Centraliza todas las notificaciones de la app.

```typescript
// Inyectar en cualquier componente
private notificationService = inject(NotificationService)

// Usar en operaciones
this.mascotaService.create(datos).subscribe({
  next: () => this.notificationService.success('Mascota creada'),
  error: () => this.notificationService.error('Error al crear')
})
```

### 2. **Token Interceptor** (✨ MEJORADO)
Maneja automáticamente:
- Agregar token JWT a todas las requests
- Validar respuestas HTTP
- Mostrar notificaciones de error
- Redirigir a login si sesión expira

### 3. **AuthStore** (NgRx Signals)
Maneja estado global de autenticación:
```typescript
// Acceder en cualquier componente
authStore = inject(AuthStore)

// Usar signals
{{ authStore.nombreCompleto() }}
@if (authStore.isSuperadmin()) { ... }
```

---

## 🔄 Flujo de una Operación CRUD Típica

### 1. El usuario hace clic en "Crear"
```typescript
abrirFormCrear() {
  this.mostrarForm.set(true)
}
```

### 2. Completa el formulario y envía
```typescript
onSubmit() {
  if (this.form.invalid) return
  
  this.mascotaService.create(this.form.value).subscribe({
    next: () => {
      this.notificationService.success('✓ Creado')  // Toast
      this.cargarMascotas()                         // Actualizar lista
      this.cerrarForm()                             // Cerrar modal
    },
    error: (err) => {
      this.notificationService.error(err.message)   // Toast de error
    }
  })
}
```

### 3. Para eliminar, muestra confirmación
```typescript
abrirConfirmarEliminar(item) {
  this.itemAEliminar.set(item)
  this.mostrarConfirm.set(true)
}

confirmarEliminar() {
  this.mascotaService.delete(id).subscribe({
    next: () => {
      this.notificationService.success('✓ Eliminado')
      this.cargarMascotas()
      this.cerrarConfirm()
    },
    error: () => this.notificationService.error('Error')
  })
}
```

---

## 🎨 Paleta de Colores

```css
--primary-color: #4a90e2      /* Azul principal */
--secondary-color: #50c878    /* Verde */
--danger-color: #e74c3c       /* Rojo */
--warning-color: #f39c12      /* Naranja */
--info-color: #3498db         /* Azul info */
--success-color: #27ae60      /* Verde oscuro */
--light-gray: #f5f5f5         /* Fondo */
--dark-gray: #2c3e50          /* Texto */
```

---

## 📱 Responsive Breakpoints

```scss
/* Desktop: 1200px+ */
/* Tablet: 769px - 1199px */
/* Mobile: 768px y menos */

@media (max-width: 768px) {
  /* Aplicar cambios mobile */
}
```

---

## ✨ Componentes Reutilizables

### 1. **NotificationsComponent**
```typescript
<!-- Agregar en layouts -->
<app-notifications></app-notifications>

// Ya está incluido en:
// - app.ts (root)
// - auth-layout
// - main-layout
```

### 2. **ConfirmDialogComponent**
```typescript
<app-confirm-dialog
  title="¿Está seguro?"
  message="Esta acción no se puede deshacer"
  confirmText="Eliminar"
  cancelText="Cancelar"
  [isOpen]="mostrarConfirm()"
  [isLoading]="eliminando()"
  (confirm)="confirmarAccion()"
  (cancel)="cerrarConfirm()"
></app-confirm-dialog>
```

### 3. **LoadingComponent** (✨ NUEVO)
```typescript
<app-loading 
  [isVisible]="loading()"
  message="Cargando datos..."
  [centered]="true"
></app-loading>
```

---

## 🚀 Guía: Aplicar Mejoras a Otros CRUDs

### Paso 1: Importar servicios
```typescript
private notificationService = inject(NotificationService)
```

### Paso 2: Reemplazar alert/console.log
```typescript
// Antes:
alert('Guardado')
console.log(err)

// Después:
this.notificationService.success('Guardado correctamente')
this.notificationService.error('Error al guardar')
```

### Paso 3: Usar confirmación para eliminar
```typescript
// Antes:
if (!confirm('¿Eliminar?')) return

// Después:
mostrarConfirm = signal(false)
itemAEliminar = signal<Item | null>(null)

abrirConfirmar(item: Item) {
  this.itemAEliminar.set(item)
  this.mostrarConfirm.set(true)
}

confirmar() {
  this.service.delete(this.itemAEliminar().id).subscribe({
    next: () => {
      this.notificationService.success('Eliminado')
      this.cargar()
      this.cerrarConfirm()
    }
  })
}
```

### Paso 4: Agregar componentes
```typescript
imports: [
  CommonModule,
  ReactiveFormsModule,
  ConfirmDialogComponent,  // ← Agregar
  LoadingComponent          // ← Opcional
]
```

---

## 🔐 Seguridad

### Token JWT
- Se guarda en localStorage
- Se envía automáticamente en header `Authorization: Bearer <token>`
- Se valida en guards antes de activar rutas
- Se remueve si la sesión expira

### Guards
```typescript
// En rutas
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard],        // Solo autenticados
}

{
  path: 'superadmin',
  children: [...],
  canActivate: [rolesGuard('Superadmin')]  // Solo superadmin
}
```

---

## 🧪 Testing Recomendado

### Pruebas de Componentes
```typescript
// test.spec.ts
describe('MascotasComponent', () => {
  it('debe mostrar notificación al crear', () => {
    // Arrange
    const notificationService = TestBed.inject(NotificationService)
    spyOn(notificationService, 'success')
    
    // Act
    component.form.patchValue({...})
    component.onSubmit()
    
    // Assert
    expect(notificationService.success).toHaveBeenCalled()
  })
})
```

---

## 📊 Rendimiento

- ✅ Lazy loading de rutas
- ✅ Componentes standalone (sin NgModule)
- ✅ Change detection onPush automático
- ✅ Signals para reactividad eficiente
- ✅ Track en *ngFor para mejor rendimiento

---

## 🎯 Checklist para Nuevo Feature

- [ ] Crear componente con imports correctos
- [ ] Inyectar NotificationService
- [ ] Usar notificaciones en success/error
- [ ] Agregar ConfirmDialogComponent si hay delete
- [ ] Aplicar estilos de styles.scss
- [ ] Hacer responsive (max-width: 768px)
- [ ] Agregar aria-labels y roles ARIA
- [ ] Probar en móvil

---

## 💡 Tips Útiles

### Reutilizar tabla mejorada
```typescript
// Copiar estructura de mascotas.html con:
// - Header con botón crear
// - Tabla con track en *ngFor
// - Modal para formulario
// - Dialog para confirmar delete
// - Loading spinner
```

### Estilos reutilizables
```scss
// Ya definidos en styles.scss:
.page { }                    // Contenedor página
.page-header { }             // Header con título + botón
.btn-primary { }             // Botón primario
.btn-danger { }              // Botón eliminar
.table { }                   // Tabla
.modal-overlay { }           // Modal
.spinner { }                 // Loading
.alert { }                   // Alertas
```

---

## 📞 Soporte Rápido

**¿Por qué no veo las notificaciones?**
- Asegúrate que `<app-notifications></app-notifications>` esté en el layout

**¿Cómo saber si el usuario es admin?**
```typescript
@if (authStore.isAdminRefugio()) { ... }
@if (authStore.isSuperadmin()) { ... }
@if (authStore.isAdoptante()) { ... }
```

**¿Cómo hacer una petición HTTP?**
```typescript
this.http.get('/api/usuarios').subscribe(...)
// El interceptor agrega automáticamente el token
```

---

¡El frontend está listo para crecer! 🚀
