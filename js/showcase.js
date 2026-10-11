/* ============================================
   LUMORA STORE — Cinematic Scroll Experience
   GSAP ScrollTrigger + Lenis Smooth Scroll
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

// Wait for all scripts to load
Promise.all([
    new Promise(r => gsapCDN.onload = r),
    new Promise(r => scrollTriggerCDN.onload = r),
    new Promise(r => lenisCDN.onload = r)
]).then(() => {
    gsap.registerPlugin(ScrollTrigger);
    initScrollExperience();
});

function initScrollExperience() {
    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Section 1: Hero Parallax ---
    gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        }
    });

    // --- Section 2: Horizontal Product Reel ---
    const reelSection = document.querySelector('.reel-section');
    if (reelSection) {
        const track = reelSection.querySelector('.reel-track');
        const cards = reelSection.querySelectorAll('.reel-card');
        const totalWidth = cards.length * 420 - window.innerWidth + 80;

        gsap.to(track, {
            x: () => -totalWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: reelSection,
                start: 'top top',
                end: () => '+=' + totalWidth,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            }
        });

        cards.forEach((card, i) => {
            gsap.fromTo(card, {
                scale: 0.85,
                rotateY: -15,
                opacity: 0.4,
            }, {
                scale: 1,
                rotateY: 0,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: reelSection,
                    start: () => `top-=${(i + 1) * 420} top`,
                    end: () => `top-=${i * 420 + 200} top`,
                    scrub: true,
                }
            });
        });

        gsap.fromTo('.reel-progress-bar', {
            scaleX: 0,
        }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: reelSection,
                start: 'top top',
                end: () => '+=' + totalWidth,
                scrub: 0.3,
            }
        });
    }

    // --- Section 3: Product Zoom on Scroll ---
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

    // --- Section 4: Staggered Feature Reveal ---
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

    // --- Section 5: CTA Parallax ---
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
