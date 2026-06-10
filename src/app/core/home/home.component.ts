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

/* ─── Globals loaded via index.html <script> tags ─── */
declare const gsap: any;
declare const ScrollTrigger: any;
declare const Lenis: any;

/* ─── Portfolio animation functions ─── */
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
      this.waitForSplineThenReveal();
    });
  }

  ngOnDestroy(): void {
    if (this.splineTimeoutId) {
      clearTimeout(this.splineTimeoutId);
    }
    if (this.lenis) {
      this.lenis.destroy();
    }
    if (this.lenisTickerFn) {
      gsap.ticker.remove(this.lenisTickerFn);
      this.lenisTickerFn = null;
    }
    ScrollTrigger.getAll().forEach((t: any) => t.kill());
  }

  private waitForSplineThenReveal(): void {
    const overlay = document.getElementById('site-loader');
    const splineEl = document.querySelector(
      'spline-viewer',
    ) as HTMLElement | null;

    // If loader HTML is commented out, skip straight to animations
    if (!overlay) {
      setTimeout(() => {
        this.initAllAnimations();
      }, 400);
      return;
    }

    document.body.classList.add('loading');

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
          overlay.style.display = 'none';
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

      setTimeout(() => {
        this.initAllAnimations();
      }, 400);
    };

    if (splineEl) {
      splineEl.addEventListener('load', revealSite, { once: true });
    }

    this.splineTimeoutId = setTimeout(revealSite, this.SPLINE_TIMEOUT_MS);
  }

  private initAllAnimations(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    this.lenisTickerFn = (time: number) => {
      this.lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(this.lenisTickerFn);
    gsap.ticker.lagSmoothing(0);

    // Run all animations first so every ScrollTrigger is registered,
    // then refresh so pin positions are calculated correctly
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
    toolsSlider();
    skillsFilter();
    stickyNav();
    ScrollTrigger.refresh();
  }
}
