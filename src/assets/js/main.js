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
        stagger: 0.05
    });
}