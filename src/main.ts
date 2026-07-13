import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Without this, the browser's own scroll-position restoration can apply
// AFTER HomeComponent's window.scrollTo({top:0}) has already run on a hard
// refresh, causing a visible post-load jump away from the top.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
