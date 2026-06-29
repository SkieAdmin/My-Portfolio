/* =====================================================================
   SKIE — SYSTEMS CONSOLE · interaction layer
   ===================================================================== */
'use strict';

const root = document.documentElement;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const accentRGB = () => (root.getAttribute('data-theme') === 'light' ? '31, 111, 235' : '79, 157, 255');

/* ---------- Theme ---------- */
const themeToggle = document.getElementById('themeToggle');
const setThemeIcon = () => {
    if (!themeToggle) return;
    const i = themeToggle.querySelector('i');
    const light = root.getAttribute('data-theme') === 'light';
    i.className = light ? 'fas fa-sun' : 'fas fa-moon';
};
if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');
setThemeIcon();
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const light = root.getAttribute('data-theme') === 'light';
        if (light) { root.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
        else { root.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
        setThemeIcon();
    });
}

/* ---------- Live clock ---------- */
const clock = document.getElementById('statusClock');
if (clock) {
    const tick = () => {
        const d = new Date();
        const p = (n) => String(n).padStart(2, '0');
        clock.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
}

/* ---------- Nav: scroll state + mobile toggle ---------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    const closeMenu = () => { navMenu.classList.remove('open'); navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); };
    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) closeMenu();
    });
}

/* ---------- Scroll progress + nav shadow ---------- */
const progress = document.getElementById('scrollProgress');
const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = h > 0 ? window.scrollY / h : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Smooth anchor scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' }); }
    });
});

/* ---------- Custom cursor ---------- */
const initCursor = () => {
    if (isTouch || prefersReduced) return;
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    if (!ring || !dot) return;

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        document.body.classList.add('cursor-on');
    });
    const loop = () => {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    };
    loop();

    const hoverSel = 'a, button, input, textarea, .card, .stat-card, .tech-card, .project-card, .certificate-card, .topic-tag, .magnetic';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSel)) { ring.classList.add('hovering'); dot.classList.add('hovering'); } });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverSel)) { ring.classList.remove('hovering'); dot.classList.remove('hovering'); } });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
};

/* ---------- Magnetic buttons ---------- */
const initMagnetic = () => {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.btn, .hero-social a, .social-links a, .magnetic').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
};

/* ---------- Network / topology background ---------- */
const initNetwork = () => {
    const canvas = document.getElementById('netCanvas');
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    let nodes = [], w = 0, h = 0, raf = null;
    const mouse = { x: null, y: null, r: 160 };

    const resize = () => {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        const count = Math.min(Math.floor((w * h) / 16000), 90);
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
            s: Math.random() * 1.6 + 0.6,
        }));
    };

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = mouse.y = null; });

    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const rgb = accentRGB();
        for (const n of nodes) {
            n.x += n.vx; n.y += n.vy;
            if (mouse.x != null) {
                const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
                if (d < mouse.r) { n.x -= dx / d * (mouse.r - d) * 0.012; n.y -= dy / d * (mouse.r - d) * 0.012; }
            }
            if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
            if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${rgb}, 0.5)`;
            ctx.arc(n.x, n.y, n.s, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.hypot(dx, dy);
                if (d < 130) {
                    ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / 130) * 0.14})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) draw();
    });
};

/* ---------- Scroll reveal + split-text titles ---------- */
const initReveal = () => {
    document.querySelectorAll('.section-title, .page-head h1').forEach((el) => {
        if (el.dataset.split) return;
        el.dataset.split = '1';
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map((wd) => `<span class="r-word">${wd}</span>`).join(' ');
    });

    const revealSel = '.stat-card, .tech-card, .project-card, .category-card, .certificate-card, .info-item, '
        + '.skill-category, .timeline-item, .about-content, .about-skills, .section-head, .skills-intro, '
        + '.learning-section, .cta-box, .contact-info, .contact-form-container, .marquee, .github-cta, .page-head .page-sub';
    const items = document.querySelectorAll(revealSel);
    items.forEach((el) => el.classList.add('reveal'));

    if (prefersReduced) {
        items.forEach((el) => el.classList.add('revealed'));
        document.querySelectorAll('.r-word').forEach((wd) => wd.classList.add('revealed'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const sibs = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
            const delay = Math.min(sibs.indexOf(el) * 80, 360);
            setTimeout(() => el.classList.add('revealed'), Math.max(delay, 0));
            io.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));

    document.querySelectorAll('.section-title, .page-head h1').forEach((title) => {
        const wio = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.r-word').forEach((wd, i) => {
                    setTimeout(() => wd.classList.add('revealed'), i * 60);
                });
                wio.unobserve(entry.target);
            });
        }, { threshold: 0.4 });
        wio.observe(title);
    });
};

/* ---------- Skill bars ---------- */
const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach((b) => {
        b.dataset.w = b.dataset.width || b.style.width || '0%';
        b.style.width = '0%';
        const name = b.closest('.skill-item')?.querySelector('.skill-name');
        if (name && !name.querySelector('.pct')) {
            const pct = document.createElement('span');
            pct.className = 'pct';
            pct.textContent = b.dataset.w;
            name.appendChild(pct);
        }
    });
    if (prefersReduced) { bars.forEach((b) => (b.style.width = b.dataset.w)); return; }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => (entry.target.style.width = entry.target.dataset.w), 150);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
};

/* ---------- Tilt on cards ---------- */
const initTilt = () => {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.stat-card, .tech-card, .project-card, .certificate-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
};

/* ---------- Counters ---------- */
const initCounters = () => {
    const els = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            if (prefersReduced) { el.textContent = target; io.unobserve(el); return; }
            let cur = 0; const step = Math.max(1, target / 40);
            const t = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(t); }
                el.textContent = Math.floor(cur);
            }, 28);
            io.unobserve(el);
        });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
};

/* ---------- Boot terminal ---------- */
const runBoot = async () => {
    const term = document.getElementById('bootTerminal');
    if (!term) return;
    const steps = [...term.querySelectorAll('.terminal-body > .line, .terminal-body > .out')];
    if (prefersReduced) { term.classList.remove('booting'); steps.forEach((s) => s.classList.add('show')); return; }
    term.classList.add('booting');
    for (const el of steps) {
        el.classList.add('show');
        const cmd = el.querySelector('.cmd');
        if (cmd) {
            const text = cmd.dataset.cmd || cmd.textContent;
            cmd.textContent = '';
            for (const ch of text) { cmd.textContent += ch; await sleep(26); }
            await sleep(230);
        } else {
            await sleep(el.classList.contains('name') ? 220 : 120);
        }
    }
};

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');
if (contactForm && formResponse) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value,
        };
        try {
            const res = await fetch('/api/contact', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'failed');
            formResponse.textContent = '> ' + data.message;
            formResponse.className = 'form-response success';
            contactForm.reset();
        } catch (err) {
            formResponse.textContent = '> error: message failed to send. please try again.';
            formResponse.className = 'form-response error';
        }
        setTimeout(() => { formResponse.className = 'form-response'; }, 6000);
    });
}

/* ---------- Boot everything ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initMagnetic();
    initNetwork();
    initReveal();
    initSkillBars();
    initTilt();
    initCounters();
    runBoot();
});

console.log('%c skie@dev:~$ ', 'background:#4f9dff;color:#04122a;font-weight:700;padding:2px 6px;border-radius:3px;');
console.log('%c systems operational — welcome to the console.', 'color:#4f9dff;font-family:monospace;');
