import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './app-breadcrumb.component.html',
  styleUrl: './app-breadcrumb.component.scss'
})
export class AppBreadcrumbComponent {
  @Input() items: Array<{ label: string; path?: string }> = [];
}
