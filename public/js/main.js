// ===================================
// Dark Mode Toggle
// ===================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
}

const updateThemeIcon = () => {
    const icon = themeToggle.querySelector('i');
    if (htmlElement.getAttribute('data-theme') === 'light') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
};

updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const isLight = htmlElement.getAttribute('data-theme') === 'light';
    if (isLight) {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// Particle System
// ===================================
const initParticles = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    const resize = () => {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            const isLight = htmlElement.getAttribute('data-theme') === 'light';
            const color = isLight ? '8, 145, 178' : '34, 211, 238';
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const createParticles = () => {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const connectParticles = () => {
        const isLight = htmlElement.getAttribute('data-theme') === 'light';
        const color = isLight ? '8, 145, 178' : '34, 211, 238';

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
};

// ===================================
// Scroll Reveal Animations
// ===================================
const initScrollReveal = () => {
    const revealElements = document.querySelectorAll(
        '.stat-card, .tech-card, .project-card, .category-card, .certificate-card, ' +
        '.info-item, .skill-category, .timeline-item, .about-content, .about-skills, ' +
        '.section-title, .skills-intro, .learning-section, .cta-section, .contact-info, .contact-form-container'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation based on sibling index
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) delay = i * 80;
                });

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, Math.min(delay, 400));

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
};

// ===================================
// Skill Bars Animation
// ===================================
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        bar.dataset.width = width;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = entry.target.dataset.width;
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
};

// ===================================
// Tilt Effect on Cards
// ===================================
const initTiltEffect = () => {
    const cards = document.querySelectorAll('.tech-card, .stat-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
};

// ===================================
// Counter Animation
// ===================================
const initCounters = () => {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current) + '+';
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
};

// ===================================
// Typed Text Effect
// ===================================
const initTypedEffect = () => {
    const el = document.querySelector('.hero-subtitle');
    if (!el) return;

    const texts = [el.textContent];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    el.textContent = '';
    el.style.borderRight = '2px solid var(--primary-color)';
    el.style.display = 'inline-block';

    const type = () => {
        const current = texts[textIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = false; // Don't delete, just keep it
            // Remove cursor after typing completes
            setTimeout(() => {
                el.style.borderRight = 'none';
            }, 1500);
            return; // Stop the loop
        }

        setTimeout(type, speed);
    };

    setTimeout(type, 800);
};

// ===================================
// Parallax Scroll Effect
// ===================================
const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        const heroBefore = hero.querySelector('.particle-canvas');
        if (heroBefore) {
            heroBefore.style.transform = `translateY(${rate}px)`;
        }
    });
};

// ===================================
// Contact Form Handler
// ===================================
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                formResponse.textContent = data.message;
                formResponse.className = 'form-response success';
                contactForm.reset();
                setTimeout(() => { formResponse.style.display = 'none'; }, 5000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            formResponse.textContent = 'Failed to send message. Please try again.';
            formResponse.className = 'form-response error';
            setTimeout(() => { formResponse.style.display = 'none'; }, 5000);
        }
    });
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollReveal();
    initSkillBars();
    initTiltEffect();
    initCounters();
    initTypedEffect();
    initParallax();
});

// Console message
console.log('%c Welcome to Skie\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%c Built with ExpressJS | Powered by Claude Code', 'font-size: 14px; color: #0ea5e9;');
