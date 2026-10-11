/* ============================================
   LUMORA STORE — Premium Scroll Showcase
   Smooth lerp, blur transitions, depth-based fade
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const showcaseSection = document.getElementById('showcase');
    const showcaseCards = document.getElementById('showcaseCards');
    if (!showcaseSection || !showcaseCards) return;

    const featuredProducts = [
        { id: 'pc-001', name: 'Shockproof Armor Back Case', category: 'Phone Cases', price: 299,
          image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=400&fit=crop',
          description: 'Rugged shockproof TPU case with armor design. Universal fit for all smartphones.' },
        { id: 'st-001', name: 'PRINTHUA Vinyl Stickers Pack', category: 'Stickers', price: 199,
          image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=400&fit=crop',
          description: 'Pack of 51 premium vinyl stickers. Waterproof, residue-free, reusable.' },
        { id: 'led-001', name: 'Gesto 5 Meter Smart LED Strip', category: 'LED Lights', price: 899,
          image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=400&fit=crop',
          description: '5 meter smart LED strip with music sync. Works with Alexa & Google Home.' },
        { id: 'dk-001', name: 'MMTX XXL Gaming Mouse Mat', category: 'Desk Accessories', price: 399,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
          description: 'XXL gaming mouse mat 80x40cm. Non-slip base, dual sided, waterproof.' }
    ];

    featuredProducts.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'showcase-card';
        card.innerHTML = `
            <div class="showcase-card-image"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
            <div class="showcase-card-content">
                <span class="showcase-card-badge">${product.category}</span>
                <h3 class="showcase-card-name">${product.name}</h3>
                <p class="showcase-card-desc">${product.description}</p>
                <div class="showcase-card-footer">
                    <span class="showcase-card-price">₹${product.price}</span>
                    <button class="showcase-card-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
                </div>
            </div>`;
        showcaseCards.appendChild(card);
    });

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'showcase-progress';
    featuredProducts.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'showcase-progress-dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    });
    showcaseCards.appendChild(dotsContainer);

    const cards = showcaseCards.querySelectorAll('.showcase-card');
    const dots = showcaseCards.querySelectorAll('.showcase-progress-dot');
    const total = cards.length;

    let ticking = false;
    let targetProgress = 0;
    let currentProgress = 0;
    let currentIndex = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateShowcase() {
        const rect = showcaseSection.getBoundingClientRect();
        const sectionHeight = showcaseSection.offsetHeight - window.innerHeight;
        targetProgress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
        currentProgress = lerp(currentProgress, targetProgress, 0.1);

        const cardProgress = currentProgress * (total - 1);
        const newIndex = Math.round(cardProgress);

        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        cards.forEach((card, i) => {
            const rel = cardProgress - i;
            const isActive = Math.abs(rel) < 0.5;

            let targetScale, targetY, targetOpacity, targetRotate, targetBlur;
            if (isActive) {
                targetScale = 1; targetY = 0; targetOpacity = 1; targetRotate = 0; targetBlur = 0;
            } else if (i < currentIndex) {
                targetScale = 0.85; targetY = -40; targetOpacity = 0.12; targetRotate = -10; targetBlur = 3;
            } else {
                targetScale = 0.9; targetY = 60; targetOpacity = 0.4; targetRotate = 6; targetBlur = 1;
            }

            const cur = card._state || { scale: 0.9, y: 60, opacity: 0, rotate: 6, blur: 1 };
            cur.scale = lerp(cur.scale, targetScale, 0.12);
            cur.y = lerp(cur.y, targetY, 0.12);
            cur.opacity = lerp(cur.opacity, targetOpacity, 0.12);
            cur.rotate = lerp(cur.rotate, targetRotate, 0.12);
            cur.blur = lerp(cur.blur, targetBlur, 0.12);
            card._state = cur;

            card.style.transform = `translateY(${cur.y}px) scale(${cur.scale}) rotateY(${cur.rotate}deg)`;
            card.style.opacity = cur.opacity;
            card.style.filter = cur.blur > 0.1 ? `blur(${cur.blur.toFixed(1)}px)` : 'none';
            card.style.zIndex = total - i;
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateShowcase);
            ticking = true;
        }
    }

    cards.forEach((card, i) => {
        if (i === 0) {
            card._state = { scale: 1, y: 0, opacity: 1, rotate: 0, blur: 0 };
        } else {
            card._state = { scale: 0.9, y: 60, opacity: 0, rotate: 6, blur: 1 };
        }
        const s = card._state;
        card.style.transform = `translateY(${s.y}px) scale(${s.scale}) rotateY(${s.rotate}deg)`;
        card.style.opacity = s.opacity;
        card.style.filter = `blur(${s.blur}px)`;
        card.style.zIndex = total - i;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    updateShowcase();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.removeEventListener('scroll', onScroll);
        cards.forEach((card, i) => {
            card.style.opacity = i === 0 ? '1' : '0';
            card.style.transform = 'none';
            card.style.filter = 'none';
        });
    }
});
