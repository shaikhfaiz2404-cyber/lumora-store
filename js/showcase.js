/* ============================================
   LUMORA STORE — Spiral Showcase (v2)
   Faster scroll, visible spiral, custom logo
   ============================================ */

const gsapCDN = document.createElement('script');
gsapCDN.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
document.head.appendChild(gapCDN);

const stCDN = document.createElement('script');
stCDN.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
document.head.appendChild(stCDN);

const lenisCDN = document.createElement('script');
lenisCDN.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
document.head.appendChild(lenisCDN);

Promise.all([
    new Promise(r => gsapCDN.onload = r),
    new Promise(r => stCDN.onload = r),
    new Promise(r => lenisCDN.onload = r)
]).then(() => {
    gsap.registerPlugin(ScrollTrigger);
    initSpiral();
});

function initSpiral() {
    const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Hero parallax ---
    gsap.to('.hero-content', {
        yPercent: -20, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // --- Spiral Showcase ---
    const section = document.querySelector('.spiral-section');
    const scene = document.getElementById('spiralScene');
    const cards = document.querySelectorAll('.spiral-card');
    const bar = document.querySelector('.spiral-progress-bar');
    if (!section || !scene || cards.length === 0) return;

    // Cards start visible in spiral formation
    cards.forEach((card, i) => {
        const angle = parseFloat(card.style.getPropertyValue('--angle')) || 0;
        const dist = parseFloat(card.style.getPropertyValue('--distance')) || 260;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * dist;
        const z = Math.sin(rad) * dist;
        gsap.set(card, { x: x, y: 0, z: z, opacity: 1, scale: 1, rotateY: 0, rotateX: 0 });
    });

    // Spiral scene starts visible
    gsap.set(scene, { opacity: 1, y: 0 });

    // Phase 1: Spiral rotates as you scroll (0% - 60%)
    gsap.to(scene, {
        rotationY: 120,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.5,
        }
    });

    // Phase 2: Cards scale up slightly + spread out (20% - 70%)
    cards.forEach((card, i) => {
        const angle = parseFloat(card.style.getPropertyValue('--angle')) || 0;
        const dist = parseFloat(card.style.getPropertyValue('--distance')) || 260;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * dist * 1.15;
        const z = Math.sin(rad) * dist * 1.15;
        gsap.to(card, {
            x: x, z: z,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                end: 'top 10%',
                scrub: 0.5,
            }
        });
    });

    // Phase 3: Spiral fades out at the very end (80% - 100%)
    gsap.to(scene, {
        opacity: 0, scale: 1.05,
        ease: 'power1.in',
        scrollTrigger: {
            trigger: section,
            start: 'top 20%',
            end: 'top top',
            scrub: 0.5,
        }
    });

    // Progress bar
    if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, {
            scaleX: 1, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: 0.3 }
        });
    }

    // --- Zoom Section ---
    const zoomSection = document.querySelector('.zoom-section');
    if (zoomSection) {
        const zoomImage = zoomSection.querySelector('.zoom-image img');
        const zoomText = zoomSection.querySelector('.zoom-text');
        gsap.fromTo(zoomImage, { scale: 1.3 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: zoomSection, start: 'top bottom', end: 'top top', scrub: 0.5 }
        });
        gsap.fromTo(zoomText, { clipPath: 'inset(0 100% 0 0)', x: 60 }, {
            clipPath: 'inset(0 0% 0 0)', x: 0, ease: 'none',
            scrollTrigger: { trigger: zoomSection, start: 'top 70%', end: 'top 30%', scrub: 0.5 }
        });
    }

    // --- Features Section ---
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        const featureCards = featuresSection.querySelectorAll('.feature-card');
        featureCards.forEach((card) => {
            gsap.fromTo(card, { y: 60, opacity: 0 }, {
                y: 0, opacity: 1, ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 55%', scrub: 0.5 }
            });
        });
    }

    // --- CTA Section ---
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        gsap.fromTo('.cta-bg', { yPercent: -15 }, {
            yPercent: 15, ease: 'none',
            scrollTrigger: { trigger: ctaSection, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        });
        gsap.fromTo('.cta-content', { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: ctaSection, start: 'top 70%', end: 'top 40%', scrub: 0.5 }
        });
    }

    // --- Navbar hide/show ---
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > lastScroll && scroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = scroll;
    });
    navbar.style.transition = 'transform 0.3s ease';
}
