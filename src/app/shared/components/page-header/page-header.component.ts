import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title = 'Sentinel AI';
  @Input() subtitle = 'Secure orchestration, built for modern operations teams.';
  @Input() icon = 'shield';
}
