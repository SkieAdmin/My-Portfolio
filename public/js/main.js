/* =====================================================================
   SKIE — STUDIO CV · page interactions
   (The 3D badge lives in badge.js.)
   ===================================================================== */
'use strict';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Nav: scrolled state, mobile menu, active section ---------- */
const initNav = () => {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav) return;

    const hero = document.querySelector('.hero');
    const onScroll = () => {
        const threshold = hero ? hero.offsetHeight - 80 : 8;
        nav.classList.toggle('is-scrolled', window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
        const setOpen = (open) => {
            links.classList.toggle('is-open', open);
            nav.classList.toggle('has-menu-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };
        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
        document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
    }

    const navLinks = [...document.querySelectorAll('.nav-links a[href^="/#"]')];
    const sections = navLinks
        .map((a) => document.getElementById(a.getAttribute('href').slice(2)))
        .filter(Boolean);
    if (!sections.length) return;
    if (hero) sections.push(hero); // no link for the hero, so reaching it clears the highlight
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `/#${entry.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
};

/* ---------- Print the CV ---------- */
const initPrint = () => {
    document.querySelectorAll('[data-print]').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (document.getElementById('experience')) window.print();
            else window.location.href = '/?print=1';
        });
    });
    if (new URLSearchParams(window.location.search).get('print') === '1') {
        window.addEventListener('load', () => setTimeout(() => window.print(), 300));
    }
};

/* ---------- Pointer tilt for [data-tilt] objects ---------- */
const initTilt = () => {
    if (!canHover || prefersReduced) return;
    document.querySelectorAll('[data-tilt]').forEach((el) => {
        const max = parseFloat(el.dataset.tilt) || 6;
        const target = el.querySelector('.project-inner') || el;
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            target.style.setProperty('--tx', `${(-y * max).toFixed(2)}deg`);
            target.style.setProperty('--ty', `${(x * max).toFixed(2)}deg`);
            el.classList.add('is-tilting');
        });
        el.addEventListener('pointerleave', () => {
            target.style.removeProperty('--tx');
            target.style.removeProperty('--ty');
            el.classList.remove('is-tilting');
        });
    });
};

/* ---------- Stack: list and tower highlight each other ---------- */
const initStack = () => {
    const layers = document.querySelectorAll('.layer');
    const slabs = document.querySelectorAll('.slab');
    if (!layers.length) return;
    const setActive = (idx) => {
        layers.forEach((l) => l.classList.toggle('is-active', l.dataset.layer === idx));
        slabs.forEach((s) => s.classList.toggle('is-active', s.dataset.layer === idx));
    };
    [...layers, ...slabs].forEach((el) => {
        el.addEventListener('pointerenter', () => setActive(el.dataset.layer));
        el.addEventListener('pointerleave', () => setActive(null));
    });
};

/* ---------- Certificate shelf (cover flow) + lightbox ---------- */
const initShelf = () => {
    const shelf = document.getElementById('shelf');
    if (!shelf) return;
    const items = [...shelf.querySelectorAll('.shelf-item')];

    let ticking = false;
    const layout = () => {
        ticking = false;
        const sr = shelf.getBoundingClientRect();
        const center = sr.left + sr.width / 2;
        items.forEach((item) => {
            const r = item.getBoundingClientRect();
            const d = (r.left + r.width / 2 - center) / r.width;
            const c = Math.max(-1.6, Math.min(1.6, d));
            const a = Math.abs(c);
            item.style.setProperty('--cap', Math.max(0, 1 - a * 1.4).toFixed(3));
            item.style.setProperty('--z', String(100 - Math.round(a * 10)));
            if (prefersReduced) return;
            item.style.setProperty('--ry', `${(-c * 38).toFixed(2)}deg`);
            item.style.setProperty('--tz', `${(-a * 140).toFixed(1)}px`);
            item.style.setProperty('--s', (1 - Math.min(a, 1) * 0.08).toFixed(3));
        });
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(layout); } };
    shelf.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    layout();

    const step = () => items[1] ? items[1].offsetLeft - items[0].offsetLeft : 0;
    document.querySelectorAll('[data-shelf]').forEach((btn) => {
        btn.addEventListener('click', () => {
            shelf.scrollBy({ left: step() * parseInt(btn.dataset.shelf, 10), behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    });

    // Drag to scroll with a mouse
    if (canHover) {
        let down = false, startX = 0, startScroll = 0, moved = false;
        shelf.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse') return;
            down = true; moved = false; startX = e.clientX; startScroll = shelf.scrollLeft;
            shelf.style.scrollSnapType = 'none';
        });
        window.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            shelf.scrollLeft = startScroll - dx;
        });
        window.addEventListener('pointerup', () => {
            if (!down) return;
            down = false;
            shelf.style.scrollSnapType = '';
        });
        shelf.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    }

    // Keyboard focus brings an item to the centre
    shelf.querySelectorAll('.cert').forEach((btn) => {
        btn.addEventListener('focus', () => {
            btn.closest('.shelf-item').scrollIntoView({ inline: 'center', block: 'nearest', behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    });

    // Lightbox
    const dialog = document.getElementById('lightbox');
    const dataEl = document.getElementById('certData');
    if (!dialog || !dataEl || typeof dialog.showModal !== 'function') return;
    const certs = JSON.parse(dataEl.textContent);
    const img = document.getElementById('lbImg');
    const title = document.getElementById('lbTitle');
    const meta = document.getElementById('lbMeta');
    const details = document.getElementById('lbDetails');
    const original = document.getElementById('lbOriginal');
    let current = 0;

    const show = (i) => {
        current = (i + certs.length) % certs.length;
        const c = certs[current];
        img.src = c.full;
        img.alt = `${c.title} certificate`;
        title.textContent = c.title;
        meta.textContent = `${c.category}, ${c.issuer}, ${c.date}`;
        details.textContent = c.details;
        original.href = c.image;
    };
    shelf.querySelectorAll('[data-cert]').forEach((btn) => {
        btn.addEventListener('click', () => { show(parseInt(btn.dataset.cert, 10)); dialog.showModal(); });
    });
    dialog.querySelectorAll('[data-lb]').forEach((btn) => btn.addEventListener('click', () => show(current + parseInt(btn.dataset.lb, 10))));
    dialog.querySelector('[data-lb-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });
};

/* ---------- Contact form ---------- */
const initContact = () => {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    const setStatus = (text, kind) => {
        status.textContent = text;
        status.className = `form-status${kind ? ` is-${kind}` : ''}`;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = [...form.querySelectorAll('input, textarea')];
        let firstInvalid = null;
        fields.forEach((f) => {
            const bad = !f.checkValidity();
            f.closest('.field').classList.toggle('has-error', bad);
            f.setAttribute('aria-invalid', String(bad));
            if (bad && !firstInvalid) firstInvalid = f;
        });
        if (firstInvalid) {
            setStatus(firstInvalid.type === 'email' && firstInvalid.value
                ? 'Enter a valid email address so I can reply.'
                : 'Fill in every field before sending.', 'error');
            firstInvalid.focus();
            return;
        }

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        setStatus('Sending…');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message);
            setStatus(data.message, 'success');
            form.reset();
        } catch {
            setStatus('Message not sent. Check your connection and try again, or call the number on this page.', 'error');
        } finally {
            button.disabled = false;
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initPrint();
    initTilt();
    initStack();
    initShelf();
    initContact();
});
