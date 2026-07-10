import { Injectable, computed, signal } from '@angular/core';
import { AppNotification, NotificationType } from '../models/notification.model';

const AUTO_DISMISS_MS = 6000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<AppNotification[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(
    () => this.notificationsSignal().filter(notification => !notification.read).length
  );

  notify(type: NotificationType, title: string, message: string): string {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notificationsSignal.update(notifications => [notification, ...notifications]);

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.dismiss(notification.id), AUTO_DISMISS_MS);
    }

    return notification.id;
  }

  success(title: string, message: string): string {
    return this.notify('success', title, message);
  }

  error(title: string, message: string): string {
    return this.notify('error', title, message);
  }

  warning(title: string, message: string): string {
    return this.notify('warning', title, message);
  }

  info(title: string, message: string): string {
    return this.notify('info', title, message);
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update(notifications =>
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(notifications =>
      notifications.map(notification => ({ ...notification, read: true }))
    );
  }

  dismiss(id: string): void {
    this.notificationsSignal.update(notifications =>
      notifications.filter(notification => notification.id !== id)
    );
  }

  clearAll(): void {
    this.notificationsSignal.set([]);
  }
}
