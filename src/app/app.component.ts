import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
constructor(private router: Router) {
  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
}
}
