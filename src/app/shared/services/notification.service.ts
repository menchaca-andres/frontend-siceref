import { Injectable, signal } from '@angular/core'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([])
  private notificationId = 0

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration)
  }

  error(message: string, duration = 6000): void {
    this.show(message, 'error', duration)
  }

  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration)
  }

  info(message: string, duration = 4000): void {
    this.show(message, 'info', duration)
  }

  private show(message: string, type: Notification['type'], duration: number): void {
    const id = `notification-${++this.notificationId}`
    const notification: Notification = { id, message, type, duration }

    this.notifications.update(notif => [...notif, notification])

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }
  }

  remove(id: string): void {
    this.notifications.update(notif => notif.filter(n => n.id !== id))
  }

  clear(): void {
    this.notifications.set([])
  }
}
