import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

declare function text(): any;
declare function timer(): any;
declare function heroheading(): any;
declare function parallax(): any;
declare function sward(): any;
declare function about(): any;
declare function title(): any;
declare function what(): any;
declare function careerLine(): any;
declare function cardsAnimation(): any;
declare function about_text(): any;
declare function horizontals(): any;
declare function swipe(): any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Add this line
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild('sliderContainer', { static: true }) sliderContainer!: ElementRef;

  // Configuration - Mixed content (GIFs and videos)
  // private mediaItems = [  
  //   { type: 'image', url: 'assets/images/1.png' },
  //   { type: 'image', url: 'assets/images/2.png' },
  //   { type: 'image', url: 'assets/images/3.png' },
  //   { type: 'image', url: 'assets/images/4.png' },
  //   { type: 'image', url: 'assets/images/5.png' },
  //   { type: 'image', url: 'assets/images/6.png' },
  //   { type: 'image', url: 'assets/images/7.png' },
  //   { type: 'image', url: 'assets/images/8.png' },
  //   { type: 'image', url: 'assets/images/9.png' },
  //   { type: 'image', url: 'assets/images/10.png' },
  //   { type: 'image', url: 'assets/images/11.png' },
  //   { type: 'image', url: 'assets/images/12.png' },
  // ];

  // Three.js variables
  // private scene!: THREE.Scene;
  // private renderer!: THREE.WebGLRenderer;
  // private camera!: THREE.PerspectiveCamera;
  // private planes: THREE.Mesh[] = [];

  // Animation variables
  // private time = 0;
  // private currentImageIndex = 0;
  // private animationId!: number;

  // Made public for template access

  // Configuration options - made public for template access
  // config = {
  //   speed: 30,
  //   gap: 10,
  //   curve: 8,
  //   direction: -1,
  // };

  // // UI state - made public for template access
  // currentImage = 1;
  // totalImages = this.mediaItems.length;
  // isAnimating = true;
  // containerVisible = true;

  constructor() {}

  ngOnInit(): void {
    // this.totalImages = this.mediaItems.length;
    // setTimeout(() => {
    //   this.containerVisible=false;
    // }, 6000);
  }

  ngAfterViewInit(): void {
    text();
    timer();
    heroheading();
    parallax();
    sward();
    about();
    title();
    what();
    careerLine();
    cardsAnimation()
    about_text();
    horizontals();
    swipe();
    // this.initThreeJS();
    // this.animate(0);
  }

  ngOnDestroy(): void {
    // if (this.animationId) {
    //   cancelAnimationFrame(this.animationId);
    // }

    // if (this.renderer) {
    //   this.renderer.dispose();
    // }
  }

  // private initThreeJS(): void {
  //   const container = this.sliderContainer.nativeElement;

  //   // Set up the scene
  //   this.scene = new THREE.Scene();

  //   // Set up the camera
  //   const aspectRatio = container.clientWidth / container.clientHeight;
  //   this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 20);
  //   this.camera.position.z = 2;

  //   // Set up the renderer
  //   this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  //   this.renderer.setSize(container.clientWidth, container.clientHeight);
  //   this.renderer.setPixelRatio(window.devicePixelRatio);

  //   // Clear any existing canvas and add the new one
  //   const existingCanvas = container.querySelector('canvas');
  //   if (existingCanvas) {
  //     container.removeChild(existingCanvas);
  //   }
  //   container.appendChild(this.renderer.domElement);

  //   // Create media planes
  //   this.createMediaPlanes();

  //   // Add window resize listener
  //   window.addEventListener('resize', this.onWindowResize.bind(this));
  // }

  // private createMediaPlanes(): void {
  //   // Clear existing planes
  //   this.planes.forEach((plane) => this.scene.remove(plane));
  //   this.planes = [];

  //   const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  //   // Calculate plane spacing
  //   const planeWidth = this.getPlaneWidth();
  //   const planeSpacing = planeWidth * this.getWidth(this.config.gap);

  //   // Create enough planes to fill the screen with some extras
  //   const visiblePlanes = Math.ceil(window.innerWidth / planeSpacing) + 2;

  //   this.mediaItems.slice(0, visiblePlanes).forEach((media, i) => {
  //     if (media.type === 'video') {
  //       this.createVideoPlane(geometry, media, i);
  //     } else {
  //       this.createImagePlane(geometry, media, i);
  //     }
  //   });
  // }

  // private createImagePlane(
  //   geometry: THREE.PlaneGeometry,
  //   media: any,
  //   index: number
  // ): void {
  //   const textureLoader = new THREE.TextureLoader();

  //   textureLoader.load(media.url, (texture: any) => {
  //     const material = new THREE.ShaderMaterial({
  //       uniforms: {
  //         tex: { value: texture },
  //         curve: { value: this.config.curve },
  //       },
  //       vertexShader: `
  //         uniform float curve;
  //         varying vec2 vertexUV;
  //         void main() {
  //           vertexUV = uv;
  //           vec3 newPosition = position;
  //           float distanceFromCenter = abs(modelMatrix * vec4(position, 1.0)).x;
  //           newPosition.y *= 1.0 + (curve/100.0) * pow(distanceFromCenter, 2.0);
  //           gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  //         }
  //       `,
  //       fragmentShader: `
  //         uniform sampler2D tex;
  //         varying vec2 vertexUV;
  //         void main() {
  //           gl_FragColor = texture2D(tex, vertexUV);
  //         }
  //       `,
  //     });

  //     const plane = new THREE.Mesh(geometry, material);
  //     plane.position.x =
  //       -this.config.direction * index * this.getWidth(this.config.gap);
  //     this.scene.add(plane);
  //     this.planes.push(plane);
  //   });
  // }

  // private createVideoPlane(
  //   geometry: THREE.PlaneGeometry,
  //   media: any,
  //   index: number
  // ): void {
  //   // Create video element
  //   const video = document.createElement('video');
  //   video.src = media.url;
  //   video.preload = 'auto';
  //   video.loop = true;
  //   video.muted = true;
  //   video.playsInline = true;

  //   // Set poster if available
  //   if (media.poster) {
  //     video.poster = media.poster;
  //   }

  //   // Create video texture
  //   const videoTexture = new THREE.VideoTexture(video);
  //   videoTexture.minFilter = THREE.LinearFilter;
  //   videoTexture.magFilter = THREE.LinearFilter;
  //   videoTexture.format = THREE.RGBFormat;

  //   const material = new THREE.ShaderMaterial({
  //     uniforms: {
  //       tex: { value: videoTexture },
  //       curve: { value: this.config.curve },
  //     },
  //     vertexShader: `
  //       uniform float curve;
  //       varying vec2 vertexUV;
  //       void main() {
  //         vertexUV = uv;
  //         vec3 newPosition = position;
  //         float distanceFromCenter = abs(modelMatrix * vec4(position, 1.0)).x;
  //         newPosition.y *= 1.0 + (curve/100.0) * pow(distanceFromCenter, 2.0);
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  //       }
  //     `,
  //     fragmentShader: `
  //       uniform sampler2D tex;
  //       varying vec2 vertexUV;
  //       void main() {
  //         gl_FragColor = texture2D(tex, vertexUV);
  //       }
  //     `,
  //   });

  //   const plane = new THREE.Mesh(geometry, material);
  //   plane.position.x =
  //     -this.config.direction * index * this.getWidth(this.config.gap);
  //   this.scene.add(plane);
  //   this.planes.push(plane);

  //   video.addEventListener('loadeddata', () => {
  //     video.play().catch((e) => console.log('Video play failed:', e));
  //   });

  //   video.load();
  // }

  // private getPlaneWidth(): number {
  //   const vFov = (this.camera.fov * Math.PI) / 180;
  //   const height = 2 * Math.tan(vFov / 2) * this.camera.position.z;
  //   const aspect = window.innerWidth / window.innerHeight;
  //   const width = height * aspect;
  //   return window.innerWidth / width;
  // }

  // private getWidth(gap: number): number {
  //   return 1 + gap / 100;
  // }

  // private animate(timestamp: number): void {
  //   if (this.isAnimating) {
  //     this.time += this.config.direction * this.config.speed * 0.0005;
  //     this.scene.position.x = this.time;

  //     if (
  //       Math.abs(this.scene.position.x) >=
  //       this.getWidth(this.config.gap) * this.mediaItems.length
  //     ) {
  //       this.time = 0;
  //       this.currentImageIndex =
  //         (this.currentImageIndex + 1) % this.mediaItems.length;
  //       this.currentImage = this.currentImageIndex + 1;
  //     }
  //   }

  //   this.renderer.render(this.scene, this.camera);
  //   this.animationId = requestAnimationFrame(this.animate.bind(this));
  // }

  // private onWindowResize(): void {
  //   const container = this.sliderContainer.nativeElement;
  //   this.camera.aspect = container.clientWidth / container.clientHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(container.clientWidth, container.clientHeight);
  //   this.createMediaPlanes();
  // }
}
