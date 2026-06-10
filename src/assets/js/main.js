/* ============================================================
   main.js — GSAP Animation Functions
   Portfolio: Abilash Ravi | UI/UX Designer & Frontend Developer

   All functions are called from HomeComponent.ngAfterViewInit().
   Requires: gsap, ScrollTrigger, SplitText, jQuery ($)
   ============================================================ */

/* ── 1. Hero Subtitle Character Animation ───────────────── */
/**
 * Animates the #heading element by splitting it into characters
 * and staggering them in with a fade + slide.
 * @param {Element} [container] - Optional scoped container element.
 */
function text(container) {
  gsap.registerPlugin(SplitText);

  const target = container
    ? container.querySelector('#heading')
    : document.querySelector('#heading');

  if (!target) return;

  const split = SplitText.create(target, { type: 'chars', charsClass: 'char' });

  gsap.from(split.chars, {
    y: 20,
    autoAlpha: 0,
    opacity: 0,
    stagger: 0.09,
    duration: 1,
    ease: 'power2.out',
  });
}

/* ── 2. Hero Subtitle Cycling Timer ─────────────────────── */
/**
 * Every 5 seconds, swaps the h6 (large gradient) and h5 (solid)
 * text inside each .hero_smtit, then re-runs the character animation.
 */
function timer() {
  gsap.registerPlugin(SplitText);

  document.querySelectorAll('.hero_smtit').forEach((item) => {
    const h6 = item.querySelector('h6');
    const h5 = item.querySelector('h5');

    gsap.set(h6, { opacity: 1 });

    setInterval(() => {
      const temp = h6.textContent;
      h6.textContent = h5.textContent;
      h5.textContent = temp;
      text(item); // re-run char animation scoped to this block
    }, 5000);
  });
}

/* ── 3. Hero Heading Animation ───────────────────────────── */
/**
 * Animates the large #hero_heading with per-character stagger,
 * adjusts font size for mobile, and triggers the robot + details slide-in.
 */
function heroheading() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  const split = SplitText.create('#hero_heading', { type: 'chars', charsClass: 'char' });

  split.chars.forEach((char, i) => {
    gsap.from(char, {
      y: 20,
      autoAlpha: 0,
      opacity: 0,
      duration: 1,
      delay: i * 0.05,
      ease: 'power2.out',
    });
  });

  // Responsive font size
  const isMobile = window.innerWidth >= 380 && window.innerWidth <= 991;
  document.querySelectorAll('#hero_heading, #hero_heading .char').forEach((el) => {
    el.style.fontSize = isMobile ? '30px' : '140px';
  });

  // Robot scale-in
  gsap.to('.robo', {
    scale: 1,
    duration: 1,
    ease: 'power2.out',
  });

  // Details panel slide-in from right
  gsap.from('.hero_details', {
    x: 100,
    opacity: 0,
    duration: 2,
    ease: 'power2.out',
  });
}

/* ── 4. Parallax & Section Fade-in ──────────────────────── */
/**
 * Creates a parallax effect on the hero background image,
 * and fades/slides the about section into view on scroll.
 */
function parallax() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero background parallax
  gsap.to('.hero_back', {
    backgroundPosition: 'center 10%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero_back',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // About section fade + rise
  gsap.from('.about_section', {
    y: '30%',
    opacity: 0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about_section',
      start: 'top 85%',
      end: 'top 50%',
      scrub: true,
    },
  });

  // Hero bottom gradient reveal
  gsap.to('.gradients', {
    opacity: 1,
    scrollTrigger: {
      trigger: '.about_section',
      start: 'top 85%',
      end: 'top 50%',
      scrub: true,
    },
  });
}

/* ── 5. Sword / Decorative Element Animation ─────────────── */
/**
 * Rotates the .sword-area decorative element as the user scrolls
 * through the career section.
 */
function sward() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.sword-area', {
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.sword-area',
      start: 'top 90%',
      end: 'bottom 50%',
      scrub: 1,
    },
  });

  gsap.to('.sword-area', {
    rotate: '60deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.sword-area',
      start: 'bottom 25%',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.sword-area', {
    rotate: '180deg',
    ease: 'none',
    scrollTrigger: {
      trigger: '.sword-area',
      start: 'bottom 80%',
      end: 'bottom 30%',
      scrub: 1,
    },
  });
}

/* ── 6. About Title Colour & Scale Animation ─────────────── */
/**
 * As the user scrolls, animates each #about-title element
 * from transparent-stroke to solid white, and scales it up.
 */
