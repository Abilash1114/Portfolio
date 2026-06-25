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

interface GalleryImage {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  href: string;
}

@Component({
  selector: 'app-gallery-3d',
  standalone: true,
  imports: [],
  templateUrl: './gallery-3d.component.html',
  styleUrls: ['./gallery-3d.component.css'],
})
export class Gallery3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('intro', { static: true }) introRef!: ElementRef<HTMLElement>;

  /**
   * 12 case-study images, each linking to its Behance case study. Only 6
   * unique screenshots exist on disk so far — each is used twice. Swap in
   * real files/links here as more case studies are added.
   */
  private readonly IMAGES = [
    {
      path: 'assets/images/zoom/1.png',
      href: 'https://www.figma.com/design/c0YVEqJ32diynIZfJfnNHy/Ev-Booking?node-id=356-2045&t=jknJuln0n4YxIEV7-1',
    },
    {
      path: 'assets/images/zoom/4.png',
      href: 'https://www.figma.com/design/njHD5544N2MBVQEfkM0o7w/SAAS-Project?node-id=3-1344&t=OhgeyGdZaEXYIyRZ-1',
    },

    {
      path: 'assets/images/zoom/3.png',
      href: 'https://www.figma.com/design/q3RcdlBzKYhyPIDAIArIZx/JReport?node-id=0-1&t=DokHTlLI7cf7WoDg-1',
    },
    {
      path: 'assets/images/zoom/8.png',
      href: 'https://theauraeliteevents.com/',
    },

    {
      path: 'assets/images/zoom/5.png',
      href: 'https://www.figma.com/design/9tBZ7gspssItJ6drWOVJub/jcompanion?node-id=0-1&t=OqRFXZp3SI90Z10x-1',
    },
    {
      path: 'assets/images/zoom/6.png',
      href: 'https://www.figma.com/design/njHD5544N2MBVQEfkM0o7w/SAAS-Project?node-id=2-2&t=OhgeyGdZaEXYIyRZ-1',
    },
    {
      path: 'assets/images/zoom/7.png',
      href: 'https://www.figma.com/design/k6z9pSOfE2OPcXlYstzM5y/Payment-Website?node-id=1-7&t=MQeIYWQKR52kvJIl-1',
    },

    {
      path: 'assets/images/zoom/9.png',
      href: 'https://www.behance.net/abilashravi4702',
    },
    {
      path: 'assets/images/zoom/10.png',
      href: 'https://www.behance.net/abilashravi4702',
    },
    {
      path: 'assets/images/zoom/5.png',
      href: 'https://www.figma.com/design/9tBZ7gspssItJ6drWOVJub/jcompanion?node-id=0-1&t=OqRFXZp3SI90Z10x-1',
    },
    {
      path: 'assets/images/zoom/2.png',
      href: 'https://www.behance.net/gallery/168801133/milk-home-delivery',
    },
  ];

  /**
   * Layout is derived directly from the image count instead of an
   * independently-scaled depth span — that previously let the scroll run
   * on past the point where the last image had already faded, leaving a
   * stretch of empty space at the end. Now END_Z is pinned to exactly
   * PEAK_OFFSET + FINISH_BUFFER past the last image's position, so the
   * scroll ends right as (or just after) it's been shown.
   */
  private static readonly IMAGE_SPACING = 10; // depth units between consecutive images
  private static readonly PEAK_OFFSET = 6; // must match the sweet-spot offset used in animate()
  private static readonly FINISH_BUFFER = 2; // small grace period after the last peak
  private static readonly SCROLL_PER_UNIT = 0.045; // viewport-heights of scroll per depth unit

  private readonly START_Z = 24;
  private readonly leadIn = 12; // first image must start beyond the sweet-spot distance
  private readonly firstZ: number;
  private readonly lastZ: number;
  private readonly END_Z: number;
  /** Scroll progress at which the first image reaches its peak/zoomed-in moment. */
  private readonly introFadeRange: number;
  private readonly DIM_COLOR = new THREE.Color(0x2a3a30);
  private readonly BRIGHT_COLOR = new THREE.Color(0xffffff);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private stars: THREE.Points | null = null;
  private images: GalleryImage[] = [];
  private activeImage: GalleryImage | null = null;
  private readonly raycaster = new THREE.Raycaster();
  private clock = new THREE.Clock();
  private rafId = 0;
  private scrollTriggerInstance: any = null;
  private readonly resizeHandler = () => this.onResize();
  private readonly clickHandler = (e: MouseEvent) => this.onCanvasClick(e);

  constructor(private ngZone: NgZone) {
    this.firstZ = this.START_Z - this.leadIn;
    this.lastZ =
      this.firstZ - Gallery3dComponent.IMAGE_SPACING * (this.IMAGES.length - 1);
    // Camera's flight ends just past the last image's peak — not way past it.
    this.END_Z =
      this.lastZ +
      Gallery3dComponent.PEAK_OFFSET +
      Gallery3dComponent.FINISH_BUFFER;

    // The intro overlay should be fully gone by the moment the first image
    // reaches its peak/zoomed-in moment (camera.z = firstZ + PEAK_OFFSET).
    const peakCameraZ = this.firstZ + Gallery3dComponent.PEAK_OFFSET;
    this.introFadeRange =
      (this.START_Z - peakCameraZ) / (this.START_Z - this.END_Z);
  }

  ngAfterViewInit(): void {
    if (typeof THREE === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.buildStarfield();
      this.buildImages();
      this.setupScrollTrigger();
      window.addEventListener('resize', this.resizeHandler);
      this.canvasRef.nativeElement.addEventListener('click', this.clickHandler);
      this.animate();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.canvasRef.nativeElement.removeEventListener(
      'click',
      this.clickHandler,
    );
    cancelAnimationFrame(this.rafId);
    this.scrollTriggerInstance?.kill();

    this.images.forEach((img) => {
      img.mesh.geometry.dispose();
      img.material.map?.dispose();
      img.material.dispose();
    });

    if (this.stars) {
      this.stars.geometry.dispose();
      (this.stars.material as THREE.Material).dispose();
    }

    this.renderer?.dispose();
  }

  // ─────────────────────────────────────────────
  //  SCENE SETUP
  // ─────────────────────────────────────────────

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const host = this.sectionRef.nativeElement;

    this.scene = new THREE.Scene();
    // Matches the site's dark-green base theme color (--color-bg: #010c0a).
    this.scene.background = new THREE.Color(0x041a12);
    this.scene.fog = new THREE.FogExp2(0x041a12, 0.018);

    this.camera = new THREE.PerspectiveCamera(
      55,
      host.clientWidth / host.clientHeight,
      0.1,
      200,
    );
    this.camera.position.set(0, 0, this.START_Z);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(host.clientWidth, host.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }

  private buildStarfield(): void {
    const COUNT = 700;
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x0bdfbb,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  /**
   * Places the 12 case-study images along the flight path in strict depth
   * order — center, right, left, center, right, left, ... looping — so as
   * the camera passes each one in turn, the active image alternates
   * center → right → left rather than landing in a random spot.
   */
  private buildImages(): void {
    const loader = new THREE.TextureLoader();

    // Scale card size and lane offset to the actual viewport shape — on a
    // narrow/mobile aspect ratio the visible frustum is much narrower, so a
    // fixed world-unit width/offset would overflow both edges in every lane
    // and make left/right/center all look the same ("centered").
    const distance = Gallery3dComponent.PEAK_OFFSET;
    const visibleWidth =
      2 *
      distance *
      Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) *
      this.camera.aspect;

    const maxCardWidth = visibleWidth * 0.55;
    const X_OFFSET = Math.min(3.2, visibleWidth * 0.32);
    const LANES = [0, X_OFFSET, -X_OFFSET]; // center, right, left

    this.IMAGES.forEach(({ path, href }, i) => {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: this.DIM_COLOR.clone(),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Fixed spacing per image (small jitter only, so it can't reorder the
      // center/right/left sequence) — X cycles through the 3 lanes.
      const z =
        this.firstZ -
        Gallery3dComponent.IMAGE_SPACING * i +
        (Math.random() - 0.5) * 1.5;
      const x = LANES[i % LANES.length];
      const y = (Math.random() - 0.5) * 1.5;
      mesh.position.set(x, y, z);
      // No tilt — these face the camera flat (billboarded each frame in animate()).

      const baseWidth = Math.min(4.2 + Math.random() * 1.4, maxCardWidth);
      mesh.scale.set(baseWidth, baseWidth / 1.4, 1); // default aspect until the texture loads

      const entry: GalleryImage = { mesh, material, href };
      this.scene.add(mesh);
      this.images.push(entry);

      loader.load(path, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;

        const aspect = texture.image.width / texture.image.height || 1.4;
        mesh.scale.set(baseWidth, baseWidth / aspect, 1);
      });
    });
  }

  // ─────────────────────────────────────────────
  //  SCROLL-DRIVEN CAMERA FLIGHT
  // ─────────────────────────────────────────────

  private setupScrollTrigger(): void {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const section = this.sectionRef.nativeElement;

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () =>
        '+=' +
        Math.round(
          window.innerHeight *
            Gallery3dComponent.SCROLL_PER_UNIT *
            (this.START_Z - this.END_Z),
        ),
      scrub: 1,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onUpdate: (self: { progress: number }) => {
        const p = self.progress;
        // Camera stays dead-center (x=0, y=0) — only depth changes — so the
        // view and the image cluster both stay centered on screen.
        this.camera.position.z = THREE.MathUtils.lerp(
          this.START_Z,
          this.END_Z,
          p,
        );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.lookAt(0, 0, this.camera.position.z - 18);

        // Intro overlay is fully gone by the time the first image hits its
        // peak/zoomed-in moment, handing off cleanly to the image flythrough.
        const introOpacity = 1 - Math.min(p / this.introFadeRange, 1);
        const introEl = this.introRef.nativeElement;
        introEl.style.opacity = String(introOpacity);
        introEl.style.transform = `translateY(${(1 - introOpacity) * -24}px)`;
      },
    });
  }

  // ─────────────────────────────────────────────
  //  RENDER LOOP — idle float + proximity highlight
  // ─────────────────────────────────────────────

  private animate(): void {
    this.rafId = requestAnimationFrame(() => this.animate());

    const t = this.clock.getElapsedTime();

    let nearest: GalleryImage | null = null;
    let nearestScore = Infinity;

    this.images.forEach((img) => {
      // Billboard — always face the camera flat. Position and scale are fixed;
      // only brightness/opacity change as the active (centered) image swaps.
      img.mesh.quaternion.copy(this.camera.quaternion);

      const depthDelta = img.mesh.position.z - this.camera.position.z;
      const score = Math.abs(depthDelta + Gallery3dComponent.PEAK_OFFSET);

      if (depthDelta < 0 && score < nearestScore) {
        nearestScore = score;
        nearest = img;
      }
    });

    this.activeImage = nearest;

    this.images.forEach((img) => {
      const isNearest = img === nearest;

      img.material.color.lerp(
        isNearest ? this.BRIGHT_COLOR : this.DIM_COLOR,
        0.08,
      );
      img.material.opacity +=
        ((isNearest ? 1 : 0.55) - img.material.opacity) * 0.08;
    });

    if (this.stars) {
      this.stars.rotation.y = t * 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const host = this.sectionRef.nativeElement;
    this.camera.aspect = host.clientWidth / host.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(host.clientWidth, host.clientHeight);
  }

  /**
   * Clicking the currently centered case study opens its Behance link.
   * Raycasts against the meshes first (precise hit); falls back to the
   * tracked "active" image so a near-miss click still works.
   */
  private onCanvasClick(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );

    this.raycaster.setFromCamera(pointer, this.camera);
    const hit = this.raycaster.intersectObjects(
      this.images.map((img) => img.mesh),
    )[0];

    const target = hit
      ? this.images.find((img) => img.mesh === hit.object)
      : this.activeImage;

    if (target) {
      window.open(target.href, '_blank', 'noopener');
    }
  }
}
