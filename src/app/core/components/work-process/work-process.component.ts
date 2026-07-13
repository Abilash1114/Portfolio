import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

declare const gsap: any;
declare const ScrollTrigger: any;

interface ProcessStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-work-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-process.component.html',
  styleUrls: ['./work-process.component.css'],
})
export class WorkProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeline', { static: true }) timelineRef!: ElementRef<HTMLElement>;

  readonly steps: ProcessStep[] = [
    {
      number: '01',
      icon: 'ri-search-line',
      title: 'Discover',
      description: 'Understanding business goals, user needs, and project requirements.',
    },
    {
      number: '02',
      icon: 'ri-bar-chart-2-line',
      title: 'Research',
      description:
        'Analyzing competitors, user behavior, and market trends to create the right strategy.',
    },
    {
      number: '03',
      icon: 'ri-pencil-line',
      title: 'Design',
      description:
        'Creating wireframes, high-fidelity UI designs, design systems and visual solutions.',
    },
    {
      number: '04',
      icon: 'ri-box-3-line',
      title: 'Prototype',
      description:
        'Building interactive prototypes to test user flows, validate ideas and gather feedback.',
    },
    {
      number: '05',
      icon: 'ri-code-s-slash-line',
      title: 'Develop',
      description:
        'Converting designs into clean, responsive code using Angular, HTML, CSS, JavaScript and more.',
    },
    {
      number: '06',
      icon: 'ri-rocket-line',
      title: 'Test & Improve',
      description: 'Testing for performance, fixing issues and continuously improving based on feedback.',
    },
  ];

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private stars: THREE.Points | null = null;
  private shapes: THREE.LineSegments[] = [];
  private clock = new THREE.Clock();
  private rafId = 0;
  private scrollTriggerInstances: any[] = [];
  private intersectionObserver?: IntersectionObserver;
  private isIntersecting = true;
  private readonly resizeHandler = () => this.onResize();

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof THREE === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.buildStarfield();
      this.buildFloatingShapes();
      window.addEventListener('resize', this.resizeHandler);
      this.setupVisibilityGate();
      this.animate();
    });

    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.intersectionObserver?.disconnect();
    cancelAnimationFrame(this.rafId);
    this.scrollTriggerInstances.forEach((t) => t?.kill());

    this.shapes.forEach((shape) => {
      shape.geometry.dispose();
      (shape.material as THREE.Material).dispose();
    });

    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }

    this.renderer?.dispose();
  }

  // ─────────────────────────────────────────────
  //  THREE.JS — ambient decorative background
  // ─────────────────────────────────────────────

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const host = this.sectionRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 20);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(host.clientWidth, host.clientHeight);
  }

  /** Same particle-field technique as gallery-3d.component.ts's buildStarfield(). */
  private buildStarfield(): void {
    const COUNT = 250;
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x0bdfbb,
      size: 0.07,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  /** Scattered slowly-rotating wireframe polyhedra — the "floating geometry" look. */
  private buildFloatingShapes(): void {
    const geometries: THREE.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.TetrahedronGeometry(1.8, 0),
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.IcosahedronGeometry(1.4, 0),
    ];

    const positions: Array<[number, number, number]> = [
      [-13, 6, -6],
      [13, -5, -8],
      [-11, -7, -4],
      [12, 7, -5],
    ];

    geometries.forEach((geometry, i) => {
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({
        color: 0x0bdfbb,
        transparent: true,
        opacity: 0.18,
      });
      const shape = new THREE.LineSegments(edges, material);
      shape.position.set(...positions[i]);
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.shapes.push(shape);
      this.scene.add(shape);
      geometry.dispose(); // only EdgesGeometry is kept/rendered; the source geometry isn't needed after extraction
    });
  }

  private animate(): void {
    if (!this.isIntersecting) return; // IntersectionObserver restarts this loop when back in view.

    this.rafId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    this.shapes.forEach((shape, i) => {
      shape.rotation.x += delta * 0.04 * (i % 2 === 0 ? 1 : -1);
      shape.rotation.y += delta * 0.06;
    });

    if (this.stars) {
      this.stars.rotation.y += delta * 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const host = this.sectionRef.nativeElement;
    this.camera.aspect = host.clientWidth / host.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(host.clientWidth, host.clientHeight);
  }

  /** Pauses the render loop while the section is scrolled off-screen. */
  private setupVisibilityGate(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = this.isIntersecting;
        this.isIntersecting = entry.isIntersecting;

        if (this.isIntersecting && !wasIntersecting) {
          this.animate();
        }
      },
      { threshold: 0 },
    );
    this.intersectionObserver.observe(this.sectionRef.nativeElement);
  }

  // ─────────────────────────────────────────────
  //  GSAP — scroll-drawn line + per-row reveal
  // ─────────────────────────────────────────────

  private setupScrollAnimations(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const timeline = this.timelineRef.nativeElement;

    gsap.utils.toArray('.wp-row', timeline).forEach((row: Element) => {
      const tween = gsap.fromTo(
        row,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      this.scrollTriggerInstances.push(tween.scrollTrigger);
    });
  }
}