function about() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('#about-title').forEach((titleEl) => {
    gsap.to(titleEl, {
      color: '#ffffffff',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleEl,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    gsap.to(titleEl, {
      scale: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleEl,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });
  });
}

/* ── 7. Section Title Character Animation ────────────────── */
/**
 * Splits each .title-anim element into characters and slides
 * them in from the left as they enter the viewport.
 */
function title() {
  if (document.querySelectorAll('.title-anim').length === 0) return;

  const isMobile = window.innerWidth >= 380 && window.innerWidth <= 991;

  gsap.utils.toArray('.title-anim').forEach((el) => {
    const split = new SplitText(el, {
      type: 'chars, words',
      charsClass: 'char',
      lineThreshold: 0.5,
    });

    document.querySelectorAll('.title-anim, .title-anim .char').forEach((node) => {
      node.style.fontSize = isMobile ? '60px' : '140px';
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom 10%',
        scrub: false,
        toggleActions: 'play none none none',
      },
    });

    tl.from(split.chars, {
      duration: 1,
      x: -70,
      autoAlpha: 0,
      stagger: 0.03,
    });
  });
}

/* ── 8. Robot Parallax (Knowledge Section) ───────────────── */
/**
 * Gently scales and moves the .roboclass element as it scrolls
 * into view.
 */
function what() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.roboclass', {
    x: 0,
    scale: 1.1,
    scrollTrigger: {
      trigger: '.roboclass',
      start: 'top bottom',
      end: 'bottom center',
      scrub: true,
    },
  });
}

/* ── 9. Career Timeline Line Animation ───────────────────── */
/**
 * Grows the glowing career line from 0% to 100% as the user
 * scrolls through .my_careeor. Also moves the star indicator
 * and fades in each .myes career entry.
 */
