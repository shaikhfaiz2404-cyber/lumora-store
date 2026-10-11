/* ============================================
   LUMORA STORE — 3D Motion Interactions
   ============================================ */

// --- 3D Card Tilt Effect ---
document.addEventListener('DOMContentLoaded', () => {
    // Add tilt to product cards
    document.querySelectorAll('.product-card, .category-card, .admin-stat').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.product-card, .category-card, .step, .section-header, .admin-stat');
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // --- Parallax Orbs on Scroll ---
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        document.querySelectorAll('.orb').forEach((orb, i) => {
            const speed = (i + 1) * 0.3;
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // --- Navbar Glow on Scroll ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 30px rgba(0, 240, 255, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // --- Smooth Button Ripple ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: 100px;
                height: 100px;
                left: ${e.clientX - rect.left - 50}px;
                top: ${e.clientY - rect.top - 50}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Product Image Parallax on Hover ---
    document.querySelectorAll('.product-card').forEach(card => {
        const img = card.querySelector('.product-image img');
        if (img) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                img.style.transform = `scale(1.1) translate(${x * 20}px, ${y * 20}px)`;
            });
            card.addEventListener('mouseleave', () => {
                img.style.transform = '';
            });
        }
    });

    // --- Glitch Effect on Hero Title ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.textShadow = '2px 0 #ff3366, -2px 0 #00f0ff';
            setTimeout(() => { heroTitle.style.textShadow = ''; }, 200);
        });
    }

    // --- Floating Animation for Category Icons ---
    document.querySelectorAll('.category-icon').forEach((icon, i) => {
        icon.style.animation = `categoryFloat ${3 + i * 0.5}s ease-in-out infinite`;
        icon.style.animationDelay = `${i * 0.3}s`;
    });

    // Add category float keyframes
    if (!document.getElementById('category-float-style')) {
        const style = document.createElement('style');
        style.id = 'category-float-style';
        style.textContent = `
            @keyframes categoryFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
        `;
        document.head.appendChild(style);
    }
});
