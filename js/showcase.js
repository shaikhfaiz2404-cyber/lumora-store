/* ============================================
   LUMORA STORE — Spiral Showcase
   Scroll-driven helix of product cards
   Hidden at start, rises on scroll, lagless
   ============================================ */

// Load GSAP + ScrollTrigger + Lenis from CDN
const gsapCDN = document.createElement('script');
gsapCDN.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
document.head.appendChild(gsapCDN);

const scrollTriggerCDN = document.createElement('script');
scrollTriggerCDN.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
document.head.appendChild(scrollTriggerCDN);

const lenisCDN = document.createElement('script');
lenisCDN.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
document.head.appendChild(lenisCDN);

Promise.all([
    new Promise(r => gsapCDN.onload = r),
    new Promise(r => scrollTriggerCDN.onload = r),
    new Promise(r => lenisCDN.onload = r)
]).then(() => {
    gsap.registerPlugin(ScrollTrigger);
    initSpiralShowcase();
});

function initSpiralShowcase() {
    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Hero Parallax ---
    gsap.to('.hero-content', {
        yPercent: -25,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });

    // --- Spiral Showcase ---
    const spiralSection = document.querySelector('.spiral-section');
    const spiralScene = document.getElementById('spiralScene');
    const spiralCards = document.querySelectorAll('.spiral-card');
    const spiralRings = document.querySelectorAll('.spiral-ring');
    const spiralBar = document.querySelector('.spiral-progress-bar');

    if (!spiralSection || !spiralScene || spiralCards.length === 0) return;

    // Initial state: everything hidden below
    gsap.set(spiralCards, {
        opacity: 0,
        y: 200,
        scale: 0.5,
        rotateY: -30,
    });

    gsap.set(spiralScene, {
        opacity: 0,
        y: 300,
    });

    // Phase 1: Spiral rises into view (0% - 20% of scroll)
    gsap.to(spiralScene, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: spiralSection,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
        }
    });

    // Phase 2: Cards appear one by one in spiral (10% - 50%)
    spiralCards.forEach((card, i) => {
        const angle = parseFloat(card.style.getPropertyValue('--angle')) || 0;
        const distance = parseFloat(card.style.getPropertyValue('--distance')) || 260;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * distance;
        const z = Math.sin(rad) * distance;

        // Start hidden
        gsap.set(card, {
            x: x * 0.5,
            y: 150,
            z: z * 0.3,
            opacity: 0,
            scale: 0.6,
            rotateY: -40,
            rotateX: 10,
        });

        // Animate to spiral position
        gsap.to(card, {
            x: x,
            y: 0,
            z: z,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: spiralSection,
                start: () => `top+=${(i + 1) * 80} top`,
                end: () => `top+=${(i + 1) * 80 + 200} top`,
                scrub: 1.5,
            }
        });
    });

    // Phase 3: Spiral rotates as you keep scrolling (30% - 80%)
    gsap.to(spiralScene, {
        rotationY: 180,
        ease: 'none',
        scrollTrigger: {
            trigger: spiralSection,
            start: 'top 40%',
            end: 'top 10%',
            scrub: 1,
        }
    });

    // Phase 4: Spiral scales up and fades (70% - 100%)
    gsap.to(spiralScene, {
        scale: 1.1,
        opacity: 0,
        ease: 'power2.in',
        scrollTrigger: {
            trigger: spiralSection,
            start: 'top 15%',
            end: 'top top',
            scrub: 1,
        }
    });

    // Progress bar
    if (spiralBar) {
        gsap.fromTo(spiralBar, {
            scaleX: 0,
        }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: spiralSection,
                start: 'top 80%',
                end: 'top top',
                scrub: 0.3,
            }
        });
    }

    // --- Zoom Section ---
    const zoomSection = document.querySelector('.zoom-section');
    if (zoomSection) {
        const zoomImage = zoomSection.querySelector('.zoom-image img');
        const zoomText = zoomSection.querySelector('.zoom-text');

        gsap.fromTo(zoomImage, {
            scale: 1.3,
        }, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: zoomSection,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
            }
        });

        gsap.fromTo(zoomText, {
            clipPath: 'inset(0 100% 0 0)',
            x: 60,
        }, {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: zoomSection,
                start: 'top 70%',
                end: 'top 30%',
                scrub: 1,
            }
        });
    }

    // --- Features Section ---
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        const featureCards = featuresSection.querySelectorAll('.feature-card');

        featureCards.forEach((card, i) => {
            gsap.fromTo(card, {
                y: 80,
                opacity: 0,
                rotateX: -10,
            }, {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                }
            });
        });

        const title = featuresSection.querySelector('.section-title');
        if (title) {
            const letters = title.textContent.split('');
            title.innerHTML = letters.map(l => '<span style="display:inline-block">' + l + '</span>').join('');
            gsap.fromTo(title.children, {
                y: 40,
                opacity: 0,
            }, {
                y: 0,
                opacity: 1,
                stagger: 0.03,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                }
            });
        }
    }

    // --- CTA Section ---
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        gsap.fromTo('.cta-bg', {
            yPercent: -20,
        }, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.fromTo('.cta-content', {
            y: 60,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ctaSection,
                start: 'top 70%',
                end: 'top 40%',
                scrub: 1,
            }
        });
    }

    // --- Navbar: hide on scroll down, show on scroll up ---
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
