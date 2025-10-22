

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// const smooth = ScrollSmoother.create({
//     smooth: 2,
//     speed: 2,
//     effect: true,
//     smoothTouch: 0.1,
// })




function text() {
  gsap.registerPlugin(SplitText);

  // Split the heading into characters with class 'char'
  let split = SplitText.create("#heading", { type: "chars", charsClass: "char" });

  // Animate each character
  gsap.from(split.chars, {
    y: 20,
    autoAlpha: 0,
    opacity: 0,
    stagger: 0.09,
    duration: 1,
    ease: "power2.out"
  });
}


function timer() {
    gsap.registerPlugin(SplitText);
    var ptag = document.querySelector('.hero_smtit h6')
    var htag = document.querySelector('.hero_smtit h5')
    gsap.set(ptag, { opacity: 1 });
    setInterval(() => {
        const temp = ptag.textContent
        ptag.textContent = htag.textContent
        htag.textContent = temp
        text()
    }, 5000);
}

function heroheading() {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    // let split = SplitText.create("#hero_heading", { type: "chars" });
let split = SplitText.create("#hero_heading", { type: "chars", charsClass: "char" });
    // Animate each character with a small delay
    split.chars.forEach((char, i) => {
        gsap.from(char, {
            y: 20,
            autoAlpha: 0,
            opacity: 0,
            duration: 1,
            delay: i * 0.05,
            ease: "power2.out"
        });
    });

      if (window.innerWidth >= 380 && window.innerWidth <= 991) {
    document.querySelectorAll("#hero_heading, #hero_heading .char").forEach((el) => {
      el.style.fontSize = "30px";
    });
  } else {
    document.querySelectorAll("#hero_heading, #hero_heading .char").forEach((el) => {
      el.style.fontSize = "140px";
    });
  }

    // Animate .robo element
    gsap.to(".robo", {
        scale: 1,
        duration: 1,
        ease: "power2.out"
    });

    // Animate .hero_details element
    gsap.from(".hero_details", {
        x: 100,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
    });
}


function parallax() {
    gsap.registerPlugin(ScrollTrigger)
    gsap.to(".hero_back", {
        backgroundPosition: "center 10%",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero_back",
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: false,
            pin: false,
        }
    })

    gsap.from(".about_section", {
        y: "30%",
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about_section",
            start: "top 85%",
            end: "top 50%",
            scrub: true,
            markers: false,
        },
    })

    gsap.to(".gradients", {
        opacity: 1,
        scrollTrigger: {
            trigger: ".about_section",
            start: "top 85%",
            end: "top 50%",
            scrub: true,
            markers: false,
        },
    })
}


function sward() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".sword-area", {
        // right: "unset",
        // left: "0%",
        // bottom: "0%",
        // top: "10%",
        // opacity: 1,
        // scale: 1.2,
        // rotate: "180deg",
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: ".sword-area",
            start: "top 90%",
            end: "bottom 50%",
            scrub: 1,
            markers: false,
        },
    });

    gsap.to(".sword-area", {
        rotate: "90deg",
        ease: "none",
        scrollTrigger: {
            trigger: ".sword-area",
            start: "bottom 25%",
            end: "bottom top",
            scrub: 1,
            duration: 1,
        },
    });

    gsap.to(".sword-area", {
        rotate: "180deg",
        ease: "none",
        scrollTrigger: {
            trigger: ".sword-area",
            start: "bottom 80%",
            end: "bottom 30%",
            scrub: 1,

        },
    });
}



function about() {
    gsap.registerPlugin(ScrollTrigger);
    const aboutTitle = document.querySelectorAll('#about-title');
    aboutTitle.forEach((title) => {


        gsap.to(title, {
            color: "#ffffffff",
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top center",
                end: "bottom center",
                scrub: 1,
                markers: false
            },
        });

        gsap.to(title, {
            scale: 1.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top center",
                end: "bottom center",
                scrub: 1,
                markers: false,
            },
        });
    });
}

