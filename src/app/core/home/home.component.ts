import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

/* ─── Globals loaded via index.html <script> tags ─── */
declare const gsap: any;
declare const ScrollTrigger: any;
declare const Lenis: any;

/* ─── Portfolio animation functions (main.js) ─── */
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  /* ── Private state ────────────────────────────────────────── */
  private lenis: any;
  private lenisTickerFn: ((time: number) => void) | null = null;
  private readonly SPLINE_TIMEOUT_MS = 8000;
  private splineTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initLenis();
      this.waitForSplineThenReveal();
    });
  }

  /* ── 1. Lenis smooth scroll ───────────────────────────────── */
  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync Lenis scroll position → ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Store the ticker fn so we can remove it on destroy
    this.lenisTickerFn = (time: number) => this.lenis.raf(time * 1000);
    gsap.ticker.add(this.lenisTickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  /* ── 2. Wait for Spline, then reveal site ─────────────────── */
  private waitForSplineThenReveal(): void {
    const overlay = document.getElementById('site-loader');
    const splineEl = document.querySelector(
      'spline-viewer',
    ) as HTMLElement | null;

    const revealSite = () => {
      if (this.splineTimeoutId) {
        clearTimeout(this.splineTimeoutId);
        this.splineTimeoutId = null;
      }

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          if (overlay) overlay.style.display = 'none';
          document.body.classList.remove('loading');
        },
      });

      if (splineEl) {
        gsap.to(splineEl, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.2,
        });
      }

      setTimeout(() => this.initAllAnimations(), 400);
    };

    if (splineEl) {
      splineEl.addEventListener('load', revealSite, { once: true });
    }

    this.splineTimeoutId = setTimeout(revealSite, this.SPLINE_TIMEOUT_MS);
  }

  /* ── 3. Fire all GSAP animations after loader fades ──────── */
  private initAllAnimations(): void {
    ScrollTrigger.refresh();
    text();
    timer();
    heroheading();
    parallax();
    sward();
    about();
    title();
    what();
    about_text();
    careerLine();
    cardsAnimation();
    horizontals();
    gradientes();
  }

  /* ── 4. Cleanup on route change ───────────────────────────── */
  ngOnDestroy(): void {
    if (this.splineTimeoutId) clearTimeout(this.splineTimeoutId);

    if (this.lenis) this.lenis.destroy();

    // Remove the exact same fn reference we added — safe remove
    if (this.lenisTickerFn) {
      gsap.ticker.remove(this.lenisTickerFn);
      this.lenisTickerFn = null;
    }

    ScrollTrigger.getAll().forEach((t: any) => t.kill());
  }
}
