import { animate, style, transition, trigger } from '@angular/animations';

export const routeAnimations = trigger('routeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
