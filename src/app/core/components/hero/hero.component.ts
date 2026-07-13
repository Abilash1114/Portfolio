import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorService } from '../../../services/visitor.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent {
  constructor(private visitorService: VisitorService) {}

  /** Logs a click on a nav link/CTA as a distinct event in the tracking sheet. */
  trackClick(label: string): void {
    this.visitorService.track(label);
  }
}
