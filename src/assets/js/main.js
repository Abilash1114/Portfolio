

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const smooth = ScrollSmoother.create({
    smooth: 2,
    speed: 2,
    effect: true,
    smoothTouch: 0.1,
})

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
