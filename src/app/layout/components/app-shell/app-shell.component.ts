import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeAnimations } from '../../../shared/animations/route-animations';
import { NAV_ITEMS } from '../../../core/constants/navigation';
import { ThemeService } from '../../../core/services/theme.service';
import { AppBreadcrumbComponent } from '../app-breadcrumb/app-breadcrumb.component';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { AppToolbarComponent } from '../app-toolbar/app-toolbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    AppSidebarComponent,
    AppToolbarComponent,
    AppBreadcrumbComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  animations: [routeAnimations]
})
export class AppShellComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  protected readonly navItems = NAV_ITEMS;
  protected readonly isDarkMode = this.themeService.isDarkMode;
  protected readonly isMenuOpen = signal(false);
  protected readonly isMobile = signal(window.innerWidth < 900);
  protected readonly currentUrl = signal(this.router.url);

  protected readonly currentYear = computed(() => new Date().getFullYear());
  protected readonly breadcrumbs = computed(() => this.getBreadcrumbs(this.currentUrl()));

  ngOnInit(): void {
    window.addEventListener('resize', () => this.isMobile.set(window.innerWidth < 900));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  private getBreadcrumbs(path: string): Array<{ label: string }> {
    const segments = path.split('/').filter(Boolean);
    if (!segments.length) {
      return [{ label: 'Home' }, { label: 'Dashboard' }];
    }

    return [{ label: 'Home' }, ...segments.map(segment => ({ label: segment.replace(/-/g, ' ') }))];
  }
}
