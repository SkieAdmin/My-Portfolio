// ===================================
// Dark Mode Toggle
// ===================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
const updateThemeIcon = () => {
    const icon = themeToggle.querySelector('i');
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
};

// Initialize icon
updateThemeIcon();

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Add animation class
    htmlElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    // Update theme
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon with animation
    updateThemeIcon();

    // Add subtle animation to the page
    document.body.style.animation = 'fadeIn 0.3s ease';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 300);
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

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                formResponse.textContent = data.message;
                formResponse.className = 'form-response success';
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            formResponse.textContent = 'Failed to send message. Please try again.';
            formResponse.className = 'form-response error';

            // Hide error message after 5 seconds
            setTimeout(() => {
                formResponse.style.display = 'none';
            }, 5000);
        }
    });
}

// Skill bars animation on scroll
const observeSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width || '0%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    observeSkillBars();

    // Add animation classes to elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.stat-card, .tech-card, .project-card, .category-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    animateOnScroll();

    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Uncomment to enable typing effect
        // typeWriter();
    }
});

// Cursor effect (optional)
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 4 + 'px';
        cursor.style.top = e.clientY - 4 + 'px';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });

    // Uncomment to enable cursor effect
    // createCursorEffect();
};

// Console message
console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with ExpressJS and ES6+ JavaScript', 'font-size: 14px; color: #ec4899;');
console.log('%cFeel free to reach out: https://github.com/SkieAdmin', 'font-size: 12px; color: #6b7280;');