function title() {
    if ($(".title-anim").length > 0) {
        let char_come = gsap.utils.toArray(".title-anim");
        char_come.forEach((char_come) => {
            // SplitText with char class
            let split_char = new SplitText(char_come, {
                type: "chars, words",
                charsClass: "char",
                lineThreshold: 0.5,
            });

            
      if (window.innerWidth >= 380 && window.innerWidth <= 991) {
    document.querySelectorAll(".title-anim, .title-anim .char").forEach((el) => {
      el.style.fontSize = "60px";
    });
  } else {
    document.querySelectorAll(".title-anim, .title-anim .char").forEach((el) => {
      el.style.fontSize = "140px";
    });
  }

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: char_come,
                    start: "top bottom",
                    end: "bottom 10%",
                    scrub: false,
                    markers: false,
                    toggleActions: "play none none none",
                },
            });

            // Animate each character
            tl2.from(split_char.chars, {
                duration: 1,
                x: -70,
                autoAlpha: 0,
                stagger: 0.03,
            });
        });
    }
}


function what() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".roboclass", {
        x: 0,
        scale: 1.1,
        scrollTrigger: {
            trigger: ".roboclass",
            start: "top bottom",
            end: "bottom center",
            markers: false,
            scrub: true,
        }
    })
}

function careerLine() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".my_careeor", {
        "--line-height": "100%",
        ease: "none",
        scrollTrigger: {
            trigger: ".my_careeor",
            start: "top 100%",
            end: "bottom center",
            scrub: true,
            markers: false,
        },
    });

    gsap.to("#star", {
        bottom: "-2%",
        ease: "none",
        scrollTrigger: {
            trigger: ".my_careeor",
            start: "top 100%",
            end: "bottom center",
            scrub: true,
            markers: false,
        },
    });

    gsap.utils.toArray(".myes").forEach((section) => {
        gsap.fromTo(
            section,
            { opacity: 0.0 },
            {
                opacity: 1,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 100%",
                    end: "bottom 60%",
                    scrub: true,
                    markers: false,
                },
            }
        );
    });
}
function cardsAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".cards",
            start: "top-=50px top",
            end: "+=2000",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            markers: false,
        },
    });

    tl
        // Card 1
        .addLabel("card1")
        .to(".card1", { yPercent: 0, opacity: 1 })

        // Card 2
        .from(".card2", { yPercent: 75, opacity: 0 })
        .addLabel("card2")
        .to(".card1", { scale: 0.925, yPercent: -0.75, opacity: 1 }, "-=0.3")
        .to(".card2", { yPercent: 0, opacity: 1 })

        // Card 3
        .from(".card3", { yPercent: 75, opacity: 0 })
        .addLabel("card3")
        .to(".card2", { scale: 0.95, yPercent: -0.5, opacity: 1 }, "-=0.3")
        .to(".card3", { yPercent: 0, opacity: 1 })

        // // Card 4
        // .from(".card4", { yPercent: 75, opacity: 0 })
        // .addLabel("card4")
        // .to(".card3", { scale: 0.98, yPercent: -0.4, opacity: 1 }, "-=0.3")
        // .to(".card4", { yPercent: 0, opacity: 1 })

        // Scale down previous cards gradually
        .to(".card1", { scale: 0.925, yPercent: -1.5, opacity: 0.9 }, "-=0.3")
        .to(".card2", { scale: 0.95, yPercent: -1.125, opacity: 0.9 }, "-=0.3")
    // .to(".card3", { scale: 0.98, yPercent: -0.85, opacity: 0.9 }, "-=0.3");
}


function about_text() {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(".about_me", { type: "lines" });

    split.lines.forEach((target) => {
        gsap.to(target, {
            backgroundPositionX: 0,
            ease: "none",
            scrollTrigger: {
                trigger: target,
                scrub: 1,
                start: "top 100%",
                end: "bottom bottom",
                markers: false
            }
        });
    });
}

function horizontals() {
  gsap.registerPlugin(ScrollTrigger);

  const horizontalSection = document.querySelector(".horizontal");

  gsap.to(horizontalSection, {
    x: () => -(horizontalSection.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: "#horizontal-scoll",
      start: "top 80px",
      end: () => "+=" + (horizontalSection.scrollWidth - window.innerWidth),
      scrub: true,
      pin: true,           
      pinSpacing: true,     
      anticipatePin: 1,
      markers: false,
    },
  });
}
