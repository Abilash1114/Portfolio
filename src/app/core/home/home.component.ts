import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  /* ───────────────────────────────────────────── */
  /* Private State                                */
  /* ───────────────────────────────────────────── */

  private lenis: any;

  private lenisTickerFn: ((time: number) => void) | null = null;

  private readonly SPLINE_TIMEOUT_MS = 8000;

  private splineTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private ngZone: NgZone) {}

  /* ───────────────────────────────────────────── */
  /* Angular Lifecycle                            */
  /* ───────────────────────────────────────────── */

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // this.initLenis();
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

  /* ───────────────────────────────────────────── */
  /* Reactive Form                                */
  /* ───────────────────────────────────────────── */

  contactform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    ]),

    requirement: new FormControl('', [Validators.required]),

    comment: new FormControl('', [Validators.required]),
  });

  /* ───────────────────────────────────────────── */
  /* Submit Form                                  */
  /* ───────────────────────────────────────────── */

  submitform(): void {
    if (this.contactform.valid) {
      const formvalue = this.contactform.value;

      const companyemail = 'abilashravi09@gmail.com';

      const subject = 'Contact Form Message';

      const body = `
Name: ${formvalue.name}

Mobile: ${formvalue.mobile}

Email: ${formvalue.email}

Requirement: ${formvalue.requirement}

Comment:
${formvalue.comment}
      `;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
        companyemail,
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, '_blank');

      this.contactform.reset();
    } else {
      this.contactform.markAllAsTouched();
    }
  }

  /* ───────────────────────────────────────────── */
  /* Lenis Smooth Scroll                          */
  /* ───────────────────────────────────────────── */

  // private initLenis(): void {
  //   this.lenis = new Lenis({
  //     lerp: 0.08,
  //     smoothWheel: true,
  //     smoothTouch: false,
  //     wheelMultiplier: 1,
  //     touchMultiplier: 1.5,
  //     infinite: false,
  //   });

  //   this.lenis.on('scroll', ScrollTrigger.update);

  //   this.lenisTickerFn = (time: number) => {
  //     this.lenis.raf(time * 1000);
  //   };

  //   gsap.ticker.add(this.lenisTickerFn);

  //   gsap.ticker.lagSmoothing(0);
  // }

  /* ───────────────────────────────────────────── */
  /* Wait for Spline                              */
  /* ───────────────────────────────────────────── */

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
          if (overlay) {
            overlay.style.display = 'none';
          }

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
      splineEl.addEventListener('load', revealSite, {
        once: true,
      });
    }

    this.splineTimeoutId = setTimeout(revealSite, this.SPLINE_TIMEOUT_MS);
  }

  /* ───────────────────────────────────────────── */
  /* Initialize Animations                        */
  /* ───────────────────────────────────────────── */

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
}