function careerLine() {
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // On mobile the section stacks vertically and is much taller,
  // so end needs to reach further down the page
  const lineEnd   = isMobile ? 'bottom 15%' : 'bottom center';
  const entryEnd  = isMobile ? 'bottom 85%' : 'bottom 60%';

  // Grow the timeline line
  gsap.to('.my_careeor', {
    '--line-height': '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.my_careeor',
      start: 'top 85%',
      end: lineEnd,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Move the star down the line
  gsap.to('#star', {
    bottom: '-2%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.my_careeor',
      start: 'top 85%',
      end: lineEnd,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Fade in each career entry
  gsap.utils.toArray('.myes').forEach((section) => {
    gsap.fromTo(
      section,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 100%',
          end: entryEnd,
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

/* ── 10. Portfolio Stacked Card Animation ────────────────── */
/**
 * Pins the .cards section and animates four portfolio cards
 * stacking on top of each other as the user scrolls.
 */
function cardsAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  // Force correct initial states immediately on load/refresh —
  // prevents cards 2-4 from appearing at their natural positions
  // before GSAP has a chance to hide them
  gsap.set('.card1', { yPercent: 0, opacity: 1, scale: 1, clearProps: 'none' });
  gsap.set(['.card2', '.card3', '.card4'], { yPercent: 75, opacity: 0 });

  const header  = document.getElementById('sticky-header');
  const headerH = header ? header.offsetHeight : 70;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.cards',
      start: 'top ' + headerH + 'px',
      end: '+=2600',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      // Re-apply initial states if user refreshes mid-page and
      // ScrollTrigger progress snaps back to 0
      onRefresh(self) {
        if (self.progress === 0) {
          gsap.set('.card1', { yPercent: 0, opacity: 1, scale: 1 });
          gsap.set(['.card2', '.card3', '.card4'], { yPercent: 75, opacity: 0 });
        }
      },
    },
  });

  tl
    .addLabel('card1')
    .to('.card1', { yPercent: 0, opacity: 1 })

    .from('.card2', { yPercent: 75, opacity: 0, immediateRender: false })
    .addLabel('card2')
    .to('.card1', { scale: 0.925, yPercent: -0.75, opacity: 1 }, '-=0.3')
    .to('.card2', { yPercent: 0, opacity: 1 })

    .from('.card3', { yPercent: 75, opacity: 0, immediateRender: false })
    .addLabel('card3')
    .to('.card2', { scale: 0.95, yPercent: -0.5, opacity: 1 }, '-=0.3')
    .to('.card3', { yPercent: 0, opacity: 1 })

    .from('.card4', { yPercent: 75, opacity: 0, immediateRender: false })
    .addLabel('card4')
    .to('.card3', { scale: 0.96, yPercent: -0.35, opacity: 1 }, '-=0.3')
    .to('.card4', { yPercent: 0, opacity: 1 })

    .to('.card1', { scale: 0.925, yPercent: -1.5,   opacity: 0.9 }, '-=0.3')
    .to('.card2', { scale: 0.95,  yPercent: -1.125, opacity: 0.9 }, '-=0.3')
    .to('.card3', { scale: 0.96,  yPercent: -0.8,   opacity: 0.9 }, '-=0.3');
}

/* ── 11. About Me Word Animation ─────────────────────────── */
/**
 * Splits the .about_me paragraph into words, sets them invisible,
 * then fades + slides them in as the paragraph scrolls into view.
 */
function about_text() {
  const split = new SplitText('.about_me', { type: 'words' });

  gsap.set(split.words, { y: 20, opacity: 0 });

  gsap.to(split.words, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.02,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about_me',
      start: 'top 100%',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
}

/* ── 12. Horizontal Scroll Section ───────────────────────── */
/**
 * On desktop (≥ 768px), pins the #horizontal-scoll section and
 * scrolls .horizontal sideways as the user scrolls vertically.
 * On mobile the section stacks normally (no horizontal scroll).
 */
function horizontals() {
  gsap.registerPlugin(ScrollTrigger);

  const horizontalSection = document.querySelector('.horizontal');
  if (!horizontalSection) return;

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      gsap.to(horizontalSection, {
        x: () => -(horizontalSection.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '#horizontal-scoll',
          start: 'top 80px',
          end: () => '+=' + (horizontalSection.scrollWidth - window.innerWidth),
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });
    },
  });
}

/* ── 13. Animated Gradient Background ────────────────────── */
/**
 * Smoothly transitions the background of #gradient between
 * green shades using linear interpolation.
 * Requires jQuery ($).
 */
function gradientes() {
  const colors = [
    [144, 238, 144], // light green
    [0, 128, 0], // dark green
    [50, 205, 50], // lime green
    [0, 255, 127], // spring green
    [34, 139, 34], // forest green
  ];

  let step = 0;
  let colorIndices = [0, 1, 2, 3];
  const speed = 0.02;

  function updateGradient() {
    if (typeof $ === 'undefined') return;

    const [c00, c01, c10, c11] = colorIndices.map((i) => colors[i]);
    const t = 1 - step;

    const r1 = Math.round(t * c00[0] + step * c01[0]);
    const g1 = Math.round(t * c00[1] + step * c01[1]);
    const b1 = Math.round(t * c00[2] + step * c01[2]);

    const r2 = Math.round(t * c10[0] + step * c11[0]);
    const g2 = Math.round(t * c10[1] + step * c11[1]);
    const b2 = Math.round(t * c10[2] + step * c11[2]);

    $('#gradient').css({
      background: `linear-gradient(to right, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}))`,
    });

    step += speed;

    if (step >= 1) {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    }
  }

  setInterval(updateGradient, 10);
}

/* ── 14. Sticky Header on Scroll-Up ─────────────────────── */
/**
 * Shows #sticky-header only when the user has scrolled past
 * the hero banner AND is scrolling UP.
 * Hides it immediately on scroll-down or when back inside the hero.
 */
/* ── 15. Tools I Use — Auto-Sliding Strip ────────────────── */
/**
 * The track uses a CSS @keyframes animation (skToolsSlide) for
 * reliable autoplay. This function adds:
 *   - Hover  → pause / resume the CSS animation
 *   - Drag   → freeze animation, move by transform, then resume
 *              with a negative animation-delay so it continues
 *              exactly where the drag ended (no jump).
 */
function toolsSlider() {
  var slider = document.querySelector('.sk-use-slider');
  var track  = document.querySelector('.sk-use-track');
  if (!slider || !track) return;

  var DURATION = 32; // must match CSS animation duration (seconds)
  var isDragging = false;
  var dragStartX = 0;
  var dragStartTranslateX = 0;

  /* ── helpers ── */
  function getTranslateX(el) {
    var m = window.getComputedStyle(el).transform;
    if (!m || m === 'none') return 0;
    var parts = m.match(/matrix.*\((.+)\)/);
    return parts ? parseFloat(parts[1].split(',')[4]) : 0;
  }

  function resumeFromX(x) {
    var halfWidth = track.offsetWidth / 2;
    var progress  = Math.abs(x) / halfWidth;          // 0 → 1
    var delay     = -(DURATION * progress);            // negative = already in-progress
    track.style.transform  = '';
    track.style.animation  = 'skToolsSlide ' + DURATION + 's linear ' + delay + 's infinite';
  }

  /* ── hover pause / resume ── */
  slider.addEventListener('mouseenter', function () {
    if (!isDragging) track.style.animationPlayState = 'paused';
  });
  slider.addEventListener('mouseleave', function () {
    if (!isDragging) track.style.animationPlayState = 'running';
  });

  /* ── mouse drag ── */
  slider.addEventListener('mousedown', function (e) {
    isDragging = true;
    slider.classList.add('is-dragging');
    dragStartX = e.clientX;
    dragStartTranslateX = getTranslateX(track);
    /* Freeze animation at current position */
    track.style.transform = 'translateX(' + dragStartTranslateX + 'px)';
    track.style.animation = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var dx       = e.clientX - dragStartX;
    var newX     = dragStartTranslateX + dx;
    var halfWidth = track.offsetWidth / 2;
    /* wrap */
    if (newX > 0)          newX = newX - halfWidth;
    if (newX < -halfWidth) newX = newX + halfWidth;
    track.style.transform = 'translateX(' + newX + 'px)';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('is-dragging');
    var currentX = parseFloat((track.style.transform.match(/-?[\d.]+/) || ['0'])[0]);
    resumeFromX(currentX);
  });

  /* ── touch drag ── */
  slider.addEventListener('touchstart', function (e) {
    dragStartX = e.touches[0].clientX;
    dragStartTranslateX = getTranslateX(track);
    track.style.transform = 'translateX(' + dragStartTranslateX + 'px)';
    track.style.animation = 'none';
  }, { passive: true });

  slider.addEventListener('touchmove', function (e) {
    var dx       = e.touches[0].clientX - dragStartX;
    var newX     = dragStartTranslateX + dx;
    var halfWidth = track.offsetWidth / 2;
    if (newX > 0)          newX = newX - halfWidth;
    if (newX < -halfWidth) newX = newX + halfWidth;
    track.style.transform = 'translateX(' + newX + 'px)';
  }, { passive: true });

  slider.addEventListener('touchend', function () {
    var currentX = parseFloat((track.style.transform.match(/-?[\d.]+/) || ['0'])[0]);
    resumeFromX(currentX);
  });
}


/* ── 16. Skills Section Filter tabs ─────────────────────── */
/**
 * Handles the skill filter tab clicks in the redesigned
 * skills section. Shows/hides .sk-card elements by data-skcat.
 */
function skillsFilter() {
  var btns = document.querySelectorAll('.sk-filter');
  var cards = document.querySelectorAll('.sk-card');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-skfilter');

      cards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-skcat') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


function stickyNav() {
  const header      = document.getElementById('sticky-header');
  const hero        = document.querySelector('.hero_back');
  const socialAside = document.querySelector('aside .social_icons');
  const contact     = document.getElementById('contact');
  if (!header || !hero) return;

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;
    const heroBottom     = hero.offsetTop + hero.offsetHeight;
    const scrollingDown  = currentScrollY > lastScrollY;
    const pastHero       = currentScrollY > heroBottom;

    if (!pastHero || scrollingDown) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    if (socialAside && contact) {
      const contactTop = contact.offsetTop;
      if (currentScrollY + window.innerHeight * 0.6 >= contactTop) {
        socialAside.style.visibility = 'hidden';
      } else {
        socialAside.style.visibility = 'visible';
      }
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });
}


/* ── (Optional) Swiper Carousel ──────────────────────────── */
/**
 * Initialises a Swiper auto-play carousel.
 * Pauses on hover, resumes on mouse leave.
 * Uncomment the call in home.component.ts if needed.
 */
function swipe() {
  const swiper = new Swiper('.swiper', {
    speed: 2000,
    direction: 'horizontal',
    loop: true,
    slidesPerView: 6,
    freeMode: true,
    zoom: true,
    keyboard: true,
    pagination: false,
    navigation: false,
    autoplay: {
      delay: 10,
      disableOnInteraction: false,
    },
    breakpoints: {
      765: { slidesPerView: 1 },
      1000: { slidesPerView: 3 },
      1200: { slidesPerView: 8 },
    },
  });

  if (swiper?.el) {
    swiper.el.addEventListener('mouseenter', () => {
      if (swiper.autoplay?.running) swiper.autoplay.stop();
    });
    swiper.el.addEventListener('mouseleave', () => {
      if (!swiper.autoplay?.running) swiper.autoplay.start();
    });
  }
}
