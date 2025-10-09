

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
// const smooth = ScrollSmoother.create({
//     smooth: 2,
//     speed: 2,
//     effect: true,
//     smoothTouch: 0.1,
// })



function text() {
    gsap.registerPlugin(SplitText);
    gsap.set("h1", { opacity: 1 });
    let split = SplitText.create("#heading", { type: "chars" });
    gsap.from(split.chars, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.09,
        opacity: 0,
        duration: 1,
        ease: "power2.out",

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
    let split = SplitText.create("#hero_heading", { type: "chars" });
    gsap.from(split.chars, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.05,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    gsap.to(".robo", {
        scale: 1,
        duration: 1,
        ease: "power2.out"
    });

    gsap.from(".hero_details", {
        x: 100,
        duration: 2,
        ease: "power2.out"
    })
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
      markers: true,
    },
  });

  gsap.to(".sword-area", {
    rotate: "180deg",
    ease: "none",
    scrollTrigger: {
      trigger: ".sword-area",
      start: "bottom 90%",
      end: "bottom top",
      scrub: 1,
    },
  });
}
