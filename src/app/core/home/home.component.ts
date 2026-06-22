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
import { Gallery3dComponent } from '../components/gallery-3d/gallery-3d.component';
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
declare function about_text(): void;
declare function horizontals(): void;
declare function gradientes(): void;
declare function toolsSlider(): void;
declare function skillsFilter(): void;
declare function projectCardsReveal(): void;
declare function socialAsideVisibility(): void;

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
    Gallery3dComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly FALLBACK_MS = 12000;
  private fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  private clockInterval: ReturnType<typeof setInterval> | null = null;
  private rafId: number | null = null;
  private progressValue = 0; // currently displayed (animated) percent
  private targetValue = 0; // percent we're animating toward
  private realLoadDone = false; // true once every image + the window 'load' event has fired
  private revealed = false;
  private readonly preventScroll = (e: Event) => e.preventDefault();

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
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.unlockScroll();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    }
  }

  // ─────────────────────────────────────────────
  //  LOADER
  // ─────────────────────────────────────────────

  private startLoader(): void {
    const loader = document.getElementById('site-loader');
    if (!loader) {
      requestAnimationFrame(() => this.initAllAnimations());
      return;
    }

    document.body.classList.add('loading');
    this.lockScroll();

    this.startClock();
    this.trackRealProgress();
    this.runProgressLoop();

    // Hard fallback — reveal after 12s no matter what
    this.fallbackTimer = setTimeout(() => this.revealSite(), this.FALLBACK_MS);
  }

  /** Belt-and-suspenders scroll lock — body.loading handles most browsers,
   *  this blocks wheel/touch directly in case overflow:hidden isn't enough. */
  private lockScroll(): void {
    window.addEventListener('wheel', this.preventScroll, { passive: false });
    window.addEventListener('touchmove', this.preventScroll, {
      passive: false,
    });
  }

  private unlockScroll(): void {
    window.removeEventListener('wheel', this.preventScroll);
    window.removeEventListener('touchmove', this.preventScroll);
  }

  private startClock(): void {
    const timeEl = document.getElementById('ldrTime');
    if (!timeEl) return;

    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const hour12 = now.getHours() % 12 || 12;
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const mm12 = String(now.getMinutes()).padStart(2, '0');
      timeEl.textContent = `Local time: ${hh}:${mm}:${ss} (${hour12}:${mm12} ${ampm})`;
    };

    update();
    this.clockInterval = setInterval(update, 1000);
  }

  /**
   * Tracks real asset loading (images + the window 'load' event, which only
   * fires once every script — jquery/gsap/ScrollTrigger/main.js/etc — has
   * also finished). This only sets the *target* the visual counter animates
   * toward (see runProgressLoop) — it never jumps the displayed number directly,
   * which is what caused the old "snap to 90, stall, snap to 100" feel.
   */
  private trackRealProgress(): void {
    const images = Array.from(document.images);
    const total = Math.max(images.length, 1);
    let loaded = 0;

    const onAssetLoad = () => {
      loaded++;
      // Images only ever drive the target up to 92% — the final stretch to
      // 100 is reserved for confirmation that the whole page (incl. scripts)
      // has truly finished loading via the window 'load' event below.
      this.targetValue = Math.max(this.targetValue, (loaded / total) * 92);
    };

    if (images.length === 0) {
      this.targetValue = Math.max(this.targetValue, 92);
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

    window.addEventListener(
      'load',
      () => {
        this.realLoadDone = true;
        this.targetValue = 100;
      },
      { once: true },
    );
  }

  /** Smoothly animates the displayed percent toward targetValue every frame,
   *  so it's a continuous 0→100 ramp no matter how the real progress arrives. */
  private runProgressLoop(): void {
    const step = () => {
      // Ease toward the target — fast enough to feel responsive, slow enough
      // to never look like an instant jump even when the target itself jumps.
      this.progressValue += (this.targetValue - this.progressValue) * 0.08;

      const displayPct = this.realLoadDone
        ? Math.max(this.progressValue, 99.5)
        : this.progressValue;

      this.renderLoaderUI(displayPct);

      if (this.realLoadDone && this.progressValue >= 99.5) {
        this.renderLoaderUI(100);
        this.revealSite();
        return;
      }

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  }

  private renderLoaderUI(rawPct: number): void {
    const pct = Math.min(100, Math.max(0, Math.round(rawPct)));

    const pctEl = document.getElementById('ldrPercent');
    if (pctEl) pctEl.textContent = String(pct).padStart(2, '0');

    const ringEl = document.getElementById('ldrRingProgress');
    if (ringEl) {
      ringEl.setAttribute('stroke-dashoffset', String(100 - pct));
    }
  }

  private revealSite(): void {
    if (this.revealed) return;
    this.revealed = true;

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.unlockScroll();
    document.body.classList.remove('loading');

    const loader = document.getElementById('site-loader');
    if (!loader) {
      this.initAllAnimations();
      return;
    }

    loader.classList.add('sl-hidden');
    setTimeout(() => {
      loader.style.display = 'none';
      this.initAllAnimations();
    }, 700);
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
    run(
      typeof projectCardsReveal !== 'undefined' ? projectCardsReveal : undefined,
      'projectCardsReveal',
    );
    run(
      typeof socialAsideVisibility !== 'undefined'
        ? socialAsideVisibility
        : undefined,
      'socialAsideVisibility',
    );

    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
}
