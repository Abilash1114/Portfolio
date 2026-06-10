import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => this.initAnimations(), 100);
  }

  private initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    // Single ScrollTrigger on the section — all animations fire together
    // when the top of the skills section hits 70% down from the top of the viewport
    const trigger = {
      trigger: '.know',
      start: 'top 70%',
      once: true,
    };

    // ── Title
    gsap.from('.know .section-eyebrow', {
      scrollTrigger: trigger,
      opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
    });
    gsap.from('.know .main_title h6', {
      scrollTrigger: trigger,
      opacity: 0, y: 28, duration: 0.65, ease: 'power3.out', delay: 0.12,
    });

    // ── Stats
    gsap.from('.know .sk-stat', {
      scrollTrigger: trigger,
      opacity: 0, y: 36, stagger: 0.1, duration: 0.55, ease: 'power3.out', delay: 0.2,
    });

    // ── Stat counters
    document.querySelectorAll<HTMLElement>('.sk-stat__num').forEach((el) => {
      const raw = el.textContent?.trim() ?? '';
      const hasSuffix = raw.includes('+');
      const target = parseInt(raw);
      if (isNaN(target)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        scrollTrigger: trigger,
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.3,
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + (hasSuffix ? '+' : '');
        },
      });
    });

    // ── Skill cards — clip-path reveal (contained within each card, no grid bleed)
    gsap.fromTo(
      '.know .sk-card',
      { opacity: 0, clipPath: 'inset(28px 0px 0px 0px round 18px)' },
      {
        scrollTrigger: trigger,
        opacity: 1,
        clipPath: 'inset(0px 0px 0px 0px round 18px)',
        stagger: 0.09,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.35,
        clearProps: 'clipPath',
      }
    );

    // ── Tool icons — pop in after cards settle
    gsap.from('.know .sk-tool', {
      scrollTrigger: trigger,
      opacity: 0, scale: 0.35, stagger: 0.018, duration: 0.38,
      ease: 'back.out(2.2)', delay: 0.85,
    });

    // ── Marquee
    gsap.from('.know .sk-marquee', {
      scrollTrigger: trigger,
      opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', delay: 1.1,
    });
  }
}
