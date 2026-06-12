import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { AboutComponent } from '../components/about/about.component';
import { CareerComponent } from '../components/career/career.component';
import { ContactComponent } from '../components/contact/contact.component';
import { HeroComponent } from '../components/hero/hero.component';
import { SkillsComponent } from '../components/skills/skills.component';
import { WorksComponent } from '../components/works/works.component';

declare const gsap: any;
declare const ScrollTrigger: any;

declare function text(): void;
declare function timer(): void;
declare function heroheading(): void;
declare function parallax(): void;
declare function sward(): void;
declare function about(): void;
declare function title(): void;
declare function what(): void;
declare function careerLine(): void;
declare function cardsAnimation(): void;
declare function about_text(): void;
declare function horizontals(): void;
declare function gradientes(): void;
declare function toolsSlider(): void;
declare function skillsFilter(): void;
declare function stickyNav(): void;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    CareerComponent,
    WorksComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly FALLBACK_MS = 12000;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;
  private progressValue = 0;
  private revealed = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Scroll to top on every refresh
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.startLoader());
    });
  }

  ngOnDestroy(): void {
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    }
  }

  // ─────────────────────────────────────────────
  //  LOADER LOGIC
  // ─────────────────────────────────────────────

  private startLoader(): void {
    const loader = document.getElementById('site-loader');
    if (!loader) {
      // No loader in HTML — skip straight to animations
      setTimeout(() => this.initAllAnimations(), 100);
      return;
    }

    document.body.classList.add('sl-loading');

    // Track real asset loading
    this.trackRealProgress();

    // Hard fallback — reveal after 12s no matter what
    this.fallbackTimer = setTimeout(
      () => this.revealSite(100),
      this.FALLBACK_MS,
    );
  }

  private trackRealProgress(): void {
    const images = Array.from(document.images);
    const total = Math.max(images.length, 1);
    let loaded = 0;

    const onAssetLoad = () => {
      loaded++;
      // Images count for 70% of progress; last 30% reserved for scripts/spline
      const imgProgress = (loaded / total) * 70;
      this.updateLoaderUI(imgProgress);
    };

    if (images.length === 0) {
      // No images — jump to 70% and wait for window.load
      this.animateTo(70, 1200);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          onAssetLoad();
        } else {
          img.addEventListener('load', onAssetLoad, { once: true });
          img.addEventListener('error', onAssetLoad, { once: true });
        }
      });
    }

    // window 'load' = all scripts + images + fonts done → drive to 100%
    window.addEventListener(
      'load',
      () => {
        this.animateTo(100, 600, () => {
          setTimeout(() => this.revealSite(100), 400);
        });
      },
      { once: true },
    );

    // Spline viewer (if present) — wait for it before revealing
    const splineEl = document.querySelector(
      'spline-viewer',
    ) as HTMLElement | null;
    if (splineEl) {
      const alreadyLoaded =
        (splineEl as any).loaded === true ||
        splineEl.shadowRoot?.querySelector('canvas') !== null;

      if (!alreadyLoaded) {
        splineEl.addEventListener('load', () => this.revealSite(100), {
          once: true,
        });
      }
    }
  }

  // Smooth animate progress from current value to target
  private animateTo(
    target: number,
    durationMs: number,
    onDone?: () => void,
  ): void {
    const start = this.progressValue;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - startTime) / durationMs, 1);
      const val = start + (target - start) * t;
      this.updateLoaderUI(val);
      if (t < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.progressValue = target;
        if (onDone) onDone();
      }
    };

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(step);
  }

  private updateLoaderUI(rawPct: number): void {
    const pct = Math.min(100, Math.max(0, Math.round(rawPct)));
    this.progressValue = pct;

    const fillEl = document.getElementById('slFill');
    const pctEl = document.getElementById('slPct');
    const statusEl = document.getElementById('slStatus');
    const blocks = document.querySelectorAll<HTMLElement>('.sl-block');

    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = String(pct);

    // Light up blocks proportionally
    blocks.forEach((b, i) => {
      const threshold = (i / blocks.length) * 100;
      b.classList.toggle('sl-on', pct > threshold);
    });

    // Status messages
    if (statusEl) {
      const msg =
        pct >= 100
          ? 'Ready!'
          : pct >= 90
            ? 'Almost there…'
            : pct >= 70
              ? 'Rendering UI…'
              : pct >= 45
                ? 'Mounting components…'
                : pct >= 20
                  ? 'Fetching assets…'
                  : 'Loading scripts…';
      statusEl.textContent = msg;
    }
  }

  private revealSite(finalPct: number): void {
    if (this.revealed) return;
    this.revealed = true;

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    this.animateTo(100, 400, () => {
      const loader = document.getElementById('site-loader');
      if (!loader) {
        this.afterReveal();
        return;
      }

      loader.classList.add('sl-complete');

      setTimeout(() => {
        loader.classList.add('sl-hidden');
        document.body.classList.remove('sl-loading');
        setTimeout(() => {
          loader.style.display = 'none';
          this.afterReveal();
        }, 900);
      }, 600);
    });
  }

  private afterReveal(): void {
    requestAnimationFrame(() => {
      setTimeout(() => this.initAllAnimations(), 200);
    });
  }

  // ─────────────────────────────────────────────
  //  ANIMATIONS
  // ─────────────────────────────────────────────

  private initAllAnimations(): void {
    const run = (fn: unknown, name: string) => {
      if (typeof fn === 'function') {
        try {
          (fn as () => void)();
        } catch (e) {
          console.error(`[HomeComponent] ${name}:`, e);
        }
      } else {
        console.warn(
          `[HomeComponent] "${name}" not found — check index.html <script> tags.`,
        );
      }
    };

    run(typeof text !== 'undefined' ? text : undefined, 'text');
    run(typeof timer !== 'undefined' ? timer : undefined, 'timer');
    run(
      typeof heroheading !== 'undefined' ? heroheading : undefined,
      'heroheading',
    );
    run(typeof parallax !== 'undefined' ? parallax : undefined, 'parallax');
    run(typeof sward !== 'undefined' ? sward : undefined, 'sward');
    run(typeof about !== 'undefined' ? about : undefined, 'about');
    run(typeof title !== 'undefined' ? title : undefined, 'title');
    run(typeof what !== 'undefined' ? what : undefined, 'what');
    run(
      typeof about_text !== 'undefined' ? about_text : undefined,
      'about_text',
    );
    run(
      typeof careerLine !== 'undefined' ? careerLine : undefined,
      'careerLine',
    );
    run(
      typeof cardsAnimation !== 'undefined' ? cardsAnimation : undefined,
      'cardsAnimation',
    );
    run(
      typeof horizontals !== 'undefined' ? horizontals : undefined,
      'horizontals',
    );
    run(
      typeof gradientes !== 'undefined' ? gradientes : undefined,
      'gradientes',
    );
    run(
      typeof toolsSlider !== 'undefined' ? toolsSlider : undefined,
      'toolsSlider',
    );
    run(
      typeof skillsFilter !== 'undefined' ? skillsFilter : undefined,
      'skillsFilter',
    );
    run(typeof stickyNav !== 'undefined' ? stickyNav : undefined, 'stickyNav');

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
}
